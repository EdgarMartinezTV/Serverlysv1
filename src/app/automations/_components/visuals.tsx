import { cn } from "@/lib/utils";

/**
 * Art and icons for /automations.
 *
 * The reference illustrates every band with Hostinger's own raster files, and
 * the tutorial cards additionally carry photographs of a Hostinger presenter.
 * None of that is ours to ship, so the art here is rebuilt in SVG — same
 * subject, same composition, same dark-panel-and-node-graph language, drawn
 * from the page's own palette.
 *
 * Everything is `aria-hidden` and decorative: each piece sits beside copy that
 * already says what it says, so a second announcement would be noise.
 *
 * The shared grid paper, the glow and the node chrome are defined once at the
 * bottom of this file and reused, which is why these stay short.
 *
 * COLOUR: the reference's accent is Hostinger purple (#7b66ff). Ours is the
 * Serverlys ramp, and it is deliberately held LOW on that ramp — glows are
 * brand-600 (#0000ff, the logo) and strokes are brand-500. The lighter steps
 * are the same hue 240 but tinted toward white, which reads periwinkle, and a
 * page built out of them stops looking like Serverlys and starts looking like
 * the reference we were matching. Strokes at brand-500 clear the 3:1 that
 * WCAG asks of non-text content on this canvas; the logo blue itself is 2.25:1
 * and so is used for fills behind white type, never for a line on its own.
 */

/* ==========================================================================
   Shared primitives
   ======================================================================== */

/** Faint engineering grid, as behind every panel on the reference. */
function GridPaper({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.16" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} className="text-ink-700" />
    </>
  );
}

/** A workflow node: rounded outline box, optional accent stroke. */
function Node({
  x,
  y,
  w,
  h,
  accent = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        className={accent ? "fill-surface-dark stroke-brand-500" : "fill-surface-dark stroke-line-on-dark"}
        strokeWidth="1.5"
      />
      {children}
    </>
  );
}

/** The n8n mark — three joined nodes. Drawn, not traced from their logo file. */
function NodeGlyph({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="stroke-current" fill="none" strokeWidth="1.6">
      <circle cx="2" cy="8" r="2" />
      <circle cx="10" cy="4" r="2.4" />
      <circle cx="10" cy="12" r="2.4" />
      <circle cx="19" cy="8" r="3" />
      <path d="M4 8h2.2M12 5.4 16.4 7M12 10.6 16.4 9" />
    </g>
  );
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y}l0 26 6-7.5 4.5 9 4-2-4.5-8.8 9.2-.7z`}
      className="fill-white stroke-ink-950"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  );
}

/* ==========================================================================
   Hero — chat → AI agent → editor, over a workflow panel
   ======================================================================== */

export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 460" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-hero-grid" />

      {/* Trigger → agent → action, the chain the copy describes. */}
      <path d="M66 96h12" className="stroke-brand-500" strokeWidth="1.5" />
      <path d="M20 88l-8 12h8l-6 10" className="stroke-brand-500" strokeWidth="1.6" fill="none" strokeLinejoin="round" />

      <Node x={78} y={56} w={110} h={80} accent>
        <g transform="translate(112 84)" className="stroke-white" fill="none" strokeWidth="1.6">
          <path d="M2 2h38a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H16l-9 8v-8H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
        </g>
      </Node>

      <path d="M188 96h30" className="stroke-line-on-dark" strokeWidth="1.5" />

      <Node x={218} y={56} w={290} h={80}>
        <g transform="translate(246 80)" className="stroke-white" fill="none" strokeWidth="1.6">
          <rect x="0" y="4" width="28" height="22" rx="6" />
          <path d="M14 0v4M6 22h16" />
          <circle cx="9" cy="13" r="1.6" className="fill-white stroke-none" />
          <circle cx="19" cy="13" r="1.6" className="fill-white stroke-none" />
        </g>
        <text x="292" y="103" className="fill-fg-on-dark text-[19px] font-semibold">
          AI Agent
        </text>
      </Node>

      <path d="M508 96h18a8 8 0 0 1 8 8v0" className="stroke-line-on-dark" strokeWidth="1.5" fill="none" />

      <Node x={534} y={48} w={96} h={96} accent>
        <path
          d="M566 112l4-14 26-26 10 10-26 26z"
          className="fill-none stroke-white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </Node>
      <Cursor x={616} y={116} />

      {/* The editor panel below, lit from the left as on the reference. */}
      <defs>
        <linearGradient id="n8n-hero-glow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" className="text-brand-600" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" className="text-brand-600" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 220l60-60h640v300H0z" fill="url(#n8n-hero-glow)" />

      <rect x="84" y="196" width="560" height="150" rx="14" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.5" />
      <path d="M116 272h132M480 272h132" className="stroke-brand-500" strokeWidth="2" />
      <g className="text-fg-on-dark">
        <NodeGlyph x={296} y={258} scale={1.9} />
      </g>

      <rect x="84" y="366" width="560" height="78" rx="14" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.5" />
    </svg>
  );
}

/* ==========================================================================
   Integrations — a model picker ring under a cursor
   ======================================================================== */

export function IntegrateArt({ className }: { className?: string }) {
  const logos = ["leaf", "spiral", "g", "llama", "x", "claw"] as const;
  return (
    <svg viewBox="0 0 600 435" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-int-grid" />

      <path d="M40 72h10" className="stroke-success-fill" strokeWidth="1.5" />
      <Node x={50} y={36} w={92} h={72} accent>
        <g transform="translate(76 62)" className="stroke-white" fill="none" strokeWidth="1.6">
          <path d="M2 2h32a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H14l-8 7v-7a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
        </g>
      </Node>
      <path d="M142 72h36" className="stroke-success-fill" strokeWidth="1.6" />

      <rect x="178" y="36" width="250" height="72" rx="14" className="fill-surface-dark stroke-success-fill" strokeWidth="1.6" />
      <g transform="translate(206 58)" className="stroke-white" fill="none" strokeWidth="1.6">
        <rect x="0" y="4" width="26" height="20" rx="6" />
        <path d="M13 0v4" />
        <circle cx="8" cy="13" r="1.5" className="fill-white stroke-none" />
        <circle cx="18" cy="13" r="1.5" className="fill-white stroke-none" />
      </g>
      <text x="250" y="80" className="fill-fg-on-dark text-[18px] font-semibold">
        AI Agent
      </text>

      <path d="M428 72h34" className="stroke-line-on-dark" strokeWidth="1.5" />
      <rect x="462" y="46" width="52" height="52" rx="14" className="fill-none stroke-line-on-dark" strokeWidth="1.5" />
      <path d="M488 62v20M478 72h20" className="stroke-fg-on-dark-muted" strokeWidth="1.8" strokeLinecap="round" />

      <path d="M304 108v96" className="stroke-success-fill" strokeWidth="1.6" fill="none" />

      {/* The provider ring. The third is highlighted, as on the reference. */}
      {logos.map((kind, i) => {
        const cx = 60 + i * 96;
        const active = i === 2;
        return (
          <g key={kind}>
            <circle
              cx={cx}
              cy={300}
              r="40"
              className={cn("fill-surface-dark", active ? "stroke-brand-500" : "stroke-line-on-dark")}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <ProviderMark kind={kind} cx={cx} cy={300} muted={!active} />
          </g>
        );
      })}
      <Cursor x={268} y={318} />
    </svg>
  );
}

/** Generic provider marks — suggestive shapes, not anyone's trademark. */
function ProviderMark({
  kind,
  cx,
  cy,
  muted,
}: {
  kind: string;
  cx: number;
  cy: number;
  muted: boolean;
}) {
  const c = muted ? "stroke-fg-on-dark-muted" : "stroke-fg-on-dark";
  const g = (d: string, w = 1.8) => (
    <path d={d} className={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <g transform={`translate(${cx - 16} ${cy - 16})`}>
      {kind === "leaf" && g("M4 26c0-12 8-20 24-20 0 14-8 22-24 20zM8 26c4-6 8-9 14-11")}
      {kind === "spiral" && g("M16 4a12 12 0 1 0 12 12A12 12 0 0 0 16 4zm0 6a6 6 0 1 1-6 6 6 6 0 0 1 6-6z")}
      {kind === "g" && g("M28 16a12 12 0 1 1-4-9M28 16H16")}
      {kind === "llama" && g("M10 28V14a6 6 0 0 1 12 0v14M13 8V4M19 8V4M14 17h.01M18 17h.01")}
      {kind === "x" && g("M5 5l22 22M27 5L5 27")}
      {kind === "claw" && g("M26 8a14 14 0 1 0 0 16M20 12l-6 4 6 4")}
    </g>
  );
}

/* ==========================================================================
   Bento art — one piece per card
   ======================================================================== */

/** Template picker: three selectable n8n templates, the first chosen. */
export function TemplatesArt({ className }: { className?: string }) {
  const rows = ["n8n", "n8n (+100 workflows)", "n8n (queue mode)"];
  return (
    <svg viewBox="0 0 524 737" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-tpl-grid" />
      <defs>
        <linearGradient id="n8n-tpl-glow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" className="text-brand-600" stopColor="currentColor" stopOpacity="0.48" />
          <stop offset="1" className="text-brand-600" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 300l70-70h454v507H0z" fill="url(#n8n-tpl-glow)" />

      {rows.map((label, i) => {
        const y = 56 + i * 104;
        const on = i === 0;
        return (
          <g key={label}>
            <rect
              x="32"
              y={y}
              width="460"
              height="80"
              rx="16"
              className={cn("fill-surface-dark", on ? "stroke-brand-500" : "stroke-line-on-dark")}
              strokeWidth={on ? 2 : 1.5}
            />
            <rect x="52" y={y + 18} width="44" height="44" rx="10" className={on ? "fill-white" : "fill-surface-dark-active"} />
            <g className={on ? "text-error-fill" : "text-fg-on-dark-muted"}>
              <NodeGlyph x={60} y={y + 30} scale={1.15} />
            </g>
            <text x="116" y={y + 48} className="fill-fg-on-dark text-[21px] font-semibold">
              {label}
            </text>
          </g>
        );
      })}
      <Cursor x={452} y={92} />

      {/* The resulting flow, running underneath. */}
      <rect x="90" y="392" width="434" height="300" rx="16" className="fill-surface-dark/70 stroke-line-on-dark" strokeWidth="1.5" />
      <Node x={126} y={430} w={96} h={68}>
        <g transform="translate(152 456)" className="stroke-white" fill="none" strokeWidth="1.6">
          <path d="M2 2h30a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12l-7 6v-6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" />
        </g>
      </Node>
      <path d="M222 464h44" className="stroke-line-on-dark" strokeWidth="1.5" />
      <Node x={266} y={430} w={200} h={68}>
        <text x="300" y="470" className="fill-fg-on-dark-secondary text-[17px]">
          AI Agent
        </text>
      </Node>
      <path d="M330 498v48h-60v36M330 546h66v36" className="stroke-line-on-dark" strokeWidth="1.5" fill="none" />
      <circle cx="270" cy="608" r="26" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.5" />
      <circle cx="396" cy="608" r="26" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.5" />
      <ProviderMark kind="spiral" cx={270} cy={608} muted />
      <g transform="translate(380 594)" className="stroke-fg-on-dark-muted" fill="none" strokeWidth="1.8">
        <ellipse cx="16" cy="6" rx="11" ry="4" />
        <path d="M5 6v14c0 2.2 4.9 4 11 4s11-1.8 11-4V6" />
      </g>
    </svg>
  );
}

/** A workflow run list, ticking over. */
export function RunsArt({ className }: { className?: string }) {
  const runs = [
    ["Email processor", "#26177"],
    ["Email processor", "#34169"],
    ["Email receiver", "#16462"],
    ["Email receiver", "#32264"],
    ["Route generator", "#96175"],
  ];
  return (
    <svg viewBox="0 0 362 290" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-runs-grid" />
      {/* Stacked sheets behind, as on the reference. */}
      <rect x="58" y="28" width="246" height="30" rx="12" className="fill-surface-dark-active/50" />
      <rect x="46" y="38" width="270" height="30" rx="12" className="fill-surface-dark-active/70" />

      <rect x="30" y="50" width="302" height="228" rx="14" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.5" />
      <text x="50" y="82" className="fill-fg-on-dark text-[14px] font-semibold">
        Campaign tracker flow
      </text>
      <text x="228" y="82" className="fill-success-fill text-[12px] font-semibold">
        Active
      </text>
      <rect x="276" y="68" width="38" height="20" rx="10" className="fill-success-fill" />
      <circle cx="305" cy="78" r="7" className="fill-white" />

      {runs.map(([name, id], i) => (
        <g key={id} opacity={1 - i * 0.16}>
          <path d={`M50 ${104 + i * 32}v18`} className="stroke-success-fill" strokeWidth="2" />
          <text x="60" y={`${119 + i * 32}`} className="fill-fg-on-dark-secondary text-ui">
            {name}
          </text>
          <text x="176" y={`${119 + i * 32}`} className="fill-fg-on-dark-secondary text-ui">
            Success
          </text>
          <text x="262" y={`${119 + i * 32}`} className="fill-fg-on-dark-muted text-ui">
            {id}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Stacked nodes with plus marks — resources added cheaply. */
export function ValueArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 362 290" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-val-grid" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="58"
            y={54 + i * 82}
            width="250"
            height="62"
            rx="14"
            className="fill-surface-dark stroke-brand-500"
            strokeWidth="1.5"
          />
          <g className="text-fg-on-dark">
            <NodeGlyph x={78} y={76 + i * 82} scale={1.2} />
          </g>
          {i === 1 ? (
            <>
              <rect x="118" y={80 + i * 82} width="22" height="7" rx="3.5" className="fill-success-fill" />
              <rect x="148" y={80 + i * 82} width="22" height="7" rx="3.5" className="fill-brand-500" />
              <rect x="182" y={80 + i * 82} width="106" height="3" rx="1.5" className="fill-brand-500" />
            </>
          ) : (
            <rect x="118" y={82 + i * 82} width="170" height="3" rx="1.5" className="fill-brand-500" />
          )}
        </g>
      ))}
      <g className="fill-brand-500">
        <path d="M28 148h14M35 141v14" className="stroke-brand-500" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M322 84h14M329 77v14" className="stroke-brand-500" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M300 30h12M306 24v12" className="stroke-brand-500" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Community node palette, one picked. */
export function CommunityArt({ className }: { className?: string }) {
  const tiles = ["megaphone", "headset", "branch", "clock"];
  return (
    <svg viewBox="0 0 740 253" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-com-grid" />
      <defs>
        <linearGradient id="n8n-com-glow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" className="text-brand-600" stopColor="currentColor" stopOpacity="0.48" />
          <stop offset="1" className="text-brand-600" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M140 253l60-60h540v60z" fill="url(#n8n-com-glow)" />
      <path d="M200 193h540" className="stroke-brand-500" strokeWidth="1.5" />

      <rect x="30" y="58" width="274" height="90" rx="14" className="fill-surface-dark stroke-brand-500" strokeWidth="1.8" />
      <g transform="translate(58 88)" className="stroke-brand-500" fill="none" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M2 4h10l3 4h15a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      </g>
      <text x="112" y="110" className="fill-fg-on-dark text-[18px] font-semibold">
        Document Ops
      </text>
      <Cursor x={280} y={118} />

      {tiles.map((kind, i) => (
        <g key={kind}>
          <rect
            x={334 + i * 124}
            y="58"
            width="90"
            height="90"
            rx="14"
            className="fill-surface-dark stroke-line-on-dark"
            strokeWidth="1.5"
          />
          <TileMark kind={kind} cx={379 + i * 124} cy={103} />
        </g>
      ))}
    </svg>
  );
}

function TileMark({ kind, cx, cy }: { kind: string; cx: number; cy: number }) {
  const p = (d: string) => (
    <path
      d={d}
      className="stroke-fg-on-dark-muted"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
  return (
    <g transform={`translate(${cx - 14} ${cy - 14})`}>
      {kind === "megaphone" && p("M2 11v6a1 1 0 0 0 1 1h3l7 5V5L6 10H3a1 1 0 0 0-1 1zM19 9a5 5 0 0 1 0 10")}
      {kind === "headset" && p("M4 16v-3a10 10 0 0 1 20 0v3M4 16h4v7H6a2 2 0 0 1-2-2zM24 16h-4v7h2a2 2 0 0 0 2-2z")}
      {kind === "branch" && p("M7 4v8a4 4 0 0 0 4 4h6M21 12l-4 4 4 4M7 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z")}
      {kind === "clock" && p("M14 4a10 10 0 1 0 10 10A10 10 0 0 0 14 4zm0 4v6l4 3")}
    </g>
  );
}

/* ==========================================================================
   Data centres — dotted world map with located pins
   ======================================================================== */

/* ==========================================================================
   Run log — what the reliability band is actually promising
   ======================================================================== */

/**
 * A workflow's run history: the same job, the same steps, over and over, with
 * one run that failed, retried and then succeeded.
 *
 * That failed row is the point of the picture and should not be tidied away.
 * The band beside it promises visibility rather than perfection, and a log
 * showing nothing but green would be selling the claim we specifically do not
 * make.
 */
export function RunLogArt({ className }: { className?: string }) {
  const runs = [
    { t: "09:04", label: "Enquiry → record", state: "ok" },
    { t: "09:04", label: "Confirmation sent", state: "ok" },
    { t: "10:17", label: "Booking → calendar", state: "ok" },
    { t: "11:52", label: "Invoice → accounts", state: "retry" },
    { t: "11:52", label: "Invoice → accounts", state: "ok" },
    { t: "14:30", label: "Follow-up queued", state: "ok" },
  ];

  return (
    <svg viewBox="0 0 600 420" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-runlog-grid" />

      <rect
        x="24"
        y="28"
        width="552"
        height="364"
        rx="16"
        className="fill-surface-dark-elevated stroke-line-on-dark"
        strokeWidth="1.5"
      />

      <text x="52" y="72" className="fill-fg-on-dark text-[17px] font-semibold">
        Enquiry handling
      </text>
      <rect x="446" y="54" width="104" height="26" rx="13" className="fill-success-fill/15" />
      <circle cx="466" cy="67" r="4" className="fill-success-fill" />
      <text x="478" y="72" className="fill-success-fill text-[13px] font-semibold">
        Running
      </text>

      <path d="M52 96h496" className="stroke-line-on-dark" strokeWidth="1" />

      {runs.map((r, i) => {
        const y = 130 + i * 42;
        const failed = r.state === "retry";
        return (
          <g key={`${r.t}-${i}`}>
            <text x="52" y={y} className="fill-fg-on-dark-muted text-[13px]">
              {r.t}
            </text>
            <path
              d={`M104 ${y - 12}v16`}
              className={failed ? "stroke-warning-fill" : "stroke-success-fill"}
              strokeWidth="2.5"
            />
            <text x="118" y={y} className="fill-fg-on-dark text-[14px]">
              {r.label}
            </text>
            <text
              x="548"
              textAnchor="end"
              y={y}
              className={failed ? "fill-warning-fill text-[13px]" : "fill-fg-on-dark-muted text-[13px]"}
            >
              {failed ? "retried" : "done"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ==========================================================================
   Conversation — where a workflow usually starts
   ======================================================================== */

/**
 * The reference drew a chat in which someone asks a server to take a snapshot.
 * This is the same panel carrying the enquiry a real customer sends, because
 * that is what actually triggers most of these workflows: the agent captures
 * it, and the automation does the rest.
 */
export function ConversationArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 614 543" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <GridPaper id="n8n-conv-grid" />
      <defs>
        <linearGradient id="n8n-conv-glow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" className="text-brand-600" stopColor="currentColor" stopOpacity="0.48" />
          <stop offset="1" className="text-brand-600" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 340l104-104h456v307H0z" fill="url(#n8n-conv-glow)" />
      <path d="M104 236h456M104 236L0 340" className="stroke-brand-500" strokeWidth="1.5" fill="none" />

      <rect x="96" y="74" width="420" height="466" rx="18" className="fill-surface-dark-active" />

      <g transform="translate(126 104)" className="stroke-fg-on-dark" fill="none" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2 10 12 2M2 10l10 8M16 2l6 8-6 8" />
      </g>
      <text x="160" y="124" className="fill-fg-on-dark text-[22px] font-semibold">
        New enquiry
      </text>

      {/* Request. */}
      <rect x="126" y="166" width="42" height="42" rx="11" className="fill-surface-dark" />
      <g transform="translate(139 179)" className="stroke-fg-on-dark-secondary" fill="none" strokeWidth="1.6">
        <circle cx="8" cy="5" r="3.4" />
        <path d="M1.5 16c1-3.4 3.6-5 6.5-5s5.5 1.6 6.5 5" />
      </g>
      <text x="186" y="194" className="fill-fg-on-dark text-[15px]">
        Do you cover Coral Gables on Friday?
      </text>

      {/* Two replies, the second confirmed. */}
      <rect x="126" y="236" width="42" height="42" rx="11" className="fill-brand-500" />
      <AgentGlyph x={139} y={249} />
      <text x="186" y="256" className="fill-fg-on-dark text-[15px]">
        We do — Friday has a 9am and a
      </text>
      <text x="186" y="282" className="fill-fg-on-dark text-[15px]">
        2pm free. Can I take a name and
      </text>
      <text x="186" y="308" className="fill-fg-on-dark text-[15px]">
        a number to hold one?
      </text>

      <rect x="114" y="340" width="388" height="76" rx="12" className="fill-brand-600/35 stroke-brand-500" strokeWidth="1.3" />
      <rect x="126" y="358" width="42" height="42" rx="11" className="fill-brand-500" />
      <AgentGlyph x={139} y={371} />
      <text x="186" y="386" className="fill-fg-on-dark text-[15px]">
        Booked · record created · you were emailed
      </text>

      {/* Composer. */}
      <rect x="114" y="442" width="388" height="72" rx="12" className="fill-none stroke-line-on-dark" strokeWidth="1.4" />
      <text x="138" y="484" className="fill-fg-on-dark-muted text-[15px]">
        Type a message
      </text>
      <rect x="438" y="458" width="42" height="40" rx="10" className="fill-surface-dark" />
      <path d="M450 470l20 8-20 8 4-8z" className="fill-fg-on-dark-muted" />
    </svg>
  );
}

function AgentGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="stroke-white" fill="none" strokeWidth="1.7" strokeLinecap="round">
      <path d="M1 8 9 1M1 8l8 7M13 1l5 7-5 7" />
    </g>
  );
}

/* ==========================================================================
   Tutorial thumbnails — stand-ins for the reference's video stills
   ======================================================================== */

export function TutorialArt({ kind, className }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 358 201" role="presentation" aria-hidden className={cn("h-auto w-full", className)}>
      <rect width="358" height="201" className="fill-brand-950" />
      <GridPaper id={`n8n-tut-${kind}`} />

      {kind === "setup" && (
        <>
          <rect x="22" y="26" width="46" height="46" rx="10" className="fill-white/90" />
          <text x="30" y="58" className="fill-brand-700 text-[26px] font-semibold">
            S
          </text>
          <text x="82" y="48" className="fill-fg-on-dark text-[20px] font-semibold">
            Automation
          </text>
          <rect x="82" y="60" width="132" height="30" rx="4" className="fill-warning-fill" />
          <text x="90" y="83" className="fill-ink-950 text-[20px] font-semibold">
            Ideas
          </text>
          <path d="M104 100v18" className="stroke-fg-on-dark" strokeWidth="2" markerEnd="" />
          <path d="M98 112l6 8 6-8" className="fill-none stroke-fg-on-dark" strokeWidth="2" strokeLinecap="round" />
          <g className="text-error-fill">
            <NodeGlyph x={70} y={140} scale={2.4} />
          </g>
          <text x="150" y="168" className="fill-fg-on-dark text-[26px] font-semibold">
            n8n
          </text>
        </>
      )}

      {kind === "api" && (
        <>
          <text x="24" y="46" className="fill-fg-on-dark text-[23px] font-semibold">
            n8n + Serverlys API
          </text>
          <rect x="44" y="66" width="270" height="120" rx="8" className="fill-surface-dark stroke-line-on-dark" strokeWidth="1.4" />
          <rect x="44" y="66" width="34" height="120" rx="8" className="fill-surface-dark-active" />
          <text x="150" y="92" className="fill-fg-on-dark text-[13px] font-semibold">
            Workflows
          </text>
          <rect x="130" y="100" width="70" height="12" rx="3" className="fill-error-fill/80" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={96} y={122 + i * 20} width="54" height="12" rx="3" className="fill-line-on-dark" />
          ))}
          {[0, 1].map((i) => (
            <rect key={i} x={172} y={126 + i * 26} width="44" height="16" rx="4" className="fill-brand-500/50" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={244} y={104 + i * 20} width="56" height="12" rx="3" className="fill-line-on-dark" />
          ))}
        </>
      )}

      {kind === "mcp" && (
        <>
          <g className="text-error-fill">
            <NodeGlyph x={30} y={40} scale={2.2} />
          </g>
          <text x="140" y="56" className="fill-fg-on-dark text-[26px] font-semibold">
            n8n
          </text>
          <text x="96" y="96" className="fill-fg-on-dark text-[24px] font-semibold">
            +
          </text>
          <text x="60" y="132" className="fill-fg-on-dark text-[15px]">
            Model Context Protocol
          </text>
          <rect x="56" y="146" width="174" height="30" rx="4" className="fill-warning-fill" />
          <text x="64" y="169" className="fill-ink-950 text-[19px] font-semibold">
            Automation
          </text>
        </>
      )}
    </svg>
  );
}

/* ==========================================================================
   Icons
   ======================================================================== */

export function SpecIcon({ kind, className }: { kind: string; className?: string }) {
  const common = {
    className: cn("stroke-current", className),
    fill: "none",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      {kind === "cpu" && (
        <g {...common}>
          <rect x="5.5" y="5.5" width="9" height="9" rx="2" />
          <path d="M8 3v2.5M12 3v2.5M8 14.5V17M12 14.5V17M3 8h2.5M3 12h2.5M14.5 8H17M14.5 12H17" />
        </g>
      )}
      {kind === "ram" && (
        <g {...common}>
          <rect x="2.5" y="6" width="15" height="8" rx="1.5" />
          <path d="M5.5 14v2M9 14v2M12.5 14v2M6 9h8" />
        </g>
      )}
      {kind === "disk" && (
        <g {...common}>
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M6.5 3v5.5h7V3M7 13h6" />
        </g>
      )}
      {kind === "bandwidth" && (
        <g {...common}>
          <circle cx="10" cy="10" r="7" />
          <path d="M10 10l3.5-3.5M10 3v1.5M17 10h-1.5M10 17v-1.5M3 10h1.5" />
        </g>
      )}
    </svg>
  );
}

export function FeatureIcon({ kind, className }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      {kind === "chart" && (
        <g className="stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 16v-3.5M12 16V8.5M16 16v-5.5" />
        </g>
      )}
      {kind === "shield" && (
        <g className="stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s7-3.2 7-9V5.6L12 3 5 5.6V12c0 5.8 7 9 7 9z" />
          <path d="M9.2 12l2 2 3.6-4" />
        </g>
      )}
      {kind === "restore" && (
        <g className="stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
          <path d="M4 4v4h4" />
        </g>
      )}
    </svg>
  );
}

/** Solid star, for the borrowed partner-rating strip. */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"
      />
    </svg>
  );
}
