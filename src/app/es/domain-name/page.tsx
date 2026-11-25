import EnPage, { metadata as enMetadata } from "@/app/(en)/domain-name/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/domain-name — Spanish twin of /domain-name: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/domain-name");
// Rendered per request so domain prices are always the live WHMCS ones
// (lib/domains/pricing caches the WHMCS call for 60s).
export const dynamic = "force-dynamic";

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
