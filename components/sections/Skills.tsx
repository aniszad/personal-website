"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SKILL_GROUPS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Skills page body.
 *
 * Visual identity: a two column index, category name against its tools, split
 * by hairlines. Hovering one row dims the others so a reader scanning for a
 * particular stack can isolate it.
 *
 * The dimming is presentational only, driven by pointer enter and leave. It
 * never hides or reorders content, so keyboard and screen reader users lose
 * nothing by not triggering it.
 *
 * No proficiency bars, by deliberate choice: a self assigned rating out of five
 * tells a reader nothing they can verify.
 */
export function Skills() {
  const reduced = useReducedMotion() ?? false;
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="border-b border-line">
      {SKILL_GROUPS.map((group, position) => {
        const isDimmed = focused !== null && focused !== group.category;

        return (
          <motion.section
            key={group.category}
            onPointerEnter={() => setFocused(group.category)}
            onPointerLeave={() => setFocused(null)}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduced ? 0.2 : 0.45,
              ease: "easeOut",
              delay: reduced ? 0 : position * 0.05,
            }}
            className={cn(
              "border-t border-line py-8 transition-opacity duration-300",
              isDimmed ? "opacity-30" : "opacity-100",
            )}
          >
            <div className="flex flex-col gap-4 md:flex-row md:gap-12">
              <h2
                className={cn(
                  "shrink-0 text-2xl transition-colors duration-300 md:w-56 md:text-3xl",
                  focused === group.category ? "text-accent" : "text-heading",
                )}
              >
                {group.category}
              </h2>

              <ul className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-2">
                {group.skills.map((skill, skillPosition) => (
                  <li
                    key={skill}
                    className="flex items-baseline gap-4 text-lg text-body"
                  >
                    {skill}
                    {skillPosition < group.skills.length - 1 ? (
                      <span aria-hidden="true" className="text-line">
                        /
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
