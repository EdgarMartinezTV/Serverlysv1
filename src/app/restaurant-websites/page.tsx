import { JsonLd } from "@/components/ui/json-ld";
import { RestaurantLanding } from "./_components/landing";
import { en } from "./_content/en";
import { landingGraphs, landingMetadata } from "./_seo";

/**
 * /restaurant-websites — restaurant website service page (English).
 * Spanish twin: /es/restaurant-websites. Layout: ./_components/landing.tsx.
 */
export const metadata = landingMetadata(en, "en");

export default function RestaurantWebsitesPage() {
  return (
    <>
      {landingGraphs(en, "en").map((graph, i) => (
        <JsonLd key={i} data={graph} />
      ))}
      <RestaurantLanding copy={en} locale="en" />
    </>
  );
}
