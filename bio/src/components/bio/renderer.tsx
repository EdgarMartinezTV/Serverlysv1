import type { CSSProperties, ReactNode } from "react";
import type { Block, BlockOf, PageDoc, Theme } from "@/lib/bio/schema";
import { isLive } from "@/lib/bio/validate";
import { FONT_META, fontVariables } from "@/lib/bio/fonts";
import { contrast, readableOn } from "@/lib/bio/color";
import { qrPath } from "@/lib/bio/qr";
import { resolveEmbed } from "@/lib/bio/embeds";
import {
  hostOf,
  mailtoHref,
  mapsEmbedSrc,
  mapsHref,
  normalizeUrl,
  telHref,
  tiktokId,
  videoSource,
  whatsappHref,
  youtubeId,
} from "@/lib/bio/urls";
import { SOCIAL_LABELS, SOCIAL_PATHS } from "./social-paths";
import { LeadForm } from "./lead-form";
import { PageTracker, SensitiveGate, ShareButton, ShareSheet } from "./islands";

/**
 * The ONE renderer for a bio page. The public route, the editor preview,
 * template previews and the onboarding wizard all render through this, so
 * "what you see in the editor" is literally the production markup.
 *
 * No hooks here — it renders on the server for visitors. Interactive pieces
 * (forms, share, the click tracker) are small client islands. The editor
 * passes `ctx.editor` to add selection wrappers and inline text editing.
 */

export type EditorHooks = {
  wrap: (block: Block, node: ReactNode) => ReactNode;
  /** Inline-editable text. `path` is "profile.name" or "block.<id>.<field>". */
  text: (path: string, value: string, opts?: { multiline?: boolean; placeholder?: string }) => ReactNode;
};

export type RenderCtx = {
  mode: "live" | "preview";
  pageId: string;
  /** Absolute public URL — used for the QR block and Share. */
  pageUrl: string;
  now?: number;
  editor?: EditorHooks;
  /** Absolute URL for reporting this page (live only). */
  reportUrl?: string;
};

/* ── theme → CSS variables ─────────────────────────────────────────────── */

function backgroundCss(t: Theme): string {
  const b = t.background;
  // "avatar": the solid colour sits under the blurred photo (.bio-bg::before).
  if (b.kind === "avatar") return b.color;
  if (b.kind === "gradient") return `linear-gradient(${b.angle}deg, ${b.from}, ${b.to})`;
  if (b.kind === "image" && b.image) return `${b.color} url("${b.image.replace(/"/g, "%22")}")`;
  return b.color;
}

const WIDTHS = { narrow: "480px", normal: "600px", wide: "760px" } as const;
const GAPS = { compact: "10px", normal: "14px", relaxed: "20px" } as const;

export function themeVars(t: Theme, avatar = ""): CSSProperties {
  const cardBtn = contrast(t.button.color, t.card) >= 1.6 ? t.button.color : readableOn(t.card);
  const shadow = t.button.shadow === "sm" ? "0 2px 6px rgb(0 0 0 / .12)" : t.button.shadow === "md" ? "0 10px 24px -10px rgb(0 0 0 / .35)" : "none";
  return {
    "--bio-bg": backgroundCss(t),
    "--bio-overlay": String(t.background.kind === "image" || t.background.kind === "avatar" ? t.background.overlay / 100 : 0),
    "--bio-bg-pos": `center ${t.background.position}`,
    "--bio-bg-img": t.background.kind === "avatar" && avatar ? `url("${avatar.replace(/"/g, "%22")}")` : "none",
    "--bio-text": t.text,
    "--bio-muted": t.muted,
    "--bio-accent": t.accent,
    "--bio-accent-text": readableOn(t.accent),
    "--bio-card": t.card,
    "--bio-card-text": readableOn(t.card),
    "--bio-btn": t.button.color,
    // Buttons INSIDE cards: the theme's button colour unless it would vanish
    // into the card (e.g. white pill buttons on white product cards).
    "--bio-card-btn": cardBtn,
    // Text is always computed from the fill: glass/outline themes often set
    // button text = button colour (both white), which a solid fill can't use.
    "--bio-card-btn-text": contrast(t.button.text, cardBtn) >= 4.5 ? t.button.text : readableOn(cardBtn),
    "--bio-btn-text": t.button.text,
    "--bio-btn-radius": `${t.button.radius}px`,
    "--bio-btn-shadow": shadow,
    "--bio-font-heading": FONT_META[t.headingFont].stack,
    "--bio-font-body": FONT_META[t.bodyFont].stack,
    "--bio-width": WIDTHS[t.layout.width],
    "--bio-gap": GAPS[t.layout.spacing],
    "--bio-align": t.layout.align,
    "--bio-items": t.layout.align === "left" ? "flex-start" : "center",
    "--bio-mobile-scale": String(t.mobile.fontScale),
  } as CSSProperties;
}

/* ── links ──────────────────────────────────────────────────────────────── */

/**
 * Live pages send http(s) and file links through /go/<page>/<block>, which
 * counts the click and redirects to the URL stored in the PUBLISHED page —
 * the redirect can never be pointed anywhere a visitor supplies.
 */
function outHref(ctx: RenderCtx, blockId: string, raw: string, key?: string): string | undefined {
  const isMedia = raw.startsWith("/media/");
  const url = isMedia ? raw : normalizeUrl(raw);
  if (!url) return undefined;
  if (ctx.mode !== "live") return url;
  return `/go/${ctx.pageId}/${blockId}${key ? `?k=${encodeURIComponent(key)}` : ""}`;
}

function relFor(nofollow = false): string {
  return nofollow ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer";
}

function SocialIcon({ platform }: { platform: keyof typeof SOCIAL_PATHS }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bio-btn-icon">
      <path d={SOCIAL_PATHS[platform]} />
    </svg>
  );
}

function socialHref(platform: string, url: string): string | undefined {
  if (platform === "email") return url.includes("@") ? mailtoHref(url.replace(/^mailto:/i, "")) : undefined;
  return normalizeUrl(url) ?? undefined;
}

/* ── text helper: plain in live mode, inline-editable in the editor ───── */

function T({ ctx, path, value, multiline, placeholder }: { ctx: RenderCtx; path: string; value: string; multiline?: boolean; placeholder?: string }) {
  if (ctx.editor) return <>{ctx.editor.text(path, value, { multiline, placeholder })}</>;
  return <>{value}</>;
}

/* ── blocks ─────────────────────────────────────────────────────────────── */

function blockStyleAttrs(b: Block) {
  const s = b.style;
  const vars: Record<string, string> = {};
  if (s.color) vars["--b-color"] = s.color;
  if (s.bg) vars["--b-bg"] = s.bg;
  if (s.radius >= 0) vars["--b-radius"] = `${s.radius}px`;
  if (s.align !== "center") vars["--b-align"] = s.align;
  return {
    style: vars as CSSProperties,
    "data-size": s.size !== "md" ? s.size : undefined,
    "data-weight": s.weight !== "medium" ? s.weight : undefined,
    "data-spacing": s.spacing !== "md" ? s.spacing : undefined,
    "data-width": s.width !== "full" ? s.width : undefined,
    "data-anim": s.animation !== "none" ? s.animation : undefined,
    "data-vis": s.visibility !== "all" ? s.visibility : undefined,
  };
}

function ButtonLink({
  ctx,
  block,
  href,
  title,
  titlePath,
  subtitle,
  subtitlePath,
  thumb,
  icon,
  highlight,
  nofollow,
  track,
  download,
  shareUrl,
}: {
  ctx: RenderCtx;
  block: Block;
  href: string | undefined;
  title: string;
  titlePath: string;
  subtitle?: string;
  subtitlePath?: string;
  thumb?: string;
  icon?: keyof typeof SOCIAL_PATHS | "";
  highlight?: boolean;
  nofollow?: boolean;
  /** Non-http links (mailto/tel/wa.me) are counted by the click tracker. */
  track?: boolean;
  download?: boolean;
  /** Destination for the "⋮" share menu (live pages, http links only). */
  shareUrl?: string;
}) {
  const media = thumb ? <img className="bio-btn-thumb" src={thumb} alt="" loading="lazy" /> : icon ? <SocialIcon platform={icon} /> : null;
  const content = (
    <>
      {media}
      <span className="bio-btn-label">
        <span>
          <T ctx={ctx} path={titlePath} value={title} placeholder="Link title" />
        </span>
        {subtitle || (ctx.editor && subtitlePath && subtitle !== undefined && subtitle !== "") ? (
          <span className="bio-btn-sub">
            <T ctx={ctx} path={subtitlePath ?? ""} value={subtitle ?? ""} />
          </span>
        ) : null}
      </span>
      {media ? <span className="bio-btn-spacer" /> : null}
    </>
  );
  const common = {
    className: "bio-btn",
    "data-highlight": highlight ? "" : undefined,
  };
  if (!href || ctx.editor) {
    // Editor: a link must not navigate away from the editor when clicked.
    return (
      <span {...common} role={ctx.editor ? undefined : "link"} aria-disabled={!href || undefined}>
        {content}
      </span>
    );
  }
  const anchor = (
    <a {...common} href={href} rel={relFor(nofollow)} data-track={track ? block.id : undefined} download={download || undefined} data-more={shareUrl ? "" : undefined}>
      {content}
    </a>
  );
  if (!shareUrl || ctx.mode !== "live") return anchor;
  // A sibling, not a child: a <button> can't live inside an <a>.
  return (
    <div className="bio-linkwrap">
      {anchor}
      <button type="button" className="bio-btn-more" data-share-link={shareUrl} data-share-title={title} aria-label={`Share “${title}”`}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>
    </div>
  );
}

function Img({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  if (!src) return null;
  // Customer images are pre-sized WebP from our pipeline or a template's CDN
  // URL; a plain <img> with lazy loading avoids proxying arbitrary hosts.
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" decoding="async" />;
}

function renderBlock(b: Block, ctx: RenderCtx): ReactNode {
  const p = (field: string) => `block.${b.id}.${field}`;
  switch (b.type) {
    case "heading":
      return b.level === 3 ? (
        <h3 className="bio-heading" data-level="3">
          <T ctx={ctx} path={p("text")} value={b.text} placeholder="Heading" />
        </h3>
      ) : (
        <h2 className="bio-heading">
          <T ctx={ctx} path={p("text")} value={b.text} placeholder="Heading" />
        </h2>
      );
    case "text":
      return (
        <p className="bio-text">
          <T ctx={ctx} path={p("text")} value={b.text} multiline placeholder="Write something…" />
        </p>
      );
    case "link":
      return (
        <ButtonLink
          ctx={ctx}
          block={b}
          href={outHref(ctx, b.id, b.url)}
          title={b.title || (ctx.editor ? "" : hostOf(normalizeUrl(b.url) ?? "") || "Link")}
          titlePath={p("title")}
          subtitle={b.subtitle}
          subtitlePath={p("subtitle")}
          thumb={b.thumbnail}
          icon={b.icon}
          highlight={b.highlight}
          nofollow={b.nofollow}
          shareUrl={normalizeUrl(b.url) ?? undefined}
        />
      );
    case "featured": {
      const href = outHref(ctx, b.id, b.url);
      const inner = (
        <>
          <Img src={b.image} alt="" className="bio-card-img" />
          <div className="bio-card-body">
            <span className="bio-card-title">
              <T ctx={ctx} path={p("title")} value={b.title} placeholder="Featured title" />
            </span>
            {b.description ? (
              <span className="bio-card-text">
                <T ctx={ctx} path={p("description")} value={b.description} multiline />
              </span>
            ) : null}
            {b.cta ? <span className="bio-btn">{b.cta}</span> : null}
          </div>
        </>
      );
      return href && !ctx.editor ? (
        <a className="bio-card bio-featured" href={href} rel={relFor()}>
          {inner}
        </a>
      ) : (
        <div className="bio-card bio-featured">{inner}</div>
      );
    }
    case "social":
      return <Socials items={b.items} variant={b.variant} ctx={ctx} />;
    case "image": {
      const ratio = b.aspect === "auto" ? undefined : b.aspect.replace(":", " / ");
      const img = <Img src={b.src} alt={b.alt} style={{ aspectRatio: ratio, objectPosition: `${b.focusX}% ${b.focusY}%` }} />;
      if (!b.src) return ctx.editor ? <div className="bio-empty">Add an image</div> : null;
      const href = b.url ? outHref(ctx, b.id, b.url) : undefined;
      return (
        <figure className="bio-figure">
          {href && !ctx.editor ? (
            <a href={href} rel={relFor()}>
              {img}
            </a>
          ) : (
            img
          )}
          {b.caption ? <figcaption>{b.caption}</figcaption> : null}
        </figure>
      );
    }
    case "gallery":
      if (!b.images.length) return ctx.editor ? <div className="bio-empty">Add images to the gallery</div> : null;
      return (
        <div className="bio-gallery" data-layout={b.layout} style={{ "--cols": b.columns } as CSSProperties} tabIndex={b.layout === "carousel" ? 0 : undefined} aria-label={b.layout === "carousel" ? "Image carousel" : undefined}>
          {b.images.map((img, i) => (img.src ? <Img key={i} src={img.src} alt={img.alt} /> : null))}
        </div>
      );
    case "youtube": {
      const id = youtubeId(b.url);
      if (!id) return ctx.editor ? <div className="bio-empty">Paste a YouTube link</div> : null;
      return (
        <div className="bio-embed">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={b.title || "YouTube video"}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            style={ctx.editor ? { pointerEvents: "none" } : undefined}
          />
        </div>
      );
    }
    case "tiktok": {
      const id = tiktokId(b.url);
      if (!id) return ctx.editor ? <div className="bio-empty">Paste a TikTok video link</div> : null;
      return (
        <div className="bio-embed" data-ratio="9:16">
          <iframe src={`https://www.tiktok.com/embed/v2/${id}`} title={b.title || "TikTok video"} loading="lazy" allow="encrypted-media; fullscreen" style={ctx.editor ? { pointerEvents: "none" } : undefined} />
        </div>
      );
    }
    case "video": {
      const src = videoSource(b.url);
      if (!src) return ctx.editor ? <div className="bio-empty">Paste a Vimeo or .mp4 link</div> : null;
      return (
        <div className="bio-embed">
          {src.kind === "vimeo" ? (
            <iframe src={`https://player.vimeo.com/video/${src.id}?dnt=1`} title={b.title || "Video"} loading="lazy" allow="fullscreen; picture-in-picture" style={ctx.editor ? { pointerEvents: "none" } : undefined} />
          ) : (
            <video src={src.src} controls preload="metadata" playsInline title={b.title} />
          )}
        </div>
      );
    }
    case "embed": {
      const e = resolveEmbed(b.url);
      if (!e) return ctx.editor ? <div className="bio-empty">Paste a Spotify, SoundCloud, Apple Music, Calendly, Google Forms or Typeform link</div> : null;
      return (
        <iframe
          className="bio-embed-free"
          src={e.src}
          title={b.title || e.provider}
          height={b.height || e.defaultHeight}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
          allow="encrypted-media; clipboard-write"
          style={ctx.editor ? { pointerEvents: "none" } : undefined}
        />
      );
    }
    case "product":
      return (
        <div className="bio-card">
          <Img src={b.image} alt={b.title} className="bio-card-img" />
          <div className="bio-card-body">
            {b.badge ? <span className="bio-badge">{b.badge}</span> : null}
            <div className="bio-card-row">
              <span className="bio-card-title">
                <T ctx={ctx} path={p("title")} value={b.title} placeholder="Product name" />
              </span>
              {b.price ? (
                <span className="bio-price">
                  {b.price}
                  {b.compareAt ? <span className="bio-compare">{b.compareAt}</span> : null}
                </span>
              ) : null}
            </div>
            {b.description ? (
              <span className="bio-card-text">
                <T ctx={ctx} path={p("description")} value={b.description} multiline />
              </span>
            ) : null}
            {b.kind === "digital" ? <span className="bio-meta">Digital product</span> : null}
            {b.url ? <ButtonLink ctx={ctx} block={b} href={outHref(ctx, b.id, b.url)} title={b.cta || "Buy now"} titlePath={p("cta")} /> : null}
          </div>
        </div>
      );
    case "service":
      return (
        <div className="bio-card">
          <div className="bio-card-body">
            <div className="bio-card-row">
              <span className="bio-card-title">
                <T ctx={ctx} path={p("title")} value={b.title} placeholder="Service name" />
              </span>
              {b.price ? <span className="bio-price">{b.price}</span> : null}
            </div>
            {b.duration ? <span className="bio-meta">{b.duration}</span> : null}
            {b.description ? (
              <span className="bio-card-text">
                <T ctx={ctx} path={p("description")} value={b.description} multiline />
              </span>
            ) : null}
            {b.url ? <ButtonLink ctx={ctx} block={b} href={outHref(ctx, b.id, b.url)} title={b.cta || "Book"} titlePath={p("cta")} /> : null}
          </div>
        </div>
      );
    case "booking":
      return <ButtonLink ctx={ctx} block={b} href={outHref(ctx, b.id, b.url)} title={b.title} titlePath={p("title")} subtitle={b.note} subtitlePath={p("note")} highlight shareUrl={normalizeUrl(b.url) ?? undefined} />;
    case "contact": {
      // vCard download is served by /api/vcard so it works on every phone.
      const href = ctx.mode === "live" ? `/api/vcard/${ctx.pageId}/${b.id}` : undefined;
      return <ButtonLink ctx={ctx} block={b} href={href} title={b.title} titlePath={p("title")} track download />;
    }
    case "whatsapp":
      return <ButtonLink ctx={ctx} block={b} href={b.phone ? whatsappHref(b.phone, b.message) : undefined} title={b.title} titlePath={p("title")} icon="whatsapp" track />;
    case "email":
      return <ButtonLink ctx={ctx} block={b} href={b.email ? mailtoHref(b.email, b.subject) : undefined} title={b.title} titlePath={p("title")} icon="email" track />;
    case "phone":
      return <ButtonLink ctx={ctx} block={b} href={b.phone ? telHref(b.phone, b.sms) : undefined} title={b.title} titlePath={p("title")} track />;
    case "map":
      return (
        <div className="bio-card">
          {b.showEmbed && b.address ? (
            <iframe className="bio-map" src={mapsEmbedSrc(b.address)} title={`Map: ${b.address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={ctx.editor ? { pointerEvents: "none" } : undefined} />
          ) : null}
          <div className="bio-card-body">
            <span className="bio-card-title">
              <T ctx={ctx} path={p("title")} value={b.title} />
            </span>
            {b.address ? <span className="bio-card-text">{b.address}</span> : null}
            {b.address ? <ButtonLink ctx={ctx} block={b} href={ctx.mode === "live" ? outHref(ctx, b.id, mapsHref(b.address)) : mapsHref(b.address)} title="Get directions" titlePath="" /> : null}
          </div>
        </div>
      );
    case "newsletter":
    case "form":
      return (
        <div className="bio-card">
          <div className="bio-card-body">
            <span className="bio-card-title">
              <T ctx={ctx} path={p("title")} value={b.title} />
            </span>
            {b.description ? <span className="bio-card-text">{b.description}</span> : null}
            <LeadForm
              pageId={ctx.pageId}
              blockId={b.id}
              kind={b.type === "newsletter" ? "newsletter" : "contact"}
              askName={b.type === "form"}
              askPhone={b.type === "form" && b.askPhone}
              askMessage={b.type === "form"}
              buttonLabel={b.buttonLabel}
              consentText={b.consentText}
              successMessage={b.successMessage}
              disabled={ctx.mode !== "live"}
            />
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="bio-card">
          <div className="bio-card-body bio-faq">
            {b.title ? (
              <span className="bio-card-title">
                <T ctx={ctx} path={p("title")} value={b.title} />
              </span>
            ) : null}
            {b.items.map((it, i) => (
              <details key={i}>
                <summary>{it.q}</summary>
                <p>{it.a}</p>
              </details>
            ))}
            {!b.items.length && ctx.editor ? <span className="bio-meta">Add questions in the properties panel</span> : null}
          </div>
        </div>
      );
    case "testimonial":
      return (
        <figure className="bio-card">
          <div className="bio-card-body">
            {b.rating ? (
              <span className="bio-stars" aria-label={`${b.rating} out of 5 stars`}>
                {"★".repeat(b.rating)}
                {"☆".repeat(5 - b.rating)}
              </span>
            ) : null}
            <blockquote className="bio-quote">
              <T ctx={ctx} path={p("quote")} value={b.quote} multiline placeholder="What they said…" />
            </blockquote>
            <figcaption className="bio-person">
              {b.avatar ? <Img src={b.avatar} alt="" /> : null}
              <span>
                <strong>{b.author}</strong>
                {b.role ? <span className="bio-meta"> · {b.role}</span> : null}
              </span>
            </figcaption>
          </div>
        </figure>
      );
    case "divider":
      return <hr className="bio-divider" data-variant={b.variant} />;
    case "spacer":
      return <div aria-hidden="true" style={{ height: b.height }} />;
    case "file":
      return (
        <ButtonLink
          ctx={ctx}
          block={b}
          href={b.src ? outHref(ctx, b.id, b.src) : undefined}
          title={b.title}
          titlePath={p("title")}
          subtitle={b.fileName ? `${b.fileName}${b.bytes ? ` · ${formatBytes(b.bytes)}` : ""}` : undefined}
          download
        />
      );
    case "qr": {
      const target = (b.url && normalizeUrl(b.url)) || ctx.pageUrl;
      const { size, d } = qrPath(target);
      return (
        <div className="bio-qr">
          <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${target}`}>
            <path d={d} fill="currentColor" />
          </svg>
          {b.title ? <strong>{b.title}</strong> : null}
          {b.caption ? <span className="bio-meta">{b.caption}</span> : null}
        </div>
      );
    }
    case "marquee": {
      const speed = b.speed === "slow" ? "30s" : b.speed === "fast" ? "10s" : "18s";
      const items = Array.from({ length: 6 }, (_, i) => <span key={i}>{b.text || "Your message here"}</span>);
      return (
        <div className="bio-marquee" style={{ "--speed": speed } as CSSProperties}>
          <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            {b.text}
          </span>
          <div className="bio-marquee-track" aria-hidden="true">
            {items}
            {items}
          </div>
        </div>
      );
    }
    case "custom": {
      const href = b.buttonUrl ? outHref(ctx, b.id, b.buttonUrl) : undefined;
      return (
        <div className="bio-card bio-custom" data-layout={b.layout}>
          <Img src={b.image} alt="" className="bio-card-img" />
          <div className="bio-card-body">
            {b.title ? (
              <span className="bio-card-title">
                <T ctx={ctx} path={p("title")} value={b.title} />
              </span>
            ) : null}
            {b.text ? (
              <span className="bio-card-text">
                <T ctx={ctx} path={p("text")} value={b.text} multiline />
              </span>
            ) : null}
            {b.buttonLabel ? <ButtonLink ctx={ctx} block={b} href={href} title={b.buttonLabel} titlePath={p("buttonLabel")} /> : null}
          </div>
        </div>
      );
    }
    case "section":
      // Rendered by renderBlocks() because it wraps the blocks that follow it.
      return null;
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function wrapBlock(b: Block, ctx: RenderCtx, node: ReactNode): ReactNode {
  const el = (
    <div key={b.id} className="bio-block" data-block={b.id} {...blockStyleAttrs(b)}>
      {node}
    </div>
  );
  return ctx.editor ? ctx.editor.wrap(b, el) : el;
}

/** Blocks a visitor should see now (the editor shows everything, dimmed). */
function visibleBlocks(blocks: Block[], ctx: RenderCtx): Block[] {
  if (ctx.editor) return blocks;
  const now = new Date(ctx.now ?? Date.now());
  return blocks.filter((b) => isLive(b, now));
}

export function renderBlocks(blocks: Block[], ctx: RenderCtx): ReactNode[] {
  const out: ReactNode[] = [];
  const list = visibleBlocks(blocks, ctx);
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (b.type !== "section") {
      out.push(wrapBlock(b, ctx, renderBlock(b, ctx)));
      continue;
    }
    const children: Block[] = [];
    while (i + 1 < list.length && list[i + 1].type !== "section") children.push(list[++i]);
    out.push(wrapBlock(b, ctx, <Section block={b} ctx={ctx} items={children} />));
  }
  return out;
}

function Section({ block, ctx, items }: { block: BlockOf<"section">; ctx: RenderCtx; items: Block[] }) {
  const title = <T ctx={ctx} path={`block.${block.id}.title`} value={block.title} placeholder="Section title" />;
  const body =
    block.layout === "list" ? (
      <div className="bio-group-body">{items.map((b) => wrapBlock(b, ctx, renderBlock(b, ctx)))}</div>
    ) : (
      <div className="bio-group-body" data-layout={block.layout} tabIndex={block.layout === "carousel" ? 0 : undefined} role={block.layout === "carousel" ? "region" : undefined} aria-label={block.layout === "carousel" ? block.title : undefined}>
        {items.map((b) => wrapBlock(b, ctx, renderBlock(b, ctx)))}
      </div>
    );
  if (block.collapsible) {
    return (
      <details className="bio-section bio-group" open={!block.collapsed || Boolean(ctx.editor)}>
        <summary>
          <span className="bio-section-title">{title}</span>
        </summary>
        {block.description ? <p className="bio-text">{block.description}</p> : null}
        {body}
      </details>
    );
  }
  return (
    <section className="bio-section">
      <h2 className="bio-section-title">{title}</h2>
      {block.description ? <p className="bio-text">{block.description}</p> : null}
      <div style={{ marginTop: 12 }}>{body}</div>
    </section>
  );
}

function Socials({ items, variant, ctx }: { items: PageDoc["socials"]["items"]; variant: "icons" | "pills"; ctx: RenderCtx }) {
  if (!items.length) return null;
  return (
    <div className="bio-socials" data-variant={variant}>
      {items.map((s, i) => {
        const href = socialHref(s.platform, s.url);
        const label = SOCIAL_LABELS[s.platform];
        const icon = (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={SOCIAL_PATHS[s.platform]} />
          </svg>
        );
        const content = (
          <>
            {icon}
            {variant === "pills" ? <span>{label}</span> : null}
          </>
        );
        return href && !ctx.editor ? (
          <a key={i} className="bio-social" href={href} rel="noopener noreferrer me" aria-label={variant === "icons" ? label : undefined} data-track={ctx.mode === "live" ? `social:${s.platform}` : undefined}>
            {content}
          </a>
        ) : (
          <span key={i} className="bio-social" aria-label={variant === "icons" ? label : undefined}>
            {content}
          </span>
        );
      })}
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "★"
  );
}

export function BioPage({ doc, ctx, fixedBackground = false }: { doc: PageDoc; ctx: RenderCtx; fixedBackground?: boolean }) {
  const { profile, theme, socials } = doc;
  const blocks = renderBlocks(doc.blocks, ctx);
  const socialRow = socials.position !== "hidden" ? <Socials items={socials.items} variant="icons" ctx={ctx} /> : null;

  return (
    <div
      className={`bio-root ${fontVariables}`}
      style={themeVars(theme, profile.avatar)}
      data-btn={theme.button.style}
      data-btn-anim={theme.button.animation !== "none" ? theme.button.animation : undefined}
      data-desktop={theme.layout.desktop}
      data-compact={theme.mobile.compact ? "" : undefined}
      data-enter={ctx.mode === "live" ? "" : undefined}
      lang={doc.settings.language || "en"}
    >
      <div className="bio-bg" data-kind={theme.background.kind} data-fixed={fixedBackground ? "" : undefined} />
      <div className="bio-topbar">
        {doc.settings.showBranding ? (
          <a className="bio-round" href="https://serverlys.com/bio" rel="noopener" aria-label="Serverlys Bio — make your own free page" tabIndex={ctx.editor ? -1 : undefined}>
            <img src="/brand/logo-mark-transparent.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
          </a>
        ) : (
          <span />
        )}
        {ctx.mode === "live" ? (
          <ShareButton url={ctx.pageUrl} title={profile.name} />
        ) : (
          <span className="bio-round" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" />
            </svg>
          </span>
        )}
      </div>
      <main className="bio-main">
        <header className="bio-header" data-layout={profile.layout}>
          {profile.layout !== "classic" && profile.cover ? <img className="bio-cover" src={profile.cover} alt="" style={{ objectPosition: `50% ${profile.coverFocusY}%` }} /> : null}
          {profile.avatar ? (
            <img className="bio-avatar" data-shape={profile.avatarShape} src={profile.avatar} alt={profile.name} />
          ) : (
            <div className="bio-avatar bio-avatar-fallback" data-shape={profile.avatarShape} aria-hidden="true" style={{ color: readableOn(theme.button.color) }}>
              {initials(profile.name)}
            </div>
          )}
          <h1 className="bio-name">
            <T ctx={ctx} path="profile.name" value={profile.name} placeholder="Your name" />
          </h1>
          {profile.bio || ctx.editor ? (
            <p className="bio-bio">
              <T ctx={ctx} path="profile.bio" value={profile.bio} multiline placeholder="A short bio" />
            </p>
          ) : null}
          {profile.location ? (
            <span className="bio-loc">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              {profile.location}
            </span>
          ) : null}
          {socials.position === "top" ? socialRow : null}
        </header>

        {blocks.length ? blocks : ctx.editor ? <div className="bio-empty">Add your first link or block from the left panel.</div> : null}

        {socials.position === "bottom" ? <div style={{ marginTop: 12 }}>{socialRow}</div> : null}

        <footer className="bio-footer">
          {doc.settings.showBranding ? (
            <a className="bio-join" href="https://serverlys.com/bio" rel="noopener" tabIndex={ctx.editor ? -1 : undefined}>
              Create your own free Serverlys Bio
            </a>
          ) : null}
          {ctx.mode === "live" ? (
            <p className="bio-footlinks">
              {ctx.reportUrl ? (
                <a href={ctx.reportUrl} rel="nofollow">
                  Report
                </a>
              ) : null}
              <a href="https://serverlys.com/privacy-policy" rel="nofollow">
                Privacy
              </a>
              <a href="https://serverlys.com/bio" rel="noopener">
                Serverlys Bio
              </a>
            </p>
          ) : null}
        </footer>
      </main>
      {ctx.mode === "live" ? <PageTracker pageId={ctx.pageId} /> : null}
      {ctx.mode === "live" ? <ShareSheet pageUrl={ctx.pageUrl} pageTitle={profile.name} avatar={profile.avatar} /> : null}
      {ctx.mode === "live" && doc.settings.sensitive ? <SensitiveGate /> : null}
    </div>
  );
}
