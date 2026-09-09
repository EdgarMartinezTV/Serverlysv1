import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Register a domain with Serverlys";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Domains",
    title: "Find the name first",
    detail: "Live registry availability. Free WHOIS privacy on every domain.",
  });
}
