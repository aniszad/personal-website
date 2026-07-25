"use client";

import Image from "next/image";
import type { Variants } from "motion/react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * An institution or company mark, set on a paper plate.
 *
 * Every logo the site carries is drawn dark on white. Dropping one straight
 * onto the navy would either bury it or punch a bright hole in the page, so it
 * sits on the paper token instead and reads as a printed card laid on the
 * surface. That framing is also what gives the hover something to lift.
 *
 * The motion is a single variant machine on the wrapper. Motion propagates the
 * active label down, so the halo, the plate, and the corner arrow move as one
 * gesture rather than three components each running their own transition:
 *
 *   arriving   the plate drops in rotated and overshoots slightly, like a card
 *              being set down
 *   hovered    it lifts off the page, a teal halo blooms behind it, and the
 *              link arrow snaps into the corner
 *
 * Under reduced motion every one of those collapses to a plain fade.
 */

const PLATE_SIZES = {
  sm: "h-12 w-24 p-2",
  md: "h-16 w-28 p-2.5 md:h-20 md:w-36 md:p-3",
} as const;

export function LogoPlate({
  src,
  name,
  href,
  size = "md",
  active,
  className,
}: {
  src: string;
  name: string;
  /** Institution or company homepage. When set, the plate becomes a link. */
  href?: string;
  size?: keyof typeof PLATE_SIZES;
  /**
   * Lets a parent own the arrival, which the education timeline does so the
   * plate pops in step with its scroll driven entry. Leave it off and the
   * plate triggers itself the first time it scrolls into view.
   */
  active?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const selfTriggered = active === undefined;

  const spring = {
    type: "spring" as const,
    stiffness: 300,
    damping: 18,
    mass: 0.6,
  };

  const plate: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        shown: { opacity: 1 },
        hover: { opacity: 1 },
        tap: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.7, y: 16, rotate: -6 },
        shown: { opacity: 1, scale: 1, y: 0, rotate: 0, transition: spring },
        hover: { scale: 1.09, y: -8, transition: spring },
        tap: { scale: 1.02, y: -2 },
      };

  const halo: Variants = {
    hidden: { opacity: 0, scale: 0.7 },
    shown: { opacity: 0, scale: 0.9 },
    hover: { opacity: reduced ? 0 : 0.4, scale: 1.15 },
    tap: { opacity: reduced ? 0 : 0.25, scale: 1.05 },
  };

  const arrow: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    shown: { opacity: 0, scale: 0.3 },
    hover: { opacity: 1, scale: 1, transition: { ...spring, delay: 0.04 } },
    tap: { opacity: 1, scale: 0.9 },
  };

  const inner = (
    <>
      {/*
        Sits first in the DOM so the plate paints over it without needing a
        stacking context, which keeps this safe to drop inside any layout.
      */}
      <motion.span
        aria-hidden="true"
        variants={halo}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none absolute -inset-3 rounded-2xl bg-accent blur-xl"
      />

      <motion.span
        variants={plate}
        className={cn(
          "relative flex items-center justify-center rounded-sm bg-paper ring-1 ring-line",
          PLATE_SIZES[size],
        )}
      >
        <Image
          src={src}
          /*
            Decorative: every caller renders the institution or company name as
            visible text beside the plate, so alt text here would only make a
            screen reader say it twice.
          */
          alt=""
          width={144}
          height={80}
          className="h-full w-full object-contain"
        />
      </motion.span>
    </>
  );

  const shared = {
    variants: { hidden: {}, shown: {}, hover: {}, tap: {} } satisfies Variants,
    initial: "hidden" as const,
    animate: selfTriggered ? undefined : active ? "shown" : "hidden",
    whileInView: selfTriggered ? "shown" : undefined,
    viewport: selfTriggered ? { once: true, amount: 0.6 } : undefined,
    className: cn("relative inline-block shrink-0", className),
  };

  if (!href) {
    return <motion.div {...shared}>{inner}</motion.div>;
  }

  return (
    <motion.a
      {...shared}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
      className={cn(shared.className, "cursor-pointer")}
    >
      {inner}

      <motion.span
        aria-hidden="true"
        variants={arrow}
        className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-accent text-surface"
      >
        <ArrowUpRightIcon width={13} height={13} />
      </motion.span>

      <span className="sr-only">
        Visit the {name} website (opens in a new tab)
      </span>
    </motion.a>
  );
}
