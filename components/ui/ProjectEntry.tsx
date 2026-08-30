"use client";

import Image from "next/image";
import Link from "next/link";
import type { ResolvedProject } from "@/lib/data";
import { TagList } from "@/components/ui/TagList";
import { localizeContent, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

/**
 * A featured project. The proprietary variant (Limpscanner) carries a
 * screenshot, an optional demo video slot, and a case-study link; the plain
 * featured variant is text only and sits inside a caller-owned 50/50 grid.
 */
export function ProjectEntry({
  project,
  variant,
}: {
  project: ResolvedProject;
  variant: "proprietary" | "featured";
}) {
  const { language } = useLanguage();
  const copy = t(language).generic;
  const description = localizeContent(language, project.description);
  const screenshot = project.screenshots[0];

  if (variant === "proprietary") {
    return (
      <div className="grid grid-cols-1 gap-10 border-b border-line-soft py-10 md:grid-cols-[minmax(0,1fr)_400px] md:items-start md:gap-11">
        <div>
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {copy.featuredProprietary}
          </p>
          <h2 className="mt-[14px] font-serif text-[38px] leading-[1.05] text-heading">
            {project.name}
          </h2>
          <p className="mt-4 max-w-[560px] text-[15px] font-light leading-[1.65] text-body">
            {description}
          </p>

          <TagList
            labels={project.tags}
            ariaLabel={`${copy.technologiesUsedIn} ${project.name}`}
          />

          {project.writeup ? (
            <Link
              href={`/projects/${project.slug}`}
              className="mt-[22px] inline-block border-b border-heading pb-[5px] text-sm font-medium text-heading"
            >
              {copy.caseStudy}
            </Link>
          ) : null}
        </div>

        <div className={`grid gap-3 ${project.demoVideo && screenshot ? "grid-cols-2" : "grid-cols-1"}`}>
          {screenshot ? (
            <Image
              src={screenshot}
              alt=""
              width={262}
              height={466}
              className="block aspect-[9/16] w-full border border-line object-cover"
            />
          ) : null}

          {project.demoVideo ? (
            <video
              src={project.demoVideo}
              poster={screenshot ?? undefined}
              controls
              className="aspect-[9/16] w-full border border-line bg-surface object-contain"
            />
          ) : null}
        </div>
      </div>
    );
  }

  const textBlock = (
    <div className="min-w-0">
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{copy.featured}</p>
      <h2 className="mt-3 font-serif text-[28px] leading-[1.1] text-heading">{project.name}</h2>
      <p className="mt-3.5 text-[14.5px] font-light leading-[1.65] text-body">{description}</p>
      <TagList
        labels={project.tags}
        ariaLabel={`${copy.technologiesUsedIn} ${project.name}`}
      />
    </div>
  );

  if (!screenshot) {
    return textBlock;
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px] items-start gap-4">
      {textBlock}
      <Image
        src={screenshot}
        alt=""
        width={96}
        height={171}
        className="block aspect-[9/16] w-full border border-line object-cover"
      />
    </div>
  );
}
