"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The coloured wash behind every page.
 *
 * Two large blurred fields of the page accent, drifting slowly against each
 * other. This is what makes the per section colour legible: shifting the base
 * navy alone is far too subtle to notice, but a wash covering most of the
 * viewport is unmistakable while leaving every text contrast ratio untouched,
 * since it never rises above 14 percent opacity.
 *
 * Both fields carry a colour transition, so a navigation crossfades the wash on
 * the same 700ms curve the body background uses and the two arrive together.
 *
 * Fixed rather than scrolling, so the colour belongs to the page rather than to
 * a position within it. Behind everything at -z-10, and inert to the pointer.
 */
export function Ambient() {
  const reduced = useReducedMotion() ?? false;

  /** One slow, non repeating-looking cycle. Mirrored, so it never jumps. */
  const drift = (duration: number) => ({
    duration,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute -right-[15%] -top-[25%] size-[65vmax] rounded-full bg-accent opacity-[0.13] blur-[110px] transition-colors duration-700 ease-out"
        animate={
          reduced ? undefined : { x: [0, -60, 20, 0], y: [0, 40, -30, 0] }
        }
        transition={drift(26)}
      />

      <motion.div
        className="absolute -bottom-[30%] -left-[20%] size-[55vmax] rounded-full bg-accent opacity-[0.1] blur-[120px] transition-colors duration-700 ease-out"
        animate={
          reduced ? undefined : { x: [0, 70, -20, 0], y: [0, -50, 25, 0] }
        }
        transition={drift(34)}
      />

      {/*
        A faint vignette pulling the corners back down. Without it the wash
        lifts the page edges enough that the navy stops reading as the darkest
        thing on screen.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-surface)_100%)] opacity-70" />
    </div>
  );
}
