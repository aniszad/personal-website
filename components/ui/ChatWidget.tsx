"use client";

import { FormEvent, useState, useRef, useEffect, KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/constants";
import { CloseIcon } from "@/components/ui/Icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("Ready to chat");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Refs for premium UX
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = draft.trim().length > 0 && !isTyping;

  // 1. Auto-scroll to bottom whenever messages change or typing status changes
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, open]);

  // Focus input automatically when opened
  useEffect(() => {
    if (open && textareaRef.current && !reduced) {
      // Small timeout to allow animation to start
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open, reduced]);

  // Lets other parts of the page (the command palette) open the widget
  // without lifting its state up into the layout.
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("portfolio:open-chat", openChat);
    return () => window.removeEventListener("portfolio:open-chat", openChat);
  }, []);

  // 2. Auto-resize textarea handler
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // 3. Handle Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) void sendMessage(draft);
    }
  };

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

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || isTyping) return;

    setDraft("");
    // Reset textarea height immediately
    if (textareaRef.current) textareaRef.current.style.height = "40px";

    pushUserMessage(message);
    setIsTyping(true);
    setStatus("Thinking...");

    if (showSuggestions) setShowSuggestions(false);

    try {
      const history = messages.slice(-6).map(({ role, text }) => ({ role, text }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const payload = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) {
        throw new Error(payload.error ?? "The assistant could not generate a reply.");
      }
      pushAssistantMessage(payload.answer);
    } catch (error) {
      const textValue = error instanceof Error ? error.message : String(error);
      pushAssistantMessage(`Unable to answer right now: ${textValue}`);
    } finally {
      setIsTyping(false);
      setStatus("Ready to chat");
    }
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
                  className="mb-3 flex h-[min(75svh,38rem)] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                  aria-label="Portfolio chatbot"
              >
                {/* Header with animated gradient text hint */}
                <header className="flex items-center justify-between border-b border-line px-4 py-3 bg-surface-raised">
                  <div>
                    <p className="font-display text-sm font-semibold text-heading bg-gradient-to-r from-heading to-heading/70 bg-clip-text text-transparent">
                      Ask {SITE.name.split(" ")[0]}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`size-1.5 rounded-full ${isTyping ? 'bg-accent animate-pulse' : 'bg-green-500'}`} />
                      <p className="text-xs text-muted">{status}</p>
                    </div>
                  </div>
                  <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-line/50 hover:text-heading"
                      aria-label="Close chat"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </header>

                {/* Custom scrollbar styling for a cleaner look */}
                <div
                  aria-live="polite"
                  aria-label="Chat messages"
                  className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line/80"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.95, originX: message.role === "user" ? 1 : 0 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                message.role === "assistant"
                                    ? "bg-surface text-body ring-1 ring-line rounded-tl-sm"
                                    : "ml-auto bg-accent text-surface rounded-tr-sm"
                            }`}
                        >
                          {message.role === "assistant" ? (
                              <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ul:pl-5 prose-li:my-0.5 prose-strong:text-heading dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.text}
                                </ReactMarkdown>
                              </div>
                          ) : (
                              <p>{message.text}</p>
                          )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            key="typing-indicator"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                            className="inline-flex rounded-2xl bg-surface px-4 py-3 ring-1 ring-line rounded-tl-sm shadow-sm"
                        >
                          {/* 4. Organic bouncing dots */}
                          <div className="flex gap-1 items-center">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                    className="size-1.5 rounded-full bg-muted/60"
                                />
                            ))}
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Invisible div to scroll to */}
                  <div ref={messagesEndRef} className="h-px w-full" />
                </div>

                <div className="border-t border-line px-4 pb-4 pt-3 bg-surface-raised/50">
                  <div className="mb-2">
                    <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted transition-colors hover:text-heading group"
                    >
                      <span>{showSuggestions ? "Hide suggestions" : "Show suggestions"}</span>
                      <svg
                          className={`size-3 text-muted transition-transform duration-300 group-hover:text-heading ${
                              showSuggestions ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {showSuggestions && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                          <div className="mb-3 flex flex-wrap gap-2 pt-1">
                            {QUICK_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => void sendMessage(prompt)}
                                    className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:border-accent/60 hover:text-heading hover:bg-surface"
                                >
                                  {prompt}
                                </button>
                            ))}
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  <form
                      onSubmit={(e) => { e.preventDefault(); void sendMessage(draft); }}
                      className="flex items-end gap-2"
                  >
                <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="min-h-[40px] max-h-[120px] flex-1 resize-none overflow-y-auto rounded-xl border border-line bg-surface py-2.5 px-3 text-sm text-body placeholder:text-muted focus:border-accent/60 focus:ring-1 focus:ring-accent/30 focus:outline-none transition-shadow scrollbar-thin scrollbar-thumb-line"
                    placeholder="Ask a question... (Shift+Enter for new line)"
                />
                    <button
                        type="submit"
                        disabled={!canSend}
                        className="mb-[1px] flex h-[38px] items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-surface transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 hover:shadow-md active:scale-95"
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
            className="group flex items-center gap-2.5 rounded-full border border-line bg-surface-raised/95 px-5 py-3 text-sm font-medium text-heading shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 active:translate-y-0"
            aria-label={open ? "Hide chat" : "Open chat"}
        >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-accent transition-opacity group-hover:opacity-90"></span>
        </span>
          Chat with my AI
        </button>
      </div>
  );
}