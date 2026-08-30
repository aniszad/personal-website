"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * The heading block at the top of every section page: eyebrow (with the
 * page's position in the sequence), title, blurb, and a plain hairline rule.
 *
 * Entrance is capped to a simple rise rather than the old clip-reveal: opacity
 * 0 to 1 with a 14px rise, 600ms easeOut, a 60ms stagger between the three
 * lines. Restraint is the point of this design; the rule itself doesn't
 * animate.
 */
export function PageHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
}) {
  const reduced = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.06 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.header initial="hidden" animate="visible" variants={container}>
      <motion.p
        variants={item}
        className="text-[10.5px] uppercase tracking-[0.16em] text-muted"
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        variants={item}
        className="mt-4 text-[38px] leading-none tracking-[-0.01em] text-heading lg:text-[58px]"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-5 max-w-[600px] text-base leading-[1.6] font-light text-body"
      >
        {blurb}
      </motion.p>

      <div className="mt-11 border-t border-line" />
    </motion.header>
  );
}
