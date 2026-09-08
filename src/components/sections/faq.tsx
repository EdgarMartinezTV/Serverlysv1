import { Section, SectionHeader } from "@/components/ui/section";
import type { Faq } from "@/data/faqs";

/**
 * FAQ accordion.
 *
 * Built on native <details>/<summary>: it is keyboard operable, announced
 * correctly by screen readers, and works with JavaScript disabled — no
 * custom ARIA or state needed. The `group` marker rotates via open: styling.
 *
 * The answers rendered here must stay identical to the ones fed to the
 * FAQPage structured data, or the markup misrepresents the page.
 */
export function FaqSection({ items }: { items: readonly Faq[] }) {
  if (items.length === 0) return null;

  return (
    <Section labelledBy="faq-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
        <SectionHeader
          id="faq-heading"
          eyebrow="Questions"
          title="Before you buy"
          lede="The things people actually ask us, answered plainly."
        />

        <ul className="divide-y divide-line border-t border-line">
          {items.map((faq) => (
            <li key={faq.question}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="text-body-lg font-semibold text-fg">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-fg-muted transition-transform duration-normal ease-hover group-open:rotate-45"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4">
                      <path
                        d="M8 3v10M3 8h10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-body text-fg-secondary">
                  {faq.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
