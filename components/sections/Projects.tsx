"use client";

import type { ResolvedProject } from "@/lib/data";
import { ProjectEntry } from "@/components/ui/ProjectEntry";
import { ProjectIndexRow } from "@/components/ui/ProjectIndexRow";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

/**
 * Projects page body: the proprietary flagship on its own, the other two
 * featured projects side by side, and the rest as a plain index.
 */
export function Projects({
  projects,
}: {
  projects: readonly ResolvedProject[];
}) {
  const { language } = useLanguage();
  const copy = t(language).generic;

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);
  const [proprietary, ...otherFeatured] = featured;

  return (
    <FadeInOnScroll>
      {proprietary ? <ProjectEntry project={proprietary} variant="proprietary" /> : null}

      {otherFeatured.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 border-b border-line-soft py-9 md:grid-cols-2 md:gap-12">
          {otherFeatured.map((project) => (
            <ProjectEntry key={project.slug} project={project} variant="featured" />
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <>
          <p className="pt-8 text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {copy.projectIndex}
          </p>
          <div>
            {rest.map((project, index) => (
              <ProjectIndexRow
                key={project.slug}
                project={project}
                ordinal={featured.length + index + 1}
              />
            ))}
          </div>
        </>
      ) : null}
    </FadeInOnScroll>
  );
}
