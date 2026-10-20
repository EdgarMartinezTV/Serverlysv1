"use client";

import type { Block, BlockStyle } from "@/lib/bio/schema";
import { SOCIAL_PLATFORMS } from "@/lib/bio/schema";
import { CATALOG } from "@/lib/bio/catalog";
import { isEmail, isPhone, isSafeUrl, tiktokId, videoSource, youtubeId } from "@/lib/bio/urls";
import { resolveEmbed, EMBED_PROVIDERS } from "@/lib/bio/embeds";
import { detectPlatform } from "@/lib/bio/social";
import { SOCIAL_LABELS } from "@/components/bio/social-paths";
import { ColorField, Group, Segmented, SelectField, Slider, TextArea, TextField, Toggle } from "./controls";
import { FileField, ImageField } from "./image-field";
import { Icon } from "@/components/dashboard/icons";

type Patch = (patch: Record<string, unknown>, coalesce?: string) => void;

const urlError = (v: string) => (v && !isSafeUrl(v) ? "Not a valid public web address" : undefined);

function Url({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return <TextField label={label} value={value} onChange={onChange} placeholder="https://" inputMode="url" maxLength={2048} hint={hint} error={urlError(value)} />;
}

export function BlockProperties({ block, set, pageId }: { block: Block; set: Patch; pageId: string }) {
  const k = (f: string) => `${block.id}.${f}`;
  const text = (field: string) => (v: string) => set({ [field]: v }, k(field));
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-line-subtle px-4 py-3">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-sm bg-primary-soft text-[15px]">
          {CATALOG[block.type].glyph}
        </span>
        <div>
          <p className="text-small font-semibold text-fg">{CATALOG[block.type].label}</p>
          <p className="text-[12px] text-fg-muted">{CATALOG[block.type].description}</p>
        </div>
      </div>
      <Group title="Content">
        <ContentFields block={block} set={set} text={text} pageId={pageId} />
      </Group>
      <StyleFields style={block.style} set={(s) => set({ style: { ...block.style, ...s } }, k("style"))} type={block.type} />
      <Group title="Visibility">
        <Toggle label="Hidden" hint="Kept in the editor, not shown to visitors." checked={block.hidden} onChange={(v) => set({ hidden: v })} />
        <TextField label="Show from" type="datetime-local" value={toLocal(block.schedule.start)} onChange={(v) => set({ schedule: { ...block.schedule, start: fromLocal(v) } })} hint="Leave empty to show right away." />
        <TextField label="Hide after" type="datetime-local" value={toLocal(block.schedule.end)} onChange={(v) => set({ schedule: { ...block.schedule, end: fromLocal(v) } })} hint="Leave empty to keep it up." />
      </Group>
    </div>
  );
}

function toLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}
function fromLocal(v: string): string {
  return v ? new Date(v).toISOString() : "";
}

function ContentFields({ block: b, set, text, pageId }: { block: Block; set: Patch; text: (f: string) => (v: string) => void; pageId: string }) {
  switch (b.type) {
    case "heading":
      return (
        <>
          <TextField label="Text" value={b.text} onChange={text("text")} />
          <Segmented label="Level" value={b.level} options={[{ value: 2, label: "Large" }, { value: 3, label: "Small" }]} onChange={(v) => set({ level: v })} />
        </>
      );
    case "text":
      return <TextArea label="Text" value={b.text} onChange={text("text")} rows={6} maxLength={3000} />;
    case "link":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <Url label="URL" value={b.url} onChange={text("url")} />
          <TextField label="Subtitle (optional)" value={b.subtitle} onChange={text("subtitle")} />
          <ImageField label="Thumbnail" value={b.thumbnail} onChange={(v) => set({ thumbnail: v, icon: v ? "" : b.icon })} kind="image" aspect={1} pageId={pageId} />
          <SelectField
            label="Icon"
            value={b.icon}
            onChange={(v) => set({ icon: v, thumbnail: v ? "" : b.thumbnail })}
            options={[{ value: "" as const, label: "None" }, ...SOCIAL_PLATFORMS.map((p) => ({ value: p, label: SOCIAL_LABELS[p] }))]}
          />
          {b.url && !b.icon && detectPlatform(b.url) && detectPlatform(b.url) !== "website" ? (
            <button type="button" className="w-fit text-[13px] font-semibold text-primary hover:underline" onClick={() => set({ icon: detectPlatform(b.url)! })}>
              Use the {SOCIAL_LABELS[detectPlatform(b.url)!]} icon
            </button>
          ) : null}
          <Toggle label="Highlight" hint="Accent colour + the theme's attention animation." checked={b.highlight} onChange={(v) => set({ highlight: v })} />
          <Toggle label="Sponsored / affiliate" hint='Adds rel="nofollow sponsored".' checked={b.nofollow} onChange={(v) => set({ nofollow: v })} />
        </>
      );
    case "featured":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <TextArea label="Description" value={b.description} onChange={text("description")} />
          <Url label="URL" value={b.url} onChange={text("url")} />
          <TextField label="Button label" value={b.cta} onChange={text("cta")} />
          <ImageField label="Image" value={b.image} onChange={(v) => set({ image: v })} aspect={16 / 9} pageId={pageId} />
        </>
      );
    case "booking":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <Url label="Booking URL" value={b.url} onChange={text("url")} hint="Calendly, Square, Fresha, Booksy, OpenTable, Resy…" />
          <TextField label="Note (optional)" value={b.note} onChange={text("note")} />
        </>
      );
    case "social":
      return <SocialItemsEditor items={b.items} onChange={(items) => set({ items })} variant={b.variant} onVariant={(v) => set({ variant: v })} />;
    case "image":
      return (
        <>
          <ImageField label="Image" value={b.src} onChange={(v) => set({ src: v })} pageId={pageId} />
          <TextField label="Alt text" value={b.alt} onChange={text("alt")} hint="Describe the image for screen readers." />
          <TextField label="Caption" value={b.caption} onChange={text("caption")} />
          <Url label="Link (optional)" value={b.url} onChange={text("url")} />
          <SelectField
            label="Frame"
            value={b.aspect}
            onChange={(v) => set({ aspect: v })}
            options={[
              { value: "auto", label: "Original" },
              { value: "1:1", label: "Square 1:1" },
              { value: "4:5", label: "Portrait 4:5" },
              { value: "3:4", label: "Portrait 3:4" },
              { value: "4:3", label: "Landscape 4:3" },
              { value: "16:9", label: "Wide 16:9" },
            ]}
          />
          {b.aspect !== "auto" ? (
            <>
              <Slider label="Reposition — horizontal" value={b.focusX} min={0} max={100} onChange={(v) => set({ focusX: v }, `${b.id}.fx`)} unit="%" />
              <Slider label="Reposition — vertical" value={b.focusY} min={0} max={100} onChange={(v) => set({ focusY: v }, `${b.id}.fy`)} unit="%" />
            </>
          ) : null}
        </>
      );
    case "gallery":
      return (
        <>
          <Segmented label="Layout" value={b.layout} options={[{ value: "grid", label: "Grid" }, { value: "carousel", label: "Carousel" }]} onChange={(v) => set({ layout: v })} />
          {b.layout === "grid" ? <Segmented label="Columns" value={b.columns} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }]} onChange={(v) => set({ columns: v })} /> : null}
          {b.images.map((img, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-sm bg-canvas-secondary p-3">
              <ImageField label={`Image ${i + 1}`} value={img.src} onChange={(v) => set({ images: b.images.map((x, j) => (j === i ? { ...x, src: v } : x)) })} pageId={pageId} />
              <TextField label="Alt text" value={img.alt} onChange={(v) => set({ images: b.images.map((x, j) => (j === i ? { ...x, alt: v } : x)) }, `${b.id}.alt${i}`)} />
              <button type="button" className="w-fit text-[13px] text-error hover:underline" onClick={() => set({ images: b.images.filter((_, j) => j !== i) })}>
                Remove image
              </button>
            </div>
          ))}
          {b.images.length < 24 ? (
            <button type="button" className="btn h-9 px-3 text-[13px] text-primary ring-1 ring-primary/35 hover:bg-primary-soft" onClick={() => set({ images: [...b.images, { src: "", alt: "" }] })}>
              Add image
            </button>
          ) : null}
        </>
      );
    case "youtube":
      return (
        <>
          <Url label="YouTube URL" value={b.url} onChange={text("url")} hint={b.url && !youtubeId(b.url) ? "That isn't a YouTube video link." : "Videos load from youtube-nocookie.com."} />
          <TextField label="Title (for screen readers)" value={b.title} onChange={text("title")} />
        </>
      );
    case "tiktok":
      return (
        <>
          <Url label="TikTok video URL" value={b.url} onChange={text("url")} hint={b.url && !tiktokId(b.url) ? "Use the full link: tiktok.com/@user/video/…" : undefined} />
          <TextField label="Title" value={b.title} onChange={text("title")} />
        </>
      );
    case "video":
      return (
        <>
          <Url label="Vimeo or .mp4 URL" value={b.url} onChange={text("url")} hint={b.url && !videoSource(b.url) ? "Use a Vimeo link or a direct video file URL." : undefined} />
          <TextField label="Title" value={b.title} onChange={text("title")} />
        </>
      );
    case "embed": {
      const e = resolveEmbed(b.url);
      return (
        <>
          <Url label="Share link" value={b.url} onChange={text("url")} hint={b.url ? (e ? `Detected: ${e.provider}` : "Not a supported provider.") : `Supported: ${EMBED_PROVIDERS.join(", ")}.`} />
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <Slider label="Height" value={b.height} min={80} max={800} step={8} onChange={(v) => set({ height: v }, `${b.id}.h`)} unit="px" />
        </>
      );
    }
    case "product":
      return (
        <>
          <TextField label="Product name" value={b.title} onChange={text("title")} />
          <TextArea label="Description" value={b.description} onChange={text("description")} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Price" value={b.price} onChange={text("price")} placeholder="$29" />
            <TextField label="Was (optional)" value={b.compareAt} onChange={text("compareAt")} placeholder="$39" />
          </div>
          <TextField label="Badge" value={b.badge} onChange={text("badge")} placeholder="New, Sale, Bestseller" />
          <Segmented label="Type" value={b.kind} options={[{ value: "physical", label: "Physical" }, { value: "digital", label: "Digital" }]} onChange={(v) => set({ kind: v })} />
          <ImageField label="Image" value={b.image} onChange={(v) => set({ image: v })} aspect={16 / 10} pageId={pageId} />
          <Url label="Checkout / product URL" value={b.url} onChange={text("url")} hint="Your Shopify, Gumroad, Etsy or Stripe Payment Link. Serverlys Bio doesn't take payments itself." />
          <TextField label="Button label" value={b.cta} onChange={text("cta")} />
        </>
      );
    case "service":
      return (
        <>
          <TextField label="Service name" value={b.title} onChange={text("title")} />
          <TextArea label="Description" value={b.description} onChange={text("description")} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Price" value={b.price} onChange={text("price")} placeholder="$45" />
            <TextField label="Duration" value={b.duration} onChange={text("duration")} placeholder="45 min" />
          </div>
          <Url label="Booking link (optional)" value={b.url} onChange={text("url")} />
          <TextField label="Button label" value={b.cta} onChange={text("cta")} />
        </>
      );
    case "contact":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <TextField label="Full name" value={b.name} onChange={text("name")} />
          <TextField label="Company" value={b.org} onChange={text("org")} />
          <TextField label="Phone" value={b.phone} onChange={text("phone")} inputMode="tel" error={b.phone && !isPhone(b.phone) ? "Include the country code" : undefined} />
          <TextField label="Email" value={b.email} onChange={text("email")} inputMode="email" error={b.email && !isEmail(b.email) ? "Not a valid email" : undefined} />
          <Url label="Website" value={b.website} onChange={text("website")} />
        </>
      );
    case "whatsapp":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <TextField label="WhatsApp number" value={b.phone} onChange={text("phone")} inputMode="tel" placeholder="+1 305 555 0100" error={b.phone && !isPhone(b.phone) ? "Include the country code" : undefined} />
          <TextArea label="Pre-filled message" value={b.message} onChange={text("message")} />
        </>
      );
    case "email":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <TextField label="Email address" value={b.email} onChange={text("email")} inputMode="email" error={b.email && !isEmail(b.email) ? "Not a valid email" : undefined} />
          <TextField label="Subject (optional)" value={b.subject} onChange={text("subject")} />
        </>
      );
    case "phone":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <TextField label="Phone number" value={b.phone} onChange={text("phone")} inputMode="tel" error={b.phone && !isPhone(b.phone) ? "Include the country code" : undefined} />
          <Toggle label="Open as text message (SMS)" checked={b.sms} onChange={(v) => set({ sms: v })} />
        </>
      );
    case "map":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <TextArea label="Address" value={b.address} onChange={text("address")} rows={2} />
          <Toggle label="Show embedded map" checked={b.showEmbed} onChange={(v) => set({ showEmbed: v })} />
        </>
      );
    case "newsletter":
    case "form":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <TextArea label="Description" value={b.description} onChange={text("description")} />
          {b.type === "form" ? <Toggle label="Ask for a phone number" checked={b.askPhone} onChange={(v) => set({ askPhone: v })} /> : null}
          <TextField label="Button label" value={b.buttonLabel} onChange={text("buttonLabel")} />
          <TextArea label="Consent text" value={b.consentText} onChange={text("consentText")} />
          <p className="text-[12px] text-fg-muted">Visitors must tick this before submitting. It&apos;s stored with each lead. Leave empty to skip the checkbox.</p>
          <TextField label="Success message" value={b.successMessage} onChange={text("successMessage")} />
        </>
      );
    case "faq":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          {b.items.map((it, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-sm bg-canvas-secondary p-3">
              <TextField label={`Question ${i + 1}`} value={it.q} onChange={(v) => set({ items: b.items.map((x, j) => (j === i ? { ...x, q: v } : x)) }, `${b.id}.q${i}`)} />
              <TextArea label="Answer" value={it.a} onChange={(v) => set({ items: b.items.map((x, j) => (j === i ? { ...x, a: v } : x)) }, `${b.id}.a${i}`)} maxLength={3000} />
              <button type="button" className="w-fit text-[13px] text-error hover:underline" onClick={() => set({ items: b.items.filter((_, j) => j !== i) })}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn h-9 px-3 text-[13px] text-primary ring-1 ring-primary/35 hover:bg-primary-soft" onClick={() => set({ items: [...b.items, { q: "", a: "" }] })}>
            Add question
          </button>
        </>
      );
    case "testimonial":
      return (
        <>
          <TextArea label="Quote" value={b.quote} onChange={text("quote")} />
          <TextField label="Name" value={b.author} onChange={text("author")} />
          <TextField label="Role / context" value={b.role} onChange={text("role")} />
          <ImageField label="Photo" value={b.avatar} onChange={(v) => set({ avatar: v })} kind="avatar" pageId={pageId} />
          <Slider label="Stars" value={b.rating} min={0} max={5} onChange={(v) => set({ rating: v })} />
        </>
      );
    case "divider":
      return <Segmented label="Style" value={b.variant} options={[{ value: "line", label: "Line" }, { value: "dots", label: "Dots" }, { value: "wave", label: "Wave" }]} onChange={(v) => set({ variant: v })} />;
    case "spacer":
      return <Slider label="Height" value={b.height} min={4} max={160} step={4} onChange={(v) => set({ height: v }, `${b.id}.h`)} unit="px" />;
    case "file":
      return (
        <>
          <TextField label="Button label" value={b.title} onChange={text("title")} />
          <FileField value={b.src} fileName={b.fileName} pageId={pageId} onChange={(f) => set({ src: f.src, fileName: f.fileName, bytes: f.bytes })} />
        </>
      );
    case "qr":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <Url label="URL (optional)" value={b.url} onChange={text("url")} hint="Leave empty to point at this bio page." />
          <TextField label="Caption" value={b.caption} onChange={text("caption")} />
        </>
      );
    case "section":
      return (
        <>
          <TextField label="Section title" value={b.title} onChange={text("title")} />
          <TextArea label="Description" value={b.description} onChange={text("description")} />
          <Segmented label="Layout" value={b.layout} options={[{ value: "list", label: "List" }, { value: "carousel", label: "Carousel" }, { value: "grid", label: "Grid" }]} onChange={(v) => set({ layout: v })} />
          <Toggle label="Collapsible" hint="Visitors tap the title to open it." checked={b.collapsible} onChange={(v) => set({ collapsible: v })} />
          {b.collapsible ? <Toggle label="Start collapsed" checked={b.collapsed} onChange={(v) => set({ collapsed: v })} /> : null}
          <p className="text-[12px] text-fg-muted">Every block below this one, up to the next section, belongs to it.</p>
        </>
      );
    case "marquee":
      return (
        <>
          <TextField label="Text" value={b.text} onChange={text("text")} />
          <Segmented label="Speed" value={b.speed} options={[{ value: "slow", label: "Slow" }, { value: "normal", label: "Normal" }, { value: "fast", label: "Fast" }]} onChange={(v) => set({ speed: v })} />
        </>
      );
    case "custom":
      return (
        <>
          <TextField label="Title" value={b.title} onChange={text("title")} />
          <TextArea label="Text" value={b.text} onChange={text("text")} rows={5} maxLength={3000} />
          <ImageField label="Image" value={b.image} onChange={(v) => set({ image: v })} pageId={pageId} />
          <Segmented label="Layout" value={b.layout} options={[{ value: "stack", label: "Stacked" }, { value: "side", label: "Side by side" }]} onChange={(v) => set({ layout: v })} />
          <TextField label="Button label" value={b.buttonLabel} onChange={text("buttonLabel")} />
          <Url label="Button URL" value={b.buttonUrl} onChange={text("buttonUrl")} />
        </>
      );
  }
}

export function SocialItemsEditor({ items, onChange, variant, onVariant }: { items: Array<{ platform: (typeof SOCIAL_PLATFORMS)[number]; url: string }>; onChange: (items: Array<{ platform: (typeof SOCIAL_PLATFORMS)[number]; url: string }>) => void; variant?: "icons" | "pills"; onVariant?: (v: "icons" | "pills") => void }) {
  return (
    <div className="flex flex-col gap-3">
      {onVariant && variant ? <Segmented label="Style" value={variant} options={[{ value: "icons", label: "Icons" }, { value: "pills", label: "Labelled" }]} onChange={onVariant} /> : null}
      {items.map((it, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="w-32 shrink-0">
            <SelectField label="Platform" hideLabel={i > 0} value={it.platform} onChange={(p) => onChange(items.map((x, j) => (j === i ? { ...x, platform: p } : x)))} options={SOCIAL_PLATFORMS.map((p) => ({ value: p, label: SOCIAL_LABELS[p] }))} />
          </div>
          <div className="min-w-0 flex-1">
            <TextField
              label="Profile URL"
              hideLabel={i > 0}
              value={it.url}
              placeholder={it.platform === "email" ? "you@example.com" : "https://"}
              onChange={(v) => {
                const detected = detectPlatform(v);
                onChange(items.map((x, j) => (j === i ? { platform: detected && detected !== "website" ? detected : x.platform, url: v } : x)));
              }}
              maxLength={2048}
            />
          </div>
          <div className="flex pb-0.5">
            <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(swap(items, i, i - 1))} className="grid size-9 place-items-center rounded-sm text-fg-muted hover:bg-canvas-inset disabled:opacity-30">
              ↑
            </button>
            <button type="button" aria-label={`Remove ${SOCIAL_LABELS[it.platform]}`} onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid size-9 place-items-center rounded-sm text-fg-muted hover:bg-error-soft hover:text-error">
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>
      ))}
      {items.length < 20 ? (
        <button type="button" className="btn h-9 w-fit px-3 text-[13px] text-primary ring-1 ring-primary/35 hover:bg-primary-soft" onClick={() => onChange([...items, { platform: "instagram", url: "" }])}>
          Add social profile
        </button>
      ) : null}
      <p className="text-[12px] text-fg-muted">Paste a profile link and the icon is picked for you.</p>
    </div>
  );
}

function swap<T>(arr: T[], a: number, b: number): T[] {
  const out = [...arr];
  [out[a], out[b]] = [out[b], out[a]];
  return out;
}

const BUTTONISH = new Set(["link", "booking", "whatsapp", "email", "phone", "contact", "file"]);

function StyleFields({ style, set, type }: { style: BlockStyle; set: (s: Partial<BlockStyle>) => void; type: Block["type"] }) {
  const textual = type === "heading" || type === "text" || type === "section" || type === "marquee";
  return (
    <Group title="Style">
      {textual ? <Segmented label="Alignment" value={style.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} onChange={(v) => set({ align: v })} /> : null}
      <Segmented label="Text size" value={style.size} options={[{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }]} onChange={(v) => set({ size: v })} />
      <Segmented label="Weight" value={style.weight} options={[{ value: "regular", label: "Regular" }, { value: "medium", label: "Medium" }, { value: "bold", label: "Bold" }]} onChange={(v) => set({ weight: v })} />
      <ColorField label="Text colour" value={style.color} onChange={(v) => set({ color: v })} allowEmpty />
      {!textual || type === "marquee" ? <ColorField label="Background" value={style.bg} onChange={(v) => set({ bg: v })} allowEmpty /> : null}
      {!textual || type === "marquee" ? (
        <div className="flex flex-col gap-2">
          <Toggle label="Custom corner radius" checked={style.radius >= 0} onChange={(v) => set({ radius: v ? 12 : -1 })} />
          {style.radius >= 0 ? <Slider label="Radius" value={style.radius} min={0} max={40} onChange={(v) => set({ radius: v })} unit="px" /> : null}
        </div>
      ) : null}
      <Segmented label="Width" value={style.width} options={[{ value: "full", label: "Full" }, { value: "wide", label: "Wide" }, { value: "narrow", label: "Narrow" }]} onChange={(v) => set({ width: v })} />
      <Segmented label="Space above" value={style.spacing} options={[{ value: "none", label: "None" }, { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }]} onChange={(v) => set({ spacing: v })} />
      <SelectField
        label="Animation"
        value={style.animation}
        onChange={(v) => set({ animation: v })}
        options={[
          { value: "none", label: "Theme default" },
          { value: "fade", label: "Fade in" },
          ...(BUTTONISH.has(type) ? [{ value: "lift" as const, label: "Lift on hover" }, { value: "pulse" as const, label: "Pulse" }, { value: "wobble" as const, label: "Wobble" }, { value: "shine" as const, label: "Shine" }] : []),
        ]}
      />
      <Segmented label="Show on" value={style.visibility} options={[{ value: "all", label: "All devices" }, { value: "mobile", label: "Mobile" }, { value: "desktop", label: "Desktop" }]} onChange={(v) => set({ visibility: v })} />
    </Group>
  );
}
