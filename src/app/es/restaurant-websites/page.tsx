import { JsonLd } from "@/components/ui/json-ld";
import { RestaurantLanding } from "@/app/restaurant-websites/_components/landing";
import { es } from "@/app/restaurant-websites/_content/es";
import { landingGraphs, landingMetadata } from "@/app/restaurant-websites/_seo";

/**
 * /es/restaurant-websites — the Spanish twin of /restaurant-websites. Same
 * layout, Spanish copy, its own canonical and hreflang.
 */
export const metadata = landingMetadata(es, "es");

export default function SitiosWebRestaurantesPage() {
  return (
    <>
      {landingGraphs(es, "es").map((graph, i) => (
        <JsonLd key={i} data={graph} />
      ))}
      <RestaurantLanding copy={es} locale="es" />
    </>
  );
}
