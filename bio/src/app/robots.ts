import type { MetadataRoute } from "next";
import { env } from "@/lib/server/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/editor", "/admin", "/api/", "/go/", "/preview/", "/report/", "/cd/", "/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"] }],
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
