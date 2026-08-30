"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Baseline scroll entrance: fade in and rise 14px, once, when the element
 * first enters the viewport. Reserved for a page's first content block only;
 * nothing further down a list repeats this.
 *
 * Under reduced motion the rise is dropped and only a short fade remains, so
 * nothing travels across the screen.
 */
function buildVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.6, ease: "easeOut" },
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
