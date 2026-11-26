// Shared building blocks for the blog cover mockups (1200x800).
export const PHOTO = (p) => `file:///Users/edgarmartinez/Desktop/Next%20js/public/industries/${p}`;

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1200px;height:800px;overflow:hidden}
body{font-family:-apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased}
.stage{position:relative;width:1200px;height:800px;overflow:hidden;background:var(--bg)}
.stage:before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.16) 1.4px,transparent 1.5px);background-size:28px 28px;mask-image:linear-gradient(115deg,transparent 20%,#000 75%)}
.stage:after{content:"";position:absolute;width:900px;height:900px;right:-300px;top:-420px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.28),transparent)}
.t-a{--bg:linear-gradient(135deg,#1f55ff 0%,#0000d4 100%)}
.t-b{--bg:linear-gradient(135deg,#5f8bff 0%,#1f55ff 100%)}
.t-c{--bg:linear-gradient(135deg,#0b2080 0%,#061a4d 100%)}
.t-d{--bg:linear-gradient(135deg,#94b4ff 0%,#5f8bff 100%)}
.t-e{--bg:linear-gradient(135deg,#0000ff 0%,#0b2080 100%)}
.win{position:absolute;z-index:2;background:#fff;border-radius:18px;box-shadow:0 40px 80px -20px rgba(2,8,40,.55),0 0 0 1px rgba(255,255,255,.35);overflow:hidden;display:flex;flex-direction:column}
.bar{height:52px;flex:none;display:flex;align-items:center;gap:9px;padding:0 20px;background:#f3f4f7;border-bottom:1px solid #e4e7ee}
.bar>i{width:13px;height:13px;border-radius:50%;background:#ff5f57}.bar>i:nth-child(2){background:#febc2e}.bar>i:nth-child(3){background:#28c840}
.url{margin-left:22px;flex:1;max-width:560px;height:32px;border-radius:9px;background:#fff;border:1px solid #e1e4ec;display:flex;align-items:center;gap:8px;padding:0 14px;font-size:16px;color:#334155}
.url svg{width:15px;height:15px;flex:none}
.ns{color:#d93025;font-weight:600;display:flex;align-items:center;gap:6px;padding-right:10px;border-right:1px solid #e1e4ec;margin-right:4px}
.body{flex:1;position:relative;overflow:hidden}
.app{display:flex;height:100%}
.side{width:230px;flex:none;background:#0f1b3d;color:#c7d2fe;padding:22px 16px;font-size:16px;display:flex;flex-direction:column;gap:4px}
.side.light{background:#f7f8fb;color:#475569;border-right:1px solid #e6e9f0}
.side .logo{font-weight:700;color:#fff;font-size:19px;margin:0 8px 18px;display:flex;align-items:center;gap:10px}
.side.light .logo{color:#0f172a}
.side a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px}
.side a.on{background:rgba(255,255,255,.12);color:#fff;font-weight:600}
.side.light a.on{background:#e8eeff;color:#1f55ff}
.dot{width:16px;height:16px;border-radius:5px;background:currentColor;opacity:.35;flex:none}
.main{flex:1;padding:28px 32px;overflow:hidden;background:#fff}
.main.gray{background:#f6f7fb}
h1.h{font-size:30px;font-weight:700;letter-spacing:-.5px;margin-bottom:6px}
.muted{color:#64748b}
.sm{font-size:15px}.md{font-size:18px}
.row{display:flex;align-items:center;gap:12px}
.between{justify-content:space-between}
.card{background:#fff;border:1px solid #e6e9f0;border-radius:14px;padding:20px 22px}
.float{position:absolute;z-index:5;background:#fff;border-radius:16px;padding:20px 24px;box-shadow:0 30px 60px -15px rgba(2,8,40,.5),0 0 0 1px rgba(15,23,42,.06)}
.pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;font-size:14px;font-weight:600;white-space:nowrap}
.ok{background:#dcfce7;color:#15803d}.bad{background:#fee2e2;color:#b91c1c}.warn{background:#fef3c7;color:#b45309}.info{background:#e0eaff;color:#1f55ff}.grey{background:#f1f5f9;color:#475569}
.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 22px;border-radius:10px;background:#1f55ff;color:#fff;font-weight:600;font-size:17px;white-space:nowrap}
.btn.ghost{background:#fff;color:#0f172a;border:1px solid #d6dbe6}
table.t{width:100%;border-collapse:collapse;font-size:17px}
table.t th{text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#64748b;font-weight:600;padding:12px 14px;border-bottom:1px solid #e6e9f0;background:#fafbfd}
table.t td{padding:15px 14px;border-bottom:1px solid #eef1f6;white-space:nowrap}
.tick{display:inline-flex;width:24px;height:24px;border-radius:50%;background:#16a34a;align-items:center;justify-content:center;flex:none}
.tick svg{width:14px;height:14px}
.xmark{display:inline-flex;width:24px;height:24px;border-radius:50%;background:#dc2626;align-items:center;justify-content:center;flex:none}
.ring{width:24px;height:24px;border-radius:50%;border:2.5px solid #c2d5ff;flex:none}
.big{font-size:44px;font-weight:700;letter-spacing:-1px}
.kpi{font-size:34px;font-weight:700;letter-spacing:-.6px}
.lab{font-size:14px;color:#64748b;font-weight:500}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.photo{background-size:cover;background-position:center}
.bubble{padding:12px 16px;border-radius:16px;font-size:17px;line-height:1.35;max-width:80%}
.me{background:#1f55ff;color:#fff;border-bottom-right-radius:5px;margin-left:auto}
.bot{background:#f1f5f9;color:#0f172a;border-bottom-left-radius:5px}
.line{height:12px;border-radius:6px;background:#e9edf4}
.mono{font-family:"SF Mono",Menlo,monospace}
.sel{display:flex;align-items:center;justify-content:space-between;gap:10px;height:40px;padding:0 14px;border:1px solid #d6dbe6;border-radius:9px;background:#fff;font-size:16px}
.bars{display:flex;align-items:flex-end;gap:8px}
.bars span{flex:1;border-radius:6px 6px 0 0;background:#c2d5ff}
`;

const LOCK = `<svg viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" fill="#475569"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="#475569" stroke-width="1.6"/></svg>`;
export const TICK = `<span class="tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3.5 8.5 3 3 6-7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
export const X = `<span class="xmark"><svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></span>`;
export const RING = `<span class="ring"></span>`;

/** A browser window. pos = inline style (left/top/width/height). */
export const browser = (url, inner, pos, { secure = true } = {}) =>
  `<div class="win" style="${pos}"><div class="bar"><i></i><i></i><i></i><div class="url">${
    secure ? LOCK : `<span class="ns"><svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5 15 14H1z" fill="#d93025"/><path d="M8 6v3.5M8 11.5v.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>Not secure</span>`
  }${url}</div></div><div class="body">${inner}</div></div>`;

/** A desktop-app window (no URL bar, title instead). */
export const appwin = (title, inner, pos) =>
  `<div class="win" style="${pos}"><div class="bar"><i></i><i></i><i></i><div style="flex:1;text-align:center;font-size:15px;font-weight:600;color:#475569;margin-right:60px">${title}</div></div><div class="body">${inner}</div></div>`;

export const float = (inner, pos) => `<div class="float" style="${pos}">${inner}</div>`;

export const side = (logo, items, on, light = false) =>
  `<div class="side${light ? " light" : ""}"><div class="logo">${logo}</div>${items
    .map((i) => `<a class="${i === on ? "on" : ""}"><span class="dot"></span>${i}</a>`)
    .join("")}</div>`;

/** Simple SVG line/area chart. pts are 0..100 values. */
export function chart(pts, w, h, { color = "#1f55ff", fill = true, mark = null, grid = true } = {}) {
  const step = w / (pts.length - 1);
  const xy = pts.map((p, i) => [i * step, h - (p / 100) * h]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const g = grid
    ? [0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" stroke="#eef1f6" stroke-width="1.5"/>`).join("")
    : "";
  const m = mark
    ? `<line x1="${mark.i * step}" x2="${mark.i * step}" y1="0" y2="${h}" stroke="${mark.color || "#f59e0b"}" stroke-width="2" stroke-dasharray="6 5"/><rect x="${mark.i * step - 4}" y="0" rx="6" width="${mark.w || 150}" height="30" fill="${mark.color || "#f59e0b"}"/><text x="${mark.i * step + 8}" y="20" font-size="15" font-weight="700" fill="#fff" font-family="-apple-system,Helvetica">${mark.text}</text>`
    : "";
  const id = "g" + Math.random().toString(36).slice(2, 7);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;display:block">${g}${
    fill
      ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${w},${h} L0,${h} Z" fill="url(#${id})"/>`
      : ""
  }<path d="${d}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>${m}</svg>`;
}

export const page = (tone, inner) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage t-${tone}">${inner}</div></body></html>`;
