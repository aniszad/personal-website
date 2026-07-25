"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { PlayIcon } from "@/components/ui/Icons";

/**
 * The portrait plate.
 *
 * At rest it shows the drawn portrait. The animated version is held back until
 * the reader asks for it: clicking the plate plays the loop through once and it
 * returns to the still on its own, so the movement is a reward for curiosity
 * rather than something running unbidden in the corner of the eye. Clicking
 * again while it plays stops it early.
 *
 * The artwork is drawn on white, so the plate is paper coloured and takes no
 * wash or gradient over the top, the same constraint the timeline logos follow.
 *
 * The video is muted: it is an animation of a drawing, there is nothing to
 * hear, and muted playback is what lets the click start it without the browser
 * refusing. Under reduced motion the drift and the entrance wipe are dropped,
 * but the click to play is kept, since a reader choosing to start it is a
 * deliberate act rather than motion imposed on them.
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
  const frameRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [playing, setPlaying] = useState(false);

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

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
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

  function toggle() {
    if (playing) {
      // Stopping early. Reset to the first frame so the next play starts clean.
      const element = videoRef.current;
      if (element) {
        element.pause();
        element.currentTime = 0;
      }
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // The element mounts this render, so start it on the next frame once the
    // ref is attached. A rejected promise here is a blocked autoplay, which the
    // controls-free plate cannot recover from, so it falls back to the still.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => setPlaying(false));
    });
  }

  return (
    <motion.button
      ref={frameRef}
      type="button"
      onClick={toggle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={
        playing ? "Stop the animated portrait" : "Play the animated portrait"
      }
      // Matches the source loop at 1096 by 720, so nothing of the drawing is
      // cropped away to fit a shape it was not made in.
      className="group relative block aspect-[137/90] w-full cursor-pointer overflow-hidden border border-line bg-paper transition-colors duration-500 hover:border-accent/60"
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
          muted
          playsInline
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
        The play affordance sits in the corner rather than over the centre, so
        it never covers the face, and it is what the reader reaches for on
        hover. Gone while the clip runs.
      */}
      <AnimatePresence>
        {playing ? null : (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-3 left-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span className="flex items-center gap-2 rounded-full bg-surface/75 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-heading backdrop-blur-sm transition-colors duration-300 group-hover:bg-accent group-hover:text-surface">
              <span className="grid size-7 place-items-center rounded-full bg-accent text-surface transition-colors duration-300 group-hover:bg-surface group-hover:text-accent">
                <PlayIcon width={13} height={13} />
              </span>
              Play
            </span>
          </motion.span>
        )}
      </AnimatePresence>

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
    </motion.button>
  );
}
