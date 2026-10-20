import type { PageDoc } from "@/lib/bio/schema";
import { BioPage } from "./renderer";

/**
 * A real render of a page, shrunk to a thumbnail. Rendered at phone width
 * (390px) and scaled, so container queries resolve exactly as on a phone.
 * Decorative: hidden from assistive tech and not interactive.
 */
export function MiniPreview({ doc, scale = 0.56, height = 420 }: { doc: PageDoc; scale?: number; height?: number }) {
  return (
    <div aria-hidden="true" inert className="sbio-mini pointer-events-none relative overflow-hidden bg-canvas-inset" style={{ height }}>
      <div style={{ width: 390, transform: `scale(${scale})`, transformOrigin: "top left", height: height / scale, display: "flex" }}>
        <BioPage doc={doc} ctx={{ mode: "preview", pageId: "preview", pageUrl: "https://bio.serverlys.com" }} />
      </div>
    </div>
  );
}
