import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Serverlys Cloud Hosting — auto-scaling plans";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cloud hosting",
    title: "Servers that grow with your traffic",
    detail: "Auto-scaling infrastructure. Renewal pricing shown up front.",
  });
}
