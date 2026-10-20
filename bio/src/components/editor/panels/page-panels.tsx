"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageDoc } from "@/lib/bio/schema";
import { Group, Segmented, SelectField, Slider, TextArea, TextField, Toggle } from "../controls";
import { ImageField } from "../image-field";
import { SocialItemsEditor } from "../block-fields";
import { UsernameField } from "../username-field";

/* ── Profile ────────────────────────────────────────────────────────────── */

export function ProfilePanel({ doc, pageId, set }: { doc: PageDoc; pageId: string; set: (patch: Partial<PageDoc["profile"]>, coalesce?: string) => void }) {
  const p = doc.profile;
  return (
    <div>
      <Group title="Profile">
        <ImageField label="Profile photo" value={p.avatar} onChange={(v) => set({ avatar: v })} kind="avatar" pageId={pageId} />
        <TextField label="Display name" value={p.name} onChange={(v) => set({ name: v }, "profile.name")} placeholder="Your name or business" />
        <TextArea label="Bio" value={p.bio} onChange={(v) => set({ bio: v }, "profile.bio")} placeholder="What you do, in a sentence or two" />
        <TextField label="Location (optional)" value={p.location} onChange={(v) => set({ location: v }, "profile.location")} placeholder="Miami, FL" />
      </Group>
      <Group title="Header">
        <Segmented label="Layout" value={p.layout} options={[{ value: "classic", label: "Classic" }, { value: "cover", label: "Cover" }, { value: "hero", label: "Hero" }]} onChange={(v) => set({ layout: v })} />
        {p.layout !== "classic" ? (
          <>
            <ImageField label="Cover image" value={p.cover} onChange={(v) => set({ cover: v })} kind="cover" pageId={pageId} />
            {p.cover ? <Slider label="Reposition cover" value={p.coverFocusY} min={0} max={100} onChange={(v) => set({ coverFocusY: v }, "profile.coverY")} unit="%" /> : null}
          </>
        ) : (
          <p className="text-[12px] text-fg-muted">Switch to Cover or Hero to add a cover image.</p>
        )}
        <Segmented label="Photo shape" value={p.avatarShape} options={[{ value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }]} onChange={(v) => set({ avatarShape: v })} />
      </Group>
    </div>
  );
}

/* ── Social ─────────────────────────────────────────────────────────────── */

export function SocialPanel({ doc, setSocials }: { doc: PageDoc; setSocials: (patch: Partial<PageDoc["socials"]>) => void }) {
  return (
    <div>
      <Group title="Social profiles">
        <SocialItemsEditor items={doc.socials.items} onChange={(items) => setSocials({ items })} />
      </Group>
      <Group title="Placement">
        <Segmented label="Show icons" value={doc.socials.position} options={[{ value: "top", label: "Under bio" }, { value: "bottom", label: "Page bottom" }, { value: "hidden", label: "Hidden" }]} onChange={(v) => setSocials({ position: v })} />
        <p className="text-[12px] text-fg-muted">Need icons somewhere in the middle of the page? Add a “Social icons” block.</p>
      </Group>
    </div>
  );
}

/* ── SEO ────────────────────────────────────────────────────────────────── */

export function SeoPanel({ doc, pageId, url, set }: { doc: PageDoc; pageId: string; url: string; set: (patch: Partial<PageDoc["seo"]>, coalesce?: string) => void }) {
  const s = doc.seo;
  const title = s.title || `${doc.profile.name || "Your name"} | Links`;
  const desc = s.description || doc.profile.bio.slice(0, 160) || "Links and contact details.";
  return (
    <div>
      <Group title="Search & sharing">
        <TextField label="SEO title" value={s.title} onChange={(v) => set({ title: v }, "seo.title")} placeholder={title} hint={`${s.title.length}/60 recommended`} />
        <TextArea label="Meta description" value={s.description} onChange={(v) => set({ description: v }, "seo.description")} placeholder={desc} maxLength={300} />
        <ImageField label="Social share image" value={s.image} onChange={(v) => set({ image: v })} kind="image" aspect={1200 / 630} pageId={pageId} />
        <p className="text-[12px] text-fg-muted">No image? We generate a share card from your name, photo and colours.</p>
        <Toggle label="Hide from search engines" hint="Adds noindex. Your page still works for anyone with the link." checked={s.noindex} onChange={(v) => set({ noindex: v })} />
      </Group>
      <Group title="Google preview">
        <div className="rounded-sm bg-surface p-3 ring-1 ring-line">
          <p className="truncate text-[12px] text-fg-secondary">{url.replace(/^https?:\/\//, "")}</p>
          <p className="truncate text-[17px] text-[#1a0dab]">{title}</p>
          <p className="line-clamp-2 text-[13px] text-fg-secondary">{desc}</p>
        </div>
      </Group>
    </div>
  );
}

/* ── Analytics (summary) ────────────────────────────────────────────────── */

type Mini = { views: number; uniques: number; clicks: number; ctr: number; topLinks: Array<{ blockId: string; label: string; clicks: number }> };

export function AnalyticsPanel({ pageId, published }: { pageId: string; published: boolean }) {
  const [s, setS] = useState<Mini | null>(null);
  useEffect(() => {
    fetch(`/api/pages/${pageId}/stats`)
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS(null));
  }, [pageId]);
  return (
    <div>
      <Group title="Last 7 days">
        {!published ? <p className="text-small text-fg-muted">Analytics start once the page is published.</p> : null}
        {s ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Views", s.views],
                ["Unique visitors", s.uniques],
                ["Clicks", s.clicks],
                ["Click-through", `${(s.ctr * 100).toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-sm bg-canvas-secondary p-3">
                  <p className="text-[12px] text-fg-muted">{k}</p>
                  <p className="font-display text-[22px] font-semibold text-fg tabular-nums">{v}</p>
                </div>
              ))}
            </div>
            <h4 className="mt-2 text-small font-semibold text-fg">Top links</h4>
            {s.topLinks.length ? (
              <ol className="flex flex-col gap-1 text-small">
                {s.topLinks.slice(0, 5).map((l) => (
                  <li key={l.blockId} className="flex justify-between gap-2">
                    <span className="truncate">{l.label}</span>
                    <span className="tabular-nums text-fg-muted">{l.clicks}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-small text-fg-muted">No clicks yet.</p>
            )}
          </>
        ) : published ? (
          <p className="text-small text-fg-muted">Loading…</p>
        ) : null}
        <Link href={`/dashboard/analytics?page=${pageId}`} className="text-small font-semibold text-primary hover:underline">
          Open full analytics →
        </Link>
      </Group>
    </div>
  );
}

/* ── Settings ───────────────────────────────────────────────────────────── */

export function SettingsPanel(props: {
  doc: PageDoc;
  page: { id: string; name: string; username: string | null; status: string; notifyLeads: boolean; hasPublished: boolean };
  appUrl: string;
  setSettings: (patch: Partial<PageDoc["settings"]>) => void;
  onUsername: (u: string) => void;
  onUnpublish: () => Promise<void>;
  onRevert: () => Promise<void>;
}) {
  const { doc, page } = props;
  const [name, setName] = useState(page.name);
  const [notify, setNotify] = useState(page.notifyLeads);
  const [msg, setMsg] = useState("");
  async function patch(body: object) {
    const res = await fetch(`/api/pages/${page.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    setMsg(res.ok ? "Saved" : (d.error ?? "Couldn't save"));
    setTimeout(() => setMsg(""), 2000);
    return res.ok ? d : null;
  }
  return (
    <div>
      <Group title="Page" action={msg ? <span className="text-[12px] text-success" role="status">{msg}</span> : null}>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextField label="Internal name" value={name} onChange={setName} hint="Only you see this." />
          </div>
          <button type="button" className="btn mb-5 h-10 px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary" onClick={() => patch({ name })}>
            Save
          </button>
        </div>
      </Group>
      <Group title="Address">
        <UsernameField pageId={page.id} initial={page.username ?? ""} appUrl={props.appUrl} onSaved={props.onUsername} saveMode="immediate" />
        <p className="text-[12px] text-fg-muted">
          Changing it keeps the old address redirecting here for 90 days. Want your own domain?{" "}
          <Link href="/dashboard/domains" className="text-primary hover:underline">
            Connect one free
          </Link>
          .
        </p>
      </Group>
      <Group title="Leads">
        <Toggle
          label="Email me when someone submits a form"
          checked={notify}
          onChange={(v) => {
            setNotify(v);
            patch({ notifyLeads: v });
          }}
        />
      </Group>
      <Group title="Page options">
        <Toggle label="Show “Made with Serverlys Bio”" hint="Free either way — turn it off if you prefer." checked={doc.settings.showBranding} onChange={(v) => props.setSettings({ showBranding: v })} />
        <Toggle label="Sensitive content warning" hint="Visitors confirm they're 18+ first. Also hides the page from search." checked={doc.settings.sensitive} onChange={(v) => props.setSettings({ sensitive: v })} />
        <SelectField
          label="Page language"
          value={doc.settings.language}
          onChange={(v) => props.setSettings({ language: v })}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "pt", label: "Português" },
            { value: "fr", label: "Français" },
            { value: "de", label: "Deutsch" },
            { value: "it", label: "Italiano" },
          ]}
        />
      </Group>
      <Group title="Publishing">
        {page.hasPublished ? (
          <button
            type="button"
            className="btn h-9 w-fit px-3 text-[13px] text-fg ring-1 ring-line hover:bg-canvas-secondary"
            onClick={async () => {
              if (confirm("Throw away unpublished changes and go back to the live version?")) await props.onRevert();
            }}
          >
            Discard draft changes
          </button>
        ) : null}
        {page.status === "PUBLISHED" ? (
          <button
            type="button"
            className="btn h-9 w-fit px-3 text-[13px] text-error ring-1 ring-error/40 hover:bg-error-soft"
            onClick={async () => {
              if (confirm("Unpublish? Visitors will see a “not available” page until you publish again.")) await props.onUnpublish();
            }}
          >
            Unpublish page
          </button>
        ) : (
          <p className="text-small text-fg-muted">This page isn&apos;t live.</p>
        )}
        <Link href="/dashboard/pages" className="text-small text-fg-muted hover:underline">
          Duplicate or delete this page from My Bio Pages
        </Link>
      </Group>
    </div>
  );
}
