import EnPage, { metadata as enMetadata } from "@/app/(en)/transfer-domain/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/transfer-domain — Spanish twin of /transfer-domain: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/transfer-domain");
// Rendered per request so domain prices are always the live WHMCS ones
// (lib/domains/pricing caches the WHMCS call for 60s).
export const dynamic = "force-dynamic";

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
