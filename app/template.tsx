"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Route enter animation.
 *
 * A template remounts on every navigation, unlike a layout, which is exactly
 * what an entrance transition needs. Only the enter half is animated: exit
 * animations in the App Router require holding the outgoing tree in
 * AnimatePresence, which fights the router and delays the new page for no real
 * gain at this scale.
 *
 * Opacity only, and deliberately so. A transform here would make this element a
 * containing block for the entire page, which silently reparents anything
 * fixed inside it. It also has less work to do now: the page heading masks its
 * own title up and draws its own rule, so a second slide underneath was
 * blurring the one that carries meaning.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.15 : 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
