import EnPage, { metadata as enMetadata } from "@/app/(en)/refund-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/refund-policy — Spanish twin of /refund-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/refund-policy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
