/**
 * Line art for /daily-backups, in the same drawn vocabulary as /free-ssl
 * (thin frames with three dots, outline circles, a diagonal, small filled
 * nodes, one subject in the middle). Subjects: a restore timeline, the parts
 * of a backup, a cleaned site, a rolled-back update, a restored file, a
 * calendar of nightly copies. No people, no photos.
 */

const STROKE = "var(--color-brand-500)";
const FILL = "var(--color-primary)";
const LINE = "#c7d2fe";
const TINT = "#eef1ff";
const FG = "var(--color-fg)";
const FG2 = "var(--color-fg-secondary)";

function Dots({ x, y, stroke = STROKE }: { x: number; y: number; stroke?: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.5">
      <circle cx={x} cy={y} r="4.5" />
      <circle cx={x + 16} cy={y} r="4.5" />
      <circle cx={x + 32} cy={y} r="4.5" />
    </g>
  );
}

function Grid({ x, y, cols, rows }: { x: number; y: number; cols: number; rows: number }) {
  return (
    <g fill={LINE}>
      {Array.from({ length: rows }).flatMap((_, r) =>
        Array.from({ length: cols }).map((__, c) => <circle key={`${r}-${c}`} cx={x + c * 22} cy={y + r * 22} r="1.6" />),
      )}
    </g>
  );
}

function Check({ x, y, r = 12, stroke = "#fff" }: { x: number; y: number; r?: number; stroke?: string }) {
  return <path d={`M${x - r * 0.45} ${y}l${r * 0.3} ${r * 0.3} ${r * 0.6} -${r * 0.62}`} stroke={stroke} strokeWidth={r / 4} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
}

/** Hero (on the deep band): a restore panel listing nightly copies, one selected. */
export function HeroArt({ className }: { className?: string }) {
  const rows = ["Today, 02:00", "Yesterday, 02:00", "2 days ago, 02:00", "3 days ago, 02:00"];
  return (
    <svg viewBox="0 0 600 480" fill="none" aria-hidden className={className}>
      <g stroke={STROKE} strokeWidth="1.5">
        <rect x="40" y="16" width="380" height="440" rx="4" />
        <circle cx="300" cy="230" r="230" />
        <circle cx="520" cy="330" r="64" />
        <path d="M40 456L580 46" />
      </g>
      <Dots x={56} y={32} />
      <circle cx="40" cy="150" r="7" fill="#c7d2fe" />
      <circle cx="576" cy="352" r="6" fill="#c7d2fe" />

      <rect x="130" y="84" width="340" height="320" rx="16" fill="#0b1638" stroke={STROKE} strokeWidth="1.5" />
      <g transform="translate(154 108)" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10a10 10 0 1 0 3-7" />
        <path d="M2 1v6h6" />
        <path d="M12 6v5l3 2" />
      </g>
      <text x="186" y="125" fill="#fff" fontSize="17" fontWeight="600" fontFamily="inherit">Restore points</text>
      {rows.map((label, i) => {
        const y = 150 + i * 52;
        const on = i === 1;
        return (
          <g key={label}>
            <rect x="150" y={y} width="300" height="42" rx="10" fill={on ? FILL : "#122251"} stroke={on ? FILL : STROKE} strokeOpacity={on ? 1 : 0.6} />
            <circle cx="172" cy={y + 21} r="8" fill="none" stroke="#fff" strokeOpacity={on ? 1 : 0.5} strokeWidth="1.5" />
            {on && <circle cx="172" cy={y + 21} r="4" fill="#fff" />}
            <text x="192" y={y + 26} fill="#fff" fillOpacity={on ? 1 : 0.75} fontSize="14" fontFamily="inherit">{label}</text>
            <text x="432" y={y + 26} textAnchor="end" fill="#9fb3ff" fontSize="12" fontFamily="inherit">Files · DB · Mail</text>
          </g>
        );
      })}
      <rect x="300" y="356" width="150" height="34" rx="8" fill="#fff" />
      <text x="375" y="378" textAnchor="middle" fill={FILL} fontSize="14" fontWeight="700" fontFamily="inherit">Restore</text>
    </svg>
  );
}

/** Split: one backup made of files, a database and a mailbox. */
export function ContentsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 540 560" fill="none" aria-hidden className={className}>
      <Grid x={30} y={40} cols={8} rows={6} />
      <Grid x={300} y={420} cols={9} rows={5} />
      <g stroke={LINE} strokeWidth="1.5">
        <rect x="100" y="20" width="350" height="520" rx="8" />
        <path d="M210 52l200 200" />
        <rect x="10" y="330" width="230" height="190" rx="4" />
        <path d="M10 470H240" />
      </g>
      <Dots x={118} y={40} stroke={LINE} />

      {/* Archive box */}
      <rect x="160" y="110" width="240" height="70" rx="12" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <text x="184" y="142" fontSize="15" fontWeight="600" fontFamily="inherit" fill={FG}>Daily backup</text>
      <text x="184" y="162" fontSize="12" fontFamily="inherit" fill={FG2}>Complete account copy</text>
      <circle cx="368" cy="145" r="16" fill={FILL} />
      <Check x={368} y={145} r={12} />
      <path d="M280 180v40M190 220h180M190 220v24M280 220v24M370 220v24" stroke={STROKE} strokeWidth="1.5" />

      {[
        { x: 150, label: "Files", icon: "M-9 -6h7l2 3h9v11h-18z" },
        { x: 240, label: "Database", icon: "M-8 -7a8 3 0 1 0 16 0a8 3 0 1 0 -16 0M-8 -7v13a8 3 0 0 0 16 0v-13M-8 0a8 3 0 0 0 16 0" },
        { x: 330, label: "Email", icon: "M-10 -7h20v14h-20zM-10 -7l10 8 10-8" },
      ].map((c) => (
        <g key={c.label} transform={`translate(${c.x} 244)`}>
          <rect width="80" height="96" rx="12" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
          <rect x="20" y="16" width="40" height="40" rx="10" fill={TINT} />
          <path transform="translate(40 36)" d={c.icon} stroke={FILL} strokeWidth="1.75" strokeLinejoin="round" fill="none" />
          <text x="40" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="inherit" fill={FG}>{c.label}</text>
        </g>
      ))}
      <circle cx="420" cy="88" r="20" fill={FILL} />
      <circle cx="152" cy="490" r="7" fill={FILL} />
      <circle cx="420" cy="440" r="48" fill={FILL} />
      <g transform="translate(404 424)" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M2 16a14 14 0 1 0 4-10" />
        <path d="M2 2v8h8" />
      </g>
    </svg>
  );
}

/** Reason 1: a warning-marked site and the clean copy restored over it. */
export function HackArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke={LINE} strokeWidth="1.5">
        <path d="M20 40V430H350" />
        <path d="M350 0v430" />
        <path d="M350 40a196 196 0 0 1 0 390" />
        <path d="M150 0v430" strokeDasharray="6 6" />
      </g>
      <rect x="60" y="90" width="220" height="150" rx="8" fill="#fff4f4" stroke="#f5c2c2" strokeWidth="1.5" />
      <Dots x={76} y={108} stroke="#f5c2c2" />
      <path d="M170 140l26 46h-52z" stroke="#d14343" strokeWidth="2" strokeLinejoin="round" />
      <path d="M170 156v14M170 177v1" stroke="#d14343" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="260" y="170" width="260" height="190" rx="10" fill="#fff" stroke={STROKE} strokeWidth="1.75" />
      <Dots x={278} y={190} />
      <rect x="280" y="212" width="160" height="12" rx="6" fill="#dbe3ff" />
      <rect x="280" y="236" width="220" height="8" rx="4" fill={TINT} />
      <rect x="280" y="254" width="190" height="8" rx="4" fill={TINT} />
      <circle cx="460" cy="310" r="26" fill={FILL} />
      <Check x={460} y={310} r={18} />
      <path d="M240 170c30-40 60-40 80-20" stroke={STROKE} strokeWidth="1.75" strokeDasharray="6 6" />
      <circle cx="526" cy="64" r="15" fill={LINE} />
      <circle cx="568" cy="150" r="6" fill={FILL} />
      <circle cx="150" cy="380" r="8" fill={FILL} />
    </svg>
  );
}

/** Reason 2: an update that failed, and a rollback arrow to yesterday. */
export function UpdateArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke={LINE} strokeWidth="1.5">
        <circle cx="300" cy="230" r="190" />
        <circle cx="300" cy="230" r="110" />
        <path d="M120 40h200M300 40v390M440 20h160M440 20L300 200" />
      </g>
      <circle cx="300" cy="40" r="9" fill={FILL} />
      <circle cx="390" cy="58" r="13" fill={FILL} />

      <rect x="176" y="110" width="270" height="230" rx="14" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <text x="198" y="144" fontSize="14" fontWeight="600" fontFamily="inherit" fill={FG}>Plugin update</text>
      <rect x="198" y="160" width="226" height="46" rx="8" fill="#fff4f4" stroke="#f5c2c2" />
      <circle cx="220" cy="183" r="9" stroke="#d14343" strokeWidth="1.75" />
      <path d="M216 179l8 8M224 179l-8 8" stroke="#d14343" strokeWidth="1.75" strokeLinecap="round" />
      <text x="238" y="188" fontSize="12" fontFamily="inherit" fill="#b42318">Update failed · site error</text>
      <rect x="198" y="218" width="226" height="46" rx="8" fill="#f6f8ff" stroke="#dbe3ff" />
      <g transform="translate(210 231)" stroke={FILL} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M2 10a9 9 0 1 0 3-7" />
        <path d="M2 2v6h6" />
      </g>
      <text x="238" y="246" fontSize="12" fontFamily="inherit" fill={FG}>Yesterday&rsquo;s copy</text>
      <rect x="198" y="282" width="226" height="40" rx="8" fill={FILL} />
      <text x="311" y="307" textAnchor="middle" fontSize="13" fontWeight="600" fontFamily="inherit" fill="#fff">Roll back</text>

      <rect x="30" y="100" width="110" height="74" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <path d="M44 122h82M44 138h82M44 154h60" stroke={LINE} strokeWidth="1.5" />
      <rect x="470" y="270" width="110" height="74" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <path d="M484 292h82M484 308h82M484 324h60" stroke={LINE} strokeWidth="1.5" />
      <circle cx="150" cy="410" r="6" fill={FILL} />
    </svg>
  );
}

/** Reason 3: a file browser with one restored file highlighted. */
export function FileArt({ className }: { className?: string }) {
  const files = ["index.php", "about.html", "contact.php", "logo.png"];
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <Grid x={20} y={30} cols={7} rows={5} />
      <rect x="110" y="20" width="130" height="80" fill={TINT} />
      <Dots x={120} y={30} stroke={LINE} />
      <rect x="380" y="10" width="190" height="130" rx="6" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <Dots x={394} y={26} stroke={LINE} />
      <circle cx="475" cy="84" r="28" fill={TINT} />
      <path d="M462 72h18l6 6v22h-24z" stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />

      <rect x="80" y="130" width="380" height="270" rx="8" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <Dots x={98} y={150} />
      <text x="100" y="186" fontSize="14" fontWeight="600" fontFamily="inherit" fill={FG}>public_html</text>
      {files.map((f, i) => {
        const y = 202 + i * 44;
        const on = i === 2;
        return (
          <g key={f}>
            <rect x="100" y={y} width="340" height="36" rx="8" fill={on ? TINT : "#fff"} stroke={on ? STROKE : "#e5e9f5"} />
            <path transform={`translate(116 ${y + 10})`} d="M0 0h10l5 5v11h-15z" stroke={on ? FILL : FG2} strokeWidth="1.4" strokeLinejoin="round" />
            <text x="144" y={y + 23} fontSize="13" fontFamily="inherit" fill={FG}>{f}</text>
            {on && (
              <>
                <rect x="340" y={y + 6} width="88" height="24" rx="12" fill={FILL} />
                <text x="384" y={y + 22} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="inherit" fill="#fff">Restored</text>
              </>
            )}
          </g>
        );
      })}
      <rect x="20" y="320" width="150" height="110" rx="6" stroke={LINE} strokeWidth="1.5" />
      <Dots x={32} y={334} stroke={LINE} />
      <circle cx="520" cy="360" r="10" fill={FILL} />
    </svg>
  );
}

/** Reason 4: a month calendar where every night has a backup tick. */
export function CalendarArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" aria-hidden className={className}>
      <g stroke={LINE} strokeWidth="1.5">
        <path d="M290 0v440M0 230h40M520 180l30 -60M550 180h50" />
      </g>
      <rect x="40" y="50" width="510" height="340" rx="12" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <Dots x={62} y={76} stroke={LINE} />
      <text x="70" y="118" fontSize="15" fontWeight="600" fontFamily="inherit" fill={FG}>Backups this month</text>
      {Array.from({ length: 28 }).map((_, i) => {
        const c = i % 7;
        const r = Math.floor(i / 7);
        const x = 70 + c * 66;
        const y = 140 + r * 58;
        const today = i === 23;
        return (
          <g key={i}>
            <rect x={x} y={y} width="54" height="46" rx="8" fill={today ? FILL : TINT} />
            <text x={x + 8} y={y + 16} fontSize="10" fontFamily="inherit" fill={today ? "#fff" : FG2}>{i + 1}</text>
            {i <= 23 && <Check x={x + 32} y={y + 28} r={11} stroke={today ? "#fff" : FILL} />}
          </g>
        );
      })}
      <circle cx="10" cy="306" r="6" fill={FILL} />
      <circle cx="440" cy="20" r="11" fill={FILL} />
    </svg>
  );
}
