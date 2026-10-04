import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { pageMetadata, breadcrumbGraph } from "@/lib/seo";

/**
 * Acceptable Use Policy.
 *
 * The document a hosting company is asked for most often and the one it most
 * often lacks. The terms of service say what the contract is; this says what
 * you may actually run on the machines, and it is what support points at when
 * an account is suspended.
 *
 * Written to be ENFORCEABLE RATHER THAN EXHAUSTIVE. A list that tries to name
 * every prohibited thing dates badly and invites "it does not say I cannot".
 * Each section states the principle, then examples, and says plainly that the
 * examples are not the whole list.
 *
 * ⚠ Needs counsel review before launch, along with every other document under
 * components/legal — see that component's header.
 */

const PATH = "/acceptable-use-policy";

export const metadata = pageMetadata({
  title: "Acceptable Use Policy | Serverlys",
  description:
    "What you may and may not run on Serverlys hosting: prohibited content, email and anti-spam rules, fair use of shared resources, and how suspensions work.",
  path: PATH,
});

const SECTIONS: readonly LegalSection[] = [
  {
    id: "who",
    heading: "Who this applies to",
    blocks: [
      {
        type: "p",
        text: "This policy applies to anyone using a Serverlys service — the account holder, anyone they give access to, and anyone visiting or using a site they host with us. If you resell our hosting or build sites for clients on it, you are responsible for what your clients run.",
      },
      {
        type: "p",
        text: "It forms part of the terms of service. Where the two appear to conflict, the terms of service govern the contract and this policy governs what is allowed on the platform.",
      },
    ],
  },
  {
    id: "content",
    heading: "Content you may not host",
    blocks: [
      {
        type: "p",
        text: "You may not use Serverlys to store, publish, link to or distribute:",
      },
      {
        type: "ul",
        items: [
          "Child sexual abuse material. There is no notice period and no appeal for this. Accounts are terminated immediately and reported to the relevant authorities.",
          "Content that is unlawful in the jurisdiction it is served from or to, including material that infringes copyright, trademarks or other intellectual property.",
          "Malware, ransomware, exploit kits, keyloggers, or anything designed to gain unauthorised access to a system.",
          "Phishing pages, fake login screens, or anything impersonating a person, business or public body in order to deceive.",
          "Fraudulent schemes, including fake stores, advance-fee fraud, and investment or earnings claims designed to mislead.",
          "Content that incites violence against a person or group, or that harasses or threatens an identifiable individual.",
        ],
      },
      {
        type: "note",
        text: "This list names the clear cases. It is not exhaustive, and something can breach this policy without appearing on it.",
      },
    ],
  },
  {
    id: "conduct",
    heading: "Conduct you may not engage in",
    blocks: [
      {
        type: "p",
        text: "Separately from what you host, you may not use our network or our accounts to:",
      },
      {
        type: "ul",
        items: [
          "Attempt to access any system, account or data you are not authorised to access, whether ours or anyone else's.",
          "Run denial-of-service attacks, traffic floods, or stress tests against systems you do not own.",
          "Scan, probe or enumerate networks you have no authorisation to test.",
          "Circumvent account limits, billing, or the isolation between accounts on shared infrastructure.",
          "Forge headers, falsify origin information, or otherwise disguise where traffic is coming from.",
          "Operate open relays, open proxies or open recursive resolvers.",
        ],
      },
      {
        type: "p",
        text: "Security testing against your own site on your own account is fine and we would rather you did it. Tell us first if it will generate unusual load, so we do not mistake it for an attack.",
      },
    ],
  },
  {
    id: "email",
    heading: "Email, messaging and anti-spam",
    blocks: [
      {
        type: "p",
        text: "Mail sent from our infrastructure affects the deliverability of every other customer on it, so the rules here are firm.",
      },
      {
        type: "ul",
        items: [
          "Send only to people who asked to hear from you. Consent must be something you can evidence.",
          "Never send to purchased, rented, scraped or appended lists.",
          "Every marketing message needs a working unsubscribe that takes effect promptly, and an accurate sender identity and postal contact where the law requires one.",
          "Do not disguise the origin of a message, and do not use a reply-to address you do not monitor.",
          "Do not relay mail through our servers on behalf of a third party who is not a customer.",
        ],
      },
      {
        type: "p",
        text: "Bulk sending from shared hosting is limited by rate and volume. If you need to send at scale, use a dedicated delivery provider — that is better for you and for everyone whose mail shares our reputation.",
      },
      {
        type: "note",
        text: "A spam complaint rate that threatens the reputation of our sending infrastructure can lead to mail being suspended on an account even where the sending was technically consented to.",
      },
    ],
  },
  {
    id: "resources",
    heading: "Fair use of shared resources",
    blocks: [
      {
        type: "p",
        text: "Shared and managed plans put your site alongside others on the same hardware. Sustained resource use that degrades that hardware for everyone else is not covered by any plan, however it is described.",
      },
      {
        type: "ul",
        items: [
          "Cryptocurrency mining, and distributed computing run for its own sake, are not permitted on any plan.",
          "Do not use hosting storage as a personal backup target, media archive or file-distribution service unrelated to a site you run.",
          "Long-running processes, unattended scrapers and high-frequency cron jobs need a plan that accounts for them. Ask and we will tell you which one.",
          "Backups and restore points exist to recover your site, not as an archival store. We keep them for the retention period on your plan and no longer.",
        ],
      },
      {
        type: "p",
        text: "Where a site outgrows its plan we would rather move it than throttle it. Sustained overuse normally gets a conversation and an upgrade path first — see how we enforce, below.",
      },
    ],
  },
  {
    id: "security",
    heading: "Keeping your own account secure",
    blocks: [
      {
        type: "p",
        text: "We patch the platform. You are responsible for what you install on it.",
      },
      {
        type: "ul",
        items: [
          "Keep applications, themes and plugins updated. An outdated plugin is the most common way a site on any host is compromised.",
          "Use a unique password on your account and keep credentials out of files served to the public.",
          "Tell us promptly if you think your account or your site has been compromised.",
        ],
      },
      {
        type: "p",
        text: "A compromised site is not treated as a breach of this policy by you — it is treated as an incident we help with. What matters is that it gets fixed, because a compromised site is usually being used to attack someone else.",
      },
    ],
  },
  {
    id: "enforcement",
    heading: "How we enforce this",
    blocks: [
      {
        type: "p",
        text: "Our strong preference is to contact you first, tell you exactly what we have seen, and give you a reasonable period to fix it. Most issues are resolved that way and nothing is ever suspended.",
      },
      {
        type: "p",
        text: "We will suspend a service without prior notice where waiting would cause real harm: active distribution of malware or phishing, an attack in progress from your account, an ongoing outage caused by one account, or content of the kind named in the first item under prohibited content. Where we suspend without notice we will tell you why as soon as we have acted.",
      },
      {
        type: "ul",
        items: [
          "Suspension is normally partial and reversible — the offending site or mailbox rather than the whole account.",
          "Repeated or deliberate breaches can end the agreement under the terms of service.",
          "Termination for a breach of this policy does not entitle you to a refund of the remaining term.",
        ],
      },
      {
        type: "note",
        text: "You keep access to your data during a suspension for a breach that is not itself unlawful. We will not hold your files hostage to make a point.",
      },
    ],
  },
  {
    id: "reporting",
    heading: "Reporting something",
    blocks: [
      {
        type: "p",
        text: "If you believe something hosted by us breaches this policy, report it and we will look. Include the URL or IP address, what you think is wrong, and when you saw it — a report we cannot locate is one we cannot act on.",
      },
      {
        type: "p",
        text: "Copyright complaints follow a separate statutory process set out in our copyright and DMCA policy, because they require specific information to be actionable.",
      },
    ],
  },
];

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Acceptable use policy", path: PATH },
        ])}
      />
      <LegalPage
        title="Acceptable Use Policy"
        intro="What you may and may not run on Serverlys infrastructure, how we handle breaches, and how to report something you have found."
        path={PATH}
        sections={SECTIONS}
        trail={[{ name: "Home", href: "/" }, { name: "Acceptable use policy" }]}
        contact="Questions about this policy, or want to check whether something is allowed before you build it? Ask first — we would rather answer than suspend."
      />
    </>
  );
}
