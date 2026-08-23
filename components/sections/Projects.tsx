"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ResolvedProject } from "@/lib/data";
import { ProjectEntry } from "@/components/ui/ProjectEntry";

/**
 * Projects page body.
 *
 * Visual identity: a single column of hairline separated rows that arrive in
 * sequence, with an accent rule drawing across each row on hover and any
 * screenshots easing in under the cursor. Featured work sorts first and is set
 * larger.
 */
export function Projects({
  projects,
}: {
  projects: readonly ResolvedProject[];
}) {
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) return;

    document.documentElement.classList.add("timeline-snap-page");
    return () => document.documentElement.classList.remove("timeline-snap-page");
  }, [reduced]);

  const ordered = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ];

  return (
    <div className="border-b border-line">
      {ordered.map((project, position) => (
        <motion.div
          key={project.slug}
          className="snap-item flex min-h-[calc(100svh-2rem)] items-center border-t border-line py-12 md:min-h-svh md:py-16"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reduced ? 0.2 : 0.5,
            ease: "easeOut",
            delay: reduced ? 0 : position * 0.07,
          }}
        >
          <ProjectEntry project={project} />
        </motion.div>
      ))}
    </div>
  );
}
