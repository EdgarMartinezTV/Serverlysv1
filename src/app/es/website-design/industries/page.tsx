import { IndustryHub, hubMetadata } from "@/app/website-design/_industry/industry-hub";

/** /es/website-design/industries — every industry website page, in Spanish. */
export const metadata = hubMetadata("es");

export default function SectoresPage() {
  return <IndustryHub locale="es" />;
}
