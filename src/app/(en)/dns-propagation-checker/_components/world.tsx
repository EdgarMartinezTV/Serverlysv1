"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { landDots } from "./land";

/**
 * The map stage: a dot globe (cropped, as the reference shows it) or a flat
 * dot map, with one marker per DNS server, coloured by what it answered.
 *
 * Drawn on a 2D canvas rather than WebGL: ~7k dots and ~50 markers is light
 * work, and a 2D canvas renders on every device, including the ones that
 * block WebGL. The canvas is decorative (aria-hidden) — the results table
 * below carries the same information for screen readers and keyboards.
 */

export type MarkerTone = "idle" | "checking" | "live" | "notLive" | "noAnswer";
export type Marker = { id: string; lat: number; lon: number; tone: MarkerTone; label: string };
export type View = "globe" | "map";

const TONE: Record<MarkerTone, string> = {
  idle: "#0000ff",
  checking: "#0000ff",
  live: "#009e5b",
  notLive: "#e69800",
  noAnswer: "#9d9ea4",
};

const RAD = Math.PI / 180;
/** Flat map frame: 78°N to 56°S, the reference's 2.69:1 strip. */
const MAP_TOP = 78;
const MAP_BOTTOM = -56;
const MAP_RATIO = 360 / (MAP_TOP - MAP_BOTTOM);
/** Globe tilt: the centre of the view sits at 22°N so the cropped half shows the populated north. */
const TILT = 22 * RAD;

type Placed = { m: Marker; x: number; y: number };

export function World({ markers, view }: { markers: Marker[]; view: View }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const dots = useMemo(() => (typeof window === "undefined" ? [] : landDots(view === "globe")), [view]);
  const state = useRef({ lon0: -15 * RAD, dragging: false, lastX: 0, placed: [] as Placed[], visible: true });
  const markersRef = useRef(markers);
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (state.current.visible = e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const desktop = width >= 768;
  const diameter = desktop ? Math.min(790, width * 0.62) : width;
  const height = view === "map" ? Math.round(width / MAP_RATIO) : Math.round(diameter * (desktop ? 0.54 : 0.45));

  useEffect(() => {
    const c = canvas.current;
    if (!c || !width) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();

    const R = diameter / 2;
    const cx = width / 2;
    const cy = R + (desktop ? 30 * (diameter / 790) : 12);

    const drawGlobe = (t: number) => {
      const s = state.current;
      // Sphere with the soft blue rim of the reference.
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 255, 0.22)";
      ctx.shadowBlur = 36;
      const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.75, "#fbfbff");
      g.addColorStop(1, "#eef0ff");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const sinT = Math.sin(TILT);
      const cosT = Math.cos(TILT);
      const project = (lat: number, lon: number) => {
        const la = lat * RAD;
        const dl = lon * RAD - s.lon0;
        const cosLa = Math.cos(la);
        const z = sinT * Math.sin(la) + cosT * cosLa * Math.cos(dl);
        return { x: cx + R * cosLa * Math.sin(dl), y: cy - R * (cosT * Math.sin(la) - sinT * cosLa * Math.cos(dl)), z };
      };

      const size = Math.max(1.4, R / 190);
      for (const [lat, lon] of dots) {
        const p = project(lat, lon);
        if (p.z <= 0.02 || p.y > height + 4) continue;
        ctx.fillStyle = `rgba(96, 98, 112, ${0.3 + 0.6 * p.z})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }

      const placed: Placed[] = [];
      for (const m of markersRef.current) {
        const p = project(m.lat, m.lon);
        if (p.z <= 0.05 || p.y > height - 4) continue;
        placed.push({ m, x: p.x, y: p.y });
        drawMarker(m, p.x, p.y, t, Math.max(4, R / 70));
      }
      s.placed = placed;
    };

    const drawMap = (t: number) => {
      const s = state.current;
      const px = (lon: number) => ((lon + 180) / 360) * width;
      const py = (lat: number) => ((MAP_TOP - lat) / (MAP_TOP - MAP_BOTTOM)) * height;
      const size = Math.max(1.6, width / 520);
      ctx.fillStyle = "rgba(96, 98, 112, 0.55)";
      for (const [lat, lon] of dots) {
        if (lat > MAP_TOP || lat < MAP_BOTTOM) continue;
        ctx.fillRect(px(lon) - size / 2, py(lat) - size / 2, size, size);
      }
      const placed: Placed[] = [];
      for (const m of markersRef.current) {
        const x = px(m.lon);
        const y = py(m.lat);
        placed.push({ m, x, y });
        drawMarker(m, x, y, t, Math.max(4, width / 260));
      }
      s.placed = placed;
    };

    const drawMarker = (m: Marker, x: number, y: number, t: number, r: number) => {
      const color = TONE[m.tone];
      if (!reduce && (m.tone === "checking" || m.tone === "idle")) {
        const phase = ((t / 1600 + (m.lat + m.lon) / 97) % 1 + 1) % 1;
        ctx.beginPath();
        ctx.arc(x, y, r + phase * r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = hexA(color, 0.28 * (1 - phase));
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, r + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const frame = (t: number) => {
      const s = state.current;
      const dt = Math.min(64, t - last);
      last = t;
      if (view === "globe" && !reduce && !s.dragging) s.lon0 += dt * 0.00006;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (view === "globe") drawGlobe(t);
      else drawMap(t);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const loop = (t: number) => {
      if (state.current.visible || state.current.dragging) frame(t);
      else {
        last = t;
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(frame);
    // Under reduced motion there is no loop, so redraw when markers change.
    const redraw = reduce ? window.setInterval(() => frame(performance.now()), 500) : 0;
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(redraw);
    };
  }, [width, height, diameter, desktop, view, dots]);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (s.dragging) {
      s.lon0 -= (e.clientX - s.lastX) * (Math.PI / Math.max(400, diameter * 1.4));
      s.lastX = e.clientX;
      setTip(null);
      return;
    }
    let best: Placed | null = null;
    let bestD = 14 * 14;
    for (const p of s.placed) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    setTip(best ? { x: best.x, y: best.y, text: best.m.label } : null);
  };

  return (
    <div ref={wrap} className="relative w-full" style={{ height: height || undefined }}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={view === "globe" ? "block size-full cursor-grab touch-pan-y active:cursor-grabbing" : "block size-full"}
        style={{ width, height }}
        onPointerDown={(e) => {
          if (view !== "globe") return;
          state.current.dragging = true;
          state.current.lastX = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={() => (state.current.dragging = false)}
        onPointerCancel={() => (state.current.dragging = false)}
        onPointerMove={onMove}
        onPointerLeave={() => setTip(null)}
      />
      {tip && (
        <div
          role="presentation"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-ink-950 px-3 py-1.5 text-[13px] leading-5 whitespace-nowrap text-white shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
