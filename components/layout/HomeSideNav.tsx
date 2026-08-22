"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PAGES, SITE, type PageMeta } from "@/lib/constants";
import { getLocalizedPages, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { PaletteTrigger, PaletteTriggerIcon } from "@/components/ui/PaletteTrigger";

/**
 * The homepage's only navigation: a fixed rail on the left from md upward,
 * collapsing to a slim top bar with a drawer below it.
 *
 * Replaces the old in-page index list. Destinations no longer live in the
 * scroll, so nothing about reaching them depends on how far down the hero
 * happens to run.
 */
export function HomeSideNav() {
  const { language } = useLanguage();
  const copy = t(language);
  const pages = getLocalizedPages(language, PAGES);
  const [open, setOpen] = useState(false);

  // Drawer never survives a viewport resize past the breakpoint it belongs to.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return (
    <>
      <div className="mx-auto flex max-w-4xl items-center justify-between border-b border-line px-6 pb-5 pt-6 md:hidden">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-heading"
        >
          {SITE.name}
        </Link>
        <div className="flex items-center gap-4">
          <PaletteTriggerIcon />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={copy.generic.openMenu}
            className="text-muted transition-colors duration-200 hover:text-heading"
          >
            <MenuIcon width={22} height={22} />
          </button>
        </div>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        pages={pages}
        label={copy.home.indexLabel}
        location={copy.home.location}
      />

      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-20 md:flex md:w-72 md:flex-col md:justify-between md:overflow-y-auto md:border-r md:border-line md:px-8 md:py-10 lg:w-80">
        <div>
          <Link
            href="/"
            className="font-display text-xl font-semibold text-heading transition-colors duration-200 hover:text-accent"
          >
            {SITE.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{copy.home.location}</p>

          <PaletteTrigger className="mt-8 w-full" />

          <NavList pages={pages} label={copy.home.indexLabel} />
        </div>

        <div className="flex items-center justify-between">
          <SocialLinks size={18} />
          <LanguageSwitch compact />
        </div>
      </aside>
    </>
  );
}

function MobileDrawer({
  open,
  onClose,
  pages,
  label,
  location,
}: {
  open: boolean;
  onClose: () => void;
  pages: PageMeta[];
  label: string;
  location: string;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between border-r border-line bg-surface px-6 py-8 md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-heading">
                  {SITE.name}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="text-muted transition-colors duration-200 hover:text-heading"
                >
                  <CloseIcon width={20} height={20} />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">{location}</p>

              <PaletteTrigger className="mt-6 w-full" onClick={onClose} />

              <NavList pages={pages} label={label} onNavigate={onClose} />
            </div>

            <div className="flex items-center justify-between">
              <SocialLinks size={18} />
              <LanguageSwitch compact />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function NavList({
  pages,
  label,
  onNavigate,
}: {
  pages: PageMeta[];
  label: string;
  onNavigate?: () => void;
}): ReactNode {
  const reduced = useReducedMotion() ?? false;

  return (
    <nav aria-label={label} className="mt-12">
      <p className="mb-4 text-xs lowercase tracking-[0.25em] text-muted">
        {label}
      </p>

      <ul>
        {pages.map((page, position) => (
          <motion.li
            key={page.href}
            style={{ "--row": page.theme.accent } as CSSProperties}
            initial={{ opacity: 0, x: reduced ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduced ? 0.2 : 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: reduced ? 0 : 0.2 + position * 0.05,
            }}
          >
            <Link
              href={page.href}
              onClick={onNavigate}
              className="group relative flex items-baseline gap-3 py-3 pl-4"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-1.5 left-0 w-px scale-y-0 bg-[var(--row)] transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
              />

              <span className="font-display text-xs text-muted transition-colors duration-200 group-hover:text-[var(--row)]">
                {String(position + 1).padStart(2, "0")}
              </span>

              <span className="font-display text-base font-medium text-heading transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--row)] motion-reduce:transition-none">
                {page.label}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
