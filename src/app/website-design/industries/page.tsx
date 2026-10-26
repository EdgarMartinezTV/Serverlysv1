import { IndustryHub, hubMetadata } from "../_industry/industry-hub";

/** /website-design/industries — every industry website page, in English. */
export const metadata = hubMetadata("en");

export default function IndustriesPage() {
  return <IndustryHub locale="en" />;
}
