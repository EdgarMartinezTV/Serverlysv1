import Image from "next/image";
import { DASHBOARD } from "../_content";
import { Band, Grid } from "@/components/ref/kit";

/**
 * "Multiple projects. One easy dashboard" — copy left, panel right.
 *
 * The reference runs a screen-capture video here. The still of our own panel
 * carries the same information and costs a fraction of the bytes, which on a
 * page this long matters more than the motion did.
 */
export function Dashboard() {
  return (
    <Band labelledBy="cloud-dashboard-heading">
      <Grid>
        <div className="grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-x-20">
          {/* Full track, no 560px cap — see the DM Sans note in kit.tsx. */}
          <div className="flex flex-col gap-6">
            <h2
              id="cloud-dashboard-heading"
              className="text-[36px] leading-[44px] font-normal tracking-[-0.18px] text-fg lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.24px]"
            >
              {DASHBOARD.title}
            </h2>
            <p className="text-body text-fg">{DASHBOARD.description}</p>
          </div>

          <Image
            src="/Hosting-images/Caching-server .png"
            alt="The Serverlys panel showing a site's CPU, memory and storage use beside its security checks and daily backups"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 688px, 100vw"
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </Grid>
    </Band>
  );
}
