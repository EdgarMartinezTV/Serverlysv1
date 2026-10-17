"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A background film with its poster, for the hero and the fire section.
 *
 * Delivery: the poster is a plain <picture> (portrait and landscape crops, the
 * film's own first frame, so the swap is invisible) and paints immediately —
 * it is in the server HTML with fetchpriority=high, so it needs no preload (a
 * media-scoped preload only earns a Firefox warning). It is NOT the LCP
 * element: Chromium treats a full-viewport image as background.
 * The video gets its <source>s only after mount, picked for the viewport's
 * shape — a 9:16 cut for portrait screens, 16:9 otherwise — AV1 WebM first,
 * H.264 MP4 as the fallback. A phone never downloads the desktop film.
 *
 * It does NOT load at all when the visitor asks for reduced motion or has
 * Save-Data on; the poster stands in and the play button still works. It
 * plays only while on screen, and the poster is always there if autoplay is
 * refused (iOS Low Power Mode) or the file fails.
 *
 * WCAG 2.2.2: anything that moves for more than five seconds needs a pause
 * control, so every film has one. No audio track exists, so no sound toggle.
 */

type FilmName = "lumbre-hero" | "lumbre-fire";

const BASE = "/restaurant/video";
const PORTRAIT = "(max-aspect-ratio: 4/5)";

export function Film({
  name,
  lazy = false,
  pauseLabel,
  playLabel,
  controlClassName,
}: {
  name: FilmName;
  lazy?: boolean;
  pauseLabel: string;
  playLabel: string;
  controlClassName?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const visible = useRef(false);
  const [variant, setVariant] = useState<"portrait" | "landscape" | null>(null);
  const [playing, setPlaying] = useState(false);

  // Decide whether, and which file, to load — once the frame is near view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    if (reduce || saveData) {
      userPaused.current = true;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        const v = video.current;
        if (entry.isIntersecting) {
          if (!userPaused.current) {
            setVariant(
              (cur) =>
                cur ?? (window.matchMedia(PORTRAIT).matches ? "portrait" : "landscape"),
            );
            v?.play().catch(() => {});
          }
        } else if (v && !v.paused) {
          v.pause();
        }
      },
      { rootMargin: lazy ? "300px 0px" : "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  // Sources changed: reload and start (muted must be set before play on iOS).
  useEffect(() => {
    const v = video.current;
    if (!v || !variant) return;
    v.muted = true;
    v.defaultMuted = true;
    v.load();
    if (visible.current && !userPaused.current) v.play().catch(() => {});
  }, [variant]);

  const toggle = () => {
    const v = video.current;
    if (playing) {
      userPaused.current = true;
      v?.pause();
      return;
    }
    userPaused.current = false;
    if (!variant)
      setVariant(window.matchMedia(PORTRAIT).matches ? "portrait" : "landscape");
    else v?.play().catch(() => {});
  };

  const file = variant === "portrait" ? `${name}-mobile` : name;

  return (
    <>
      <div ref={wrap} className="absolute inset-0 -z-20 overflow-hidden bg-[#111411]">
        <picture>
          <source media={PORTRAIT} srcSet={`${BASE}/${name}-mobile-poster.jpg`} />
          <img
            src={`${BASE}/${name}-poster.jpg`}
            alt=""
            decoding="async"
            fetchPriority={lazy ? "low" : "high"}
            loading={lazy ? "lazy" : "eager"}
            className="lb-ken absolute inset-0 size-full object-cover"
          />
        </picture>
        <video
          ref={video}
          aria-hidden="true"
          tabIndex={-1}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          data-playing={playing}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          className="lb-film absolute inset-0 size-full object-cover"
        >
          {variant && (
            <>
              <source
                src={`${BASE}/${file}.webm`}
                type='video/webm; codecs="av01.0.08M.08"'
              />
              <source src={`${BASE}/${file}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      </div>
      {/* Outside the media layer: the overlays above it would cover a child. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        data-film-control={name}
        className={cn(
          "absolute z-20 flex size-11 items-center justify-center rounded-full text-[#F4EFE6] ring-1 ring-[#F4EFE6]/35 backdrop-blur-sm transition-colors hover:bg-[#F4EFE6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A97E]",
          controlClassName ?? "right-5 bottom-5 sm:right-8 sm:bottom-8",
        )}
      >
        {playing ? (
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="size-4"
            fill="currentColor"
          >
            <rect x="5" y="4" width="3.2" height="12" rx="1" />
            <rect x="11.8" y="4" width="3.2" height="12" rx="1" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="ml-0.5 size-4"
            fill="currentColor"
          >
            <path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.3-5.8a.8.8 0 0 0 0-1.4L7.2 3.5A.8.8 0 0 0 6 4.2Z" />
          </svg>
        )}
      </button>
    </>
  );
}
