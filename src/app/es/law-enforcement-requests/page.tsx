import EnPage, { metadata as enMetadata } from "@/app/(en)/law-enforcement-requests/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/law-enforcement-requests — Spanish twin of /law-enforcement-requests: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/law-enforcement-requests");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
