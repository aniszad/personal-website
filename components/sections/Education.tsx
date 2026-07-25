"use client";

import { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { ResolvedEducationEntry } from "@/lib/data";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { WavyRail } from "@/components/ui/WavyRail";

/**
 * Scroll driven education timeline.
 *
 * A vertical track runs down the section. As the reader scrolls, an accent
 * coloured fill draws downward over it, and each milestone lights up as the
 * fill reaches it.
 *
 * Two mechanisms share one scroll value:
 *   - the fill height maps continuously from scroll progress
 *   - each node has a discrete threshold, and activates once progress passes it
 *
 * The useScroll offset below starts the fill when the section top reaches 85%
 * down the viewport and completes it when the section bottom reaches 55% down,
 * so the line finishes slightly before the section leaves the screen rather
 * than still crawling as the reader scrolls away.
 */

export function Education({
  entries,
}: {
  entries: readonly ResolvedEducationEntry[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Fraction of scroll progress at which each node lights up.
  const thresholds = entries.map(
    (_, index) => (index + 0.35) / entries.length,
  );

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "end 0.55"],
  });

  // Number of milestones passed so far. Nodes below this index are dormant.
  const [activeCount, setActiveCount] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    let passed = 0;
    for (const threshold of thresholds) {
      if (progress >= threshold) passed += 1;
    }
    // React bails out when the value is unchanged, so this is safe to call on
    // every scroll frame.
    setActiveCount(passed);
  });

  return (
    <div ref={trackRef} className="relative">
      {/* Wavy track that threads through the milestone dots. */}
      <WavyRail
        containerRef={trackRef}
        progress={scrollYProgress}
        reduced={reduced}
      />

      <ol className="space-y-12 md:space-y-16">
        {entries.map((entry, index) => (
          <TimelineNode
            key={`${entry.institution}-${entry.dates}`}
            entry={entry}
            isActive={reduced || index < activeCount}
          />
        ))}
      </ol>
    </div>
  );
}
