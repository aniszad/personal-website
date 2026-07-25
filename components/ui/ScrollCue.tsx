"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The hint at the foot of the opening screen.
 *
 * The index used to be visible immediately, which answered "what is here"
 * before the page had said who it belonged to. Holding it below the fold only
 * works if the reader knows to keep going, so this is doing real navigational
 * work rather than decoration.
 *
 * Two nested elements because two things drive opacity and they must not fight
 * over the same value: the outer one is bound to scroll position, the inner one
 * runs the fade in on mount.
 */
export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  const reduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  /* Gone by the time the index rows are in play, so it never overlaps them. */
  const fade = useTransform(scrollY, [0, 180], [1, 0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: fade }}
      className="pointer-events-none pb-10"
    >
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 1.4 }}
      >
        {/* The rail, with a short accent segment falling down it on a loop. */}
        <span className="relative block h-14 w-px overflow-hidden bg-line">
          {reduced ? null : (
            <motion.span
              className="absolute inset-x-0 top-0 h-5 bg-accent transition-colors duration-700"
              // Transform rather than top, so the loop stays on the compositor
              // and never asks for layout. Percentages are of the segment.
              animate={{ y: ["-110%", "290%"] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.35,
              }}
            />
          )}
        </span>

        <span className="text-xs lowercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}
