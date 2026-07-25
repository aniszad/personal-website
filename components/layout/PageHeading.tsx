"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The heading block at the top of every section page.
 *
 * The title rises out of a clipped box and the rule beneath it draws left to
 * right in the page accent, so the first thing that moves on arrival is also
 * the first thing that states which colour this section is. It replaces a
 * static border, which is why the rule is a real element rather than a
 * border-bottom.
 */
export function PageHeading({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <header className="relative mb-20 pb-10 md:mb-28">
      <h1 className="text-5xl text-heading md:text-7xl">
        <span className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: "120%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            transition={{
              duration: reduced ? 0.3 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {title}
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduced ? 0.2 : 0.55,
          ease: "easeOut",
          delay: reduced ? 0 : 0.18,
        }}
      >
        {blurb}
      </motion.p>

      {/* The full width hairline, with the accent drawing over it. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-line"
      >
        <motion.span
          className="block h-px origin-left bg-accent transition-colors duration-700"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduced ? 0.3 : 1.1,
            ease: [0.16, 1, 0.3, 1],
            delay: reduced ? 0 : 0.3,
          }}
        />
      </span>
    </header>
  );
}
