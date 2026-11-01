import EnPage, { metadata as enMetadata } from "@/app/(en)/migrations/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/migrations — Spanish twin of /migrations: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/migrations");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
