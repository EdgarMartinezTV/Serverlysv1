import EnPage, { metadata as enMetadata } from "@/app/(en)/about/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/about — Spanish twin of /about: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/about");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
