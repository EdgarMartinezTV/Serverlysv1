import EnPage, { metadata as enMetadata } from "@/app/(en)/abuse-handling-policy/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/abuse-handling-policy — Spanish twin of /abuse-handling-policy: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/abuse-handling-policy");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
