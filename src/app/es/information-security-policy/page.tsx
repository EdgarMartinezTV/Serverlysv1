import EnPage, { metadata as enMetadata } from "@/app/(en)/information-security-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/information-security-policy — Spanish twin of /information-security-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/information-security-policy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
