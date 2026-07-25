"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Baseline scroll entrance: fade in and slide up by 20px, once, when the
 * element first enters the viewport.
 *
 * Pages with their own visual identity drive motion directly instead of using
 * this. It exists for the plain cases, where a section wants the house default
 * rather than a treatment of its own.
 *
 * Under reduced motion the slide is dropped and only a short fade remains, so
 * nothing travels across the screen.
 */
function buildVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.5, ease: "easeOut" },
    },
  };
}

export function FadeInOnScroll({
  children,
  className,
  /** Seconds to wait before this element starts animating. */
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={buildVariants(reduced)}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
