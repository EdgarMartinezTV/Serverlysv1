import { DemoPage } from "@/app/restaurant-websites/_demo/demo-page";
import { demoMetadata } from "@/app/restaurant-websites/_seo";

/** /es/restaurant-websites/demo — la demo de Lumbre en español. Noindex. */
export const metadata = demoMetadata("es");

export default function DemoRestaurantePage() {
  return <DemoPage locale="es" />;
}
