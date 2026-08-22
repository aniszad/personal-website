"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CloseIcon, ExpandIcon, PlayIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";

/**
 * Project media, and the viewer they open into.
 *
 * The screenshots come first and a demonstration clip, when there is one, sits
 * beside them in the same grid, so a project reads as a still of the product
 * next to a video you can play. Each tile fades up a little as it scrolls in,
 * staggered so a pair arrives as a sequence rather than a block. The reveal
 * moves opacity and offset only, never a clip, so a tile is at worst briefly
 * faint rather than a permanent gap if the reveal is slow to trigger.
 *
 * Clicking a screenshot does not fade a modal over the page: the thumbnail
 * itself travels and grows into the viewer, because both share a layoutId and
 * motion animates between the two boxes. A video tile cannot morph a still into
 * a moving picture honestly, so it fades up instead and plays.
 *
 * The viewer goes through a portal to document.body. Project rows animate on
 * scroll, which leaves a transform on an ancestor, and a transformed ancestor
 * silently reparents position:fixed to itself. Escaping the tree entirely is
 * the only reliable fix.
 */

type MediaItem =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster: string | null };

export function ScreenshotGallery({
  projectName,
  screenshots,
  demoVideo,
  demoPoster,
}: {
  projectName: string;
  screenshots: readonly string[];
  demoVideo?: string | null;
  demoPoster?: string | null;
}) {
  const reduced = useReducedMotion() ?? false;
  const { language } = useLanguage();
  const copy = t(language).generic.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Screenshots first, then the clip. The lightbox indexes into this one array
  // so a single keyboard and focus path covers both.
  const items = useMemo<MediaItem[]>(() => {
    const images = screenshots.map((src) => ({ kind: "image" as const, src }));
    const video: MediaItem[] = demoVideo
      ? [{ kind: "video", src: demoVideo, poster: demoPoster ?? null }]
      : [];
    return [...images, ...video];
  }, [demoVideo, demoPoster, screenshots]);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    if (openIndex !== null) triggers.current[openIndex]?.focus();
    setOpenIndex(null);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;

    const restoreOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      // The close button is the only thing to reach in here, so Tab holds
      // focus on it instead of walking back out into the page behind.
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    closeButton.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = restoreOverflow;
    };
  }, [openIndex, close]);

  const openItem = openIndex === null ? null : items[openIndex];

  /** Shared reveal for every tile: a short fade and lift, once, on scroll in. */
  function reveal(position: number) {
    return {
      initial: { opacity: 0, y: reduced ? 0 : 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: {
        duration: reduced ? 0.25 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: reduced ? 0 : position * 0.1,
      },
    };
  }

  function tileClasses(kind: MediaItem["kind"]) {
    return cn(
      "group/shot relative block aspect-video w-full overflow-hidden border border-line bg-surface-raised/40 transition-colors duration-300 hover:border-accent/60",
      kind === "video" ? "cursor-pointer" : "cursor-zoom-in",
    );
  }

  function tileBody(item: MediaItem, index: number) {
    const label =
      item.kind === "video"
        ? copy.playVideo.replace("{name}", projectName)
        : copy.enlargeScreenshot.replace("{number}", String(index + 1)).replace("{name}", projectName);

    return (
      <button
        ref={(node) => {
          triggers.current[index] = node;
        }}
        type="button"
        onClick={() => setOpenIndex(index)}
        className={tileClasses(item.kind)}
      >
        {item.kind === "image" ? (
          <motion.span layoutId={item.src} className="absolute inset-0">
            <Image
              src={item.src}
              alt={`${projectName}, screenshot ${index + 1}`}
              fill
              sizes="(min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/shot:scale-[1.06] motion-reduce:transition-none"
            />
          </motion.span>
        ) : item.poster ? (
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/shot:scale-[1.06] motion-reduce:transition-none"
          />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 bg-surface-raised" />
        )}

        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            item.kind === "video"
              ? "bg-surface/35 group-hover/shot:bg-surface/45"
              : "bg-surface/0 group-hover/shot:bg-surface/40",
          )}
        />

        {item.kind === "video" ? (
          <>
            {/* Centred play control. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-surface/70 text-heading backdrop-blur-sm transition-all duration-300 group-hover/shot:scale-110 group-hover/shot:bg-accent group-hover/shot:text-surface">
                <PlayIcon width={22} height={22} />
              </span>
            </span>

            {/* Persistent label, so the tile is unmistakably the video even at
                rest beside an identical looking still. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-surface/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-heading backdrop-blur-sm"
            >
              <PlayIcon width={12} height={12} className="text-accent" />
              {copy.demonstrationVideo}
            </span>
          </>
        ) : (
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-2 rounded-sm bg-surface/85 px-3 py-2 text-xs text-heading opacity-0 backdrop-blur-sm transition duration-300 ease-out group-hover/shot:translate-y-0 group-hover/shot:opacity-100 motion-reduce:transition-none"
          >
            <ExpandIcon width={14} height={14} />
            {copy.enlarge}
          </span>
        )}

        <span className="sr-only">{label}</span>
      </button>
    );
  }

  return (
    <>
      {items.length > 0 ? (
        <ul
          className={cn(
            "relative z-10 mt-8 grid gap-4",
            items.length > 1 ? "sm:grid-cols-2" : "max-w-2xl",
          )}
        >
          {items.map((item, index) => (
            <motion.li key={item.src} {...reveal(index)}>
              {tileBody(item, index)}
            </motion.li>
          ))}
        </ul>
      ) : null}

      {mounted
        ? createPortal(
            <AnimatePresence>
              {openItem && openIndex !== null ? (
                <motion.div
                  key="viewer"
                  role="dialog"
                  aria-modal="true"
                  aria-label={
                    openItem.kind === "video"
                      ? `${projectName} demonstration`
                      : `${projectName}, screenshot enlarged`
                  }
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.35, ease: "easeOut" }}
                >
                  <div
                    aria-hidden="true"
                    onClick={close}
                    className="absolute inset-0 cursor-zoom-out bg-surface/90 backdrop-blur-md"
                  />

                  <motion.button
                    ref={closeButton}
                    type="button"
                    onClick={close}
                    className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full border border-line bg-surface-raised text-body transition-colors duration-200 hover:border-accent hover:text-accent sm:right-8 sm:top-8"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: reduced ? 0 : 0.2, duration: 0.25 }}
                  >
                    <CloseIcon width={20} height={20} />
                    <span className="sr-only">{copy.close}</span>
                  </motion.button>

                  <figure className="relative z-10 w-full max-w-5xl">
                    {openItem.kind === "video" ? (
                      <motion.div
                        className="relative aspect-video w-full overflow-hidden border border-line bg-surface shadow-2xl shadow-surface"
                        initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                        transition={{
                          duration: reduced ? 0.15 : 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <video
                          key={openItem.src}
                          src={openItem.src}
                          poster={openItem.poster ?? undefined}
                          controls
                          autoPlay
                          playsInline
                          className="size-full bg-surface object-contain"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        layoutId={openItem.src}
                        className="relative aspect-video w-full overflow-hidden border border-line bg-surface-raised shadow-2xl shadow-surface"
                      >
                        <Image
                          src={openItem.src}
                          alt={`${projectName}, screenshot enlarged`}
                          fill
                          sizes="90vw"
                          className="object-contain"
                        />
                      </motion.div>
                    )}

                    <motion.figcaption
                      className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: reduced ? 0 : 0.25, duration: 0.3 }}
                    >
                      <span className="font-display text-lg font-semibold text-heading">
                        {projectName}
                      </span>
                      <span className="text-sm text-muted">
                        {openItem.kind === "video"
                      ? copy.demonstration
                      : copy.pressEscape}
                      </span>
                    </motion.figcaption>
                  </figure>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
