import Link from "next/link";
import type { ReactNode } from "react";
import { getNeighbours, type PageMeta } from "@/lib/constants";
import { PageHeading } from "@/components/layout/PageHeading";
import { SiteNav } from "@/components/layout/SiteNav";
import { ThemeStyle } from "@/components/layout/ThemeStyle";

/**
 * Chrome shared by the six section pages: the colour identity, the persistent
 * nav, a display heading, and the sequential footer that carries the reader
 * onward.
 *
 * Each page supplies its own body treatment, so this stays visually quiet and
 * owns only structure, rhythm, and colour.
 */
export function PageShell({
  page,
  children,
}: {
  page: PageMeta;
  children: ReactNode;
}) {
  const { previous, next } = getNeighbours(page.href);

  return (
    <>
      {/*
        A sibling of the content rather than a wrapper around it, because it has
        to reach :root to retint the document. The wash that picks the new
        accent up lives in the root layout, outside the route template.
      */}
      <ThemeStyle theme={page.theme} />

      <div className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
        <SiteNav />

        <PageHeading title={page.title} blurb={page.blurb} />

        <main id="content">{children}</main>

        <nav
          aria-label="Page sequence"
          className="mt-32 grid gap-px border-t border-line sm:grid-cols-2"
        >
          {previous ? (
            <SequenceLink
              href={previous.href}
              caption="Previous"
              label={previous.label}
            />
          ) : (
            <span className="hidden sm:block" />
          )}

          {next ? (
            <SequenceLink
              href={next.href}
              caption="Next"
              label={next.label}
              alignEnd
            />
          ) : (
            <SequenceLink href="/" caption="Back to" label="Index" alignEnd />
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
      className={`group relative flex flex-col gap-2 py-8 ${
        alignEnd ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span className="text-sm lowercase text-muted">{caption}</span>
      <span className="font-display text-3xl font-semibold text-heading transition-colors duration-300 group-hover:text-accent">
        {label}
      </span>
    </Link>
  );
}
