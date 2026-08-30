"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import type { ResolvedProject } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

const ROTATE_MS = 2300;

/**
 * Home page body: hero, CTAs, metrics, and the featured Limpscanner artifact.
 * Five bands total; the sixth (footer note) lives in app/page.tsx alongside
 * this since it sits outside the last rule.
 */
export function Hero({ limpscanner }: { limpscanner: ResolvedProject }) {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const copy = t(language);
  const home = copy.home;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: 0.1 },
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

  const screenshot = limpscanner.screenshots[0];
  const middle = home.headline.middle;
  const [middleIndex, setMiddleIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setMiddleIndex((current) => (current + 1) % middle.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduced, middle.length]);

  return (
    <>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="grid grid-cols-1 items-end gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-16 lg:pt-[78px]"
      >
        <div>
          <motion.h1
            variants={item}
            aria-label={`${home.headline.start} ${middle[middleIndex]} ${home.headline.end}`}
            className="text-[clamp(2.75rem,11vw,3.5rem)] leading-[0.98] tracking-[-0.015em] text-heading text-pretty lg:text-[78px]"
          >
            <span aria-hidden="true" className="shimmer-once block">
              {home.headline.start}
            </span>

            <span
              aria-hidden="true"
              className="relative block h-[1.15em] overflow-hidden text-[clamp(1.5rem,5.5vw,2.15rem)] leading-[1.15] lg:h-[1.1em] lg:text-[44px]"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={middle[middleIndex]}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                  transition={{ duration: reduced ? 0.15 : 0.4, ease: "easeOut" }}
                  className="absolute left-0 top-0 block whitespace-nowrap text-heading"
                >
                  {middle[middleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>

            <em aria-hidden="true" className="block font-serif italic text-body">
              {home.headline.end}
            </em>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-[34px] max-w-[560px] text-[16.5px] font-light leading-[1.6] text-body text-pretty"
          >
            {home.tagline}
          </motion.p>
        </div>

        <motion.div
          variants={item}
          className="grid grid-cols-1 gap-5 border-line pt-8 sm:grid-cols-3 lg:flex lg:flex-col lg:border-l lg:pl-[26px] lg:pt-0"
        >
          <StatusBlock label={home.status.currentlyLabel} lines={home.status.currentlyValue} />
          <StatusBlock label={home.status.fromLabel} lines={home.status.fromValue} />
          <StatusBlock
            label={home.status.availableLabel}
            lines={[home.status.availableValue]}
            emphasized
          />
        </motion.div>
      </motion.section>

      <div className="mt-[66px] flex items-center gap-[34px] border-t border-line pt-[26px]">
        <HeroLink href="/projects" label={home.startWithWork} primary />
        <HeroLink href="/contact" label={home.getInTouch} />
      </div>

      <div className="mt-[58px] grid grid-cols-1 divide-y divide-line-soft border-t border-line md:grid-cols-3 md:divide-y-0">
        {home.metrics.map((metric, index) => (
          <div
            key={metric.value}
            className={`py-7 md:px-10 ${index === 0 ? "md:pl-0" : ""} ${
              index < home.metrics.length - 1 ? "md:border-r md:border-line" : ""
            }`}
          >
            <p className="font-serif text-[34px] leading-none text-heading">{metric.value}</p>
            <p className="mt-[9px] text-[12.5px] font-light leading-[1.5] text-muted">
              {metric.caption}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-11 border-t border-line py-11 md:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">
            {home.featured.eyebrow}
          </p>
          <h2 className="mt-[14px] font-serif text-[34px] leading-[1.05] text-heading">
            {limpscanner.name}
          </h2>
          <p className="mt-4 text-[14.5px] font-light leading-[1.6] text-body">
            {limpscanner.description}
          </p>
          <Link
            href="/projects/limpscanner"
            className="mt-[22px] inline-block border-b border-heading pb-[5px] text-sm font-medium text-heading"
          >
            {home.featured.cta}
          </Link>
        </div>

        {screenshot ? (
          <div>
            <Image
              src={screenshot}
              alt=""
              width={300}
              height={400}
              className="block aspect-[3/4] w-full border border-line object-cover"
            />
            <p className="mt-2.5 text-[11.5px] font-light leading-[1.4] text-muted">
              {home.featured.caption}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}

function StatusBlock({
  label,
  lines,
  emphasized = false,
}: {
  label: string;
  lines: readonly string[];
  emphasized?: boolean;
}) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p
        className={`mt-2 text-sm leading-[1.45] ${emphasized ? "text-heading" : "text-body-strong"}`}
      >
        {lines.map((line, index) => (
          <span key={line}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </div>
  );
}

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
      className={`group relative inline-flex items-center gap-2 pb-[5px] text-[15px] transition-colors duration-300 ${
        primary
          ? "border-b border-heading font-medium text-heading"
          : "border-b border-line-strong text-muted hover:text-heading"
      }`}
    >
      {label}
      <ArrowUpRightIcon
        width={14}
        height={14}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
