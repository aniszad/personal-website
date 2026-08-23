"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/** A restrained precision cursor for fine-pointer devices only. */
export function PrecisionCursor() {
  const reduced = useReducedMotion() ?? false;
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const x = useMotionValue(-40);
  const y = useMotionValue(-40);
  const ringX = useSpring(x, { damping: 34, stiffness: 500, mass: 0.22 });
  const ringY = useSpring(y, { damping: 34, stiffness: 500, mass: 0.22 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(finePointer.matches && !reduced);
    update();
    finePointer.addEventListener("change", update);

    return () => finePointer.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("has-precision-cursor");
    let frame = 0;
    let nextX = -40;
    let nextY = -40;

    const handlePointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      const target = event.target;
      setInteractive(
        target instanceof Element &&
          Boolean(target.closest("a, button, input, textarea, select, [role='button']")),
      );

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        x.set(nextX);
        y.set(nextY);
        frame = 0;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      document.body.classList.remove("has-precision-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ left: x, top: y }}
      />
      <motion.div
        className={`absolute ${interactive ? "size-7 opacity-100" : "size-5 opacity-75"} -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/80 transition-[width,height,opacity] duration-200`}
        style={{ left: ringX, top: ringY }}
      />
    </div>
  );
}
