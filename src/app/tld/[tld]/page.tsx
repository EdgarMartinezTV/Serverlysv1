import Link from "next/link";
import { notFound } from "next/navigation";
import { Band, Heading, Pill, Tick } from "../../hosting/_components/band";
import { ManageMock } from "../_components/manage-mock";
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
 * extension suits, its typical uses and naming advice, and its own
 * registration rules where it has any (.eu, .us, .biz). The FAQ answers are
 * built from those same fields, so they differ per page for the same reason
 * the pages do.
 *
 * Shared sections only repeat what other domain pages on this site already
 * state (/register-domain, /transfer-domain, /domain-name): free WHOIS privacy
 * where the registry allows it, editable DNS, auto-renewal, the ICANN 60-day
 * transfer lock, live chat and email support.
 *
 * FAQ text is rendered by FaqSection and fed to faqGraph from the same array,
 * so the JSON-LD equals the visible text by construction. Keep apostrophes
 * typographic (’): the SEO audit matches questions against raw HTML, where a
 * straight quote is escaped.
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

/** Short label for the privacy tile in the management mock. */
function privacyTile(t: TldEntry): string {
  if (t.slug === "us") return "Not permitted";
  if (t.slug === "eu") return "Registry-masked";
  return t.country ? "Where supported" : "On, free";
}

function transferNote(t: TldEntry): string {
  const dot = `.${t.slug}`;
  return t.country
    ? `Unlock the domain at your current registrar and get its authorisation code. ${dot} is a country-code extension, so the transfer rules of the registry for ${t.country} apply; we confirm them before you pay.`
    : `Unlock the domain at your current registrar, get its authorisation code, and start the transfer here. ICANN rules block transfers within 60 days of registration or of a previous transfer. The transfer adds a year to the registration.`;
}

/** Character rules: DNS limits for everyone, plus the registry's own where we have verified them. */
function namingNote(t: TldEntry): string {
  const dot = `.${t.slug}`;
  const base = `Letters a–z, digits 0–9 and hyphens, up to 63 characters before the dot, not starting or ending with a hyphen. Capitals make no difference, so YourName${dot} and yourname${dot} are the same domain.`;
  if (t.slug === "eu")
    return `${base} The .eu registry also requires at least two characters, and names written in Greek or Cyrillic script take the Greek or Cyrillic version of the extension instead.`;
  return `${base} Registries can reserve particular names or set a longer minimum; the search tells you if a name cannot be registered.`;
}

function faqsFor(t: TldEntry): Faq[] {
  const dot = `.${t.slug}`;
  const path = pathFor(t);
  const scopes = [path];
  return [
    {
      question: `How much does a ${dot} domain cost?`,
      answer: `${formatPrice(t.register)} for the first year at Serverlys, and ${formatPrice(t.renew)} a year to renew. Transferring an existing ${dot} domain in costs ${formatPrice(t.transfer)}, which adds a year to its registration.`,
      scopes,
    },
    {
      question: `Who can register a ${dot} domain?`,
      answer: t.rules ?? `Anyone. ${dot} has no residency or purpose requirement, so individuals and businesses anywhere can register one.`,
      scopes,
    },
    ...(t.extraFaqs ?? []).map((f) => ({ ...f, scopes })),
    {
      question: `Does the ${dot} price go up after the first year?`,
      answer:
        t.renew === t.register
          ? `No. The renewal rate is the same ${formatPrice(t.renew)} as the first year, so there is no introductory discount to lose.`
          : `Yes: the first year is ${formatPrice(t.register)} and renewal is ${formatPrice(t.renew)} a year. Both are shown before you pay.`,
      scopes,
    },
    {
      question: `Which names can I register as a ${dot} domain?`,
      answer: namingNote(t),
      scopes,
    },
    {
      question: `How long can I register a ${dot} domain for?`,
      answer: t.country
        ? `The minimum term at Serverlys is one year. Longer terms, where the ${dot} registry allows them, are shown at checkout, and you can renew every year after that for as long as you want the name.`
        : `The minimum term at Serverlys is one year. Longer terms are shown at checkout; ICANN rules cap any generic-extension registration at ten years ahead at a time, and you can keep renewing for as long as you want the name.`,
      scopes,
    },
    {
      question: `Is WHOIS privacy included with ${dot}?`,
      answer: privacyNote(t),
      scopes,
    },
    {
      question: `Is ${dot} good for SEO?`,
      answer: googleNote(t),
      scopes,
    },
    {
      question: `Can I use a ${dot} domain for email?`,
      answer: `Yes. Email at a ${dot} address works through the domain’s MX records, which you set in DNS. Serverlys business email sets them for you, or you can point them at any other email provider; the domain and the inbox do not have to be with the same company.`,
      scopes,
    },
    {
      question: `Do I need Serverlys hosting to register ${dot}?`,
      answer: `No. You can register ${dot} on its own and point it at Serverlys hosting, at your own nameservers, or at another provider entirely. The DNS records stay editable either way.`,
      scopes,
    },
    {
      question: `What happens if my ${dot} domain expires?`,
      answer: `Renew before the expiry date and nothing changes. After expiry, most registries hold the name for a grace period, and many add a redemption period with a restore fee, before releasing it for anyone to register; the length of each is set by the ${dot} registry. Turning on auto-renewal avoids the question.`,
      scopes,
    },
    {
      question: `How do I transfer a ${dot} domain to Serverlys?`,
      answer: transferNote(t),
      scopes,
    },
  ];
}

/** Registration steps, with the eligibility step written for this extension. */
function registerSteps(t: TldEntry): [string, string][] {
  const dot = `.${t.slug}`;
  const eligibility: [string, string] = t.rules
    ? [
        "Check you are eligible",
        `${dot} has registration rules, set out above. Make sure the registrant, the person or company that will own the domain, meets them before you pay.`,
      ]
    : [
        "Pick the exact spelling",
        `${dot} has no residency or purpose requirement, so the only question is the name. Check the spelling and that it is not someone else’s trademark.`,
      ];
  const contact = t.country
    ? "Use the details of the person or organisation that should own the domain, and an email address you read: renewal notices and any registry checks go there."
    : "Use the details of the person or organisation that should own the domain. ICANN rules require the registrant’s email address to be verified, so click the confirmation email if one arrives; an unverified domain can be suspended.";
  return [
    [
      "Search the name",
      `Type the name you want with ${dot}. The search asks the registry directly, and the Serverlys cart is the final word on availability and premium pricing.`,
    ],
    eligibility,
    ["Enter the registrant details", contact],
    [
      "Pay for the first year",
      `Checkout shows ${formatPrice(t.register)} for the first year and the ${formatPrice(t.renew)} renewal rate before you pay. Registration is usually instant.`,
    ],
    [
      "Point it at your site and inbox",
      "Use Serverlys hosting and email, or add DNS records for any other provider. Changes usually show up within minutes to a few hours.",
    ],
    [
      "Turn on auto-renewal",
      "A lapsed domain can be re-registered by anyone. Auto-renewal is the cheapest insurance there is.",
    ],
  ];
}

function transferSteps(t: TldEntry): [string, string][] {
  const check: [string, string] = t.country
    ? [
        "Check the registry’s rules",
        `Make sure the domain is active and the registrant details are current. The registry for ${t.country} sets its own transfer rules, and we confirm them before you pay.`,
      ]
    : [
        "Check the 60-day window",
        "ICANN blocks transfers within 60 days of a registration or a previous transfer. Inside that window, the only option is to wait.",
      ];
  return [
    ["Unlock it", "Turn off the registrar lock at your current provider. Transfers fail while it is on."],
    ["Get the auth code", "Your current registrar must give you the authorisation (EPP) code on request."],
    check,
    [
      "Start the transfer here",
      "Enter the name and the auth code in the Serverlys cart. Your DNS keeps resolving while the transfer runs, so copy the records across before it completes.",
    ],
  ];
}

const PAIRINGS = [
  ["/hosting", "Web hosting", "Put a website on the domain, with the DNS set up for you."],
  ["/business-email", "Business email", "Addresses at your own domain instead of a free webmail one."],
  ["/wordpress-hosting", "WordPress hosting", "Managed hosting for a WordPress site on the name."],
  ["/website-design", "Website design", "Have the site designed and built for you."],
] as const;

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

const linkClass = "text-primary underline underline-offset-4";

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
            {t.renew === t.register && (
              <p className="mt-4 text-small text-fg-secondary">
                The renewal rate is the first-year rate. Many registrars discount the first year and charge
                more from the second; here the price you pay to register {dot} is the price you pay every
                year after, so the second invoice holds no surprise.
              </p>
            )}
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

      <Band tone="subtle" labelledBy="tld-uses-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="tld-uses-heading" align="left" title={`Who uses ${dot}`} />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.uses.map((u) => (
                <li key={u} className="rounded-2xl bg-canvas p-5 text-body text-fg ring-1 ring-line">
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading id="tld-tips-heading" align="left" title={`Choosing a ${dot} name`} />
            <ul className="mt-8 flex flex-col gap-4">
              {[
                ...t.tips,
                "Keep it short and easy to spell: no hyphens, no numbers, nothing that has to be explained over the phone.",
              ].map((tip) => (
                <li key={tip} className="flex gap-3 text-body text-fg-secondary">
                  <Tick />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band labelledBy="tld-included-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ManageMock slug={t.slug} renew={formatPrice(t.renew)} privacy={privacyTile(t)} />
          <div>
            <Heading
              id="tld-included-heading"
              align="left"
              title={`What comes with a ${dot} domain`}
              lede="Renewal, privacy and DNS live in one place, so pointing the name at a website or an inbox takes minutes."
            />
            <ul className="mt-8 flex flex-col gap-5">
              {(
                [
                  ["Editable DNS", `Point ${dot} at Serverlys hosting, your own nameservers, or another provider. A, CNAME, MX and TXT records stay editable either way.`],
                  ["Privacy", privacyNote(t)],
                  ["Auto-renewal", "Turn it on and the domain renews before it expires, rather than waiting for someone to remember."],
                  ["One price, every year", `${formatPrice(t.renew)} a year to renew, shown before you pay the first time.`],
                  ["People to ask", "Live chat or email, around the clock, with a person who reads the whole conversation."],
                ] as const
              ).map(([term, text]) => (
                <li key={term} className="flex gap-3">
                  <Tick />
                  <p className="text-body text-fg-secondary">
                    <span className="font-semibold text-fg">{term}.</span> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band tone="subtle" labelledBy="tld-steps-heading">
        <Heading
          id="tld-steps-heading"
          title={`How to get a ${dot} domain`}
          lede="Register a new name, or move one you already own."
        />
        <div className="mx-auto mt-12 grid max-w-[1080px] gap-12 lg:grid-cols-2">
          {(
            [
              ["tld-register-steps", `Register a new ${dot} name`, registerSteps(t)],
              ["tld-transfer-steps", `Transfer an existing ${dot} domain`, transferSteps(t)],
            ] as const
          ).map(([id, title, steps]) => (
            <div key={id}>
              <h3 id={id} className="text-h4 font-semibold text-fg">{title}</h3>
              <ol aria-labelledby={id} className="mt-6 flex flex-col gap-5">
                {steps.map(([head, body], i) => (
                  <li key={head} className="flex gap-4">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-body font-semibold text-fg">{head}</p>
                      <p className="mt-1 text-small text-fg-secondary">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-small text-fg-secondary">
          More detail in the <Link href="/transfer-domain" className={linkClass}>domain transfer guide</Link> and{" "}
          <Link href="/blog/expired-domains-guide" className={linkClass}>what happens when a domain expires</Link>.
        </p>
      </Band>

      <Band labelledBy="tld-pair-heading">
        <Heading
          id="tld-pair-heading"
          title={`Put your ${dot} domain to work`}
          lede="A domain on its own is an address. These are the things people usually connect to it."
        />
        <ul className="mx-auto mt-10 grid max-w-[1080px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAIRINGS.map(([href, title, body]) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col rounded-2xl bg-canvas p-5 ring-1 ring-line transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="text-body-lg font-semibold text-fg">{title}</span>
                <span className="mt-1 text-small text-fg-secondary">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {related.length > 0 && (
        <Band tone="subtle" labelledBy="tld-related-heading">
          <Heading
            id="tld-related-heading"
            title={`Alternatives to ${dot}`}
            lede="Extensions people compare it with, at their store prices."
          />
          <ul className="mx-auto mt-10 grid max-w-[1080px] gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={pathFor(r)}
                  className="flex h-full flex-col rounded-2xl bg-canvas p-5 ring-1 ring-line transition-colors duration-fast hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="text-body-lg font-semibold text-fg">.{r.slug}</span>
                  <span className="mt-1 text-small font-semibold text-fg">{formatPrice(r.register)}/yr</span>
                  <span className="mt-2 text-small text-fg-secondary">{r.forWhom}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-small text-fg-secondary">
            See <Link href="/tld" className={linkClass}>every domain extension</Link>{" "}
            or <Link href="/domain-name" className={linkClass}>search for a name</Link>.
          </p>
        </Band>
      )}

      <FaqSection items={faqs} />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(path)} />
    </>
  );
}
