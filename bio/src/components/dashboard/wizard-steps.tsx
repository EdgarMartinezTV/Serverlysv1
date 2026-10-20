const STEPS = ["Choose a template", "Customize", "Publish"];

export function WizardSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2 text-small sm:gap-4" aria-label="Progress">
      {STEPS.map((s, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={s} className="flex items-center gap-2 sm:gap-4" aria-current={state === "current" ? "step" : undefined}>
            <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${state === "todo" ? "bg-canvas-inset text-fg-muted" : "bg-primary text-white"}`}>{state === "done" ? "✓" : n}</span>
            <span className={`hidden font-semibold sm:inline ${state === "todo" ? "text-fg-muted" : "text-fg"}`}>{s}</span>
            {n < STEPS.length ? <span aria-hidden="true" className="h-px w-6 bg-line sm:w-12" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
