import EnPage, { metadata as enMetadata } from "@/app/(en)/cookie-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/cookie-policy — Spanish twin of /cookie-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/cookie-policy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
