import { Grid, Headline } from "@/components/ref/kit";

/**
 * Security tiles. Every item is something every cloud plan actually carries
 * (see data/pricing.ts INCLUDES and the Manage stage on the homepage).
 */
const ITEMS = [
  {
    title: "Free SSL certificate",
    body: "Issued and renewed automatically, so visitors' data is always encrypted.",
    icon: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z M12 15v2" />,
  },
  {
    title: "Malware scanning",
    body: "The file system is scanned on a schedule, and anything harmful is flagged.",
    icon: (
      <path d="M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Z M9 12l2 2 4-4.5" />
    ),
  },
  {
    title: "Firewall in front",
    body: "Traffic is filtered before it reaches your site, not after.",
    icon: <path d="M4 5h16v14H4z M4 10h16M4 15h16M10 5v5M14 10v5M8 15v4" />,
  },
  {
    title: "Daily backups",
    body: "A snapshot every day. Restore the whole account or one file yourself.",
    icon: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5 M12 8v4l3 2" />,
  },
] as const;

export function Security() {
  return (
    <section
      id="security"
      aria-labelledby="cloud-sec-heading"
      className="scroll-mt-14 bg-canvas py-16 lg:py-24"
    >
      <Grid>
        <Headline
          id="cloud-sec-heading"
          title="Cloud hosting that keeps your site safe from day one"
          description="Built-in protection on every plan, no extra setup, no extra cost."
          className="mb-10 xl:mb-12"
        />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((it) => (
            <li key={it.title} className="rounded-2xl bg-canvas-secondary p-6">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-5"
                >
                  {it.icon}
                </svg>
              </span>
              <h3 className="mt-6 text-body-lg font-medium text-fg">{it.title}</h3>
              <p className="mt-1.5 text-small text-fg-secondary">{it.body}</p>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  );
}
