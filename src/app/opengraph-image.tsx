import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Serverlys — premium web hosting, domains and cloud solutions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Web hosting",
    title: "Hosting priced honestly. Including year two.",
    detail: "Free migration, free SSL and daily backups on every plan.",
  });
}
