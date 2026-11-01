import EnPage, { metadata as enMetadata } from "@/app/(en)/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es — Spanish twin of /: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
