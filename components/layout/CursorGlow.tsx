"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

/**
 * A single viewport-level pointer wash. It lives beside the route tree so no
 * page transition or section transform can trap the fixed layer inside a box.
 */
export function CursorGlow() {
  const reduced = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${x}px ${y}px,
      rgba(183, 243, 74, 0.04),
      transparent 80%
    )
  `;

  useEffect(() => {
    if (reduced) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        x.set(nextX);
        y.set(nextY);
        frame = 0;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}
