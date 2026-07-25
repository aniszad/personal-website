"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Portrait plate.
 *
 * Built for the illustrated portrait, which is line and watercolour drawn on
 * white. That constrains the treatment in ways a photograph would not:
 *
 *   - it sits on a paper coloured panel, so the artwork's own white background
 *     reads as a printed plate rather than as a gap in the page
 *   - no colour wash over the top, which would poison the watercolour
 *   - no gradient into the surface, which would smear across the white
 *   - square, matching the source, so nothing of the drawing is cropped away
 *
 * The motion is therefore all structural: a wipe reveal on mount, and a slight
 * drift against the pointer for depth. Both are dropped under reduced motion,
 * where the plate simply fades in and holds still.
 */
export function Portrait({ src, alt }: { src: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.4 };
  // Kept small. The artwork is only scaled 5%, so there is little room to
  // travel before an edge would show.
  const translateX = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [8, -8]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [8, -8]),
    springConfig,
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const frame = frameRef.current;
    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative aspect-square w-full overflow-hidden border border-line bg-paper transition-colors duration-500 hover:border-accent/60"
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
      }
      animate={
        reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0 0 0)" }
      }
      transition={{
        duration: reduced ? 0.3 : 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.35,
      }}
    >
      <motion.div
        className="absolute inset-0 scale-105"
        style={reduced ? undefined : { x: translateX, y: translateY }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
