import { JsonLd } from "@/components/ui/json-ld";
import { CleaningLanding } from "./_components/landing";
import { en } from "./_content/en";
import { landingGraphs, landingMetadata } from "./_seo";

/**
 * /cleaning-company-websites — cleaning company website design (English).
 * Spanish twin: /es/cleaning-company-websites. Layout: ./_components/landing.tsx.
 */
export const metadata = landingMetadata(en, "en");

export default function CleaningCompanyWebsitesPage() {
  return (
    <>
      {landingGraphs(en, "en").map((graph, i) => (
        <JsonLd key={i} data={graph} />
      ))}
      <CleaningLanding copy={en} locale="en" />
    </>
  );
}
