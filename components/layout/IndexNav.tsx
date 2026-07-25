"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PAGES } from "@/lib/constants";
import { getLocalizedPages, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

/**
 * The index listing.
 *
 * Each destination is a hairline separated row: the name set large in the
 * display face, its summary alongside. There are no cards and no ordinals. The
 * only hover states are a rule that draws across the row, the name shifting a
 * little to the right, and an arrow arriving at the end of it.
 *
 * Every row hovers in its own section's accent rather than the site accent, so
 * the colour a visitor is about to land in announces itself a moment before
 * they get there. That is the whole reason the themes live on PageMeta: one
 * array drives the listing, the pages, and the transition between them.
 *
 * These are ordinary links, so keyboard focus, middle click, and open in new
 * tab all behave the way a reader expects. Rows arrive on scroll rather than on
 * load, because they now sit a screen below the fold and animating them on
 * mount would mean they had already finished by the time anyone looked.
 */
export function IndexNav() {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const copy = t(language);
  const pages = getLocalizedPages(language, PAGES);

  return (
    <nav aria-label={copy.generic.siteSections}>
      <p className="mb-8 text-xs lowercase tracking-[0.25em] text-muted">
        {copy.home.indexLabel}
      </p>

      <ul>
        {pages.map((page, position) => (
          <motion.li
            key={page.href}
            // Read by the hover utilities below, which is what lets a single
            // markup block carry six different colours.
            style={{ "--row": page.theme.accent } as CSSProperties}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduced ? 0.2 : 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: reduced ? 0 : position * 0.06,
            }}
            className="border-t border-line last:border-b"
          >
            <Link
              href={page.href}
              className="group relative block py-6 md:py-8"
            >
              {/* Rule that draws across the row on hover, in its own colour. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--row)] transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />

              {/*
                A wash of the row's colour bleeding in from the left. Faint
                enough to register as warmth rather than as a highlighted list
                item, which is what a filled background would look like.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-6 right-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none md:-left-10"
                style={{
                  background:
                    "linear-gradient(to right, color-mix(in srgb, var(--row) 12%, transparent), transparent)",
                }}
              />

              <div className="relative flex flex-col gap-2 md:flex-row md:items-baseline md:gap-10">
                <span className="flex items-center gap-3 font-display text-4xl font-semibold text-heading transition-all duration-300 group-hover:text-[var(--row)] md:w-64 md:shrink-0 md:text-5xl md:group-hover:translate-x-2">
                  {page.label}
                </span>

                <span className="max-w-xl text-base leading-relaxed text-muted transition-colors duration-300 group-hover:text-body">
                  {page.blurb}
                </span>

                <ArrowUpRightIcon
                  width={22}
                  height={22}
                  className="hidden shrink-0 -translate-x-2 text-[var(--row)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none md:ml-auto md:block"
                />
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
