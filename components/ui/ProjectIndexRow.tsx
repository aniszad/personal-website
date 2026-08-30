"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ResolvedProject } from "@/lib/data";
import { localizeContent } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

const ROW_CLASS =
  "group grid grid-cols-[56px_minmax(0,1fr)] items-center gap-[22px] border-b border-line-soft py-[18px] md:grid-cols-[56px_minmax(0,1fr)_260px]";

/** One row in the projects index: a thumbnail (or ordinal, when there's no screenshot), name and truncated description, tech list. */
export function ProjectIndexRow({
  project,
  ordinal,
}: {
  project: ResolvedProject;
  ordinal: number;
}) {
  const { language } = useLanguage();
  const description = localizeContent(language, project.description);
  const tech = project.tags.join(" · ");
  const thumbnail = project.screenshots[0];

  const content = (
    <>
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt=""
          width={56}
          height={56}
          className="block size-14 border border-line object-cover"
        />
      ) : (
        <span aria-hidden="true" className="font-serif text-lg leading-none text-muted">
          {String(ordinal).padStart(2, "0")}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-base font-medium text-body-strong transition-colors duration-200 group-hover:text-heading">
          {project.name}
        </p>
        <p className="mt-1.5 truncate text-[13.5px] font-light text-muted">{description}</p>
        <p className="mt-1.5 text-[12.5px] font-light text-muted md:hidden">{tech}</p>
      </div>
      <span className="hidden text-right text-[12.5px] font-light text-muted md:block">
        {tech}
      </span>
    </>
  );

  if (project.writeup) {
    return (
      <Link href={`/projects/${project.slug}`} className={ROW_CLASS}>
        {content}
      </Link>
    );
  }

  if (project.repo) {
    return (
      <RowLink href={project.repo}>{content}</RowLink>
    );
  }

  return <div className={ROW_CLASS}>{content}</div>;
}

function RowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={ROW_CLASS}>
      {children}
    </a>
  );
}
