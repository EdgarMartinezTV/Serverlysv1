import { PHOTO, TICK, X, RING, browser, appwin, float, side, chart, page } from "./lib.mjs";

const MAIN = "left:64px;top:84px;width:920px;height:760px";
const MAINW = "left:64px;top:84px;width:1072px;height:760px";

/** Small business site used inside several browsers. */
const site = (name, photo, headline, sub, cta = "Book now", nav = ["Services", "About", "Contact"]) => `
  <div style="height:100%;display:flex;flex-direction:column">
    <div class="row between" style="padding:18px 32px;border-bottom:1px solid #eef1f6">
      <div class="row" style="gap:10px;font-weight:700;font-size:20px"><span style="width:30px;height:30px;border-radius:8px;background:#0f172a"></span>${name}</div>
      <div class="row" style="gap:26px;font-size:16px;color:#475569">${nav.map((n) => `<span>${n}</span>`).join("")}<span class="btn" style="height:38px;font-size:15px;padding:0 16px">${cta}</span></div>
    </div>
    <div class="photo" style="flex:1;position:relative;background-image:linear-gradient(90deg,rgba(2,8,30,.78) 0%,rgba(2,8,30,.35) 55%,rgba(2,8,30,0) 100%),url('${PHOTO(photo)}')">
      <div style="position:absolute;left:40px;top:64px;width:470px;color:#fff">
        <div style="font-size:46px;font-weight:700;line-height:1.05;letter-spacing:-1px">${headline}</div>
        <div style="font-size:19px;margin-top:16px;opacity:.88;line-height:1.4">${sub}</div>
        <div class="row" style="margin-top:26px"><span class="btn" style="background:#fff;color:#0f172a">${cta}</span><span class="btn ghost" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.6)">Call us</span></div>
      </div>
    </div>
  </div>`;

const wpSide = (on) =>
  side(`<span style="width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:16px">W</span>Dashboard`,
    ["Home", "Updates", "Posts", "Pages", "Plugins", "Users", "Tools", "Settings"], on);

const cpSide = (on) =>
  side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff;display:inline-flex;align-items:center;justify-content:center;font-size:15px">cP</span>Control panel`,
    ["Home", "Files", "Databases", "Domains", "Email", "Software", "Security", "Metrics"], on);

const gscSide = (on) =>
  side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Search Console`,
    ["Overview", "Performance", "URL inspection", "Pages", "Sitemaps", "Core Web Vitals", "Links"], on, true);

const storeSide = (on) =>
  side(`<span style="width:30px;height:30px;border-radius:8px;background:#22c55e"></span>Store admin`,
    ["Home", "Orders", "Products", "Customers", "Analytics", "Payments", "Shipping", "Settings"], on);

const inboxSide = (on) =>
  side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Mail`,
    ["Inbox", "Starred", "Sent", "Drafts", "Spam", "Trash"], on, true);

const checklist = (items) =>
  items.map(([t, s]) => `<div class="row" style="padding:13px 0;border-bottom:1px solid #eef1f6;font-size:18px">${s === 1 ? TICK : s === 0 ? RING : X}<span style="${s === 0 ? "color:#64748b" : ""}">${t}</span></div>`).join("");

export const SCENES = {
  "ai-receptionist-for-small-business": ["e", `
    ${browser("brightsmiledental.com", site("Bright Smile Dental", "dental/hero.webp", "Gentle care for the whole family", "New patients welcome. Evening appointments Monday to Thursday.", "Book a visit"), MAIN)}
    ${float(`
      <div class="row" style="gap:12px;margin-bottom:16px"><span style="width:44px;height:44px;border-radius:50%;background:#1f55ff;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700">AI</span><div><div style="font-weight:700;font-size:19px">Front desk assistant</div><div class="row sm" style="gap:6px;color:#16a34a"><span style="width:8px;height:8px;border-radius:50%;background:#16a34a"></span>Answering now</div></div></div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="bubble me">Can I get a cleaning on Tuesday after work?</div>
        <div class="bubble bot">Yes! Tuesday has 5:30 pm and 6:15 pm open. Which one works?</div>
        <div class="bubble me">5:30 please</div>
        <div class="bubble bot">Booked. You'll get a text reminder the day before.</div>
      </div>`, "right:48px;top:150px;width:400px")}
    ${float(`<div class="row" style="gap:12px">${TICK}<div><div style="font-weight:700;font-size:18px">Appointment booked</div><div class="muted sm">Tue · 5:30 pm · Cleaning</div></div></div>`, "right:300px;bottom:44px;padding:16px 20px")}`],

  "bilingual-website-english-spanish": ["b", `
    ${browser("riveraplumbing.com", site("Rivera Plumbing", "service-business/hero.webp", "Fast, honest plumbing repairs", "Same-day service across the county.", "Book a visit", ["Services", "About", "EN · ES"]), "left:48px;top:96px;width:640px;height:520px")}
    ${browser("riveraplumbing.com/es", site("Plomería Rivera", "service-business/hero.webp", "Reparaciones rápidas y honestas", "Servicio el mismo día en todo el condado.", "Reservar", ["Servicios", "Nosotros", "ES · EN"]), "left:500px;top:300px;width:660px;height:540px")}
    ${float(`<div class="row" style="gap:8px"><span class="pill info" style="font-size:18px;padding:8px 18px">English</span><span class="pill" style="font-size:18px;padding:8px 18px;background:#1f55ff;color:#fff">Español</span></div>`, "left:120px;top:660px;padding:14px")}`],

  "black-friday-web-hosting-deals-checklist": ["e", `
    ${browser("examplehost.com/black-friday", `
      <div style="padding:34px 40px;background:linear-gradient(180deg,#0b1020,#151b33);height:100%;color:#fff">
        <div class="row" style="gap:12px"><span class="pill" style="background:#facc15;color:#0f172a;font-size:16px">BLACK FRIDAY</span><span style="opacity:.7">Ends Sunday</span></div>
        <div style="font-size:44px;font-weight:800;margin:16px 0 26px;letter-spacing:-1px">Up to 80% off hosting</div>
        <div class="grid3">${[["Starter", "$1.99", "$10.99"], ["Business", "$3.49", "$15.99"], ["Pro", "$5.99", "$24.99"]].map(([n, p, r], i) => `
          <div style="background:#1d2442;border:1px solid ${i == 1 ? "#facc15" : "#2b3460"};border-radius:16px;padding:22px">
            <div style="font-size:20px;font-weight:700">${n}</div>
            <div style="font-size:40px;font-weight:800;margin:10px 0 2px">${p}<span style="font-size:17px;opacity:.7">/mo</span></div>
            <div style="font-size:15px;opacity:.65">48-month term, paid upfront</div>
            <div style="margin-top:14px;padding:8px 10px;border-radius:8px;background:rgba(239,68,68,.18);color:#fca5a5;font-size:15px;font-weight:600">Renews at ${r}/mo</div>
          </div>`).join("")}</div>
      </div>`, MAIN)}
    ${float(`<div style="font-weight:700;font-size:20px;margin-bottom:6px">Before you buy</div>${checklist([["Renewal price", 1], ["Term you must prepay", 1], ["Money-back window", 1], ["Free domain renewal?", 0]])}`, "right:44px;top:250px;width:330px")}`],

  "dns-propagation-explained": ["c", `
    ${browser("serverlys.com/dns-propagation-checker", `
      <div style="padding:28px 34px">
        <div class="row" style="gap:12px;margin-bottom:20px"><div class="sel" style="flex:1;height:48px;font-size:18px">yourbrand.com</div><div class="sel" style="width:110px;height:48px">A</div><span class="btn" style="height:48px">Check</span></div>
        <div style="height:230px;border-radius:14px;background:#f1f5ff;position:relative;overflow:hidden;margin-bottom:18px">
          <svg viewBox="0 0 800 230" width="100%" height="230">${(()=>{let o="";for(let x=10;x<800;x+=14)for(let y=8;y<230;y+=14){const land=(((x-150)/95)**2+((y-85)/55)**2<1)||(((x-215)/40)**2+((y-175)/45)**2<1)||(((x-400)/55)**2+((y-70)/40)**2<1)||(((x-420)/45)**2+((y-160)/55)**2<1)||(((x-560)/120)**2+((y-90)/55)**2<1)||(((x-680)/45)**2+((y-185)/22)**2<1);if(land)o+=`<circle cx="${x}" cy="${y}" r="3.6" fill="#b7cbff"/>`;}return o;})()}
          ${[[120, 70, 1], [190, 110, 1], [380, 60, 1], [420, 150, 0], [560, 80, 1], [640, 110, 1], [215, 180, 0], [690, 185, 1]].map(([x, y, ok]) => `<circle cx="${x}" cy="${y}" r="13" fill="${ok ? "#16a34a" : "#f59e0b"}" stroke="#fff" stroke-width="4"/>`).join("")}</svg>
        </div>
        <table class="t"><tr><th>Location</th><th>Resolver</th><th>Result</th><th></th></tr>
        ${[["New York, US", "203.0.113.10", 1], ["London, UK", "203.0.113.10", 1], ["São Paulo, BR", "198.51.100.7", 0], ["Tokyo, JP", "203.0.113.10", 1]].map(([l, ip, ok]) => `<tr><td>${l}</td><td class="mono" style="font-size:15px">${ip}</td><td>${ok ? '<span class="pill ok">New IP</span>' : '<span class="pill warn">Old IP (cached)</span>'}</td><td>${ok ? TICK : '<span class="ring" style="border-color:#f59e0b"></span>'}</td></tr>`).join("")}</table>
      </div>`, MAIN)}
    ${float(`<div class="lab">Propagated</div><div class="big" style="color:#1f55ff">18 / 22</div><div class="muted sm">resolvers see the new record</div>`, "right:48px;top:420px;width:250px")}`],

  "domain-renewal-scams": ["c", `
    ${appwin("Inbox — you@yourbrand.com", `<div class="app">${inboxSide("Inbox")}<div class="main" style="padding:0">
      ${[["Domain Registry Services", "FINAL NOTICE: Domain Listing Expiration yourbrand.com", "Your search engine listing will be cancelled unless payment of $389.00…", 1], ["Your registrar", "Your domain renews in 30 days", "yourbrand.com is set to auto-renew on Jan 14.", 0], ["Google Workspace", "Your monthly invoice is ready", "Invoice for December is available.", 0], ["Bank", "New sign-in to your account", "We noticed a new sign-in from Chrome on Mac.", 0]].map(([f, s, p, bad]) => `
        <div style="padding:20px 26px;border-bottom:1px solid #eef1f6;${bad ? "background:#fff5f5;border-left:5px solid #dc2626" : ""}">
          <div class="row between"><span style="font-weight:700;font-size:18px">${f}</span>${bad ? '<span class="pill bad">⚠ Not your registrar</span>' : '<span class="muted sm">9:41 AM</span>'}</div>
          <div style="font-size:18px;margin-top:4px;${bad ? "font-weight:600" : ""}">${s}</div><div class="muted sm" style="margin-top:3px">${p}</div></div>`).join("")}
    </div></div>`, MAIN)}
    ${float(`<div style="font-weight:700;font-size:19px;margin-bottom:8px">Red flags</div>${checklist([["Sender isn't your registrar", 2], ["Urgent \"final notice\"", 2], ["\"Listing\", not renewal", 2]])}`, "right:44px;top:330px;width:330px")}`],

  "domain-vs-hosting": ["a", `
    ${appwin("Domain", `<div style="padding:30px">
      <div class="lab">YOUR ADDRESS</div><div style="font-size:38px;font-weight:700;margin:8px 0 20px">yourbrand<span style="color:#1f55ff">.com</span></div>
      <table class="t"><tr><th>Type</th><th>Points to</th></tr><tr><td><span class="pill info">A</span></td><td class="mono" style="font-size:16px">203.0.113.24</td></tr><tr><td><span class="pill info">MX</span></td><td class="mono" style="font-size:16px">mail.yourbrand.com</td></tr><tr><td><span class="pill info">NS</span></td><td class="mono" style="font-size:16px">ns1.serverlys.com</td></tr></table>
      <div class="row sm muted" style="margin-top:16px;gap:8px">Renews yearly · <b style="color:#0f172a">Registrar</b></div></div>`, "left:56px;top:170px;width:470px;height:470px")}
    <svg style="position:absolute;left:520px;top:360px;z-index:3" width="150" height="60"><path d="M6 30 H130" stroke="#fff" stroke-width="5" stroke-dasharray="12 10" stroke-linecap="round"/><path d="M120 16 L140 30 L120 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${appwin("Hosting · File manager", `<div style="padding:24px 26px">
      <div class="row between" style="margin-bottom:16px"><div style="font-weight:700;font-size:20px">public_html</div><span class="pill ok">Server online</span></div>
      ${[["index.php", "4 KB"], ["wp-content", "folder"], ["wp-config.php", "3 KB"], ["images", "folder"], [".htaccess", "1 KB"]].map(([n, s]) => `<div class="row between" style="padding:13px 6px;border-bottom:1px solid #eef1f6;font-size:18px"><span class="row" style="gap:12px"><span style="width:22px;height:18px;border-radius:4px;background:${s === "folder" ? "#facc15" : "#c2d5ff"}"></span>${n}</span><span class="muted sm">${s}</span></div>`).join("")}
      <div class="row sm muted" style="margin-top:16px">Website files, databases, email · <b style="color:#0f172a">&nbsp;Host</b></div></div>`, "left:664px;top:110px;width:480px;height:600px")}`],

  "first-week-after-launching-a-website": ["b", `
    ${appwin("Analytics · yourbrand.com", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#f59e0b"></span>Analytics`, ["Home", "Realtime", "Pages", "Sources", "Events"], "Realtime", true)}<div class="main">
      <div class="row between"><h1 class="h">First 7 days</h1><span class="pill ok">● 6 visitors right now</span></div>
      <div class="grid3" style="margin:18px 0 22px">${[["Visitors", "412"], ["Contact forms", "9"], ["From Google", "31%"]].map(([l, v]) => `<div class="card"><div class="lab">${l}</div><div class="kpi">${v}</div></div>`).join("")}</div>
      <div class="card">${chart([8, 22, 18, 35, 41, 58, 74], 600, 230, { mark: { i: 2, text: "Shared on Instagram", w: 186, color: "#1f55ff" } })}<div class="row between sm muted" style="margin-top:10px">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<span>${d}</span>`).join("")}</div></div>
    </div></div>`, MAIN)}
    ${float(`<div style="font-weight:700;font-size:19px;margin-bottom:4px">Launch week</div>${checklist([["Submitted sitemap", 1], ["Tested contact form", 1], ["Backups on", 1], ["Business profile", 0]])}`, "right:44px;top:300px;width:300px")}`],

  "fonts-scripts-and-embeds-slowing-your-site": ["a", `
    ${appwin("Developer tools — Network", `<div style="padding:0">
      <div class="row" style="gap:20px;padding:14px 22px;border-bottom:1px solid #e6e9f0;font-size:15px;color:#475569"><b style="color:#1f55ff">All</b><span>Fetch/XHR</span><span>JS</span><span>CSS</span><span>Font</span><span>Img</span><span>Media</span></div>
      <table class="t" style="font-size:15px"><tr><th>Name</th><th>Type</th><th>Size</th><th style="width:420px">Waterfall</th></tr>
      ${[["index.html", "doc", "18 kB", 0, 40, "#64748b"], ["chat-widget.js", "script", "612 kB", 30, 220, "#f59e0b"], ["fonts.css", "css", "2 kB", 40, 60, "#a855f7"], ["Display-Black.woff2", "font", "184 kB", 90, 150, "#a855f7"], ["Display-Italic.woff2", "font", "176 kB", 90, 140, "#a855f7"], ["video-embed.js", "script", "880 kB", 60, 300, "#ef4444"], ["tracking-pixel.js", "script", "94 kB", 120, 90, "#f59e0b"], ["hero.jpg", "img", "2.4 MB", 130, 270, "#22c55e"], ["reviews-carousel.js", "script", "310 kB", 180, 200, "#f59e0b"]].map(([n, t, s, x, w, c]) => `<tr><td>${n}</td><td class="muted">${t}</td><td style="${parseInt(s) > 300 || s.includes("MB") ? "color:#dc2626;font-weight:700" : ""}">${s}</td><td><div style="position:relative;height:14px"><span style="position:absolute;left:${x}px;width:${w}px;height:14px;border-radius:4px;background:${c}"></span></div></td></tr>`).join("")}</table>
      <div class="row" style="gap:24px;padding:14px 22px;font-size:15px;color:#475569"><b>38 requests</b><span>4.9 MB transferred</span><span style="color:#dc2626;font-weight:700">Load: 6.8 s</span></div>
    </div>`, MAINW)}
    ${float(`<div class="lab">Third-party code</div><div class="big" style="color:#dc2626">72%</div><div class="muted sm">of the page weight</div>`, "right:56px;bottom:60px;width:240px")}`],

  "google-november-2026-core-update": ["c", `
    ${appwin("Search Console · Performance", `<div class="app">${gscSide("Performance")}<div class="main">
      <h1 class="h">Search results</h1><div class="muted sm" style="margin-bottom:18px">Last 3 months · Web</div>
      <div class="grid4" style="margin-bottom:20px">${[["Total clicks", "2.41K", "#1f55ff"], ["Impressions", "88.6K", "#7c3aed"], ["Average CTR", "2.7%", "#0d9488"], ["Position", "14.2", "#ea580c"]].map(([l, v, c]) => `<div style="background:${c};color:#fff;border-radius:12px;padding:14px 16px"><div style="font-size:13px;opacity:.85">${l}</div><div style="font-size:28px;font-weight:700">${v}</div></div>`).join("")}</div>
      <div class="card" style="padding:22px 18px">${chart([40, 44, 42, 47, 45, 50, 48, 52, 50, 38, 33, 41, 49, 55, 58, 61], 700, 400, { mark: { i: 9, text: "Nov 2026 core update", w: 200, color: "#ea580c" } })}</div>
    </div></div>`, MAINW)}`],

  "hipaa-website-hosting": ["c", `
    ${browser("riverbendclinic.com/new-patient", `<div style="display:flex;height:100%">
      <div class="photo" style="width:42%;background-image:url('${PHOTO("medical/hero.webp")}')"></div>
      <div style="flex:1;padding:34px 38px"><div style="font-size:30px;font-weight:700;margin-bottom:6px">New patient intake</div><div class="muted md" style="margin-bottom:22px">Step 2 of 3 · Medical history</div>
      ${["Full name", "Date of birth", "Current medications", "Insurance provider"].map((l) => `<div style="margin-bottom:16px"><div class="lab" style="margin-bottom:6px">${l}</div><div class="sel" style="height:46px"></div></div>`).join("")}
      <span class="btn" style="width:100%">Continue securely</span></div></div>`, MAIN)}
    ${float(`<div class="row" style="gap:12px;margin-bottom:10px"><span style="width:44px;height:44px;border-radius:12px;background:#e0eaff;display:inline-flex;align-items:center;justify-content:center"><svg width="22" height="22" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" fill="#1f55ff"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="#1f55ff" stroke-width="1.6"/></svg></span><div style="font-weight:700;font-size:19px">Patient data</div></div>${checklist([["Encrypted in transit (TLS)", 1], ["Encrypted at rest", 1], ["BAA signed with host", 1], ["Access logs kept", 1]])}`, "right:44px;top:270px;width:340px")}`],

  "hosting-for-bootstrapped-startups": ["b", `
    ${appwin("Billing & usage", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Client area`, ["Dashboard", "Services", "Usage", "Invoices", "Support"], "Usage")}<div class="main gray">
      <h1 class="h">This month</h1><div class="muted sm" style="margin-bottom:18px">Plan: Starter · billed monthly</div>
      <div class="grid3" style="margin-bottom:18px">${[["Monthly cost", "$9.99"], ["Visitors", "3,180"], ["Headroom left", "71%"]].map(([l, v]) => `<div class="card"><div class="lab">${l}</div><div class="kpi">${v}</div></div>`).join("")}</div>
      <div class="card">${[["CPU", 22], ["Memory", 38], ["Storage", 14], ["Bandwidth", 29]].map(([l, p]) => `<div style="margin-bottom:16px"><div class="row between md" style="margin-bottom:8px"><span>${l}</span><b>${p}%</b></div><div style="height:12px;border-radius:6px;background:#eef1f6"><div style="width:${p}%;height:100%;border-radius:6px;background:#1f55ff"></div></div></div>`).join("")}</div>
    </div></div>`, MAIN)}
    ${float(`<div class="row" style="gap:12px">${TICK}<div><div style="font-weight:700;font-size:18px">No upgrade needed yet</div><div class="muted sm">Scale up when traffic does</div></div></div>`, "right:48px;top:200px")}`],

  "how-ai-is-helping-small-businesses": ["e", `
    ${appwin("Today · Salon Rosa", `<div class="app"><div class="photo" style="width:330px;background-image:url('${PHOTO("salon/hero.webp")}')"></div><div class="main">
      <h1 class="h">Handled by AI today</h1><div class="muted sm" style="margin-bottom:16px">You approved 3, it did 14 on its own</div>
      ${[["Answered 9 website chats", "Prices, hours, parking", "ok", "Done"], ["Booked 4 appointments", "Synced to your calendar", "ok", "Done"], ["Drafted reply to a review", "Waiting for your OK", "warn", "Review"], ["Sent 12 reminder texts", "For tomorrow's clients", "ok", "Done"], ["Flagged a refund request", "Needs a person", "info", "You"]].map(([t, s, c, l]) => `<div class="row between" style="padding:15px 0;border-bottom:1px solid #eef1f6"><div><div style="font-weight:600;font-size:18px">${t}</div><div class="muted sm">${s}</div></div><span class="pill ${c}">${l}</span></div>`).join("")}
    </div></div>`, MAINW)}`],

  "how-long-does-a-domain-transfer-take": ["d", `
    ${appwin("Domain transfer · yourbrand.com", `<div style="padding:34px 40px">
      <div class="row between" style="margin-bottom:28px"><div><div class="lab">TRANSFERRING</div><div style="font-size:36px;font-weight:700">yourbrand.com</div></div><span class="pill info" style="font-size:16px">Day 3 of 5–7</span></div>
      ${[["Domain unlocked at old registrar", "Done · Mon", 1], ["Authorization (EPP) code entered", "Done · Mon", 1], ["Transfer approved by email", "Done · Tue", 1], ["Old registrar releases the domain", "Up to 5 days, or approve it now", 0], ["Transfer complete, +1 year added", "", 0]].map(([t, s, d], i) => `<div class="row" style="gap:18px;align-items:flex-start;padding-bottom:22px;position:relative">${d ? TICK : i === 3 ? '<span style="width:24px;height:24px;border-radius:50%;border:3px solid #1f55ff;background:#e0eaff;flex:none"></span>' : RING}<div><div style="font-size:19px;font-weight:${d || i === 3 ? 600 : 400};${!d && i !== 3 ? "color:#94a3b8" : ""}">${t}</div><div class="muted sm">${s}</div></div></div>`).join("")}
      <div style="height:12px;border-radius:6px;background:#eef1f6;margin-top:6px"><div style="width:60%;height:100%;border-radius:6px;background:#1f55ff"></div></div>
    </div>`, "left:64px;top:84px;width:760px;height:760px")}
    ${float(`<div class="lab">Typical .com transfer</div><div class="big">5–7 days</div><div class="muted sm">Your site stays online the whole time</div>`, "right:56px;top:260px;width:300px")}`],

  "how-much-hosting-do-you-need": ["a", `
    ${appwin("Resource usage", `<div class="app">${cpSide("Metrics")}<div class="main gray">
      <h1 class="h">Resource usage</h1><div class="muted sm" style="margin-bottom:18px">Last 30 days</div>
      <div class="grid2" style="margin-bottom:16px">${[["Disk space", "3.2 GB", "of 50 GB", 6], ["Monthly visits", "8,400", "comfortable", 30], ["Databases", "2", "of unlimited", 4], ["Inodes", "41,200", "of 250,000", 16]].map(([l, v, o, p]) => `<div class="card"><div class="lab">${l}</div><div class="row" style="gap:8px;align-items:baseline"><span class="kpi">${v}</span><span class="muted sm">${o}</span></div><div style="height:10px;border-radius:5px;background:#eef1f6;margin-top:10px"><div style="width:${p}%;height:100%;border-radius:5px;background:#1f55ff"></div></div></div>`).join("")}</div>
      <div class="card"><div class="row between" style="margin-bottom:10px"><b>CPU</b><span class="muted sm">peak 34%</span></div>${chart([12, 18, 15, 22, 30, 19, 14, 25, 34, 21, 16, 20, 18], 560, 110)}</div>
    </div></div>`, MAINW)}`],

  "how-to-build-a-strong-online-presence": ["b", `
    ${browser("greenleaflandscaping.com", site("Greenleaf Landscaping", "landscaping/hero.webp", "Yards you'll want to spend time in", "Design, planting and weekly care across the county.", "Free estimate"), "left:48px;top:84px;width:780px;height:600px")}
    ${float(`<div class="row" style="gap:12px;margin-bottom:14px"><span class="photo" style="width:56px;height:56px;border-radius:12px;background-image:url('${PHOTO("landscaping/photo-1.webp")}')"></span><div><div style="font-weight:700;font-size:19px">Greenleaf Landscaping</div><div class="muted sm">Landscaper · Open until 6 pm</div></div></div>
      <div class="grid3" style="gap:8px">${["Website", "Call", "Directions"].map((b) => `<span class="btn ghost" style="height:40px;font-size:15px;padding:0">${b}</span>`).join("")}</div>`, "right:40px;top:120px;width:380px")}
    ${float(`<div class="row" style="gap:12px"><span class="photo" style="width:96px;height:96px;border-radius:12px;background-image:url('${PHOTO("landscaping/photo-2.webp")}')"></span><div><div style="font-weight:700;font-size:17px">New post</div><div class="muted sm" style="width:200px">Spring cleanup slots are open for March.</div></div></div>`, "right:80px;top:420px;width:360px")}
    ${float(`<div class="row" style="gap:10px">${TICK}<b style="font-size:17px">New estimate request</b></div>`, "left:120px;bottom:48px;padding:16px 20px")}`],

  "is-my-website-down": ["c", `
    ${appwin("Uptime monitor", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#22c55e"></span>Monitor`, ["Monitors", "Incidents", "Status page", "Alerts"], "Monitors")}<div class="main">
      <div class="row between" style="margin-bottom:18px"><div><h1 class="h">yourbrand.com</h1><div class="muted sm">HTTPS · checked every minute</div></div><span class="pill bad" style="font-size:17px;padding:8px 16px">● Down · 503</span></div>
      <div class="row" style="gap:3px;margin-bottom:22px">${Array.from({ length: 60 }, (_, i) => `<span style="flex:1;height:44px;border-radius:3px;background:${i > 50 && i < 56 ? "#ef4444" : i === 30 ? "#f59e0b" : "#22c55e"}"></span>`).join("")}</div>
      <div class="card" style="margin-bottom:16px"><div class="row between" style="margin-bottom:8px"><b>Response time</b><span class="muted sm">ms</span></div>${chart([30, 28, 33, 31, 29, 35, 32, 30, 34, 90, 0, 0, 0, 0], 560, 140, { color: "#1f55ff" })}</div>
      <div class="card row between" style="background:#fff5f5;border-color:#fecaca"><div><b>Incident started 9:41 AM</b><div class="muted sm">Service Unavailable from 3 of 3 locations</div></div><span class="btn" style="background:#dc2626">Alert sent</span></div>
    </div></div>`, MAINW)}`],

  "keep-control-of-your-domain": ["a", `
    ${appwin("Registrar · My domains", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Domains`, ["My domains", "DNS", "Contacts", "Security", "Billing"], "My domains", true)}<div class="main">
      <h1 class="h">yourbrand.com</h1><div class="muted sm" style="margin-bottom:20px">Registered in your name · expires Mar 14, 2028</div>
      ${[["Registrant (owner)", "You · you@yourbrand.com"], ["Auto-renew", "On"], ["Transfer lock", "On"], ["Two-factor login", "On"], ["Recovery email", "Not the web designer's"]].map(([l, v]) => `<div class="row between" style="padding:16px 0;border-bottom:1px solid #eef1f6;font-size:18px"><span>${l}</span><span class="row" style="gap:10px"><b>${v}</b>${TICK}</span></div>`).join("")}
    </div></div>`, MAIN)}
    ${float(`<div class="row" style="gap:14px"><span style="width:52px;height:52px;border-radius:14px;background:#dcfce7;display:inline-flex;align-items:center;justify-content:center"><svg width="26" height="26" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 13.5 4v4c0 3.2-2.4 5.6-5.5 6.5C4.9 13.6 2.5 11.2 2.5 8V4z" fill="#16a34a"/><path d="m5.5 8 2 2 3-3.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div><div style="font-weight:700;font-size:19px">You're in control</div><div class="muted sm">5 of 5 checks passed</div></div></div>`, "right:48px;top:220px")}`],

  "online-store-pre-launch-checklist": ["e", `
    ${appwin("Store admin · Launch", `<div class="app">${storeSide("Home")}<div class="main gray">
      <div class="row between"><h1 class="h">Ready to launch?</h1><span class="pill warn">7 of 9 done</span></div>
      <div class="grid2" style="margin-top:18px">
        <div class="card">${checklist([["Test order paid & refunded", 1], ["Shipping rates by zone", 1], ["Sales tax set up", 1], ["Refund & privacy pages", 1], ["Order emails tested", 1]])}</div>
        <div class="card">${checklist([["Mobile checkout tested", 1], ["Backups on", 1], ["Abandoned cart email", 0], ["Remove password page", 0]])}</div>
      </div>
      <div class="grid3" style="margin-top:16px">${[["service-business/photo-1.webp", "Gift box", "$34"], ["artist/photo-2.webp", "Art print", "$48"], ["salon/photo-3.webp", "Care kit", "$26"]].map(([p, n, v]) => `<div class="card" style="padding:12px"><div class="photo" style="height:90px;border-radius:10px;background-image:url('${PHOTO(p)}')"></div><div class="row between md" style="margin-top:8px"><span>${n}</span><b>${v}</b></div></div>`).join("")}</div>
    </div></div>`, MAINW)}`],

  "php-8-2-end-of-life-update-php-version": ["c", `
    ${appwin("Control panel · MultiPHP Manager", `<div class="app">${cpSide("Software")}<div class="main">
      <h1 class="h">MultiPHP Manager</h1><div class="muted sm" style="margin-bottom:20px">Choose the PHP version for each domain</div>
      <table class="t"><tr><th></th><th>Domain</th><th>PHP version</th><th>Status</th></tr>
      ${[["yourbrand.com", "PHP 8.2", "bad", "Ends Dec 31, 2026", true], ["shop.yourbrand.com", "PHP 8.2", "bad", "Ends Dec 31, 2026", false], ["blog.yourbrand.com", "PHP 8.4", "ok", "Supported", false]].map(([d, v, c, s, on]) => `<tr><td><span style="display:inline-flex;width:22px;height:22px;border-radius:5px;border:2px solid ${on ? "#1f55ff" : "#cbd5e1"};background:${on ? "#1f55ff" : "#fff"}"></span></td><td>${d}</td><td><b>${v}</b></td><td><span class="pill ${c}">${s}</span></td></tr>`).join("")}</table>
      <div class="row" style="gap:12px;margin-top:22px;position:relative"><span class="md">Set selected to</span><div class="sel" style="width:200px"><b>PHP 8.3</b><span>▾</span></div><span class="btn">Apply</span>
        <div style="position:absolute;left:142px;top:46px;width:200px;background:#fff;border:1px solid #d6dbe6;border-radius:10px;box-shadow:0 12px 30px rgba(15,23,42,.15);overflow:hidden;font-size:16px">${["PHP 8.2", "PHP 8.3", "PHP 8.4", "PHP 8.5"].map((v) => `<div style="padding:10px 14px;${v === "PHP 8.3" ? "background:#1f55ff;color:#fff;font-weight:600" : ""}">${v}</div>`).join("")}</div></div>
    </div></div>`, MAINW)}
    ${float(`<div class="lab">PHP 8.2 security support</div><div class="big" style="color:#dc2626">Dec 31, 2026</div><div class="muted sm">Move to 8.3 or newer</div>`, "right:40px;bottom:50px;width:400px")}`],

  "prepare-online-store-for-holiday-traffic": ["e", `
    ${appwin("Store analytics · Live", `<div class="app">${storeSide("Analytics")}<div class="main">
      <div class="row between"><h1 class="h">Cyber Monday</h1><span class="pill ok">● Live</span></div>
      <div class="grid3" style="margin:16px 0 18px">${[["Visitors now", "1,284"], ["Orders / min", "17"], ["Page load", "0.9 s"]].map(([l, v]) => `<div class="card"><div class="lab">${l}</div><div class="kpi">${v}</div></div>`).join("")}</div>
      <div class="card">${chart([10, 12, 11, 14, 13, 18, 30, 55, 72, 88, 80, 92, 85], 580, 240, { color: "#16a34a", mark: { i: 6, text: "Sale email sent", w: 160, color: "#1f55ff" } })}</div>
    </div></div>`, MAINW)}
    ${float(`<div class="lab">Served from cache</div><div class="big" style="color:#16a34a">94%</div>`, "right:40px;bottom:46px;width:220px")}`],

  "website-accessibility-checklist": ["b", `
    ${browser("harborlaw.com", site("Harbor Law", "lawyer/hero.webp", "Straight answers when it matters", "Family, estate and small business law.", "Free consult"), "left:48px;top:84px;width:760px;height:640px")}
    ${float(`<div class="row between" style="margin-bottom:6px"><b style="font-size:20px">Accessibility check</b><span class="pill warn">3 issues</span></div>${checklist([["Text contrast 7.1:1", 1], ["Keyboard focus visible", 1], ["Form fields labelled", 1], ["2 images missing alt text", 2], ["Heading skips h2 → h4", 2], ["Link says \"click here\"", 2]])}`, "right:40px;top:110px;width:400px")}`],

  "website-migration-cost": ["d", `
    ${appwin("Website migration", `<div style="padding:34px 40px">
      <div class="row between" style="margin-bottom:24px"><div><div class="lab">MOVING</div><div style="font-size:32px;font-weight:700">yourbrand.com → new host</div></div><span class="pill info" style="font-size:16px">In progress</span></div>
      ${[["Files", "2.1 GB", 100], ["Database", "184 MB", 100], ["Email accounts", "6 mailboxes", 68], ["SSL certificate", "issue after DNS", 0]].map(([l, s, p]) => `<div style="margin-bottom:20px"><div class="row between md" style="margin-bottom:8px"><span class="row" style="gap:10px">${p === 100 ? TICK : RING}${l}</span><span class="muted">${s}</span></div><div style="height:12px;border-radius:6px;background:#eef1f6"><div style="width:${p}%;height:100%;border-radius:6px;background:${p === 100 ? "#16a34a" : "#1f55ff"}"></div></div></div>`).join("")}
      <div class="mono" style="margin-top:8px;background:#0f172a;color:#a5b4fc;border-radius:12px;padding:18px 20px;font-size:14px;line-height:1.8">✓ rsync public_html/ … 14,212 files<br>✓ mysqldump wp_main … 184 MB<br>✓ search-replace old URLs … 0 left<br>→ imapsync info@yourbrand.com … 68%</div>
    </div>`, "left:64px;top:84px;width:760px;height:760px")}
    ${float(`<div style="font-weight:700;font-size:19px;margin-bottom:12px">What it usually costs</div>${[["Do it yourself", "Your time"], ["Freelancer", "$100–$500"], ["Serverlys", "Free"]].map(([l, v], i) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid #eef1f6;font-size:18px"><span>${l}</span><b style="${i === 2 ? "color:#16a34a" : ""}">${v}</b></div>`).join("")}`, "right:40px;top:230px;width:330px")}`],

  "website-not-secure-warning": ["c", `
    ${browser("yourbrand.com", `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fafafa;padding:40px">
      <div style="width:72px;height:72px;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin-bottom:22px"><svg width="36" height="36" viewBox="0 0 16 16"><path d="M8 1.5 15 14H1z" fill="#d93025"/><path d="M8 6v3.5M8 11.5v.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg></div>
      <div style="font-size:30px;font-weight:700;margin-bottom:10px">Your connection is not private</div>
      <div class="muted md" style="max-width:520px;text-align:center;line-height:1.5">Attackers might be trying to steal your information from yourbrand.com (for example, passwords, messages or credit cards).</div>
      <div class="row" style="gap:12px;margin-top:26px"><span class="btn ghost">Advanced</span><span class="btn">Back to safety</span></div></div>`, "left:48px;top:84px;width:800px;height:600px", { secure: false })}
    ${float(`<div class="lab" style="margin-bottom:10px">AFTER SSL IS ON</div><div class="url" style="margin:0;max-width:none;height:46px;font-size:18px"><svg viewBox="0 0 16 16" fill="none" width="16"><rect x="3" y="7" width="10" height="7" rx="2" fill="#16a34a"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="#16a34a" stroke-width="1.6"/></svg>https://yourbrand.com</div><div class="row sm" style="gap:8px;margin-top:12px;color:#15803d">${TICK}<b>Certificate valid · auto-renews</b></div>`, "right:40px;bottom:70px;width:420px")}`],

  "website-not-showing-on-google": ["a", `
    ${appwin("Search Console · URL inspection", `<div class="app">${gscSide("URL inspection")}<div class="main">
      <div class="sel" style="height:48px;font-size:17px;margin-bottom:22px">🔍&nbsp; https://yourbrand.com/services</div>
      <div class="card" style="border-left:6px solid #f59e0b;margin-bottom:16px"><div class="row" style="gap:14px"><span style="width:40px;height:40px;border-radius:50%;background:#fef3c7;display:inline-flex;align-items:center;justify-content:center;color:#b45309;font-weight:800;font-size:22px">i</span><div><div style="font-size:22px;font-weight:700">URL is not on Google</div><div class="muted md">Discovered – currently not indexed</div></div></div></div>
      ${[["Sitemap", "Not submitted", "bad"], ["Referring page", "None detected", "warn"], ["Crawl allowed?", "Yes", "ok"], ["Page fetch", "Successful", "ok"]].map(([l, v, c]) => `<div class="row between" style="padding:14px 4px;border-bottom:1px solid #eef1f6;font-size:18px"><span>${l}</span><span class="pill ${c}">${v}</span></div>`).join("")}
      <div class="row" style="margin-top:20px;gap:12px"><span class="btn">Request indexing</span><span class="btn ghost">Test live URL</span></div>
    </div></div>`, MAINW)}`],

  "what-fully-managed-hosting-includes": ["a", `
    ${appwin("Managed hosting · Activity", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Managed`, ["Overview", "Activity", "Backups", "Security", "Support"], "Activity")}<div class="main gray">
      <div class="row between"><h1 class="h">Done for you this week</h1><span class="pill ok">All healthy</span></div>
      <div class="card" style="margin-top:16px">${[["Security patches applied", "OS + PHP + web server", "Mon 3:00 AM"], ["Daily backup verified", "Restore test passed", "Every day"], ["Firewall blocked 1,942 requests", "Brute-force + bad bots", "This week"], ["SSL certificate renewed", "yourbrand.com", "Wed"], ["Uptime 100%", "Checked every minute", "7 days"], ["Slow query fixed", "Checkout page 2.1 s → 0.6 s", "Thu"]].map(([t, s, w]) => `<div class="row between" style="padding:13px 0;border-bottom:1px solid #eef1f6"><div class="row" style="gap:14px">${TICK}<div><div style="font-weight:600;font-size:18px">${t}</div><div class="muted sm">${s}</div></div></div><span class="muted sm">${w}</span></div>`).join("")}</div>
    </div></div>`, MAINW)}`],

  "what-happens-if-you-stop-paying-for-web-hosting": ["c", `
    ${browser("yourbrand.com", `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f8fafc;padding:40px;text-align:center">
      <div style="width:78px;height:78px;border-radius:20px;background:#fee2e2;display:flex;align-items:center;justify-content:center;margin-bottom:22px"><svg width="38" height="38" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#dc2626" stroke-width="2.2"/><path d="M6 6l12 12" stroke="#dc2626" stroke-width="2.2"/></svg></div>
      <div style="font-size:36px;font-weight:700;margin-bottom:10px">Account Suspended</div>
      <div class="muted md" style="max-width:480px;line-height:1.5">This account has been suspended. If you are the owner, please contact your hosting provider.</div></div>`, "left:48px;top:84px;width:760px;height:620px")}
    ${float(`<div class="row between" style="margin-bottom:12px"><b style="font-size:20px">Invoice #4821</b><span class="pill bad">Overdue 6 days</span></div>${[["Web hosting · 12 months", "$119.88"], ["Due date", "Nov 19"], ["Status", "Service suspended"]].map(([l, v]) => `<div class="row between" style="padding:11px 0;border-bottom:1px solid #eef1f6;font-size:17px"><span class="muted">${l}</span><b>${v}</b></div>`).join("")}<span class="btn" style="width:100%;margin-top:16px">Pay now to restore</span>`, "right:40px;top:200px;width:390px")}`],

  "what-is-web-hosting": ["b", `
    ${browser("rosasalon.com", site("Rosa Salon", "salon/hero.webp", "Cut, color and calm", "Walk-ins welcome Tuesday to Saturday.", "Book online"), "left:48px;top:84px;width:740px;height:560px")}
    ${float(`<div class="row" style="gap:14px;margin-bottom:16px"><span style="width:52px;height:52px;border-radius:14px;background:#0f1b3d;display:inline-flex;flex-direction:column;justify-content:center;gap:5px;padding:0 10px">${'<span style="height:6px;border-radius:3px;background:#5f8bff"></span>'.repeat(3)}</span><div><div style="font-weight:700;font-size:19px">Your web server</div><div class="row sm" style="gap:6px;color:#16a34a"><span style="width:8px;height:8px;border-radius:50%;background:#16a34a"></span>Online 24/7</div></div></div>
      ${[["Website files", "1.4 GB"], ["Database", "96 MB"], ["Email · 4 mailboxes", "2.2 GB"], ["SSL certificate", "Active"]].map(([l, v]) => `<div class="row between" style="padding:11px 0;border-bottom:1px solid #eef1f6;font-size:17px"><span>${l}</span><b>${v}</b></div>`).join("")}`, "right:40px;top:240px;width:380px")}`],

  "where-is-my-domain-registered": ["d", `
    ${browser("serverlys.com/whois-lookup", `<div style="padding:30px 36px">
      <div class="row" style="gap:12px;margin-bottom:24px"><div class="sel" style="flex:1;height:50px;font-size:19px">yourbrand.com</div><span class="btn" style="height:50px">Look up</span></div>
      <div class="card"><div class="row between" style="margin-bottom:12px"><div style="font-size:26px;font-weight:700">yourbrand.com</div><span class="pill ok">Registered</span></div>
      ${[["Registrar", "Example Registrar, LLC"], ["Created", "Mar 14, 2019"], ["Expires", "Mar 14, 2028"], ["Status", "clientTransferProhibited"], ["Name servers", "ns1 / ns2.serverlys.com"], ["DNSSEC", "unsigned"], ["Updated", "Mar 02, 2025"]].map(([l, v], i) => `<div class="row between" style="padding:14px 0;border-bottom:1px solid #eef1f6;font-size:18px;${i === 0 ? "background:#fffbeb;margin:0 -22px;padding:14px 22px" : ""}"><span class="muted">${l}</span><b class="${i > 2 ? "mono" : ""}" style="${i > 2 ? "font-size:15px" : ""}">${v}</b></div>`).join("")}</div>
    </div>`, "left:64px;top:84px;width:760px;height:760px")}
    ${float(`<div class="lab">Your domain is registered with</div><div style="font-size:26px;font-weight:700;margin-top:6px">Example Registrar</div><div class="muted sm" style="margin-top:4px">Log in there to renew or transfer</div>`, "right:40px;top:250px;width:320px")}`],

  "who-has-access-to-your-website": ["c", `
    ${appwin("WordPress · Users", `<div class="app">${wpSide("Users")}<div class="main">
      <div class="row between" style="margin-bottom:16px"><h1 class="h">Users</h1><span class="btn" style="height:40px">Add new</span></div>
      <table class="t"><tr><th>Name</th><th>Role</th><th>Last login</th><th></th></tr>
      ${[["You (owner)", "Administrator", "Today", ""], ["Office manager", "Editor", "Yesterday", ""], ["Old web designer", "Administrator", "14 months ago", "bad"], ["seo-agency-2021", "Administrator", "3 years ago", "bad"], ["Blog writer", "Author", "Last week", ""]].map(([n, r, l, b]) => `<tr style="${b ? "background:#fff5f5" : ""}"><td class="row" style="gap:12px;border:0"><span style="width:36px;height:36px;border-radius:50%;background:${b ? "#fecaca" : "#e0eaff"}"></span><b>${n}</b></td><td>${r}</td><td class="${b ? "" : "muted"}" style="${b ? "color:#b91c1c;font-weight:600" : ""}">${l}</td><td>${b ? '<span class="pill bad">Remove</span>' : ""}</td></tr>`).join("")}</table>
    </div></div>`, MAINW)}`],

  "why-are-my-emails-going-to-spam": ["a", `
    ${appwin("Mail — Spam", `<div class="app">${inboxSide("Spam")}<div class="main" style="padding:0">
      <div style="padding:16px 26px;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:16px;color:#92400e"><b>Why is this message in spam?</b> It failed authentication checks for yourbrand.com.</div>
      ${[["Your Brand", "Your quote for the kitchen remodel", 1], ["Your Brand", "Invoice #2041 from Your Brand", 1], ["Prize Center", "You have (1) pending reward", 0], ["Your Brand", "Appointment confirmed for Friday", 1], ["Your Brand", "Thanks for your order #1187", 1], ["Deals Daily", "Last chance: 90% off", 0]].map(([f, s, ours]) => `<div style="padding:18px 26px;border-bottom:1px solid #eef1f6;${ours ? "" : "opacity:.55"}"><div class="row between"><b style="font-size:18px">${f}</b>${ours ? '<span class="pill bad">SPF ✕</span>' : ""}</div><div style="font-size:17px;margin-top:4px">${s}</div></div>`).join("")}
    </div></div>`, MAIN)}
    ${float(`<div style="font-weight:700;font-size:19px;margin-bottom:6px">Message headers</div>${[["SPF", "fail", "bad"], ["DKIM", "none", "warn"], ["DMARC", "fail", "bad"]].map(([l, v, c]) => `<div class="row between" style="padding:12px 0;border-bottom:1px solid #eef1f6"><span class="mono" style="font-size:17px">${l}</span><span class="pill ${c}">${v}</span></div>`).join("")}<div class="muted sm" style="margin-top:12px">Fix: add the 3 DNS records</div>`, "right:44px;top:440px;width:300px")}`],

  "why-your-business-needs-a-website": ["e", `
    ${browser("summitroofing.com", site("Summit Roofing", "roofing/hero.webp", "Roof repairs done right, the first time", "Licensed and insured. Free inspections within 48 hours.", "Get a quote"), "left:48px;top:84px;width:800px;height:620px")}
    ${float(`<div style="width:240px;height:470px;border-radius:34px;border:8px solid #0f172a;overflow:hidden;background:#fff;display:flex;flex-direction:column"><div class="photo" style="height:210px;background-image:url('${PHOTO("roofing/photo-1.webp")}')"></div><div style="padding:16px"><div style="font-weight:700;font-size:19px;line-height:1.2">Roof repairs done right</div><div class="muted sm" style="margin:8px 0 14px">Free inspections in 48 h</div><span class="btn" style="width:100%;height:40px;font-size:15px">Call now</span><span class="btn ghost" style="width:100%;height:40px;font-size:15px;margin-top:8px">Get a quote</span></div></div>`, "right:70px;top:150px;padding:0;border-radius:34px;background:transparent")}
    ${float(`<div class="row" style="gap:12px">${TICK}<div><div style="font-weight:700;font-size:17px">New quote request</div><div class="muted sm">From Google search · 2 min ago</div></div></div>`, "left:340px;bottom:40px;padding:16px 20px")}`],

  "wordpress-7-1-5-security-update": ["a", `
    ${appwin("WordPress · Updates", `<div class="app">${wpSide("Updates")}<div class="main">
      <h1 class="h">WordPress Updates</h1><div class="muted sm" style="margin-bottom:20px">Last checked today at 9:41 am</div>
      <div class="card" style="border-left:6px solid #dc2626;margin-bottom:18px"><div class="row between"><div><div class="row" style="gap:10px"><span class="pill bad">Security release</span></div><div style="font-size:24px;font-weight:700;margin:10px 0 4px">WordPress 7.1.5 is available</div><div class="muted md">You're running 7.1.4. Back up first, then update.</div></div><span class="btn">Update now</span></div></div>
      <div style="font-weight:700;font-size:19px;margin:6px 0 8px">Plugins</div>
      ${[["Contact Form", "6.2 → 6.3"], ["SEO Toolkit", "24.1 → 24.2"], ["Backup Pro", "3.0.8 → 3.0.9"]].map(([n, v]) => `<div class="row between" style="padding:13px 0;border-bottom:1px solid #eef1f6;font-size:18px"><span class="row" style="gap:12px"><span style="display:inline-flex;width:22px;height:22px;border-radius:5px;background:#1f55ff"></span>${n}</span><span class="muted">${v}</span></div>`).join("")}
      <div style="font-weight:700;font-size:19px;margin:22px 0 8px">Themes</div><div class="row between" style="padding:13px 0;border-bottom:1px solid #eef1f6;font-size:18px"><span class="row" style="gap:12px"><span class="photo" style="width:56px;height:36px;border-radius:6px;background-image:url('${PHOTO("architect/hero.webp")}')"></span>Studio Theme</span><span class="pill ok">Up to date</span></div>
    </div></div>`, MAINW)}`],

  "wordpress-hosting-vs-web-hosting": ["b", `
    ${float(`<div class="lab">WEB HOSTING</div><div style="font-size:30px;font-weight:700;margin:6px 0 16px">Any website</div>${checklist([["Any PHP app or HTML site", 1], ["cPanel + email", 1], ["Daily backups", 1], ["WordPress tuned cache", 0], ["Auto WordPress updates", 0], ["Staging in one click", 0]])}`, "left:110px;top:120px;width:450px;padding:30px")}
    ${float(`<div class="row between"><div class="lab" style="color:#1f55ff">WORDPRESS HOSTING</div><span class="pill info">For WP sites</span></div><div style="font-size:30px;font-weight:700;margin:6px 0 16px">WordPress only</div>${checklist([["WordPress pre-installed", 1], ["cPanel + email", 1], ["Daily backups", 1], ["WordPress tuned cache", 1], ["Auto WordPress updates", 1], ["Staging in one click", 1]])}`, "left:620px;top:90px;width:470px;padding:30px;box-shadow:0 0 0 4px #1f55ff,0 30px 60px -15px rgba(2,8,40,.5)")}`],

  "wordpress-maintenance-routine": ["d", `
    ${appwin("Maintenance · yourbrand.com", `<div class="app">${wpSide("Tools")}<div class="main gray">
      <div class="row between"><h1 class="h">Maintenance routine</h1><span class="pill ok">On track</span></div>
      <div class="grid3" style="margin-top:16px">${[["Weekly", [["Update plugins", 1], ["Check backups", 1], ["Test contact form", 1]]], ["Monthly", [["Review users", 1], ["Fix broken links", 1], ["Speed test", 0]]], ["Yearly", [["PHP version", 0], ["Renew domain", 1], ["Review plugins", 0]]]].map(([t, items]) => `<div class="card"><div style="font-weight:700;font-size:19px;margin-bottom:4px">${t}</div>${checklist(items)}</div>`).join("")}</div>
      <div class="card" style="margin-top:16px"><div class="row between" style="margin-bottom:8px"><b>Uptime last 30 days</b><b style="color:#16a34a">99.98%</b></div><div class="row" style="gap:3px">${Array.from({ length: 30 }, (_, i) => `<span style="flex:1;height:34px;border-radius:3px;background:${i === 17 ? "#f59e0b" : "#22c55e"}"></span>`).join("")}</div></div>
    </div></div>`, MAINW)}`],

  "write-the-answers-your-ai-assistant-gives": ["e", `
    ${appwin("AI assistant · Knowledge", `<div class="app">${side(`<span style="width:30px;height:30px;border-radius:8px;background:#1f55ff"></span>Assistant`, ["Inbox", "Knowledge", "Tone", "Handoff", "Reports"], "Knowledge")}<div class="main">
      <div class="row between"><h1 class="h">Answers</h1><span class="btn" style="height:40px">+ New answer</span></div>
      <div class="card" style="margin-top:14px;border-color:#1f55ff;box-shadow:0 0 0 3px #e0eaff"><div class="lab">QUESTION</div><div style="font-size:21px;font-weight:700;margin:4px 0 12px">Do you offer same-day service?</div><div class="lab">ANSWER</div><div class="md" style="line-height:1.5;margin-top:4px">Yes, for calls before 11 am, Monday to Friday. After that we book the next morning. Emergency leaks: call (555) 010-2040.</div></div>
      ${["What areas do you cover?", "Do you give free estimates?", "Are you licensed and insured?"].map((q) => `<div class="row between" style="padding:15px 0;border-bottom:1px solid #eef1f6;font-size:18px"><span>${q}</span><span class="pill ok">Live</span></div>`).join("")}
    </div></div>`, "left:64px;top:84px;width:780px;height:760px")}
    ${float(`<div class="lab" style="margin-bottom:10px">PREVIEW</div><div style="display:flex;flex-direction:column;gap:10px"><div class="bubble me">Can someone come today?</div><div class="bubble bot">Yes, if you book before 11 am. Want me to check a time for you?</div></div>`, "right:40px;top:470px;width:340px")}`],
};

export const render = (slug) => {
  const [tone, html] = SCENES[slug];
  return page(tone, html);
};
