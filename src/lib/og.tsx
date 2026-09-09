import { ImageResponse } from "next/og";

/**
 * Shared OpenGraph card renderer.
 *
 * One generator, called by thin per-route `opengraph-image.tsx` files, so the
 * card design lives in exactly one place. Next.js serves the result for both
 * `og:image` and `twitter:image`, so there is no separate Twitter card to keep
 * in sync.
 *
 * Colours are hard-coded rather than read from the design tokens: this renders
 * through Satori, which has no access to the CSS layer. They are copied from
 * globals.css and must be updated together — hence the comments.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK_950 = "#0b0e14"; // --color-canvas-dark
const INK_300 = "#c4cbd7"; // --color-fg-on-dark-secondary
const INK_400 = "#8d97a8"; // --color-fg-on-dark-muted
const BRAND_400 = "#5ea3fa"; // --color-primary-on-dark

export function renderOgImage({
  title,
  eyebrow,
  detail,
}: {
  title: string;
  eyebrow: string;
  detail?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK_950,
        // Brand light source, mirroring the site's dark bands.
        backgroundImage:
          "radial-gradient(60% 55% at 50% -10%, rgba(34,126,255,0.35) 0%, rgba(11,14,20,0) 70%)",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: BRAND_400,
          }}
        />
        <div
          style={{
            color: BRAND_400,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: title.length > 48 ? 64 : 76,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        {detail && (
          <div style={{ color: INK_300, fontSize: 30, maxWidth: 900 }}>{detail}</div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: `1px solid ${INK_400}33`,
          paddingTop: 28,
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Serverlys
        </div>
        <div style={{ color: INK_400, fontSize: 24 }}>serverlys.com</div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
