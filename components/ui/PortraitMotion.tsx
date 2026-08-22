"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const PORTRAIT_PLAYED_KEY = "anis-portrait-animation-played-v2";

/**
 * The portrait plate.
 *
 * The animated version plays once on a visitor's first landing-page view, then
 * returns to the still. A session flag prevents it playing again when the
 * visitor navigates home or refreshes during that same visit.
 *
 * The artwork is drawn on white, so the plate is paper coloured and takes no
 * wash or gradient over the top, the same constraint the timeline logos follow.
 *
 * The video is muted and inline, which allows autoplay. Visitors who prefer
 * reduced motion see the still portrait instead.
 */
export function PortraitMotion({
  video,
  poster,
  alt,
}: {
  video: string;
  poster: string | null;
  alt: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [playing, setPlaying] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.4 };
  // Kept small. The artwork is only scaled 4%, so there is little room to
  // travel before an edge would show.
  const translateX = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [7, -7]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [7, -7]),
    springConfig,
  );

  useEffect(() => {
    if (reduced || sessionStorage.getItem(PORTRAIT_PLAYED_KEY)) {
      return;
    }

    setShouldAutoplay(true);
  }, [reduced]);

  useEffect(() => {
    if (!shouldAutoplay) return;
    const video = videoRef.current;
    if (!video) return;

    // The autoplay attribute starts the clip as soon as it is ready. Calling
    // play as well covers browsers that wait for enough data before starting.
    setPlaying(true);
    void video
      .play()
      .then(() => sessionStorage.setItem(PORTRAIT_PLAYED_KEY, "true"))
      .catch(() => {
        setPlaying(false);
        setShouldAutoplay(false);
      });
  }, [shouldAutoplay]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const frame = frameRef.current;
    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      // Matches the source loop at 1096 by 720, so nothing of the drawing is
      // cropped away to fit a shape it was not made in.
      className="relative block aspect-[137/90] w-full overflow-hidden border border-line bg-paper"
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
      }
      animate={
        reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0 0 0)" }
      }
      transition={{
        duration: reduced ? 0.3 : 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.35,
      }}
    >
      <motion.div
        className="absolute inset-0 scale-[1.04]"
        style={reduced ? undefined : { x: translateX, y: translateY }}
      >
        {/* The still is always mounted underneath, so the video fades over it
            and the plate is never empty for a frame. */}
        {poster ? (
          <Image
            src={poster}
            alt={alt}
            fill
            sizes="(min-width: 768px) 45vw, 92vw"
            className="object-cover"
            priority
          />
        ) : null}

        <video
          ref={videoRef}
          autoPlay={shouldAutoplay}
          muted
          playsInline
          // Metadata lets the browser size the video without downloading the
          // whole 2.4 MB clip before the rest of the page is usable.
          preload="metadata"
          poster={poster ?? undefined}
          aria-hidden="true"
          onEnded={() => setPlaying(false)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      </motion.div>

      {/*
        A single sweep of light crossing the plate once on arrival, then never
        again. It reads as the surface catching a reflection as it settles.
      */}
      {reduced ? null : (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ left: "-40%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 1.05 }}
        />
      )}
    </motion.div>
  );
}
