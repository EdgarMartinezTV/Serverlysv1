import EnPage, { metadata as enMetadata } from "@/app/(en)/ai-agents/page";
import { esMetadata } from "@/i18n/metadata";
import { setLocale } from "@/i18n/rsc";

/** /es/ai-agents — Spanish twin of /ai-agents: same page, rendered with the Spanish dictionary. */
export const metadata = esMetadata(enMetadata, "/ai-agents");

export default function SpanishPage() {
  setLocale("es");
  return <EnPage />;
}
