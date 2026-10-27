import Link from "next/link";
import { Band } from "../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbGraph, pageMetadata } from "@/lib/seo";
import { breadcrumbTrail } from "@/data/routes";
import { billing } from "@/data/company";
import { formatPrice } from "@/data/pricing";
import { PRICES_AS_OF, tldCatalog } from "@/data/tld-catalog";

const PATH = "/tld";

export const metadata = pageMetadata({
  title: "Domain Extensions and Prices: .com, .io, .shop | Serverlys",
  description: `Every domain extension Serverlys sells, from .com to .io, with first-year and renewal prices side by side. ${tldCatalog.length} extensions.`,
  path: PATH,
});

/**
 * The domain-extension index (hostinger.com's equivalent is its domain
 * extensions list). Links every /tld/<ext> page and shows register and renewal
 * prices together, which is the comparison people come here to make.
 */
const SORTED = [...tldCatalog].sort((a, b) => a.slug.localeCompare(b.slug));

export default function TldIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbGraph(breadcrumbTrail(PATH))} />

      <Band tone="dark" labelledBy="tld-index-heading">
        <div className="mx-auto max-w-[760px] text-center">
          <h1 id="tld-index-heading" className="display-lg text-white">
            Domain extensions
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-body-lg text-fg-on-dark-secondary">
            All {tldCatalog.length} extensions we sell, with the first-year price and the renewal price
            side by side.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href={billing.registerDomain}>Search for a domain</Button>
          </div>
        </div>
      </Band>

      <Band labelledBy="tld-index-list">
        <h2 id="tld-index-list" className="sr-only">
          Extensions and prices
        </h2>
        <div className="mx-auto max-w-[960px] overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-body">
            <thead className="bg-canvas-secondary text-small text-fg">
              <tr>
                <th scope="col" className="p-4 font-semibold">Extension</th>
                <th scope="col" className="p-4 font-semibold">Best for</th>
                <th scope="col" className="p-4 text-right font-semibold">First year</th>
                <th scope="col" className="p-4 text-right font-semibold">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {SORTED.map((t) => (
                <tr key={t.slug} className="border-t border-line">
                  <th scope="row" className="p-4 font-semibold">
                    <Link href={`/tld/${t.slug}`} className="text-primary hover:underline">
                      .{t.slug}
                    </Link>
                  </th>
                  <td className="p-4 text-small text-fg-secondary">{t.forWhom}</td>
                  <td className="p-4 text-right text-fg">{formatPrice(t.register)}</td>
                  <td className="p-4 text-right text-fg">{formatPrice(t.renew)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-[960px] text-small text-fg-secondary">
          Yearly prices in USD from the store as of {PRICES_AS_OF}. Premium names are priced by the registry
          and marked at checkout.
        </p>
      </Band>

      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
