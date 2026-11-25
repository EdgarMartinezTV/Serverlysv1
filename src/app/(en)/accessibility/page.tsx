import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { t as tx } from "@/i18n/t";

const PATH = "/accessibility";

export const metadata = pageMetadata({
  title: "Accessibility Statement | Serverlys",
  description:
    "The conformance target for serverlys.com, what we have actually done and tested, the known limitations, and how to report a barrier.",
  path: PATH,
});

/**
 * Accessibility statement.
 *
 * Every claim on this page corresponds to work that was actually done and can
 * be re-checked with the scripts in this repository — scripts/a11y.mjs for
 * structure and target sizes, scripts/validate-tokens.mjs for the computed
 * contrast floors. Nothing here asserts a conformance level we have not
 * tested for, and the known limitations section is deliberately specific.
 * A statement claiming full conformance without an audit is a liability, not
 * a credential.
 */
const SECTIONS: readonly LegalSection[] = [
  {
    id: "commitment",
    heading: "What we are aiming at",
    blocks: [
      {
        type: "p",
        text: "We build this website to meet WCAG 2.2 at Level AA. That is the target we design and test against, not a certification we are claiming to hold — no independent audit has been carried out yet, and until one has, saying otherwise would be dishonest.",
      },
      {
        type: "p",
        text: "Accessibility is built in as pages are made rather than added afterwards. Retrofitting it does not work, and every site that has tried has the markup to prove it.",
      },
    ],
  },
  {
    id: "what-we-do",
    heading: "What we have actually done",
    blocks: [
      {
        type: "ul",
        items: [
          "Colour contrast is computed rather than estimated. Every foreground and background pairing in the design system has a calculated ratio that meets the WCAG AA minimum, and a validation script checks those pairings during development.",
          "Interactive targets meet the WCAG 2.2 minimum of 24 by 24 CSS pixels, and controls on touch surfaces are sized to 44 pixels.",
          "Every page is operable by keyboard alone, including the mega menu and the mobile drawer. Focus is visible everywhere and is never removed without a replacement.",
          "The navigation uses real ARIA patterns — a tablist for the mega menu rail, a modal dialog for the mobile drawer — with focus returned to the trigger on close.",
          "Headings follow a logical order, landmarks are marked up, and there is a skip link to the main content.",
          "Forms use real labels tied to their inputs, describe their own errors, and announce them.",
          "Content that reveals on scroll is fail-safe: with JavaScript unavailable it is visible rather than stranded invisible.",
          "Motion respects prefers-reduced-motion. Under that setting, reveal animations do not have a hidden initial state at all.",
          "Data tables that are wider than a small screen scroll inside their own region, so the page itself never scrolls sideways.",
        ],
      },
    ],
  },
  {
    id: "testing",
    heading: "How we test",
    blocks: [
      {
        type: "p",
        text: "We run automated checks during development and review: heading order, images without alternative text, controls with no accessible name, unlabelled landmarks, and target sizes below the minimum. Contrast is validated separately against the design tokens. These checks are run by hand before changes go out; they are not yet an automatic gate on every deployment.",
      },
      {
        type: "p",
        text: "Automation catches perhaps a third of real accessibility problems, so pages are also operated by keyboard and checked at nine screen widths from 320 to 1440 pixels.",
      },
    ],
  },
  {
    id: "limitations",
    heading: "Known limitations",
    blocks: [
      {
        type: "p",
        text: "Being specific about what is not yet done is the part that makes the rest of this statement worth reading.",
      },
      {
        type: "ul",
        items: [
          "No independent audit has been carried out. Our testing is our own, and self-assessment has blind spots by definition.",
          "We have not completed testing with the full range of screen readers and browser combinations. Automated checks and keyboard testing are not a substitute for that.",
          "The billing and client area runs on WHMCS, third-party billing software. We have built our own theme on it, but much of the underlying markup comes from WHMCS, and the client area has not been assessed to the same standard as this site.",
          "The ConvoAI chat assistant on this site and in the client area is our own product, but it has not yet been tested with screen readers to the same standard as the pages around it.",
          "Some illustrative mock-ups on product pages use colours outside the design system, so the contrast check described above does not cover them. They are decorative pictures of a product, not controls you need to use.",
          "Our accessibility checks run by hand rather than automatically on every deployment, so a regression can reach the live site before we catch it.",
          "Where a domain registry or payment provider renders part of a flow, its accessibility is outside our control.",
        ],
      },
    ],
  },
  {
    id: "feedback",
    heading: "If something blocks you",
    blocks: [
      {
        type: "p",
        text: "Tell us. A specific report — the page, what you were trying to do, the browser and assistive technology you were using — is worth more than any audit, because it describes a real barrier rather than a theoretical one.",
      },
      {
        type: "p",
        text: "We treat accessibility reports as defects rather than feature requests. We aim to reply to an accessibility report within one business day. If something on this site prevents you doing business with us, we will also do that business with you by phone on (305) 671-1272 or by email in the meantime, at no disadvantage to you.",
      },
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <LegalPage
        title={tx("Accessibility statement")}
        intro={tx("What we target, what we have actually tested, and — the part most statements omit — what we know is not done yet.")}
        path={PATH}
        trail={[{ name: "Home", href: "/" }, { name: "Accessibility" }]}
        sections={tx(SECTIONS)}
        contact={tx("Report a barrier and we will treat it as a bug with a priority, not a suggestion for a future release.")}
      />
      <PageBreadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Accessibility", path: PATH }]} />
    </>
  );
}
