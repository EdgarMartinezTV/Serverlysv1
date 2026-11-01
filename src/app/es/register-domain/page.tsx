import EnPage, { generateMetadata as enMetadata } from "@/app/(en)/register-domain/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/register-domain — Spanish twin of /register-domain: same page, rendered with the Spanish dictionary. */
export async function generateMetadata() {
  setLocale("es");
  return esMetadata(await enMetadata(), "/register-domain");
}
export const revalidate = 3600;

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
