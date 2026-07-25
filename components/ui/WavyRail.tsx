"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { motion, type MotionValue } from "motion/react";

/**
 * A scroll-drawn wavy rail that threads through a set of marker dots.
 *
 * The whole point is that the dots sit ON the line rather than beside it. A
 * free sine wave drawn over a straight column of centred dots leaves each dot
 * stranded off the curve wherever the wave has bulged away. So this measures
 * where the dots actually land and builds the path to cross the centre axis at
 * exactly those points, bulging out only in the gaps between them. The dots
 * then land on crossings, embedded in the line.
 *
 * Measuring is the only honest way to do this: milestone heights vary with
 * their content and with images that load late, so their positions are not
 * knowable ahead of time. A ResizeObserver re-measures whenever the column
 * reflows.
 *
 * The caller owns the scroll value, so the wave draws in on the same progress
 * that lights up the milestones.
 */

type Metrics = { width: number; height: number; centerX: number; ys: number[] };

/**
 * Builds the path.
 *
 * The line runs from the first dot to the last, not from the top of the
 * container, so there is no bulge above the first dot: that stray bulge was the
 * little hook at the start.
 *
 * Each gap between dots is a half sine, and the direction always alternates.
 * Alternating is what makes the line pass THROUGH each dot: a half sine has its
 * steepest horizontal slope at its ends, so two neighbours leaning opposite
 * ways meet at the dot with matching slope and cross it cleanly. Pinning every
 * bulge to the same side instead makes the line reverse at each dot and form a
 * cusp beside it, which reads as the dots being off the line.
 *
 * Where the axis sits near an edge, the swing toward that edge is shrunk to
 * whatever room is there while the other side keeps the full amplitude. The
 * crossing stays clean either way; only the shape leans.
 */
function buildPath(metrics: Metrics, amplitude: number): string {
  const { centerX, ys } = metrics;
  const dots = ys.filter((y) => Number.isFinite(y));
  if (dots.length < 2) return "";

  const leftAmp = Math.min(amplitude, Math.max(4, centerX - 3));
  const rightAmp = amplitude;

  let path = `M${centerX.toFixed(2)} ${dots[0].toFixed(2)} `;

  for (let segment = 0; segment < dots.length - 1; segment += 1) {
    const yStart = dots[segment];
    const yEnd = dots[segment + 1];
    const goRight = segment % 2 === 0;
    const amp = goRight ? rightAmp : -leftAmp;

    const steps = Math.max(6, Math.round((yEnd - yStart) / 8));
    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const y = yStart + (yEnd - yStart) * t;
      const x = centerX + amp * Math.sin(Math.PI * t);
      path += `L${x.toFixed(2)} ${y.toFixed(2)} `;
    }
  }
  return path.trim();
}

export function WavyRail({
  containerRef,
  progress,
  reduced,
  amplitude = 14,
}: {
  /** The positioned element the rail is drawn over and measured against. */
  containerRef: RefObject<HTMLElement | null>;
  /** Scroll progress 0 to 1, driving how much of the accent wave is drawn. */
  progress: MotionValue<number>;
  reduced: boolean;
  amplitude?: number;
}) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const dots = container.querySelectorAll<HTMLElement>("[data-wavy-node]");

      const ys: number[] = [];
      let centerSum = 0;
      dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        ys.push(rect.top + rect.height / 2 - bounds.top);
        centerSum += rect.left + rect.width / 2 - bounds.left;
      });

      setMetrics({
        width: bounds.width,
        height: bounds.height,
        centerX: dots.length ? centerSum / dots.length : 8,
        ys: ys.sort((a, b) => a - b),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);

  const path = useMemo(
    () => (metrics ? buildPath(metrics, amplitude) : ""),
    [metrics, amplitude],
  );

  if (!metrics || !path) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${metrics.width} ${metrics.height}`}
      fill="none"
    >
      <path
        d={path}
        stroke="var(--color-line)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <motion.path
        d={path}
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: reduced ? 1 : progress }}
      />
    </svg>
  );
}
