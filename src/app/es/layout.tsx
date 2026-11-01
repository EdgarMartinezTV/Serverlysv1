import { SiteChrome } from "@/components/layout/site-chrome";
import { SpanishProvider } from "@/i18n/es-provider";
import { setLocale } from "@/i18n/rsc";

/**
 * Spanish pages (/es/...). Same chrome as English, rendered in Spanish:
 * setLocale("es") switches t() in Server Components, SpanishProvider in browser
 * components. Every /es page must ALSO call setLocale("es") — layouts and pages
 * render independently, so neither can rely on the other having run first.
 *
 * lang: the wrapper carries lang="es" in the server HTML (display:contents, so
 * the body's flex layout is untouched); the inline script sets <html lang="es">
 * before first paint, since the shared root layout renders lang="en".
 */
export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  setLocale("es");
  return (
    <div lang="es" className="contents">
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="es"' }} />
      <SpanishProvider>
        <SiteChrome>{children}</SiteChrome>
      </SpanishProvider>
    </div>
  );
}
