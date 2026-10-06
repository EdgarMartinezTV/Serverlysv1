import Image from "next/image";
import { LaptopFrame } from "@/components/product-ui/laptop-frame";
import { HostingConsole } from "@/components/product-ui/live/hosting-console";
import { NavIcon } from "@/components/navigation/nav-icons";
import type { NavIconName } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * The Build stage visual: the hosting console as it is actually used — open
 * in a browser on a laptop, inside an app with its own navigation.
 *
 * The URL is the real address customers manage hosting from (WHMCS at
 * /billing). The sidebar is decoration (aria-hidden, not focusable): it
 * gives the console an application around it without adding controls that
 * do nothing. Everything operable is the console itself.
 */

const NAV: ReadonlyArray<{ icon: NavIconName; label: string; active?: boolean }> = [
  { icon: "server", label: "Sites", active: true },
  { icon: "globe", label: "Domains" },
  { icon: "mail", label: "Email" },
  { icon: "shield", label: "Security" },
  { icon: "chart", label: "Analytics" },
];

export function BuildLaptop() {
  return (
    <LaptopFrame url="serverlys.com/billing">
      <div className="flex">
        <div
          aria-hidden="true"
          className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-line-subtle bg-canvas-secondary py-3"
        >
          <Image
            src="/brand/logo-square.png"
            alt=""
            width={28}
            height={28}
            className="mb-3 h-7 w-7"
          />
          {NAV.map((item) => (
            <span
              key={item.label}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                item.active ? "bg-primary-soft text-primary" : "text-fg-muted",
              )}
            >
              <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
            </span>
          ))}
          <span className="mt-auto flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-primary">
            NS
          </span>
        </div>
        <HostingConsole frameless className="min-w-0 flex-1" />
      </div>
    </LaptopFrame>
  );
}
