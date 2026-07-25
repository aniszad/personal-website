"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { CV_PATH, SOCIALS } from "@/lib/constants";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

/**
 * Contact page body.
 *
 * Visual identity: an amber glow that follows the pointer across the panel,
 * built from motion values piped straight into a CSS gradient so it updates
 * without triggering a React render on every pointer move.
 *
 * The glow is decorative and carries no information, so there is nothing to
 * replace on touch devices or under reduced motion, where it simply rests at
 * the centre.
 */
export function Contact() {
  const panelRef = useRef<HTMLDivElement>(null);

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const background = useMotionTemplate`radial-gradient(600px circle at ${glowX}% ${glowY}%, var(--color-accent), transparent 50%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const element = panelRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    glowX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    glowY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  }

  return (
    <div
      ref={panelRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden border-y border-line py-24 md:py-32"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{ background }}
      />

      <div className="relative max-w-3xl">
        <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-heading md:text-4xl">
          I am looking for an alternance starting September 2026 in AI, Data
          Science, or Software Engineering, in and around Lille.
        </p>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          If you would like to work together, or you just want to ask about
          something I built, write to me.
        </p>

        <a
          href={`mailto:${SOCIALS.email}`}
          className="group mt-14 inline-block"
        >
          <span className="block break-all font-display text-3xl font-semibold tracking-tight text-accent transition-opacity duration-300 group-hover:opacity-70 md:text-5xl">
            {SOCIALS.email}
          </span>
          {/*
            The rule is always drawn on touch, where there is no hover to
            reveal it. Both the resting and hover states are scoped to the same
            breakpoint, otherwise the responsive variant would be emitted after
            the hover variant and win even while hovered.
          */}
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-full origin-left bg-accent transition-transform duration-500 ease-out motion-reduce:transition-none md:scale-x-0 md:group-hover:scale-x-100"
          />
        </a>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6">
          <SocialLinks size={22} />

          {/*
            download hints the filename to the browser; target and rel are the
            safety pair for opening it in a new tab. The file is served straight
            from /public by the static export.
          */}
          <a
            href={CV_PATH}
            download
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-body transition-colors duration-200 hover:text-accent"
          >
            Download CV
            <ArrowUpRightIcon
              width={15}
              height={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
