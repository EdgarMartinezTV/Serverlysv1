import { JsonLd } from "@/components/ui/json-ld";
import { Grid } from "@/components/ref/kit";
import { company, emailDisplay } from "@/data/company";
import { breadcrumbGraph, pageMetadata } from "@/lib/seo";
import { HERO } from "./_content";
import { AbuseForm } from "./_components/abuse-form";

/**
 * Report abuse.
 *
 * Measured from hostinger.com/report-abuse. That URL is behind an interactive
 * Cloudflare challenge — a direct fetch returns 403, a headless browser never
 * clears it, and the Internet Archive was offline — so it was read by opening
 * a real Chrome window, letting the check pass, and driving the page over CDP.
 * The geometry and every string come from that live read.
 *
 * The reference is ONE compact section: a centred 48/56 h1 capped at 646px, a
 * centred 16/24 lede capped at 700px, then a two-step form. No hero visual, no
 * marketing bands, no FAQ — which is right for a page someone reaches while
 * reporting a crime.
 *
 * The form still POSTs to the WHMCS abuse queue. See _components/abuse-form.
 */

const PATH = "/report-abuse";

export const metadata = pageMetadata({
  title: "Report Abuse | Serverlys",
  description:
    "Report phishing, malware, spam, copyright infringement or other abuse originating from a Serverlys service.",
  path: PATH,
});

export default function ReportAbusePage() {
  return (
    <div className="[&_h1]:text-wrap [&_h2]:text-wrap [&_p]:text-wrap">
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Report abuse", path: PATH },
        ])}
      />

      <section aria-labelledby="ra-heading" className="relative isolate overflow-hidden bg-canvas py-14 md:py-16 xl:py-20">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(55%_70%_at_50%_0%,rgb(0_0_255/0.07),transparent_70%)]" />
        <Grid>
          <h1
            id="ra-heading"
            className="display-lg mx-auto max-w-[760px] text-center text-fg"
          >
            {HERO.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-center text-body text-fg-secondary">
            {HERO.lede}{" "}
            <a
              href={`mailto:${company.email}?subject=Abuse%20report`}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
            >
              {emailDisplay}
            </a>
            .
          </p>

          <AbuseForm />
        </Grid>
      </section>
    </div>
  );
}
