"use client";

import { FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/constants";
import { CloseIcon } from "@/components/ui/Icons";
import {
  buildRuleBasedFallbackAnswer,
  loadKnowledgeBase,
  type KnowledgeBase,
} from "@/lib/chatbot";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const QUICK_PROMPTS = [
  "Tell me about your background",
  "What projects are you proud of?",
  "What role are you looking for?",
] as const;

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: `Hi, I am ${SITE.name}'s portfolio assistant. Ask me about projects, experience, skills, or availability.`,
};

export function ChatWidget() {
  const reduced = useReducedMotion() ?? false;
  const knowledgeRef = useRef<KnowledgeBase | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("Ready to chat");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const canSend = draft.trim().length > 0 && !isTyping;

  function pushUserMessage(text: string) {
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
  }

  function pushAssistantMessage(text: string) {
    setMessages((current) => [
      ...current,
      { id: `assistant-${Date.now()}`, role: "assistant", text },
    ]);
  }

  async function ensureKnowledgeBase(): Promise<KnowledgeBase> {
    if (knowledgeRef.current) {
      return knowledgeRef.current;
    }
    const knowledge = await loadKnowledgeBase();
    knowledgeRef.current = knowledge;
    return knowledge;
  }

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || isTyping) {
      return;
    }

    setDraft("");
    pushUserMessage(message);
    setIsTyping(true);
    setStatus("Thinking...");

    try {
      const knowledge = await ensureKnowledgeBase();
      pushAssistantMessage(buildRuleBasedFallbackAnswer(knowledge, message));
    } catch (error) {
      const textValue = error instanceof Error ? error.message : String(error);
      pushAssistantMessage(`Unable to answer right now: ${textValue}`);
    } finally {
      setIsTyping(false);
      setStatus("Ready to chat");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.section
            key="chat-panel"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduced ? 0.2 : 0.28, ease: "easeOut" }}
            className="mb-3 flex h-[min(70svh,34rem)] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised/95 shadow-[0_14px_50px_-14px_rgba(0,0,0,0.65)] backdrop-blur"
            aria-label="Portfolio chatbot"
          >
            <header className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-display text-sm font-semibold text-heading">
                  Ask {SITE.name.split(" ")[0]}
                </p>
                <p className="text-xs text-muted">{status}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:text-heading"
                aria-label="Close chat"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "assistant"
                      ? "bg-surface text-body ring-1 ring-line"
                      : "ml-auto bg-accent text-surface"
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {isTyping ? (
                <div className="inline-flex rounded-2xl bg-surface px-3 py-2 ring-1 ring-line">
                  <span className="h-2 w-12 animate-pulse rounded-full bg-muted/45" />
                </div>
              ) : null}
            </div>

            <div className="border-t border-line px-4 pb-4 pt-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      void sendMessage(prompt);
                    }}
                    className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-accent/60 hover:text-heading"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="h-10 flex-1 rounded-xl border border-line bg-surface px-3 text-sm text-body placeholder:text-muted focus:border-accent/60 focus:outline-none"
                  placeholder="Ask a question..."
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-surface transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex items-center gap-2 rounded-full border border-line bg-surface-raised/95 px-4 py-2.5 text-sm text-heading shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur transition-colors hover:border-accent/60"
        aria-label={open ? "Hide chat" : "Open chat"}
      >
        <span
          aria-hidden="true"
          className="inline-block size-2 rounded-full bg-accent transition-opacity group-hover:opacity-90"
        />
        Chat with my AI
      </button>
    </div>
  );
}
