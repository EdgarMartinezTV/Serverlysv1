import EnPage, { metadata as enMetadata } from "@/app/(en)/hosting/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/hosting — Spanish twin of /hosting: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/hosting");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
