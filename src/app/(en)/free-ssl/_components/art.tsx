/**
 * Line art for /free-ssl, drawn for this page.
 *
 * The reference composes each illustration from the same parts: a thin
 * browser frame with three dots, large outline circles, a diagonal, small
 * filled nodes, and one subject in the middle. The parts are reproduced here;
 * the subjects are ours (padlock, address bar, chart) and there are no people
 * or photos, so nothing is taken from the reference's artwork.
 *
 * Strokes use brand-500 and fills the logo blue, per the brand-step rule:
 * tinting hue 240 toward white reads as the reference's purple.
 */

const STROKE = "var(--color-brand-500)";
const FILL = "var(--color-primary)";
const SOFT_FILL = "var(--color-brand-50)";

function Dots({ x, y, fill = "none", stroke = STROKE }: { x: number; y: number; fill?: string; stroke?: string }) {
  return (
    <g fill={fill} stroke={stroke} strokeWidth="1.5">
      <circle cx={x} cy={y} r="4.5" />
      <circle cx={x + 16} cy={y} r="4.5" />
      <circle cx={x + 32} cy={y} r="4.5" />
    </g>
  );
}

/** Hero: frame, big circle, diagonal, small orbit, padlock + HTTPS bar. Sits on the deep band. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 480" fill="none" aria-hidden className={className}>
      <g stroke={STROKE} strokeWidth="1.5">
        <rect x="40" y="16" width="380" height="440" rx="4" />
        <path d="M40 260H420" />
        <circle cx="300" cy="230" r="230" />
        <circle cx="520" cy="310" r="64" />
        <path d="M40 456L580 46" />
      </g>
      <Dots x={56} y={32} />
      <circle cx="40" cy="132" r="7" fill="#c7d2fe" />
      <circle cx="574" cy="334" r="6" fill="#c7d2fe" />

      {/* Address bar */}
      <rect x="150" y="96" width="300" height="52" rx="26" fill="#0b1638" stroke={STROKE} strokeWidth="1.5" />
      <g transform="translate(176 110)" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0" y="10" width="20" height="15" rx="3" />
        <path d="M4 10V6a6 6 0 0 1 12 0v4" />
      </g>
      <text x="212" y="129" fill="#fff" fontSize="18" fontFamily="inherit" fontWeight="600">https://</text>
      <text x="288" y="129" fill="#9fb3ff" fontSize="18" fontFamily="inherit">yoursite.com</text>

      {/* Shield + padlock */}
      <path d="M300 180l112 40v84c0 74-52 120-112 146-60-26-112-72-112-146v-84l112-40z" fill="#0b1638" stroke={STROKE} strokeWidth="2" />
      <path d="M300 206l88 31v67c0 58-40 95-88 117-48-22-88-59-88-117v-67l88-31z" fill={FILL} />
      <g stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="262" y="290" width="76" height="62" rx="10" fill={FILL} />
        <path d="M276 290v-18a24 24 0 0 1 48 0v18" />
      </g>
      <circle cx="300" cy="316" r="7" fill="#fff" />
      <path d="M300 320v14" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** "Paid vs free": two certificates side by side, one marked free, identical padlocks. */
export function DifferenceArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 540 560" fill="none" aria-hidden className={className}>
      <g fill="#c7d2fe">
        {Array.from({ length: 6 }).flatMap((_, r) =>
          Array.from({ length: 8 }).map((__, c) => <circle key={`${r}-${c}`} cx={30 + c * 22} cy={40 + r * 22} r="1.6" />),
        )}
        {Array.from({ length: 5 }).flatMap((_, r) =>
          Array.from({ length: 9 }).map((__, c) => <circle key={`b${r}-${c}`} cx={300 + c * 22} cy={420 + r * 22} r="1.6" />),
        )}
      </g>
      <g stroke="#c7d2fe" strokeWidth="1.5">
        <rect x="100" y="20" width="350" height="520" rx="8" />
        <path d="M210 52l200 200" />
        <rect x="10" y="310" width="230" height="200" rx="4" />
        <path d="M10 450H240" />
      </g>
      <Dots x={118} y={40} stroke="#c7d2fe" />
      <path d="M420 330v24M408 342h24" stroke="#c7d2fe" strokeWidth="2" />

      {/* Two certificate cards */}
      {[
        { x: 130, y: 110, tag: "Paid", tagFill: "#fff", tagText: "var(--color-fg)" },
        { x: 200, y: 290, tag: "Free", tagFill: FILL, tagText: "#fff" },
      ].map((c) => (
        <g key={c.tag} transform={`translate(${c.x} ${c.y})`}>
          <rect width="220" height="150" rx="12" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
          <rect x="18" y="18" width="40" height="40" rx="10" fill={SOFT_FILL} />
          <g transform="translate(28 26)" stroke={FILL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="9" width="20" height="15" rx="3" />
            <path d="M4 9V6a6 6 0 0 1 12 0v3" />
          </g>
          <rect x="72" y="24" width="110" height="8" rx="4" fill="#dbe3ff" />
          <rect x="72" y="42" width="76" height="8" rx="4" fill="#dbe3ff" />
          <rect x="18" y="80" width="184" height="6" rx="3" fill="#eef1ff" />
          <rect x="18" y="96" width="150" height="6" rx="3" fill="#eef1ff" />
          <rect x="18" y="116" width="58" height="22" rx="11" fill={c.tagFill} stroke={STROKE} strokeWidth="1" />
          <text x="47" y="131" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="inherit" fill={c.tagText}>{c.tag}</text>
          <text x="202" y="131" textAnchor="end" fontSize="11" fontFamily="inherit" fill="var(--color-fg-secondary)">TLS · HTTPS</text>
        </g>
      ))}
      <circle cx="350" cy="110" r="22" fill={FILL} />
      <circle cx="152" cy="480" r="7" fill={FILL} />
      <circle cx="430" cy="470" r="52" fill={FILL} />
      <path d="M408 470l15 15 30-32" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Reason 1: shield + padlock inside a half-circle and a dashed triangle. */
export function SecureArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke="#c7d2fe" strokeWidth="1.5">
        <path d="M20 40V430H350" />
        <path d="M350 0v430" />
        <path d="M350 40a196 196 0 0 1 0 390" />
        <path d="M150 0v430" strokeDasharray="6 6" />
        <path d="M350 0L20 220l330 210" strokeDasharray="6 6" />
      </g>
      <circle cx="350" cy="236" r="104" fill="#eef1ff" />
      <path d="M350 120l92 30v98c0 62-44 100-92 122-48-22-92-60-92-122v-98l92-30z" fill="#fff" stroke={STROKE} strokeWidth="1.75" />
      <g stroke={STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="312" y="218" width="76" height="70" rx="10" />
        <path d="M326 218v-18a24 24 0 0 1 48 0v18" />
        <path d="M350 244v20" />
      </g>
      <circle cx="526" cy="64" r="15" fill="#c7d2fe" />
      <circle cx="568" cy="150" r="6" fill={FILL} />
      <circle cx="426" cy="344" r="8" fill={FILL} />
    </svg>
  );
}

/** Reason 2: a checkout card with a card-number form behind a padlock. */
export function PaymentArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke="#c7d2fe" strokeWidth="1.5">
        <circle cx="300" cy="230" r="190" />
        <circle cx="300" cy="230" r="110" />
        <path d="M120 40h200M300 40v390M440 20h160" />
        <path d="M440 20L300 200" />
      </g>
      <path d="M150 410L300 230l90 180z" fill="#eef1ff" />
      <path d="M150 410L240 300l60-70" stroke={STROKE} strokeWidth="1.75" />
      <circle cx="150" cy="410" r="6" fill={FILL} />
      <circle cx="240" cy="300" r="7" fill={FILL} />
      <circle cx="300" cy="40" r="9" fill={FILL} />
      <circle cx="390" cy="58" r="13" fill={FILL} />

      <rect x="196" y="120" width="230" height="210" rx="14" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <text x="216" y="152" fontSize="14" fontWeight="600" fontFamily="inherit" fill="var(--color-fg)">Checkout</text>
      <g transform="translate(392 136)" stroke={FILL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0" y="8" width="16" height="12" rx="2.5" />
        <path d="M3 8V5.5a5 5 0 0 1 10 0V8" />
      </g>
      <rect x="216" y="170" width="190" height="34" rx="8" fill="#f6f8ff" stroke="#dbe3ff" />
      <text x="228" y="192" fontSize="12" fontFamily="inherit" fill="var(--color-fg-secondary)">•••• •••• •••• 4242</text>
      <rect x="216" y="214" width="90" height="34" rx="8" fill="#f6f8ff" stroke="#dbe3ff" />
      <rect x="316" y="214" width="90" height="34" rx="8" fill="#f6f8ff" stroke="#dbe3ff" />
      <rect x="216" y="270" width="190" height="40" rx="8" fill={FILL} />
      <text x="311" y="295" textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="inherit" fill="#fff">Pay securely</text>

      <rect x="30" y="100" width="110" height="74" rx="6" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
      <path d="M44 122h82M44 138h82M44 154h60" stroke="#c7d2fe" strokeWidth="1.5" />
      <rect x="460" y="260" width="110" height="74" rx="6" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
      <path d="M474 282h82M474 298h82M474 314h60" stroke="#c7d2fe" strokeWidth="1.5" />
    </svg>
  );
}

/** Reason 3: overlapping browser windows; the front one shows HTTPS, the back one "Not secure". */
export function TrustArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g fill="#c7d2fe">
        {Array.from({ length: 5 }).flatMap((_, r) =>
          Array.from({ length: 7 }).map((__, c) => <circle key={`${r}-${c}`} cx={20 + c * 20} cy={30 + r * 22} r="1.6" />),
        )}
      </g>
      <rect x="110" y="20" width="130" height="80" fill="#eef1ff" />
      <Dots x={120} y={30} stroke="#c7d2fe" />

      <rect x="300" y="10" width="270" height="170" rx="6" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
      <Dots x={314} y={26} stroke="#c7d2fe" />
      <rect x="320" y="48" width="230" height="30" rx="15" fill="#fff4f4" stroke="#f5c2c2" />
      <path d="M338 56l9 16h-18z" stroke="#d14343" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="356" y="68" fontSize="12" fontFamily="inherit" fill="#b42318">Not secure</text>
      <text x="426" y="68" fontSize="12" fontFamily="inherit" fill="var(--color-fg-muted)">http://…</text>

      <rect x="80" y="150" width="380" height="240" rx="8" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <Dots x={98} y={170} />
      <rect x="100" y="190" width="340" height="40" rx="20" fill="#f6f8ff" stroke="#dbe3ff" />
      <g transform="translate(118 199)" stroke={FILL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0" y="8" width="16" height="12" rx="2.5" />
        <path d="M3 8V5.5a5 5 0 0 1 10 0V8" />
      </g>
      <text x="144" y="215" fontSize="14" fontWeight="600" fontFamily="inherit" fill="var(--color-fg)">https://</text>
      <text x="202" y="215" fontSize="14" fontFamily="inherit" fill="var(--color-fg-secondary)">yoursite.com</text>
      <rect x="100" y="250" width="160" height="12" rx="6" fill="#dbe3ff" />
      <rect x="100" y="274" width="300" height="8" rx="4" fill="#eef1ff" />
      <rect x="100" y="292" width="260" height="8" rx="4" fill="#eef1ff" />
      <rect x="100" y="324" width="120" height="36" rx="8" fill={FILL} />
      <rect x="380" y="330" width="130" height="80" rx="6" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
      <circle cx="445" cy="370" r="24" fill="#eef1ff" />
      <path d="M433 370l8 8 16-17" stroke={FILL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="300" width="160" height="130" rx="6" stroke="#c7d2fe" strokeWidth="1.5" />
      <Dots x={32} y={314} stroke="#c7d2fe" />
    </svg>
  );
}

/** Reason 4: a rising traffic chart in a browser frame. */
export function RankArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke="#c7d2fe" strokeWidth="1.5">
        <path d="M290 0v440M0 230h40M520 180l30 -60M550 180h50" />
      </g>
      <rect x="40" y="50" width="510" height="340" rx="12" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
      <Dots x={62} y={76} stroke="#c7d2fe" />
      <rect x="250" y="110" width="210" height="280" fill="#eef1ff" />
      <path d="M0 236h120l60-70 60 100 50-80 80-20 90-140" stroke={STROKE} strokeWidth="2" />
      <path d="M40 236l90-14 60-62 50 40 70-26 120-150" stroke={STROKE} strokeWidth="1.75" strokeDasharray="7 7" />
      {[
        [130, 222],
        [190, 160],
        [240, 200],
        [310, 174],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="9" fill="#fff" stroke={STROKE} strokeWidth="1.75" />
      ))}
      <circle cx="10" cy="306" r="6" fill={FILL} />
      <circle cx="440" cy="20" r="11" fill={FILL} />
      <path d="M440 20l20 80 40 -10" stroke="#c7d2fe" strokeWidth="1.5" />
    </svg>
  );
}
