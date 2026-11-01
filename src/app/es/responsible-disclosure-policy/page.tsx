import EnPage, { metadata as enMetadata } from "@/app/(en)/responsible-disclosure-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/responsible-disclosure-policy — Spanish twin of /responsible-disclosure-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/responsible-disclosure-policy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
