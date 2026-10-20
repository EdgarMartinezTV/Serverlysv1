import { ImageResponse } from "next/og";
import { getPublishedById } from "@/lib/server/public-pages";
import { env } from "@/lib/server/env";
import { readableOn } from "@/lib/bio/color";

/** Generated 1200×630 share card for pages without their own share image. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const page = await getPublishedById((await params).id);
  if (!page) return new Response("Not found", { status: 404 });
  const { profile, theme } = page.doc;
  const bg = theme.background.kind === "gradient" ? `linear-gradient(${theme.background.angle}deg, ${theme.background.from}, ${theme.background.to})` : theme.background.color;
  const avatar = profile.avatar ? (profile.avatar.startsWith("/") ? `${env.appUrl}${profile.avatar}` : profile.avatar) : null;
  const fg = theme.text;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: 80, background: bg, color: fg, fontFamily: "sans-serif" }}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} width={260} height={260} style={{ borderRadius: 999, objectFit: "cover" }} alt="" />
        ) : (
          <div style={{ width: 260, height: 260, borderRadius: 999, background: theme.button.color, color: readableOn(theme.button.color), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 700 }}>
            {(profile.name || page.username).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{profile.name || page.username}</div>
          {profile.bio ? <div style={{ fontSize: 32, opacity: 0.8, lineHeight: 1.3 }}>{profile.bio.slice(0, 120)}</div> : null}
          <div style={{ fontSize: 28, marginTop: 12, opacity: 0.9 }}>{`${env.appUrl.replace(/^https?:\/\//, "")}/${page.username}`}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
