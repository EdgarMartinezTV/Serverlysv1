import EnPage, { metadata as enMetadata } from "@/app/(en)/automations/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/automations — Spanish twin of /automations: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/automations");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
