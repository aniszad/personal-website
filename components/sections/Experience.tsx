"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import type { ResolvedExperience } from "@/lib/data";
import { ExperienceEntry } from "@/components/ui/ExperienceEntry";
import { WavyRail } from "@/components/ui/WavyRail";

/**
 * Experience page body.
 *
 * Visual identity: a rail down the left edge that fills as the reader
 * descends, with each role sliding in from the rail side. It is the same
 * scroll driven idea as the education timeline but deliberately quieter, since
 * the reading weight here is in the bullet points rather than the graphic.
 */
export function Experience({
  entries,
}: {
  entries: readonly ResolvedExperience[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) return;

    document.documentElement.classList.add("timeline-snap-page");
    return () => document.documentElement.classList.remove("timeline-snap-page");
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.7"],
  });

  return (
    <div ref={railRef} className="relative pl-8 md:pl-12">
      {/* Same wavy rail as the education timeline, threaded through the role
          markers. */}
      <WavyRail
        containerRef={railRef}
        progress={scrollYProgress}
        reduced={reduced}
        amplitude={10}
      />

      <ol className="space-y-16">
        {entries.map((entry) => (
          <li
            key={`${entry.company}-${entry.role}`}
            className="relative flex min-h-[calc(100svh-2rem)] items-center py-12 md:min-h-svh md:py-16"
          >
            {/*
              Marker sitting on the rail, aligned with the role title. It is a
              static sibling of the sliding content on purpose: the wavy rail
              measures its position to thread the line through it, and a marker
              that translated with the entrance animation would be measured
              mid-slide and leave the line missing its dot.
            */}
            <span
              aria-hidden="true"
              data-wavy-node
              className="absolute -left-8 top-2 z-10 size-2.5 rounded-full bg-accent md:-left-12"
            />
            <motion.div
              initial={{ opacity: 0, x: reduced ? 0 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reduced ? 0.2 : 0.55, ease: "easeOut" }}
            >
              <ExperienceEntry entry={entry} />
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}
