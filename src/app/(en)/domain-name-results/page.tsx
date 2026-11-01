import { DomainSearchApp } from "@/components/domain/domain-search-app";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { getTldPricing } from "@/lib/domains/pricing";
import { pageMetadata } from "@/lib/seo";
import { t as tx } from "@/i18n/t";

/**
 * Domain search results — hostinger.com/domain-name-results, our way.
 *
 * Every domain search bar in a hero (/domain-name, /register-domain) navigates
 * here with ?domain=name.tld, as Hostinger's does; this page runs the search
 * on arrival and owns the results: exact match, great alternative, bundle,
 * category tabs, in-place add to the WHMCS cart and the hosting upsell. See
 * components/domain/domain-results.tsx.
 *
 * Not indexable: one URL per query, nothing for a crawler. The query string
 * itself is not read on the server, so the page stays static (hourly, for the
 * live WHMCS prices) and the client reads ?domain on arrival.
 */

const PATH = "/domain-name-results";

export const metadata = pageMetadata({
  title: "Domain search results | Serverlys",
  description: "Check a domain name, see every extension we sell with its price, and add it to your cart.",
  path: PATH,
  index: false,
});

/** Prices come from WHMCS (lib/domains/pricing); re-render at the same cadence. */
export const revalidate = 3600;

export default async function DomainNameResultsPage() {
  const { all, featured } = await getTldPricing();
  return (
    <>
      <section
        aria-labelledby="dr-heading"
        className="relative isolate bg-canvas-abyss px-4 pt-10 pb-16 md:px-10 xl:pt-14"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(0_0_255/0.35),transparent_70%)]"
        />
        <div className="mx-auto max-w-[920px]">
          <h1 id="dr-heading" className="display-md text-center text-white">{tx("Find your domain name")}</h1>
          <div className="mt-8">
            <DomainSearchApp tlds={tx(featured)} catalog={tx(all)} mode="results" />
          </div>
        </div>
      </section>
      <PageBreadcrumbs
        trail={[
          { name: "Home", path: "/" },
          { name: "Domain names", path: "/domain-name" },
          { name: "Search results", path: PATH },
        ]}
      />
    </>
  );
}
