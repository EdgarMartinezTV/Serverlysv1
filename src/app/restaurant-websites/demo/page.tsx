import { DemoPage } from "../_demo/demo-page";
import { demoMetadata } from "../_seo";

/** /restaurant-websites/demo — the Lumbre live demo (English). Noindex. */
export const metadata = demoMetadata("en");

export default function RestaurantDemoPage() {
  return <DemoPage locale="en" />;
}
