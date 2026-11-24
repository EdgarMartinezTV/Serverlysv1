/**
 * Two articles published 2026-11-24, both from content gaps found in the
 * Search Console export of 2026-11-24 (last 3 months): queries the domain
 * already earned impressions for with no page targeting them.
 *
 *   · hipaa-website-hosting
 *                         "medical website hosting" (33 impr), "hosting
 *                         options for medical applications", "medical
 *                         practice website hosting", "chiropractic website
 *                         hosting", "medical web hosting": ~87 impressions,
 *                         avg position ~70, served only by the DESIGN pages
 *                         /website-design/medical and /chiropractic. Links
 *                         back up to both.
 *
 *                         ⚠ IT DOES NOT CLAIM SERVERLYS IS HIPAA HOSTING OR
 *                         SIGNS BAAs. That is unconfirmed, and asserting it
 *                         would be a regulatory claim, not marketing copy.
 *                         The position matches the industry pages: the public
 *                         site carries no patient information; intake, portal
 *                         and messaging go through HIPAA tools whose vendors
 *                         sign a BAA. Change the "serverlys" section only if
 *                         Edgar confirms a BAA offering.
 *
 *                         Legal facts used, all checked 2026-11-24:
 *                         HHS OCR cloud computing guidance (a host that stores
 *                         ePHI is a business associate even if it cannot read
 *                         it); AHA v. Becerra, N.D. Tex., 20 June 2024,
 *                         vacated the "proscribed combination" part of OCR's
 *                         tracking-technology bulletin, OCR dropped its appeal,
 *                         authenticated pages remain covered; the Security
 *                         Rule NPRM of 6 January 2025 is still not final.
 *                         No penalty amounts quoted. Not legal advice, and the
 *                         article says so.
 *
 *   · how-long-does-a-domain-transfer-take
 *                         "time to transfer domain", "faster domain name
 *                         transfer", "faster way to transfer domain name",
 *                         "how to transfer a domain within 60 days of
 *                         registration": ~72 impressions at position ~79, the
 *                         one unanswered question inside the 1,000+ impression
 *                         transfer cluster. /transfer-domain and the tutorial
 *                         cover the steps; this covers TIMING and the locks.
 *
 *                         Facts from ICANN's Transfer Policy page, read
 *                         2026-11-24: §3.5 five calendar days then default
 *                         approval; §3.7.5/3.7.6 registrar MAY deny within 60
 *                         days of creation or of a transfer; §II.C.2 60-day
 *                         Change of Registrant lock (registrar may offer an
 *                         opt-out). The reform the Board adopted on 7 June
 *                         2026 (30-day locks, single-use Transfer
 *                         Authorization Code) has NO effective date yet, so it
 *                         is described as coming, not current. Revisit when
 *                         ICANN announces one, and bump `updated`.
 *
 * Same editorial rules as original.ts: no invented statistics, no quotes, no
 * named competitors. No price quoted. No cover photos yet: both fall back to
 * the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261124b: readonly Article[] = [
  {
    slug: "hipaa-website-hosting",
    title: "HIPAA website hosting: does your medical practice website need it?",
    seoTitle: "HIPAA website hosting for medical practices",
    description:
      "When a medical, dental, chiropractic or therapy practice website needs HIPAA-compliant hosting and when it does not: patient forms, portals, email, tracking pixels, business associate agreements and a simple setup that keeps patient data off the website.",
    category: "Hosting",
    published: "2026-11-24",
    body: [
      {
        type: "p",
        text: "If you run a medical, dental, chiropractic or therapy practice, sooner or later someone will tell you that your website needs \"HIPAA-compliant hosting\". Sometimes that is true. Often it is not, and practices end up paying for specialist hosting for a site that never touches a single piece of patient information, while the real risk sits in a contact form or an email inbox nobody thought about.",
      },
      {
        type: "p",
        text: "This guide explains, in plain English, what HIPAA actually cares about on a website, which parts of a practice website handle patient information, and the simplest way to set things up so the website itself stays out of scope.",
      },
      {
        type: "callout",
        title: "The short answer",
        text: "HIPAA protects patient health information, not websites. If your website only shows information about the practice (services, providers, hours, location, insurance accepted) and collects no health details, it does not need HIPAA hosting. It needs HIPAA-level care the moment it collects, stores or sends health information about a patient, and anything that does that needs a vendor who will sign a **business associate agreement**.",
      },
      {
        type: "p",
        text: "This article is general information for practice owners, not legal advice. For decisions about your own practice, speak to your compliance officer or a healthcare attorney.",
      },
      { type: "h2", id: "what-hipaa-covers", text: "What HIPAA cares about on a website" },
      {
        type: "p",
        text: "HIPAA applies to \"covered entities\" (most healthcare providers that bill insurance electronically, health plans and clearinghouses) and to the companies that handle patient information for them. What it protects is **protected health information (PHI)**: information that identifies a patient and relates to their health, care or payment for care. On a computer or the internet it is called **ePHI**.",
      },
      {
        type: "p",
        text: "A name on its own is not PHI. A name together with \"I'd like an appointment about my knee pain\" sent to a clinic is, because it links a person to a health condition and to your practice. That is why the question is never \"is my website HIPAA compliant?\" in general. It is \"which parts of my website touch patient information, and where does that information go?\"",
      },
      { type: "h2", id: "needs-it-or-not", text: "Does your website handle patient information?" },
      {
        type: "table",
        head: ["Part of the website", "Usually handles PHI?", "What to do"],
        rows: [
          ["Home, services, providers, hours, map, insurance list", "No", "Normal secure hosting is fine"],
          ["Blog posts and health articles anyone can read", "No", "Normal secure hosting is fine"],
          ["General contact form (\"name, email, message\")", "Often, because patients write about symptoms anyway", "Label it \"not for medical questions\", or replace it with a HIPAA tool"],
          ["Appointment request form asking the reason for the visit", "Yes", "Use a scheduler whose vendor signs a BAA"],
          ["New-patient intake, health history, consent forms", "Yes", "Use your EHR or practice software's own forms"],
          ["Patient portal, test results, messaging", "Yes", "Link to your EHR's portal, do not rebuild it on the website"],
          ["Online bill pay", "Can do, depending on what is collected", "Use your practice software or a payment provider set up for healthcare"],
          ["Live chat or AI chat on the site", "Yes, if patients can describe symptoms", "Use a tool that signs a BAA, or tell visitors not to share health details"],
        ],
      },
      {
        type: "p",
        text: "Most practice websites fall into a familiar pattern: a public site that needs no special hosting, plus three or four places where patients are invited to share health details. Those few places are where the work is.",
      },
      { type: "h2", id: "hidden-risks", text: "The four places practices get caught out" },
      { type: "h3", text: "1. The contact form that emails everything" },
      {
        type: "p",
        text: "A standard website form usually sends each submission as an ordinary email to the front desk, and often keeps a copy in the website's database too. If patients use it to describe symptoms or ask about their treatment, that information now lives in your website database, your email provider and every device that downloads the mail. Either keep health information out of the form (a clear note above it, and no \"reason for visit\" field), or move the form to a HIPAA-ready form tool.",
      },
      { type: "h3", text: "2. Email" },
      {
        type: "p",
        text: "Email is the most common way patient information leaves a practice. If staff email patients about appointments, results or billing, the email provider is handling PHI and needs to be covered by a business associate agreement. The large business email providers offer one on certain plans, but you usually have to request or accept it in the admin settings; it is not switched on by default.",
      },
      { type: "h3", text: "3. Tracking pixels and analytics" },
      {
        type: "p",
        text: "Advertising pixels and analytics scripts send information about each visit to the company that made them: which page was opened, the visitor's IP address and sometimes what was typed or clicked. In 2022 the US Department of Health and Human Services' Office for Civil Rights (OCR) issued guidance on these tools, and in June 2024 a federal court in Texas vacated part of it in American Hospital Association v. Becerra. The part that was struck down concerned public pages viewed by someone who is not logged in. OCR later dropped its appeal.",
      },
      {
        type: "p",
        text: "What still stands matters more for most practices: tracking on **logged-in pages**, such as a patient portal or a booking flow tied to a patient's account, is still treated as handling PHI. On top of HIPAA, several states have their own health-privacy laws that cover tracking on health websites. The safe default is simple: keep advertising pixels off anything a patient logs in to, off booking and intake pages, and off any page where a visitor enters health details.",
      },
      { type: "h3", text: "4. Plugins and third-party tools" },
      {
        type: "p",
        text: "Every form plugin, chat widget, booking embed or backup service that sees patient information is part of the chain. A HIPAA-ready host does not help if the form plugin sends submissions through a service that has never heard of a business associate agreement.",
      },
      { type: "h2", id: "baa", text: "What a business associate agreement is, and who needs one" },
      {
        type: "p",
        text: "A **business associate agreement (BAA)** is a contract between your practice and a company that creates, receives, stores or sends patient information on your behalf. In it, the company agrees to protect that information under HIPAA's rules and to tell you if it is exposed.",
      },
      {
        type: "p",
        text: "OCR's [guidance on cloud computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) is clear on one point that surprises many practices: a hosting or cloud provider that stores ePHI is a business associate **even if the data is encrypted and the provider cannot read it**. So if patient information lives on a server, the company running that server needs to sign a BAA. If a vendor will not sign one, do not put patient information on its systems.",
      },
      {
        type: "ul",
        items: [
          "**Needs a BAA:** your EHR or practice-management software, online scheduling that collects the reason for a visit, intake form tools, your business email provider if staff email patients, any chat tool patients use, and any host or backup service that stores patient information.",
          "**Usually does not:** the company hosting a purely informational website that collects no patient information, and the designer who builds it, as long as neither ever has access to patient data.",
        ],
      },
      { type: "h2", id: "what-hipaa-hosting-includes", text: "What \"HIPAA-compliant hosting\" actually means" },
      {
        type: "p",
        text: "There is no official HIPAA certification for a host, so the label means whatever the provider says it means. When a website genuinely needs to store patient information, look for a provider that offers all of the following in writing:",
      },
      {
        type: "ul",
        items: [
          "**A signed business associate agreement**, before any patient data goes in. This is the non-negotiable one.",
          "**Encryption** of data in transit (HTTPS everywhere) and at rest (on the server's disks and in backups).",
          "**Access controls:** named accounts, strong passwords, [two-factor authentication](/blog/two-factor-authentication) and the ability to remove access quickly. Our guide on [who has access to your website](/blog/who-has-access-to-your-website) explains how to review it.",
          "**Audit logs** showing who accessed or changed what, kept for a defined period.",
          "**Encrypted backups and a tested restore**, so patient data is not lost, plus a clear answer on where backups are stored.",
          "**Breach notification terms:** how quickly they will tell you about an incident and what they will tell you.",
          "**Security updates** for the server and the software it runs, with a stated process.",
        ],
      },
      {
        type: "p",
        text: "HIPAA's Security Rule is also expected to tighten. OCR published a proposed update in January 2025 that would make several of these practices, such as encryption and multi-factor authentication, explicit requirements. At the time of writing it has not been finalised, but it points in one direction: more of this will be expected, not less.",
      },
      { type: "h2", id: "simple-setup", text: "The simple setup most practices should use" },
      {
        type: "p",
        text: "For most small practices, the cleanest approach is to split the job in two, so the website never holds patient information at all.",
      },
      {
        type: "ol",
        items: [
          "**The public website** handles everything a prospective patient needs before they get in touch: services, providers, insurance, location, reviews and articles. It runs on ordinary secure hosting with HTTPS, backups and updates, and it collects no health details.",
          "**Your HIPAA tools** handle everything that involves a patient's health: online booking, intake forms, the patient portal, messaging and payments. These come from your EHR or practice software, or from vendors that sign a BAA. The website simply links to them or embeds them.",
          "**The contact form** stays short (name, phone or email, preferred time) and says clearly above the form that it is not for medical questions or emergencies.",
          "**Tracking scripts** stay off the booking, intake and portal pages.",
          "**Staff email** with patients runs on a business email plan covered by a BAA.",
        ],
      },
      {
        type: "p",
        text: "This is how we design practice websites at Serverlys. On our [medical practice websites](/website-design/medical) and [chiropractic websites](/website-design/chiropractic), scheduling and intake are linked to the practice's own HIPAA-compliant tools, and the general contact form is labelled not to be used for health information.",
      },
      { type: "h2", id: "checklist", text: "A quick checklist for your practice website" },
      {
        type: "ul",
        items: [
          "List every form, chat box, booking button and embed on the site, and write down where each one sends what it collects.",
          "For each one that can receive health information, confirm the vendor has signed a BAA with you. If not, replace it or remove the health questions.",
          "Add a short note above general forms: \"Please do not include medical information. For emergencies call 911.\"",
          "Check which tracking and advertising scripts run on the site, and remove them from booking, intake and portal pages.",
          "Make sure the whole site loads over HTTPS. If any page shows a warning, see [why a site says \"Not secure\"](/blog/website-not-secure-warning).",
          "Turn on two-factor authentication for the website, hosting, domain and email accounts, and remove former staff.",
          "Confirm backups run daily and that you have actually restored one. See our [website backup strategy](/blog/website-backup-strategy).",
          "Keep the site's software and plugins updated. Our [website security checklist](/blog/website-security-checklist) covers the rest.",
        ],
      },
      { type: "h2", id: "serverlys", text: "Where Serverlys fits" },
      {
        type: "p",
        text: "Serverlys builds and hosts the public side of a practice's online presence: a fast, secure website on managed [web hosting](/hosting) with free SSL, daily backups and updates handled for you. Our standard hosting is meant for that public website, not for storing patient records, so we set your site up to send patient information to the HIPAA tools you already use rather than collecting it on the website. If you are not sure whether something on your current site handles patient information, [contact support](/support) and we will walk through it with you.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Does a medical practice website have to be HIPAA compliant?" },
      {
        type: "p",
        text: "Only the parts that handle patient health information. A website that just describes the practice and collects no health details is not handling PHI. As soon as a form, chat, portal or booking flow collects health information, that part must be handled by systems covered by a business associate agreement.",
      },
      { type: "h3", text: "Is a contact form on a medical website a HIPAA problem?" },
      {
        type: "p",
        text: "It can be, because patients often describe symptoms in a free-text message even when you do not ask. Keep the form short, add a clear note not to include medical information, and send appointment requests that need a reason for the visit through a HIPAA-ready scheduling or form tool instead.",
      },
      { type: "h3", text: "Can I use Google Analytics or a Meta pixel on my practice website?" },
      {
        type: "p",
        text: "Be careful. Tracking on logged-in pages such as a patient portal is still treated as handling PHI under OCR's guidance, and several states have their own health-privacy laws. Keep these scripts off booking, intake and portal pages, and ask your compliance adviser before using them anywhere patients might enter health details.",
      },
      { type: "h3", text: "Does my web host need to sign a BAA?" },
      {
        type: "p",
        text: "Only if patient information is stored on, or passes through, its servers. If your website collects no patient information and your forms, booking and portal run on separate HIPAA tools, the website host is not handling PHI. If patient data does end up on the server, OCR's guidance says the host is a business associate even when the data is encrypted.",
      },
      { type: "h3", text: "Is there such a thing as a HIPAA certification for hosting?" },
      {
        type: "p",
        text: "No. HHS does not certify hosts or software. A provider describing its service as HIPAA compliant is describing its own safeguards. What matters is what it will put in writing, starting with a signed business associate agreement.",
      },
    ],
  },
  {
    slug: "how-long-does-a-domain-transfer-take",
    title: "How long does a domain transfer take? The 5-day window, the 60-day rule and how to go faster",
    seoTitle: "How long does a domain transfer take?",
    description:
      "Most domain transfers finish within five days, and many finish the same day. Here is what decides the timing, why a domain cannot move within 60 days of registration, and how to speed a transfer up safely.",
    category: "Domains",
    published: "2026-11-24",
    body: [
      {
        type: "p",
        text: "You have decided to move your domain to a new registrar. The next question is always the same: how long will it take, and will my website go down while it happens? The short version is that most transfers of common endings like .com finish within five days, many finish the same day, and your website and email keep working throughout, as long as you check one thing first.",
      },
      {
        type: "callout",
        title: "The short answer",
        text: "Up to **5 days** once the transfer starts. Often **a few hours** if you approve it at the registrar you are leaving. **Not at all** if the domain was registered, or last transferred, in the last 60 days: most registrars refuse those transfers, so you have to wait.",
      },
      { type: "h2", id: "timeline", text: "The timeline, step by step" },
      {
        type: "table",
        head: ["Stage", "How long it usually takes", "What decides it"],
        rows: [
          ["Unlock the domain and get the transfer code", "Minutes", "Some registrars email the code; a few take up to five days"],
          ["Start the transfer at the new registrar and pay", "Minutes", "The code has to be entered correctly"],
          ["Confirmation email, if the new registrar sends one", "As fast as you click it", "Goes to the owner's email address on the domain"],
          ["The registrar you are leaving responds", "Up to 5 days", "Approving it yourself makes this almost instant"],
          ["The domain shows the new registrar", "Within hours of approval", "WHOIS and the new account update"],
        ],
      },
      {
        type: "p",
        text: "The longest step is the one in the middle. ICANN's [Transfer Policy](https://www.icann.org/resources/pages/transfer-policy-2016-06-01-en), the rulebook for .com, .net, .org and the other generic endings, gives the registrar you are leaving five calendar days to respond once the transfer is requested. If it does nothing in that time, the transfer is approved by default. So five days is the ceiling for a normal transfer, not the typical time.",
      },
      { type: "h2", id: "60-day-rule", text: "The 60-day rule: why some domains cannot move yet" },
      {
        type: "p",
        text: "Under ICANN's policy, a registrar may refuse a transfer in two situations tied to time, and in practice almost every registrar does:",
      },
      {
        type: "ul",
        items: [
          "**Within 60 days of the domain's creation date.** A domain you registered last month cannot move yet.",
          "**Within 60 days of a previous transfer.** A domain you just moved has to stay put for 60 days.",
        ],
      },
      {
        type: "p",
        text: "There is also a third, less known lock. When you change the domain's owner details, such as the registrant's name, organisation or email address, many registrars apply a **60-day Change of Registrant lock**. Some let you opt out of it at the moment you make the change. If you plan to update the owner details and transfer, check whether your registrar applies this lock and whether the opt-out is offered, or transfer first and update the details afterwards.",
      },
      {
        type: "p",
        text: "To see where you stand, run your domain through a [WHOIS lookup](/whois-lookup) and look at the **Created** (or Registered) date and, if it has moved before, when that happened. Our guide on [finding where your domain is registered](/blog/where-is-my-domain-registered) explains each line of the result.",
      },
      {
        type: "callout",
        title: "Can I transfer a domain within 60 days of registration?",
        text: "Usually not to a different registrar. There is no fee or form that skips the lock, and anyone offering one should be treated with suspicion. What you can do in the meantime is everything that does not need a transfer: point the domain at your new hosting by [changing its nameservers](/tutorials/change-nameservers), and move the transfer itself once the 60 days have passed.",
      },
      { type: "h2", id: "go-faster", text: "How to make a transfer go faster" },
      {
        type: "ol",
        items: [
          "**Check the owner's email address first.** Approval emails and sometimes the code go to the registrant email on the domain. If that address is an old one you cannot open, update it before you begin, bearing in mind the Change of Registrant lock above.",
          "**Unlock the domain and get the code in one sitting**, then start the transfer straight away. The code is sometimes called the auth code, EPP code or transfer key.",
          "**Approve the transfer at the registrar you are leaving.** Many send an email with an approve link, or show a pending transfer in the account with an \"approve now\" button. Approving it there cuts the five-day wait to minutes or hours.",
          "**Copy the code exactly.** A wrong code, often caused by an extra space or a confusing character, makes the transfer fail and you start again.",
          "**Make sure the domain is not close to expiry or already expired.** Some registrars block transfers in the last days before expiry or after it, and recovering an expired domain first takes longer than a transfer.",
        ],
      },
      { type: "h2", id: "slow-or-stuck", text: "Why a transfer is slow or stuck" },
      {
        type: "table",
        head: ["What you see", "Likely cause", "What to do"],
        rows: [
          ["Rejected straight away", "The domain is still locked, or inside the 60-day window", "Remove the transfer lock, or wait until 60 days have passed"],
          ["\"Invalid authorization code\"", "Code copied wrongly, or a new code was generated since", "Request a fresh code and paste it without spaces"],
          ["Pending for days", "Waiting for the registrar you are leaving", "Approve it there, or wait for the five-day default approval"],
          ["Pending, waiting for confirmation", "The confirmation email went to an address nobody checks", "Check the registrant email on the domain, including spam"],
          ["Rejected by the losing registrar", "Unpaid invoice, a dispute, or a recent owner change", "Ask the registrar for the reason; they must give one"],
        ],
      },
      { type: "h2", id: "downtime", text: "Will my website or email go down during the transfer?" },
      {
        type: "p",
        text: "Not if the DNS stays where it is. A transfer moves where you rent and renew the domain. It does not, by itself, change where your website or email live, because that is set by your nameservers and DNS records.",
      },
      {
        type: "p",
        text: "The one trap is free DNS from the registrar you are leaving. If the old registrar also runs your DNS, your records can be deleted when the domain leaves, and the website and email stop. Check your nameservers before you start. If they belong to the old registrar, copy every record (especially the MX records for email) to your hosting or another DNS provider and switch the nameservers first. Our [step-by-step transfer tutorial](/tutorials/transfer-a-domain) walks through it, and [how DNS propagation works](/blog/dns-propagation-explained) explains what happens after a nameserver change.",
      },
      { type: "h2", id: "country-endings", text: "Country endings follow their own rules" },
      {
        type: "p",
        text: "Everything above applies to generic endings such as .com, .net, .org, .info and the newer ones like .xyz or .live. Country-code endings such as .uk, .ca, .de or .co are run by national registries that set their own transfer process, timing and locks. Some move in minutes with no 60-day rule at all, others need a different kind of approval. Check the rules for your ending, or ask the registrar you are moving to before you start.",
      },
      { type: "h2", id: "rules-changing", text: "The rules are changing, but not yet" },
      {
        type: "p",
        text: "In June 2026 the ICANN Board adopted a set of changes to the Transfer Policy. Once they are implemented they are expected to shorten the post-registration and post-transfer locks from 60 days to 30 days and replace today's transfer code with a single-use **Transfer Authorization Code**. At the time of writing ICANN has not announced a date for these changes to take effect, so the 60-day rules above still apply to every transfer today. We will update this article when that changes.",
      },
      { type: "h2", id: "transfer-to-serverlys", text: "Transferring your domain to Serverlys" },
      {
        type: "p",
        text: "When you [transfer a domain to Serverlys](/transfer-domain), the time you have already paid for is kept and, for most generic endings, a year is added to the registration. You start the transfer from your client area, and we keep you updated until it completes. If you are not sure your domain is ready to move, or whether your DNS will come with it, [contact support](/support) and we will check it with you before you start. If the move is part of a bigger change, our guides on [keeping control of your domain](/blog/keep-control-of-your-domain) and [moving a website without downtime](/blog/move-a-website-without-downtime) cover the rest.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "How long does a .com domain transfer take?" },
      {
        type: "p",
        text: "Up to five days once it has been requested, and often a few hours if you approve it at the registrar you are leaving. It cannot start if the domain was registered or transferred in the last 60 days.",
      },
      { type: "h3", text: "Can I speed up a domain transfer?" },
      {
        type: "p",
        text: "Yes. Unlock the domain and start the transfer in one go, make sure you can open the owner's email address, and approve the transfer at the registrar you are leaving instead of waiting for the five-day default approval.",
      },
      { type: "h3", text: "Why can't I transfer my domain within 60 days?" },
      {
        type: "p",
        text: "ICANN's Transfer Policy lets registrars refuse transfers within 60 days of registration or of a previous transfer, mainly to protect owners from hijacking and payment fraud. Almost all registrars apply it. Many also lock a domain for 60 days after the owner details change.",
      },
      { type: "h3", text: "Do I lose the time left on my domain when I transfer it?" },
      {
        type: "p",
        text: "No. For generic endings like .com, the remaining time carries over and the transfer normally adds one year to the expiry date, which is what the transfer fee pays for.",
      },
      { type: "h3", text: "Is it a scam if someone offers to transfer my domain for me?" },
      {
        type: "p",
        text: "Often, if you did not ask. Fake renewal notices that are really transfer authorisations are a common trick. See [how to spot a fake domain invoice](/blog/domain-renewal-scams).",
      },
    ],
  },
];
