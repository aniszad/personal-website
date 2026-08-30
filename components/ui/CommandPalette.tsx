"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PAGES, SITE, SOCIALS, CV_PATH } from "@/lib/constants";
import { getLocalizedPages, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowUpRightIcon } from "@/components/ui/Icons";

type Command = {
  id: string;
  group: "go" | "actions";
  label: string;
  hint?: string;
  keywords?: string;
  keepOpen?: boolean;
  run: () => void;
};

/**
 * Cmd/Ctrl+K opens this from anywhere on the site. It is a second, faster way
 * to reach a page or fire off an action (ask the assistant, grab the email,
 * pull the CV) without hunting for the right link.
 *
 * Lives in the root layout rather than the homepage alone, since a keyboard
 * shortcut that only works on one route is a worse habit to build than not
 * having one.
 */
export function CommandPalette() {
  const reduced = useReducedMotion() ?? false;
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const copy = t(language);
  const cc = copy.generic.commandPalette;
  const pages = getLocalizedPages(language, PAGES);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [eggFound, setEggFound] = useState(false);

  // A quiet hidden command for whoever is curious enough to type it. Never
  // hinted at anywhere in the UI, and it never appears in the normal list.
  const isSecret = query.trim().toLowerCase() === "whoami";

  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    setEggFound(false);
    lastFocused.current?.focus();
  }, []);

  const revealEgg = useCallback(() => {
    setEggFound(true);
    window.setTimeout(close, 1000);
  }, [close]);

  const openPalette = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => {
          if (current) {
            lastFocused.current?.focus();
            return false;
          }
          lastFocused.current = document.activeElement as HTMLElement | null;
          return true;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onToggle() {
      openPalette();
    }
    window.addEventListener("portfolio:toggle-palette", onToggle);
    return () => window.removeEventListener("portfolio:toggle-palette", onToggle);
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const id = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 60);
      return () => {
        document.body.style.overflow = "";
        window.clearTimeout(id);
      };
    }
    return undefined;
  }, [open, reduced]);

  const commands = useMemo<Command[]>(() => {
    const go: Command[] = [
      {
        id: "home",
        group: "go",
        label: cc.home,
        run: () => router.push("/"),
      },
      ...pages.map((page) => ({
        id: page.href,
        group: "go" as const,
        label: page.label,
        hint: page.blurb,
        run: () => router.push(page.href),
      })),
    ];

    const actions: Command[] = [
      {
        id: "ask",
        group: "actions",
        label: cc.askAssistant,
        hint: cc.askAssistantHint,
        keywords: "chat assistant ai question",
        run: () => window.dispatchEvent(new CustomEvent("portfolio:open-chat")),
      },
      {
        id: "copy-email",
        group: "actions",
        label: copied ? cc.copyEmailDone : cc.copyEmail,
        hint: cc.copyEmailHint,
        keywords: "email contact mail",
        keepOpen: true,
        run: () => {
          void navigator.clipboard.writeText(SOCIALS.email).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      {
        id: "cv",
        group: "actions",
        label: cc.downloadCv,
        hint: cc.downloadCvHint,
        keywords: "resume pdf download",
        run: () => window.open(CV_PATH, "_blank", "noopener,noreferrer"),
      },
      {
        id: "github",
        group: "actions",
        label: cc.openGithub,
        keywords: "code repo",
        run: () => window.open(SOCIALS.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        group: "actions",
        label: cc.openLinkedin,
        keywords: "profile network",
        run: () => window.open(SOCIALS.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "language",
        group: "actions",
        label: language === "en" ? cc.switchToFrench : cc.switchToEnglish,
        keywords: "language locale fr en francais english",
        run: () => setLanguage(language === "en" ? "fr" : "en"),
      },
    ];

    return [...go, ...actions];
  }, [cc, copied, language, pages, router, setLanguage]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  function runCommand(command: Command) {
    command.run();
    if (!command.keepOpen) close();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (isSecret && event.key === "Enter") {
      event.preventDefault();
      revealEgg();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = filtered[activeIndex];
      if (command) runCommand(command);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  const goItems = filtered.filter((c) => c.group === "go");
  const actionItems = filtered.filter((c) => c.group === "actions");

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden="true"
            onClick={close}
            className="fixed inset-0 z-[70] bg-surface/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed inset-x-0 top-[12vh] z-[71] mx-auto flex w-[min(92vw,34rem)] flex-col overflow-hidden border border-line bg-raised"
            initial={{ opacity: 0, y: reduced ? 0 : -12, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : -12, scale: reduced ? 1 : 0.98 }}
            transition={{ duration: reduced ? 0.15 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {eggFound ? (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10"
                style={{ background: "radial-gradient(circle at 50% 40%, var(--color-heading), transparent 65%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.16, 0] }}
                transition={{ duration: reduced ? 0.3 : 0.9, ease: "easeOut" }}
              />
            ) : null}

            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span aria-hidden="true" className="text-muted">
                ⌘
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={cc.placeholder}
                aria-label={cc.placeholder}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent text-base text-heading placeholder:text-muted focus:outline-none"
              />
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-2 py-2">
              {isSecret ? (
                <button
                  type="button"
                  onClick={revealEgg}
                  className="flex w-full flex-col gap-1.5 px-3 py-4 text-left"
                >
                  <span className="font-serif text-lg text-heading">{SITE.name}</span>
                  <span className="text-sm font-light text-muted">{SITE.discipline}</span>
                  <span className="mt-1 text-xs font-light text-muted">↵ to say hi</span>
                </button>
              ) : filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">{cc.empty}</p>
              ) : (
                <>
                  {goItems.length > 0 ? (
                    <CommandGroup
                      label={cc.groupGo}
                      items={goItems}
                      allItems={filtered}
                      activeIndex={activeIndex}
                      onHover={setActiveIndex}
                      onSelect={runCommand}
                    />
                  ) : null}

                  {actionItems.length > 0 ? (
                    <CommandGroup
                      label={cc.groupActions}
                      items={actionItems}
                      allItems={filtered}
                      activeIndex={activeIndex}
                      onHover={setActiveIndex}
                      onSelect={runCommand}
                    />
                  ) : null}
                </>
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-muted">
              <span>↑↓ {cc.hint}</span>
              <span>↵ {cc.hintSelect}</span>
              <span>esc {cc.hintClose}</span>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function CommandGroup({
  label,
  items,
  allItems,
  activeIndex,
  onHover,
  onSelect,
}: {
  label: string;
  items: Command[];
  allItems: Command[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (command: Command) => void;
}) {
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-xs lowercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <ul>
        {items.map((command) => {
          const index = allItems.indexOf(command);
          const isActive = index === activeIndex;
          const icon = iconFor(command.id);

          return (
            <li key={command.id}>
              <button
                type="button"
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(command)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 ${
                  isActive ? "bg-heading/10" : ""
                }`}
              >
                {icon ? (
                  <span
                    aria-hidden="true"
                    className={isActive ? "text-heading" : "text-muted"}
                  >
                    {icon}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${isActive ? "bg-heading" : "bg-line"}`}
                  />
                )}

                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-medium ${isActive ? "text-heading" : "text-body"}`}
                  >
                    {command.label}
                  </span>
                  {command.hint ? (
                    <span className="block truncate text-xs text-muted">
                      {command.hint}
                    </span>
                  ) : null}
                </span>

                {command.group === "go" ? (
                  <ArrowUpRightIcon
                    width={14}
                    height={14}
                    className={isActive ? "text-heading" : "text-muted"}
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function iconFor(id: string) {
  switch (id) {
    case "github":
      return <GitHubIcon width={16} height={16} />;
    case "linkedin":
      return <LinkedInIcon width={16} height={16} />;
    case "copy-email":
      return <MailIcon width={16} height={16} />;
    default:
      return null;
  }
}
