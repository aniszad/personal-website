"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PAGES, SITE } from "@/lib/constants";
import { getLocalizedPages, t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname === `${href}/`;
}

/**
 * Horizontal, full width, not fixed: the masthead replaces the old fixed left
 * rail. Name and location sit at the left, the six section links and the
 * locale switch at the right; on narrow viewports it collapses to name + a
 * menu button opening a drawer.
 */
export function Masthead() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = t(language);
  const pages = getLocalizedPages(language, PAGES);
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return (
    <>
      <div className="flex items-baseline justify-between border-b border-line px-6 pb-[22px] pt-[26px] md:px-8 lg:px-14">
        <div className="flex items-baseline gap-[18px]">
          {onHome ? (
            <span className="font-serif text-[17px] text-heading">{SITE.name}</span>
          ) : (
            <Link href="/" className="font-serif text-[17px] text-heading">
              {SITE.name}
            </Link>
          )}
          <span className="text-xs tracking-[0.06em] text-muted">{copy.home.location}</span>
        </div>

        <nav
          aria-label={copy.generic.siteSections}
          className="hidden items-baseline gap-[26px] md:flex"
        >
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              aria-current={isActive(pathname, page.href) ? "page" : undefined}
              className={`text-[12.5px] transition-colors duration-200 ${
                isActive(pathname, page.href)
                  ? "border-b border-heading pb-1 text-heading"
                  : "text-muted hover:text-heading"
              }`}
            >
              {page.label}
            </Link>
          ))}

          <PaletteMastheadTrigger />

          <span aria-hidden="true" className="h-[13px] w-px bg-line-strong" />

          <LocaleSwitch />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <PaletteMastheadTrigger />
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
        pathname={pathname}
      />
    </>
  );
}

function PaletteMastheadTrigger() {
  const { language } = useLanguage();
  const label = t(language).generic.commandPalette.trigger;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("portfolio:toggle-palette"))}
      className="text-[12.5px] text-muted transition-colors duration-200 hover:text-heading"
    >
      {label}
    </button>
  );
}

function LocaleSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="text-[11px] tracking-[0.08em] text-muted" role="group" aria-label="Language switch">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={language === "en" ? "text-heading" : "transition-colors duration-200 hover:text-heading"}
      >
        EN
      </button>
      <span aria-hidden="true"> · </span>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        aria-pressed={language === "fr"}
        className={language === "fr" ? "text-heading" : "transition-colors duration-200 hover:text-heading"}
      >
        FR
      </button>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  pages,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pages: ReturnType<typeof getLocalizedPages>;
  pathname: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const copy = t(language);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-surface/90 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between border-l border-line bg-surface px-6 py-8 md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg text-heading">{SITE.name}</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={copy.generic.closeMenu}
                  className="text-muted transition-colors duration-200 hover:text-heading"
                >
                  <CloseIcon width={20} height={20} />
                </button>
              </div>

              <nav aria-label={copy.generic.siteSections} className="mt-10 flex flex-col gap-1">
                {pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={onClose}
                    aria-current={isActive(pathname, page.href) ? "page" : undefined}
                    className={`py-3 text-base ${
                      isActive(pathname, page.href) ? "text-heading" : "text-muted"
                    }`}
                  >
                    {page.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-between">
              <PaletteMastheadTrigger />
              <LocaleSwitch />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
