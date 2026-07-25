"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { SITE } from "@/lib/constants";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { ScrollCue } from "@/components/ui/ScrollCue";

/**
 * The opening screen.
 *
 * It owns the full viewport and holds no navigation of its own, so the first
 * thing a visitor meets is who is speaking rather than a table of contents.
 * The index sits below the fold and the scroll cue at the foot is what carries
 * them to it.
 *
 * Laid out asymmetrically on purpose: an oversized title against small, plain
 * metadata. That size contrast is what gives the page its character, so resist
 * balancing the columns.
 *
 * The portrait is passed in rather than imported, because whether one exists is
 * a build time fact the server resolves. This component only decides where it
 * sits, and lays out fine without one.
 */

/**
 * Broken by hand rather than left to wrap. Three short lines keep the type
 * large enough to carry the screen inside a narrow column, and the ragged right
 * edge is the point.
 */
export function Hero({ portrait }: { portrait?: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const copy = t(language);
  const titleCopy = copy.home.rotatingTitle;
  const [titleIndex, setTitleIndex] = useState(0);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.6, ease: "easeOut" },
    },
  };

  /*
    Each line rises out of a clipped box rather than fading in. It is the same
    wipe the portrait plate and the project screenshots use, so the whole
    opening resolves in one visual language instead of three.
  */
  const line: Variants = {
    // 120 rather than 100, so the descenders the clip box has to leave room for
    // are still clear of it at rest.
    hidden: { y: reduced ? 0 : "120%", opacity: reduced ? 0 : 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: reduced ? 0.3 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  useEffect(() => {
    if (reduced) {
      setTitleIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setTitleIndex((current) => (current + 1) % titleCopy.middle.length);
    }, 2300);

    return () => window.clearInterval(intervalId);
  }, [reduced, titleCopy.middle.length]);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={container}
      className="flex min-h-svh flex-col"
    >
      <motion.div
        variants={item}
        className="flex items-baseline justify-between gap-6 border-b border-line pb-5"
      >
        <span className="font-display text-lg font-semibold text-heading">
          {SITE.name}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{copy.home.location}</span>
          <LanguageSwitch />
        </div>
      </motion.div>

      <div className="flex flex-1 items-center py-14 md:py-16">
        <div
          className={
            portrait
              ? "grid w-full items-center gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-14"
              : "w-full"
          }
        >
          <div className="min-w-0">
            <h1
              aria-label={`${titleCopy.start} ${titleCopy.middle[titleIndex]} ${titleCopy.end}`}
              className="text-[clamp(3rem,8vw,5.5rem)] leading-[0.92] text-heading"
            >
              <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={line} className="block">
                  {titleCopy.start}
                </motion.span>
              </span>

              <span
                aria-hidden="true"
                className="relative block h-[1.25em] w-full overflow-hidden text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1]"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={titleCopy.middle[titleIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reduced ? 0.2 : 0.35,
                      ease: "easeOut",
                    }}
                    className="absolute left-0 top-0 block whitespace-nowrap"
                  >
                    {titleCopy.middle[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>

              <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  variants={line}
                  className="block text-accent transition-colors duration-700"
                >
                  {titleCopy.end}
                </motion.span>
              </span>
            </h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-md leading-relaxed text-body"
            >
              {copy.home.tagline}
            </motion.p>

            <motion.p
              variants={item}
              className="mt-6 flex items-center gap-3 text-sm text-muted"
            >
              {/*
                A square rather than a dot, breathing rather than pinging. The
                stock pulsing circle is the most reused availability marker on
                the web and it shows.
              */}
              <motion.span
                aria-hidden="true"
                className="size-2 shrink-0 bg-accent transition-colors duration-700"
                animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {copy.home.availability}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <HeroLink href="/projects" label={copy.home.startWithWork} primary />
              <HeroLink href="/contact" label={copy.home.getInTouch} />
            </motion.div>
          </div>

          {portrait ? <div className="md:pl-2">{portrait}</div> : null}
        </div>
      </div>

      <ScrollCue label="More below" />
    </motion.section>
  );
}

/**
 * A call to action in the house link style: no button, no fill, just a rule
 * that draws in under the label and an arrow that leans out on hover.
 */
function HeroLink({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-2 pb-1 font-display text-base font-semibold transition-colors duration-300 ${
        primary
          ? "text-accent"
          : "text-muted hover:text-heading"
      }`}
    >
      {label}
      <ArrowUpRightIcon
        width={15}
        height={15}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none ${
          primary ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}
