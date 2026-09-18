import { Band, CtaButton, Grid, Headline } from "../kit";

/**
 * "How to get the best domain name" — the reference numbers these 1–6 and
 * walks them in a switcher. They are short enough to show at once, so they
 * render as a numbered grid: nothing is hidden behind a control, and the
 * numbers come from the list rather than being typed into the copy.
 */
export type StepsCopy = {
  title: string;
  items: readonly { title: string; body: string; cta?: string }[];
};

export function Steps({ copy: STEPS }: { copy: StepsCopy }) {
  return (
    <Band labelledBy="dn-steps-heading" surface="subtle">
      <Grid>
        <Headline id="dn-steps-heading" title={STEPS.title} className="mb-8 xl:mb-12" />
        <ol className="grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {STEPS.items.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-[16px] font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-2 text-[20px] leading-7 font-semibold tracking-[-0.1px] text-fg">
                {s.title}
              </h3>
              <p className="text-body text-fg-secondary">{s.body}</p>
              {s.cta && (
                <div className="mt-2">
                  <CtaButton href="#search">{s.cta}</CtaButton>
                </div>
              )}
            </li>
          ))}
        </ol>
      </Grid>
    </Band>
  );
}
