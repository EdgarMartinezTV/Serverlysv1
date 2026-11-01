import EnPage, { metadata as enMetadata } from "@/app/(en)/cloud-hosting/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/cloud-hosting — Spanish twin of /cloud-hosting: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/cloud-hosting");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
