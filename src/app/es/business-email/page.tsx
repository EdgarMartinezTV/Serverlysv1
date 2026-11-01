import EnPage, { metadata as enMetadata } from "@/app/(en)/business-email/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/business-email — Spanish twin of /business-email: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/business-email");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
