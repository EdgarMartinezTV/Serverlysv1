import type { MetadataRoute } from "next";
import { company } from "@/data/company";

/**
 * Web app manifest. Not a PWA — there is no service worker and none is
 * planned — but browsers and Android read the name and icons from here when
 * the site is saved to a home screen, and it is the one place the icon set is
 * declared together. Icons are the file-convention ones in `app/`
 * (favicon.ico 16/32, icon.png 192, apple-icon.png 180); the 192 is a multiple
 * of 48, which is what Google Search asks of a favicon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.name,
    description: company.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/logo-square.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
