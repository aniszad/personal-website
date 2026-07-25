import { NextResponse } from "next/server";
import knowledgeBase from "@/public/anis-profile.json";
import {
  buildSystemPrompt,
  retrieveContext,
  type KnowledgeBase,
} from "@/lib/chatbot";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.HF_MODEL ?? "Qwen/Qwen2.5-7B-Instruct-1M:fastest";
const MAX_MESSAGE_LENGTH = 700;
const MAX_HISTORY_MESSAGES = 6;

type ClientMessage = {
  role: "user" | "assistant";
  text: string;
};

function parseHistory(value: unknown): ClientMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is ClientMessage =>
        typeof item === "object" &&
        item !== null &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.text === "string",
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({ role: item.role, text: item.text.slice(0, MAX_MESSAGE_LENGTH) }));
}

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

export async function POST(request: Request) {
  if (!process.env.HF_TOKEN) {
    return NextResponse.json(
      { error: "The AI assistant is not configured yet." },
      { status: 503 },
    );
  }

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

  const knowledge = knowledgeBase as KnowledgeBase;
  const context = retrieveContext(knowledge, message, 5);
  const history = parseHistory(body.history);
  const systemPrompt = [
    buildSystemPrompt(knowledge),
    "You are Anis AI, a portfolio assistant representing Anis professionally.",
    "Do not claim to be Anis or speak about personal experiences in the first person.",
    "Answer only with the supplied profile context. If the context does not support an answer, say so plainly and invite the visitor to contact Anis.",
    "Keep answers concise: normally one short paragraph or 3 bullets.",
  ].join("\n");

  try {
    const modelResponse = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.25,
          max_tokens: 280,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.map((item) => ({ role: item.role, content: item.text })),
            {
              role: "user",
              content: `Question: ${message}\n\nRelevant profile context:\n${context || "No matching profile information was found."}`,
            },
          ],
        }),
      },
    );

    const payload: unknown = await modelResponse.json();
    if (!modelResponse.ok) {
      return NextResponse.json(
        { error: "The AI model is temporarily unavailable. Please try again shortly." },
        { status: 502 },
      );
    }

    const answer = extractAnswer(payload);
    if (!answer) {
      return NextResponse.json(
        { error: "The AI model returned an empty reply. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "The AI model could not be reached. Please try again shortly." },
      { status: 502 },
    );
  }
}
