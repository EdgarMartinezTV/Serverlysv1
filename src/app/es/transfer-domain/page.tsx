import EnPage, { metadata as enMetadata } from "@/app/(en)/transfer-domain/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/transfer-domain — Spanish twin of /transfer-domain: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/transfer-domain");
export const revalidate = 3600;

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
