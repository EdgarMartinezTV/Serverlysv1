import Link from "next/link";
import { Grid } from "@/components/ref/kit";
import { DASHBOARD } from "../_content";

const SITES = [
  ["northlight.studio", "WordPress", "Online"],
  ["harborgoods.com", "WooCommerce", "Online"],
  ["mesa-dental.com", "WordPress", "Backing up"],
] as const;

/**
 * One panel for every site — split layout: copy left, a dark grid stage with
 * a coded site list right. Replaced the raster "Caching-server" image.
 */
export function Dashboard() {
  return (
    <section aria-labelledby="cloud-dash-heading" className="bg-canvas py-16 lg:py-24">
      <Grid>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-[520px]">
            <span className="inline-flex rounded-md bg-brand-50 px-2.5 py-1 text-small font-medium text-primary">
              Serverlys panel
            </span>
            <h2 id="cloud-dash-heading" className="display-lg mt-5 text-fg">
              {DASHBOARD.title}
            </h2>
            <p className="mt-5 text-body text-fg-secondary">
              See security, speed and backups for every site at a glance. Manage client
              accounts, get alerted the moment something breaks, and tag sites to keep a
              growing portfolio organised.
            </p>
            <Link
              href="/site-management"
              className="mt-7 inline-flex h-11 items-center rounded-md px-6 text-body font-semibold text-primary ring-1 ring-inset ring-primary transition-colors duration-fast hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              See site management
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="relative overflow-hidden rounded-3xl bg-[#050d24] p-8 [background-image:linear-gradient(rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:44px_44px] sm:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_45%,rgb(0_0_255/0.35),transparent_70%)]" />
            <div className="relative mx-auto max-w-[360px] rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 backdrop-blur">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="text-small font-semibold text-white">Your sites</span>
                <span className="rounded-md bg-primary px-2 py-0.5 text-micro font-semibold text-white">
                  3
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {SITES.map(([site, kind, state]) => (
                  <li
                    key={site}
                    className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3"
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-micro font-bold text-primary">
                      {site[0].toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small font-medium text-fg">
                        {site}
                      </span>
                      <span className="block text-micro text-fg-muted">{kind}</span>
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-micro font-semibold ${state === "Online" ? "text-success" : "text-primary"}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${state === "Online" ? "bg-success-fill" : "bg-primary"}`}
                      />
                      {state}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto mt-4 flex max-w-[360px] items-center gap-2 rounded-xl bg-success-fill/15 px-4 py-3 ring-1 ring-success-fill/50">
              <span className="size-2 rounded-full bg-success-fill" />
              <span className="text-small font-semibold text-white">
                All checks passing
              </span>
              <span className="ml-auto text-micro text-white/70">
                SSL · Backups · Firewall
              </span>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
