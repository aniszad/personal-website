"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES, SITE } from "@/lib/constants";
import { t, getLocalizedPages } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { PaletteTriggerIcon } from "@/components/ui/PaletteTrigger";

/**
 * Slim bar carried by every page except the index.
 *
 * There is no sidebar, so this is the only persistent navigation. Labels stay
 * lowercase and unstyled; the current page is marked with an accent rule
 * beneath it rather than a filled pill.
 *
 * The list scrolls horizontally on narrow screens instead of collapsing into a
 * menu, so every destination stays one tap away with nothing to open first.
 */
export function SiteNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = t(language);
  const pages = getLocalizedPages(language, PAGES);

  return (
    <nav
      aria-label={copy.generic.siteSections}
      className="sticky top-0 z-30 -mx-6 mb-20 border-b border-line bg-surface/90 px-6 backdrop-blur-sm md:-mx-10 md:px-10"
    >
      <div className="flex h-16 items-center justify-between gap-8">
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-heading transition-colors duration-200 hover:text-accent"
          >
            {SITE.name}
          </Link>
          <LanguageSwitch compact />
        </div>

        <ul className="flex min-w-0 items-center gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pages.map((page) => {
            // Routes are exported with trailing slashes, so compare on the
            // prefix rather than requiring an exact string match.
            const isCurrent =
              pathname === page.href || pathname === `${page.href}/`;

            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "relative block whitespace-nowrap py-1 text-sm lowercase transition-colors duration-200",
                    isCurrent ? "text-accent" : "text-muted hover:text-heading",
                  )}
                >
                  {page.label}
                  {isCurrent ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px bg-accent"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <PaletteTriggerIcon className="shrink-0" />
      </div>
    </nav>
  );
}
