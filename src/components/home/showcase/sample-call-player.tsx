"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Grow, second row: a play button so a prospect can hear what a CallFlow call
 * sounds like before buying — the same bakery booking the mockup beside it
 * animates, ringback included.
 *
 * The audio is a voiced sample, not a recorded customer call (generated
 * 2026-10-25 with OpenAI gpt-4o-mini-tts, then run through a real phone
 * chain: ringback, pickup/hang-up clicks, 8 kHz G.711 mu-law, line hiss,
 * -17 LUFS), and the line under the button says so. To swap in a real recorded call later, replace
 * public/audio/callflow-sample-call.mp3 and update DURATION.
 *
 * preload="none": nothing downloads until the visitor presses play.
 */
const SRC = "/audio/callflow-sample-call.mp3";
const DURATION = 44;

function clock(s: number) {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

export function SampleCallPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(DURATION);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  const progress = length ? Math.min(1, time / length) : 0;

  return (
    <div className="mt-6 flex items-center gap-4 rounded-2xl bg-brand-50 p-3 pr-5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the sample call" : "Play a sample CallFlow call"}
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-e3 transition-transform duration-fast hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {playing ? (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5">
            <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
            <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-0.5 size-5">
            <path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.3-5.8a.8.8 0 0 0 0-1.4L7.2 3.5A.8.8 0 0 0 6 4.2Z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-small font-medium text-fg">Listen to a sample call</span>
          <span className="tabular text-micro text-fg-secondary">
            {playing || time > 0 ? `${clock(time)} / ${clock(length)}` : clock(length)}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Sample call progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(length)}
          aria-valuenow={Math.round(time)}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100"
        >
          <div
            className={cn("h-full rounded-full bg-primary", playing && "transition-[width] duration-200 ease-linear")}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="mt-1.5 block text-micro text-fg-secondary">
          The bakery booking shown here, as the caller hears it. Voiced sample.
        </span>
      </div>

      {/* React's own media props, not listeners added in an effect: a click
          that lands while the page is still hydrating is replayed, and an
          effect attached after it would miss the first "play" event. */}
      <audio
        ref={audio}
        src={SRC}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setLength(e.currentTarget.duration)}
        onEnded={(e) => {
          setPlaying(false);
          setTime(0);
          e.currentTarget.currentTime = 0;
        }}
      />
    </div>
  );
}
