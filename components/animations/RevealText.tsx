"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Reveals a paragraph one word at a time as it scrolls into view.
 *
 * Accessibility note: the visible text is split into per word spans, which
 * assistive technology would otherwise announce as disconnected fragments. The
 * paragraph therefore carries the full string as its accessible name and the
 * spans are hidden from the accessibility tree, so a screen reader hears one
 * clean sentence.
 *
 * Under reduced motion the split is skipped entirely and the text renders as
 * ordinary markup.
 */
export function RevealText({
  text,
  className,
  /** Seconds between each word. Lower reads faster and calmer. */
  stagger = 0.02,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");

  return (
    <motion.p
      className={cn("text-balance", className)}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {words.map((word, position) => (
        <motion.span
          // Words repeat within a paragraph, so the index is part of the key.
          key={`${word}-${position}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          {word}
          {position < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
