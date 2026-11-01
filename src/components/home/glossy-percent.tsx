import { useId } from "react";
import { t as tx } from "@/i18n/t";

/**
 * Glossy 3D percent sign, drawn in code (house rule: no AI-generated art).
 * SVG strokes stacked into an extrusion, then a gradient face, a specular
 * bloom and a rim light. Shared by the homepage Black Friday hero and the
 * /cloud-hosting Black Friday hero. Decorative: callers wrap it aria-hidden.
 */

/* ── Glossy 3D percent sign ───────────────────────────────────────────────── */

export type Tone = "blue" | "dark" | "red" | "ghost";

const TONES: Record<Tone, { side: string; face: [string, string, string]; rim: string; rimOpacity: number }> = {
  // Logo blue, lit from the top left.
  blue: { side: "#00006e", face: ["#7aa2ff", "#1f55ff", "#0000c8"], rim: "#ffffff", rimOpacity: 0.55 },
  // Black lacquer with a blue rim light, the shape beside the headline.
  dark: { side: "#000000", face: ["#3a3d4a", "#111218", "#000000"], rim: "#5f8bff", rimOpacity: 0.9 },
  // Sale red, small accent.
  red: { side: "#7a0614", face: ["#ff8a92", "#e73a47", "#be1025"], rim: "#ffffff", rimOpacity: 0.6 },
  // Pale and translucent, the out-of-focus one at the bottom left.
  ghost: { side: "#9db0e8", face: ["#ffffff", "#dfe6ff", "#aebdf2"], rim: "#ffffff", rimOpacity: 0.8 },
};

/** The % as three strokes: two rings and the slash. Shared by every layer. */
function PercentStrokes({ stroke, width }: { stroke: string; width: number }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round">
      <circle cx="58" cy="56" r="30" />
      <circle cx="142" cy="144" r="30" />
      <path d="M150 34 50 166" />
    </g>
  );
}

export function GlossyPercent({ tone }: { tone: Tone }) {
  const id = useId().replace(/:/g, "");
  const t = TONES[tone];
  const depth = 14;
  return (
    <svg viewBox="-10 -10 230 230" className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.face[0]} />
          <stop offset="0.45" stopColor={t.face[1]} />
          <stop offset="1" stopColor={t.face[2]} />
        </linearGradient>
        <radialGradient id={`s${id}`} cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Contact shadow */}
      <ellipse cx="108" cy="212" rx="78" ry="9" fill="#000" opacity="0.35" />
      {/* Extrusion: the same strokes stepped down-right, darkest at the back. */}
      {tx(Array.from({ length: depth }, (_, i) => {
        const o = depth - i;
        return (
          <g key={i} transform={`translate(${o * 0.9} ${o * 1.1})`} opacity={0.6 + (i / depth) * 0.4}>
            <PercentStrokes stroke={t.side} width={30} />
          </g>
        );
      }))}
      {/* Face */}
      <PercentStrokes stroke={`url(#f${id})`} width={30} />
      {/* Specular bloom across the face */}
      <PercentStrokes stroke={`url(#s${id})`} width={30} />
      {/* Rim light along the top-left edges */}
      <g transform="translate(-4 -5)" opacity={t.rimOpacity}>
        <g fill="none" stroke={t.rim} strokeWidth="3" strokeLinecap="round">
          <path d="M34 44a30 30 0 0 1 40-16" />
          <path d="M118 132a30 30 0 0 1 40-16" />
          <path d="M150 34 118 76" />
        </g>
      </g>
    </svg>
  );
}
