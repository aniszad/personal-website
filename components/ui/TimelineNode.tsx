"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ResolvedEducationEntry } from "@/lib/data";
import { LogoPlate } from "@/components/ui/LogoPlate";
import { cn } from "@/lib/utils";

/**
 * Builds a short badge from an institution name, used when no logo file exists.
 * A single word yields its first two letters, multiple words yield the initial
 * of each significant word.
 */
function initialsFor(name: string): string {
  const words = name
    .split(/\s+/)
    .filter((word) => word.length > 2 && /[a-zA-Z]/.test(word[0]));

  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * One milestone on the education timeline: the dot on the line, the
 * institution's logo, and the entry that slides in beside it.
 *
 * The logo lifts and grows on hover, and becomes a link out to the institution
 * when a website is known. Everything reacts to `isActive`, which the parent
 * flips when scroll progress passes this entry's threshold.
 *
 * Entries alternate sides on desktop and all sit right of the line on mobile,
 * where the line hugs the left edge.
 */
export function TimelineNode({
  entry,
  isActive,
}: {
  entry: ResolvedEducationEntry;
  isActive: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const isLeft = entry.side === "left";

  // Entries travel in from the side they occupy. On mobile every entry is on
  // the right of the line, so they all travel the same way.
  const offscreenX = reduced ? 0 : isLeft ? -32 : 32;

  return (
    <li className="relative pl-10 md:grid md:grid-cols-2 md:gap-x-16 md:pl-0">
      {/* Dot on the line. Left edge on mobile, centered on desktop. The
          data attribute lets the wavy rail measure this point and thread the
          line through it. */}
      <motion.span
        aria-hidden="true"
        data-wavy-node
        className={cn(
          "absolute left-0 top-2 z-10 size-3 rounded-full border",
          "md:left-1/2 md:-translate-x-1/2",
          isActive ? "border-accent bg-accent" : "border-line bg-surface",
        )}
        initial={false}
        animate={{ scale: isActive ? 1 : 0.5, opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
      />

      <motion.div
        className={cn(
          isLeft ? "md:col-start-1 md:text-right" : "md:col-start-2 md:row-start-1",
        )}
        initial={{ opacity: 0, x: offscreenX }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: offscreenX }}
        transition={{ duration: reduced ? 0.2 : 0.5, ease: "easeOut" }}
      >
        <p className="text-sm text-muted">{entry.dates}</p>

        <div
          className={cn(
            "mt-4 flex items-center gap-4",
            isLeft && "md:flex-row-reverse",
          )}
        >
          {entry.logo ? (
            /*
              Arrival is handed to the timeline rather than left to the plate,
              so the logo pops at the moment the scroll fill reaches this
              entry instead of whenever it happens to cross the viewport.
            */
            <LogoPlate
              src={entry.logo}
              name={entry.institution}
              href={entry.website}
              active={isActive}
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-14 shrink-0 place-items-center rounded-sm border border-line font-display text-base font-semibold text-accent"
            >
              {initialsFor(entry.institution)}
            </span>
          )}

          <h3 className="min-w-0 text-2xl text-heading md:text-3xl">
            {entry.institution}
          </h3>
        </div>

        <p className="mt-4 text-base text-body">{entry.degree}</p>
        <p className="mt-1 text-sm text-muted">{entry.location}</p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {entry.description}
        </p>
      </motion.div>
    </li>
  );
}
