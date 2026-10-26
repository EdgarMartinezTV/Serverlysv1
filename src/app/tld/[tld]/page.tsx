import Link from "next/link";
import { notFound } from "next/navigation";
import { Band, Heading, Pill, Tick } from "../../hosting/_components/band";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbGraph, faqGraph, pageMetadata, productGraph } from "@/lib/seo";
import { breadcrumbTrail } from "@/data/routes";
import { billing } from "@/data/company";
import { formatPrice } from "@/data/pricing";
import type { Faq } from "@/data/faqs";
import { PRICES_AS_OF, relatedTlds, tldBySlug, tldCatalog, type TldEntry } from "@/data/tld-catalog";

/**
 * One page per domain extension, as hostinger.com does with /tld/<ext>.
 *
 * Statically generated from data/tld-catalog.ts; an extension the store does
 * not sell 404s. What makes each page more than a template with the name
 * swapped: the store's real register, transfer and renewal prices, who the
 * extension suits, and its own registration rules where it has any (.eu, .us,
 * .biz). The FAQ answers are built from those same fields, so they differ
 * per page for the same reason the pages do.
 */
export function generateStaticParams() {
  return tldCatalog.map((t) => ({ tld: t.slug }));
}

const pathFor = (t: TldEntry) => `/tld/${t.slug}`;

/**
 * How Google treats the extension in search. Google's own documentation:
 * ccTLDs are geotargeted to their country, EXCEPT a list it treats as generic
 * (.io, .me, .tv among them); regional extensions like .eu are treated as
 * generic; new generic extensions carry no ranking advantage or penalty.
 */
const GENERIC_CCTLDS = new Set(["io", "me", "tv"]);
function googleNote(t: TldEntry): string {
  const dot = `.${t.slug}`;
  if (t.slug === "eu")
    return `Google treats regional extensions like ${dot} as generic, so it does not limit which countries your site can rank in.`;
  if (GENERIC_CCTLDS.has(t.slug))
    return `${dot} is a country code, but Google treats it as a generic extension, so it does not tie your site to ${t.country} in search results.`;
  if (t.country)
    return `Google treats ${dot} as a country-code extension and associates it with ${t.country}. That helps when your customers are there and works against you when they are not.`;
  return `Google treats ${dot} like any other generic extension: no ranking advantage or penalty compared with .com. Your content and links decide how the site ranks, not the extension.`;
}

/** WHOIS privacy is the registry's decision, and two of ours decide it differently. */
function privacyNote(t: TldEntry): string {
  const dot = `.${t.slug}`;
  if (t.slug === "us")
    return `Privacy service is not permitted for ${dot}: the registry requires registrant details to be published.`;
  if (t.slug === "eu")
    return `The ${dot} registry does not publish the personal details of individual registrants in public WHOIS.`;
  if (t.country)
    return `WHOIS privacy is included free where the ${dot} registry supports it. Country-code registries set their own rules on what registrant data is published.`;
  return `WHOIS privacy is included free for ${dot}, so your name, address and phone stay out of public lookups.`;
}

function transferNote(t: TldEntry): string {
  const dot = `.${t.slug}`;
  return t.country
    ? `Unlock the domain at your current registrar and get its authorisation code. ${dot} is a country-code extension, so the transfer rules of the registry for ${t.country} apply; we confirm them before you pay.`
    : `Unlock the domain at your current registrar, get its authorisation code, and start the transfer here. ICANN rules block transfers within 60 days of registration or of a previous transfer. The transfer adds a year to the registration.`;
}

function faqsFor(t: TldEntry): Faq[] {
  const dot = `.${t.slug}`;
  const path = pathFor(t);
  return [
    {
      question: `How much does a ${dot} domain cost?`,
      answer: `${formatPrice(t.register)} for the first year at Serverlys, and ${formatPrice(t.renew)} a year to renew. Transferring an existing ${dot} domain in costs ${formatPrice(t.transfer)}, which adds a year to its registration.`,
      scopes: [path],
    },
    {
      question: `Who can register a ${dot} domain?`,
      answer: t.rules ?? `Anyone. ${dot} has no residency or purpose requirement, so individuals and businesses anywhere can register one.`,
      scopes: [path],
    },
    {
      question: `Does the ${dot} price go up after the first year?`,
      answer:
        t.renew === t.register
          ? `No. The renewal rate is the same ${formatPrice(t.renew)} as the first year, so there is no introductory discount to lose.`
          : `Yes: the first year is ${formatPrice(t.register)} and renewal is ${formatPrice(t.renew)} a year. Both are shown before you pay.`,
      scopes: [path],
    },
    {
      question: `Is WHOIS privacy included with ${dot}?`,
      answer: privacyNote(t),
      scopes: [path],
    },
    {
      question: `Is ${dot} good for SEO?`,
      answer: googleNote(t),
      scopes: [path],
    },
    {
      question: `How do I transfer a ${dot} domain to Serverlys?`,
      answer: transferNote(t),
      scopes: [path],
    },
  ];
}

export async function generateMetadata(props: PageProps<"/tld/[tld]">) {
  const { tld } = await props.params;
  const t = tldBySlug(tld);
  if (!t) return {};
  return pageMetadata({
    title: `.${t.slug} Domain: Register for ${formatPrice(t.register)}/yr | Serverlys`,
    description: `Register a .${t.slug} domain for ${formatPrice(t.register)} a year, renewing at ${formatPrice(t.renew)}. ${t.forWhom}`.slice(0, 158),
    path: pathFor(t),
  });
}

export default async function TldPage(props: PageProps<"/tld/[tld]">) {
  const { tld } = await props.params;
  const t = tldBySlug(tld);
  if (!t) notFound();

  const dot = `.${t.slug}`;
  const path = pathFor(t);
  const faqs = faqsFor(t);
  const related = relatedTlds(t);

  return (
    <>
      <JsonLd data={breadcrumbGraph(breadcrumbTrail(path))} />
      <JsonLd data={faqGraph(faqs, path)} />
      <JsonLd
        data={productGraph({
          name: `${dot} domain registration`,
          description: `${dot} domain registration at Serverlys: ${formatPrice(t.register)} first year, ${formatPrice(t.renew)} renewal.`,
          path,
          lowPrice: Math.min(t.register, t.renew),
          highPrice: Math.max(t.register, t.renew),
          offerCount: 1,
          category: "Domain names",
        })}
      />

      <Band tone="dark" labelledBy="tld-heading">
        <div className="mx-auto max-w-[760px] text-center">
          <Pill tone="on-dark">{t.country ? `Country code · ${t.country}` : "Generic extension"}</Pill>
          <h1 id="tld-heading" className="display-lg mt-6 text-white">
            Register a {dot} domain
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-body-lg text-fg-on-dark-secondary">
            {dot} domains cost {formatPrice(t.register)} for the first year at Serverlys and renew at{" "}
            {formatPrice(t.renew)}. {t.forWhom}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={billing.registerDomain}>Search {dot} names</Button>
            <Button href={billing.transferDomain} variant="inverseOutline">
              Transfer a {dot} domain
            </Button>
          </div>
        </div>
      </Band>

      <Band labelledBy="tld-price-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="tld-price-heading" align="left" title={`${dot} pricing`} />
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-line">
              <table className="w-full border-collapse text-left text-body">
                <caption className="sr-only">{dot} domain prices per year</caption>
                <tbody>
                  {(
                    [
                      ["Register, first year", t.register],
                      ["Renew, every year after", t.renew],
                      ["Transfer in (adds a year)", t.transfer],
                    ] as const
                  ).map(([label, price]) => (
                    <tr key={label} className="border-t border-line first:border-t-0">
                      <th scope="row" className="p-4 font-medium text-fg">{label}</th>
                      <td className="p-4 text-right font-semibold text-fg">{formatPrice(price)}/yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-small text-fg-secondary">
              Store prices as of {PRICES_AS_OF}. Premium names are priced by the registry and marked as
              premium at checkout.
            </p>
          </div>
          <div>
            <Heading id="tld-about-heading" align="left" title={`What ${dot} is for`} />
            <p className="mt-6 text-body text-fg-secondary">{t.about}</p>
            {t.rules && (
              <div className="mt-6 rounded-2xl bg-brand-50 p-5">
                <p className="text-small font-semibold text-fg">Registration rules</p>
                <p className="mt-2 text-small text-fg-secondary">{t.rules}</p>
              </div>
            )}
            <dl className="mt-6 flex flex-col gap-5">
              {(
                [
                  ["In Google search", googleNote(t)],
                  ["Privacy", privacyNote(t)],
                  ["Moving it here", transferNote(t)],
                ] as const
              ).map(([term, text]) => (
                <div key={term} className="flex gap-3">
                  <Tick />
                  <div>
                    <dt className="text-small font-semibold text-fg">{term}</dt>
                    <dd className="mt-1 text-small text-fg-secondary">{text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Band>

      {related.length > 0 && (
        <Band tone="subtle" labelledBy="tld-related-heading">
          <Heading
            id="tld-related-heading"
            title={`Alternatives to ${dot}`}
            lede="Extensions people compare it with, at their store prices."
          />
          <ul className="mx-auto mt-10 grid max-w-[960px] gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={pathFor(r)}
                  className="flex h-full flex-col rounded-2xl bg-canvas p-5 ring-1 ring-line transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="text-body-lg font-semibold text-fg">.{r.slug}</span>
                  <span className="mt-1 text-small text-fg-secondary">{formatPrice(r.register)}/yr</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-small text-fg-secondary">
            See <Link href="/tld" className="text-primary underline underline-offset-4">every domain extension</Link>{" "}
            or <Link href="/domain-name" className="text-primary underline underline-offset-4">search for a name</Link>.
          </p>
        </Band>
      )}

      <FaqSection items={faqs} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(path)} />
    </>
  );
}
