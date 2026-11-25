import EnPage, { metadata as enMetadata } from "@/app/(en)/dns-propagation-checker/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/dns-propagation-checker — Spanish twin of /dns-propagation-checker: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/dns-propagation-checker");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
