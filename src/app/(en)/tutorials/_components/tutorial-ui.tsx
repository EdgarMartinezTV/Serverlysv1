import Link from "next/link";
import { Section } from "@/components/ui/section";

/** In-page anchor for a category group on /tutorials ("Domains & DNS" → "domains-dns"). */
export function categoryAnchor(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** The "not covered here?" band shared by the index and every tutorial. */
export function TutorialsHelpCta() {
  return (
    <Section surface="light" spacing="tight">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-7 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-h4 text-fg">Stuck on something not covered here?</h2>
          <p className="mt-2 max-w-2xl text-body text-fg-secondary">
            Support is included on every plan, and it reaches a person. There
            is also the{" "}
            <Link href="/blog" className="font-medium text-primary hover:text-primary-hover">
              blog
            </Link>{" "}
            for the why behind these, and the{" "}
            <Link href="/faq" className="font-medium text-primary hover:text-primary-hover">
              FAQ
            </Link>{" "}
            for questions about buying.
          </p>
        </div>
        <Link
          href="/support"
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-small font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Get help
        </Link>
      </div>
    </Section>
  );
}
