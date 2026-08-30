"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { getNeighbours, PAGES, type PageMeta } from "@/lib/constants";
import { getPageCopy, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PageHeading } from "@/components/layout/PageHeading";
import { Masthead } from "@/components/layout/Masthead";

/**
 * Chrome shared by the six section pages: the masthead, a page heading, and
 * the sequential footer that carries the reader onward.
 *
 * Each page supplies its own body treatment, so this stays visually quiet and
 * owns only structure and rhythm.
 */
export function PageShell({
  page,
  children,
}: {
  page: PageMeta;
  children: ReactNode;
}) {
  const { language } = useLanguage();
  const copy = t(language);
  const localizedPage = getPageCopy(language, page.href);
  const { previous, next } = getNeighbours(page.href);
  const position = PAGES.findIndex((candidate) => candidate.href === page.href) + 1;
  const eyebrow = `${String(position).padStart(2, "0")}. ${localizedPage.label}`;

  return (
    <>
      <Masthead />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-10 md:px-8 lg:px-14 lg:pt-14">
        <PageHeading eyebrow={eyebrow} title={localizedPage.title} blurb={localizedPage.blurb} />

        <main id="content" className="pt-9 md:pt-11">
          {children}
        </main>

        <nav
          aria-label={copy.generic.pageSequence}
          className="mt-14 grid grid-cols-1 gap-px border-t border-line sm:mt-[56px] sm:grid-cols-2"
        >
          {previous ? (
            <SequenceLink
              href={previous.href}
              caption={copy.generic.previous}
              label={getPageCopy(language, previous.href).label}
            />
          ) : (
            <span className="hidden sm:block" />
          )}

          {next ? (
            <SequenceLink
              href={next.href}
              caption={copy.generic.next}
              label={getPageCopy(language, next.href).label}
              alignEnd
            />
          ) : (
            <SequenceLink
              href="/"
              caption={copy.generic.backTo}
              label={copy.generic.index}
              alignEnd
            />
          )}
        </nav>
      </div>
    </>
  );
}

function SequenceLink({
  href,
  caption,
  label,
  alignEnd = false,
}: {
  href: string;
  caption: string;
  label: string;
  alignEnd?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-[7px] py-[26px] ${
        alignEnd ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-heading transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span className="text-xs font-light text-muted">{caption}</span>
      <span className="font-serif text-[26px] leading-none text-heading">
        {label}
      </span>
    </Link>
  );
}
