import { JsonLd } from "@/components/ui/json-ld";
import { CleaningLanding } from "@/app/cleaning-company-websites/_components/landing";
import { es } from "@/app/cleaning-company-websites/_content/es";
import { landingGraphs, landingMetadata } from "@/app/cleaning-company-websites/_seo";

/** /es/cleaning-company-websites — the Spanish twin of /cleaning-company-websites. */
export const metadata = landingMetadata(es, "es");

export default function SitiosWebEmpresasDeLimpiezaPage() {
  return (
    <>
      {landingGraphs(es, "es").map((graph, i) => (
        <JsonLd key={i} data={graph} />
      ))}
      <CleaningLanding copy={es} locale="es" />
    </>
  );
}
