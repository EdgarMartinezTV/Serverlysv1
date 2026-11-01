import EnPage, { metadata as enMetadata } from "@/app/(en)/whois-lookup/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/whois-lookup — Spanish twin of /whois-lookup: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/whois-lookup");
export const revalidate = 3600;

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
