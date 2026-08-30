"use client";

import { FormEvent, useState, useRef, useEffect, KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { ChatBubbleIcon, CloseIcon, SendIcon } from "@/components/ui/Icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function Avatar() {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-heading text-surface">
      <ChatBubbleIcon width={12} height={12} />
    </span>
  );
}

export function ChatWidget() {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const chatCopy = t(language).generic.chat;
  const quickPrompts = chatCopy.quickPrompts;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<string>(chatCopy.ready);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{
    id: "welcome",
    role: "assistant",
    text: chatCopy.welcome.replace("{name}", SITE.name),
  }]);
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
    setStatus(chatCopy.thinking);

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
      pushAssistantMessage(chatCopy.statusError.replace("{error}", textValue));
    } finally {
      setIsTyping(false);
      setStatus(chatCopy.ready);
    }
  }

  return (
      <div className="fixed bottom-5 right-5 z-50">
        <AnimatePresence initial={false}>
          {open ? (
              <motion.section
                  key="chat-panel"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: reduced ? 0.2 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mb-3 flex h-[min(75svh,38rem)] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_24px_70px_-15px_rgba(0,0,0,0.75)]"
                  aria-label="Portfolio chatbot"
              >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.06]"
                    style={{ background: "radial-gradient(60% 100% at 50% 0%, var(--color-heading), transparent)" }}
                />

                <header className="relative flex items-center justify-between border-b border-line bg-heading px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-heading">
                      <ChatBubbleIcon width={16} height={16} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-surface">
                        {chatCopy.ask.replace("{name}", SITE.name.split(" ")[0])}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full bg-surface ${isTyping ? "animate-pulse" : "opacity-50"}`} />
                        <p className="text-xs font-light text-surface/80">{status}</p>
                      </div>
                    </div>
                  </div>
                  <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="grid size-8 shrink-0 place-items-center text-surface/70 transition-colors duration-200 hover:text-surface"
                      aria-label={chatCopy.close}
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </header>

                {/* Custom scrollbar styling for a cleaner look */}
                <div
                  aria-live="polite"
                  aria-label={chatCopy.messages}
                  className="flex-1 space-y-4 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line/80"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            layout
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : ""}`}
                        >
                          {message.role === "assistant" ? <Avatar /> : null}

                          <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-light leading-relaxed ${
                                  message.role === "assistant"
                                      ? "rounded-bl-sm border border-line text-body"
                                      : "rounded-br-sm bg-heading text-surface shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4)]"
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
                          </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            key="typing-indicator"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                            className="flex items-end gap-2"
                        >
                          <Avatar />
                          <div className="inline-flex rounded-2xl rounded-bl-sm border border-line px-4 py-3">
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
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Invisible div to scroll to */}
                  <div ref={messagesEndRef} className="h-px w-full" />
                </div>

                <div className="border-t border-line px-4 pb-4 pt-3">
                  <div className="mb-2">
                    <button
                        type="button"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted transition-colors duration-200 hover:text-heading group"
                    >
                        <span>{showSuggestions ? chatCopy.hideSuggestions : chatCopy.showSuggestions}</span>
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
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => void sendMessage(prompt)}
                                    className="rounded-full border border-line px-3 py-1.5 text-xs font-light text-muted transition-colors duration-200 hover:border-line-strong hover:text-heading"
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
                      className="flex items-end gap-2 rounded-[22px] border border-line bg-surface py-1.5 pl-4 pr-1.5 transition-colors duration-200 focus-within:border-heading"
                  >
                <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="min-h-[28px] max-h-[120px] flex-1 resize-none overflow-y-auto bg-transparent py-1.5 text-sm font-light text-body placeholder:text-muted focus:outline-none scrollbar-thin scrollbar-thumb-line"
                    placeholder={chatCopy.placeholder}
                />
                    <motion.button
                        type="submit"
                        disabled={!canSend}
                        whileHover={canSend && !reduced ? { scale: 1.08 } : undefined}
                        whileTap={canSend ? { scale: 0.92 } : undefined}
                        aria-label={chatCopy.send}
                        className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
                            canSend
                                ? "bg-heading text-surface"
                                : "cursor-not-allowed bg-line/60 text-muted"
                        }`}
                    >
                      <SendIcon width={16} height={16} />
                    </motion.button>
                  </form>
                </div>
              </motion.section>
          ) : null}
        </AnimatePresence>

        {!open ? (
          <motion.button
              type="button"
              onClick={() => setOpen(true)}
              initial={false}
              animate={{ scale: 1 }}
              whileHover={reduced ? undefined : { scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2.5 rounded-full bg-heading py-3.5 pl-4 pr-5 text-sm font-medium text-surface shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]"
              aria-label={chatCopy.ask.replace("{name}", SITE.name.split(" ")[0])}
          >
            <span className="relative grid size-6 shrink-0 place-items-center">
              <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full bg-surface/25 ${reduced ? "" : "animate-ping"}`}
              />
              <ChatBubbleIcon width={16} height={16} className="relative" />
            </span>
            {chatCopy.ask.replace("{name}", `${SITE.name.split(" ")[0]}'s AI`)}
          </motion.button>
        ) : null}
      </div>
  );
}
