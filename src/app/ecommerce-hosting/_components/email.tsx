import { ContentSwitch } from "@/components/ref/content-switch";
import { EMAIL } from "../_content";
import { ImportContactsPanel } from "./visuals";

/**
 * "Turn WordPress visitors into customers with AI Email Marketing".
 *
 * The band itself is shared (components/ref/content-switch) — this file is
 * just the page's copy and media bound to it.
 *
 * ⚠ Describes "Serverlys Reach", which does not exist. See _content.ts.
 */
export function Email() {
  return (
    <ContentSwitch
      id="ecom-email"
      copy={EMAIL}
      media={<ImportContactsPanel className="aspect-[600/661] w-full xl:aspect-[600/560]" />}
    />
  );
}
