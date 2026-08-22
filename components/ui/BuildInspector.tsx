"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@/components/ui/Icons";

type Note = {
  label: string;
  value: string;
};

const PAGE_NOTES: Record<string, Note[]> = {
  "/": [
    { label: "Surface", value: "React + Motion values + CSS gradients" },
    { label: "Interaction", value: "Pointer tracking without React re-renders" },
    { label: "Performance", value: "Video metadata deferred until playback" },
  ],
  "/projects": [
    { label: "Structure", value: "Data-driven project entries" },
    { label: "Media", value: "Responsive images with lazy-loaded galleries" },
    { label: "Interaction", value: "Keyboard-accessible image and video viewer" },
  ],
  "/experience": [
    { label: "Structure", value: "Typed experience data resolved at build time" },
    { label: "Visual", value: "Scroll-linked SVG rail with measured milestones" },
    { label: "Motion", value: "Progressive enhancement with reduced-motion support" },
  ],
  "/education": [
    { label: "Structure", value: "Responsive timeline generated from typed data" },
    { label: "Visual", value: "SVG path follows the actual node positions" },
    { label: "Accessibility", value: "Semantic ordered list and keyboard-safe links" },
  ],
  "/about": [
    { label: "Layout", value: "Editorial rhythm built from CSS grid and type scale" },
    { label: "Content", value: "Localized copy resolved from one source" },
    { label: "Motion", value: "Reveal animations stop when reduced motion is preferred" },
  ],
  "/skills": [
    { label: "Structure", value: "Skill groups rendered from typed content" },
    { label: "Interaction", value: "Focus state dims unrelated groups" },
    { label: "Design", value: "One accent color across the entire system" },
  ],
  "/contact": [
    { label: "Interaction", value: "Pointer glow uses Motion values, not component state" },
    { label: "Delivery", value: "Contact form posts to a server route" },
    { label: "Fallback", value: "Direct email and CV remain available without JavaScript" },
  ],
};

export function BuildInspector() {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const lastFocused = useRef<HTMLElement | null>(null);

  const notes = useMemo(
    () => PAGE_NOTES[pathname.replace(/\/$/, "") || "/"] ?? PAGE_NOTES["/"]!,
    [pathname],
  );

  useEffect(() => {
    function openInspector() {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }

    window.addEventListener("portfolio:open-inspector", openInspector);
    return () => window.removeEventListener("portfolio:open-inspector", openInspector);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        lastFocused.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    lastFocused.current?.focus();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden="true"
            onClick={close}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="build-inspector-title"
            className="fixed inset-y-0 right-0 z-[81] flex w-[min(92vw,34rem)] max-w-full flex-col border-l border-line bg-surface-raised shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.8)]"
            initial={{ x: reduced ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduced ? 0 : "100%" }}
            transition={{ duration: reduced ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between border-b border-line px-6 py-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                  behind the build
                </p>
                <h2 id="build-inspector-title" className="mt-3 text-2xl text-heading">
                  How this page works
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close build notes"
                className="text-muted transition-colors hover:text-heading"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="mb-8 flex items-center gap-3 text-sm text-muted">
                <span className="grid size-8 place-items-center border border-accent/50 font-mono text-xs text-accent">
                  &lt;/&gt;
                </span>
                <span>
                  Inspecting <span className="text-heading">{pathname === "/" ? "home" : pathname.replaceAll("/", "")}</span>
                </span>
              </div>

              <div className="divide-y divide-line border-y border-line">
                {notes.map((note) => (
                  <div key={note.label} className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr] sm:gap-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {note.label}
                    </p>
                    <p className="text-sm leading-relaxed text-body">{note.value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm leading-relaxed text-muted">
                These notes show the decisions behind the interface—not a dump of production source code.
              </p>
            </div>

            <div className="border-t border-line px-6 py-4 text-xs text-muted">
              Press <kbd className="border border-line px-1.5 py-0.5 text-heading">Esc</kbd> or click outside to close.
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
