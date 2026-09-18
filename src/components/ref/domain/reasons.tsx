import { Band, CtaButton, Gear, Grid, Headline, ShieldCheck } from "../kit";

/** Small inline icons this band needs and the shared kit does not carry. */
function Lock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.25 10.5V7.75a3.75 3.75 0 0 1 7.5 0v2.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Chat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9.5L5.5 19v-3.5h-1a2 2 0 0 1 0-.1v-8.9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = { shield: ShieldCheck, lock: Lock, chat: Chat, gear: Gear } as const;

export type ReasonsCopy = {
  title: string;
  cta: { label: string; href: string };
  items: readonly { icon: keyof typeof ICONS; title: string; body: string }[];
};

/**
 * The reference's four-up card row inside one lavender panel, CTA beneath.
 * Shared across the domain pages; each supplies its own four reasons.
 */
export function Reasons({ copy: REASONS }: { copy: ReasonsCopy }) {
  return (
    <Band labelledBy="dn-reasons-heading">
      <Grid>
        <Headline id="dn-reasons-heading" title={REASONS.title} className="mb-8 xl:mb-12" />

        <div className="rounded-2xl bg-canvas-secondary p-8 xl:p-12">
          <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
            {REASONS.items.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={item.title} className="flex flex-col gap-2">
                  <span className="mb-2 grid size-10 place-items-center rounded-md bg-primary-soft text-fg">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
                    {item.title}
                  </h3>
                  <p className="text-body text-fg-secondary">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <CtaButton href={REASONS.cta.href}>{REASONS.cta.label}</CtaButton>
        </div>
      </Grid>
    </Band>
  );
}
