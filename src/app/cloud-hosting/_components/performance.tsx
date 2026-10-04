import { Check, Grid, Headline } from "@/components/ref/kit";

/** "Fast cloud hosting for growing websites" — two lit cards, coded metrics. */
export function Performance() {
  return (
    <section
      id="performance"
      aria-labelledby="cloud-perf-heading"
      className="scroll-mt-14 bg-canvas py-16 lg:py-24"
    >
      <Grid>
        <Headline
          id="cloud-perf-heading"
          title="Fast cloud hosting for growing websites"
          className="mb-10 xl:mb-12"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card
            title="Keep visitors with faster pages"
            points={[
              "Load pages faster with NVMe storage and LiteSpeed servers",
              "LiteSpeed caching built in, no plugin to configure",
              "Handle traffic spikes with unmetered bandwidth",
            ]}
          >
            <div className="grid w-full max-w-[460px] grid-cols-3 gap-3">
              <Tile label="PageSpeed">
                <Ring value={99} color="var(--color-success-fill)" text="99" />
              </Tile>
              <Tile label="Page views">
                <p className="mt-1 text-[22px] leading-none font-semibold text-fg">
                  1,934{" "}
                  <span className="text-micro font-semibold text-success">+32%</span>
                </p>
                <svg
                  viewBox="0 0 100 40"
                  className="mt-4 h-12 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 34 L20 30 L38 32 L56 22 L74 24 L100 6 L100 40 L0 40Z"
                    fill="var(--color-brand-100)"
                  />
                  <path
                    d="M0 34 L20 30 L38 32 L56 22 L74 24 L100 6"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1.6"
                  />
                </svg>
              </Tile>
              <Tile label="Disk usage">
                <Ring value={79} color="var(--color-primary)" text="79%" sub="used" />
              </Tile>
            </div>
          </Card>

          <Card
            title="Ready for more traffic"
            points={[
              "Move up a tier in a few clicks when you need more power",
              "More memory and visits on every step up, same panel",
              "Free migration if you are coming from another host",
            ]}
          >
            <div className="relative w-full max-w-[440px]">
              <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-e3">
                <svg
                  viewBox="0 0 100 40"
                  className="h-20 flex-1"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 L40 6 L50 8 L60 6 L100 6 L100 40 L0 40Z"
                    fill="var(--color-success-soft)"
                  />
                  <path
                    d="M0 6 L40 6 L50 8 L60 6 L100 6"
                    fill="none"
                    stroke="var(--color-success-fill)"
                    strokeWidth="1.4"
                  />
                </svg>
                <div className="w-32 shrink-0">
                  <p className="text-small text-fg">Website status</p>
                  <p className="mt-1 flex items-center gap-1.5 text-micro font-semibold text-success">
                    <span className="size-1.5 rounded-full bg-success-fill" /> Active
                  </p>
                </div>
              </div>
              <span className="absolute -right-3 -bottom-6 inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-e5">
                <svg viewBox="0 0 24 24" fill="none" className="size-7">
                  <path
                    d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 14h.01M12 14h3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </Card>
        </div>
      </Grid>
    </section>
  );
}

function Card({
  title,
  points,
  children,
}: {
  title: string;
  points: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-3xl bg-canvas-secondary">
      <div
        aria-hidden="true"
        className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-300 to-brand-500 px-6"
      >
        <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 [clip-path:polygon(50%_0,100%_0,100%_100%,0_100%)]" />
        <div className="relative flex w-full justify-center">{children}</div>
      </div>
      <div className="p-7 sm:p-8">
        <h3 className="text-h4 font-medium text-fg">{title}</h3>
        <ul className="mt-4 flex flex-col gap-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-small text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-success-fill" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex h-36 flex-col items-center rounded-xl bg-white p-3 shadow-e2">
      <p className="self-start text-micro text-fg">{label}</p>
      <div className="flex w-full flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

function Ring({
  value,
  color,
  text,
  sub,
}: {
  value: number;
  color: string;
  text: string;
  sub?: string;
}) {
  const c = 2 * Math.PI * 40;
  return (
    <div className="relative mx-auto size-[84px]">
      <svg viewBox="0 0 100 100" className="size-[84px] -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-canvas-secondary)"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] leading-none font-semibold text-fg">{text}</span>
        {sub && <span className="text-[10px] text-fg-muted">{sub}</span>}
      </span>
    </div>
  );
}
