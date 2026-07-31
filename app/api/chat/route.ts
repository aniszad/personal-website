import { NextResponse } from "next/server";
import knowledgeBase from "@/public/anis-profile.json";
import {
  buildSystemPrompt,
  retrieveContext,
  type KnowledgeBase,
} from "@/lib/chatbot";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.GROQ_MODEL ?? "qwen/qwen3.6-27b";
const MAX_MESSAGE_LENGTH = 700;

function extractAnswer(payload: unknown): string | null {
  if (
      typeof payload !== "object" ||
      payload === null ||
      !("choices" in payload) ||
      !Array.isArray(payload.choices)
  ) {
    return null;
  }

  const content = payload.choices[0]?.message?.content;
  return typeof content === "string" && content.trim() ? content.trim() : null;
}

function extractProviderError(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null || !("error" in payload)) {
    return undefined;
  }

  const error = payload.error;
  if (typeof error === "string") return error;
  if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
  ) {
    return error.message;
  }
  return undefined;
}

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
        { error: "The chatbot is not configured yet." },
        { status: 503 },
    );
  }

  type HistoryEntry = { role: "user" | "assistant"; text: string };

  let body: { message?: unknown; history?: unknown };
  try {
    body = (await request.json()) as { message?: unknown; history?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
        { error: "Please send a question of up to 700 characters." },
        { status: 400 },
    );
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: HistoryEntry[] = rawHistory
    .filter(
      (e): e is HistoryEntry =>
        typeof e === "object" &&
        e !== null &&
        ((e as HistoryEntry).role === "user" || (e as HistoryEntry).role === "assistant") &&
        typeof (e as HistoryEntry).text === "string",
    )
    .slice(-6);

  const knowledge = knowledgeBase as KnowledgeBase;
  const context = retrieveContext(knowledge, message, 5);
  const systemPrompt = [
    buildSystemPrompt(knowledge),
    "Answer only using the supplied profile context.",
    "Do not claim to be Anis or speak in the first person as if you were him.",
    "If the context is insufficient, say so plainly.",
    "Keep answers concise: one short paragraph or at most 3 bullets.",
  ].join("\n");

  const historyMessages = history.map((entry) => ({
    role: entry.role,
    content: entry.text,
  }));

  try {
    const modelResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.15,
        max_tokens: 280,
        reasoning_effort: "none",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          {
            role: "user",
            content: [
              "Use only the profile context below to answer the visitor's question.",
              "Do not invent or infer anything not present in the context.",
              "Format the answer as either one short paragraph or 3 bullet points max.",
              "",
              "PROFILE CONTEXT:",
              context || "No matching profile information was found.",
              "",
              `VISITOR QUESTION: ${message}`,
            ].join("\n"),
          },
        ],
      }),
    });

    const payload: unknown = await modelResponse.json();

    if (!modelResponse.ok) {
      console.error("Groq chat request failed", {
        model: MODEL,
        status: modelResponse.status,
        detail: extractProviderError(payload),
      });

      return NextResponse.json(
          { error: "Chatbot is unavailable currently." },
          { status: 502 },
      );
    }

    const answer = extractAnswer(payload);
    if (!answer) {
      return NextResponse.json(
          { error: "The chatbot returned an empty reply. Please try again." },
          { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Groq chat request could not be completed", {
      model: MODEL,
      detail: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
        { error: "Chatbot is unavailable currently." },
        { status: 502 },
    );
  }
}