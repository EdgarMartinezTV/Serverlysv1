import { SiteChrome } from "@/components/layout/site-chrome";

/** English pages: the site chrome in English (the default — no locale is set). */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
