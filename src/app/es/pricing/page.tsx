import EnPage, { metadata as enMetadata } from "@/app/(en)/pricing/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/pricing — Spanish twin of /pricing: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/pricing");
export const revalidate = 3600;

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
