import Link from "next/link";
import { ProductHero } from "@/components/sections/product-hero";
import { Band, Heading, Pill, Tick } from "../hosting/_components/band";
import { ComingSoonNotice, CloudPlansToday } from "../hosting/_components/coming-soon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FaqSection } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { ShowcaseSplit } from "@/components/sections/showcase-split";
import { JsonLd } from "@/components/ui/json-ld";
import { TerminalMock, ResponsibilityMock, WorkloadsMock } from "@/components/product-ui/infra";
import { billing } from "@/data/company";
import { pageMetadata, faqGraph, serviceGraph } from "@/lib/seo";
import type { Faq } from "@/data/faqs";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";
import { breadcrumbTrail } from "@/data/routes";

const PATH = "/vps-hosting";

export const metadata = pageMetadata({
  /* "Coming soon" in the title and description: the tier is not orderable,
     so neither the SERP snippet nor a share card may read as if it were. */
  title: "VPS Hosting (coming soon) — root access | Serverlys",
  description:
    "Serverlys VPS hosting is coming soon. What it is for, what the plan will include, managed versus unmanaged responsibilities, and what to use today instead.",
  path: PATH,
});

/**
 * VPS — COMING SOON. Not orderable: no price, no launch date, no hardware
 * figures presented as a spec, and no Offer in the structured data (the
 * Service graph below carries none). Everything is worded as planned.
 *
 * Architecture is a CAPABILITY page: the reason to buy a VPS is that you can
 * do things the shared tier forbids, so the page leads with a shell and then
 * answers the question that actually decides the purchase — who administers
 * it. An unmanaged VPS sold to someone who cannot run one is the most common
 * bad sale in this industry. The cloud plans, which ARE on sale, are shown
 * with real prices as the answer for anyone who does not need root.
 */
const FAQS: readonly Faq[] = [
  {
    question: "Can I buy a Serverlys VPS today?",
    answer:
      "Not yet. VPS hosting is coming soon, and we are not publishing a price or a launch date until both are real. If you need more than a website plan today, our cloud hosting is available now and is fully managed. If you specifically need root, open a ticket with our sales team and say so; we will tell you when VPS plans open.",
    scopes: [PATH],
  },
  {
    question: "What is the difference between a VPS and shared hosting?",
    answer:
      "On shared hosting you get a slice of a server's resources that flexes with what your neighbours are doing, and no system-level access. On a VPS the slice is reserved for you and you get root, so you can install packages, choose runtime versions and run background processes. You are also responsible for keeping it patched unless you buy it managed.",
    scopes: [PATH],
  },
  {
    question: "What is the difference between a VPS and cloud hosting?",
    answer:
      "Cloud hosting is a managed website platform: we run the server, the web stack and the control panel, and you deploy sites into it. A VPS is a virtual machine with its own operating system that you, or we on a managed plan, administer like any server. Cloud is the better choice for websites. A VPS is the better choice when the application needs system packages, long-running processes or a runtime the website platform does not offer.",
    scopes: [PATH],
  },
  {
    question: "Managed or unmanaged — which do I need?",
    answer:
      "If nobody in your organisation is going to apply security updates, read a system log or restart a service at an inconvenient hour, choose managed. Unmanaged is genuinely cheaper and genuinely a server administration job. There is no shame in either answer; there is real risk in choosing wrong.",
    scopes: [PATH],
  },
  {
    question: "Can I run Node, Python or a background worker?",
    answer:
      "Yes. That is most of the reason to move to a VPS. You choose the runtime and version, you can run queues, scheduled jobs and long-lived processes under a process manager such as systemd, and you can install whatever system libraries the application needs.",
    scopes: [PATH],
  },
  {
    question: "Will I be able to run Docker?",
    answer:
      "Docker needs a VPS that is a full virtual machine with its own kernel, rather than a container sharing the host's kernel. Ask that question of any VPS provider before you buy. Running Docker and Docker Compose is one of the workloads we are planning the Serverlys VPS around, and we will state the virtualisation type plainly on the plan when it launches.",
    scopes: [PATH],
  },
  {
    question: "How much CPU and memory will I need?",
    answer:
      "Less than you think, usually, and memory runs out before CPU for most web applications. The starting points on this page are for a conversation, not a quote. The honest way to size is to measure your current usage, or to start small and watch memory, CPU during your busiest hour and disk I/O for a couple of weeks.",
    scopes: [PATH],
  },
  {
    question: "What happens if I get the sizing wrong?",
    answer:
      "The plan is that you resize. Moving between VPS sizes should be a resource change rather than a migration, so starting small is the safer mistake. Disk is the exception to watch on any provider: growing a disk is easy, shrinking one usually is not.",
    scopes: [PATH],
  },
  {
    question: "Are backups included, and do they cover my database?",
    answer:
      "Backups are planned on every VPS. Be aware of one detail that applies to any provider: a disk-level snapshot of a running database is only crash-consistent. For a database you care about, also take a logical dump, such as pg_dump or mysqldump, on a schedule, and test a restore. On a managed plan we set that up with you.",
    scopes: [PATH],
  },
  {
    question: "Who is responsible for security on a VPS?",
    answer:
      "On an unmanaged VPS, you are: operating system updates, SSH configuration, the firewall and every service you install. We keep the physical host and network running. On a managed VPS we take on patching, hardening and monitoring of the operating system and standard services, and your application code stays yours in both cases.",
    scopes: [PATH],
  },
];

const FOR_YOU = [
  "An application in Node, Python, Ruby, Go or PHP that needs a specific runtime version",
  "Background workers, queues or scheduled jobs that cannot live inside a web request",
  "Software that needs a system package, such as a headless browser or image libraries",
  "Docker Compose stacks you already run on a laptop or another server",
  "An agency hosting several client sites with its own server configuration",
  "A team that has, or is paying for, someone to administer a server",
];

const NOT_FOR_YOU = [
  "A WordPress or brochure site that only needs to be fast and online",
  "Anyone hoping a VPS will be cheaper and less work than a website plan",
  "A business with nobody to apply updates, unless it buys managed",
  "Sustained heavy load that would be cheaper on a whole machine",
];

/** Workloads, each with the one thing that usually goes wrong. */
const WORKLOADS: ReadonlyArray<[title: string, body: string, watch: string]> = [
  [
    "Node.js applications",
    "Next.js, Express, NestJS or a websocket server, run as a long-lived process behind nginx. You pick the Node version and keep it there while the application needs it.",
    "Run it under systemd or a process manager so it restarts after a crash or a reboot.",
  ],
  [
    "Python applications",
    "Django, Flask or FastAPI served by gunicorn or uvicorn, with a virtual environment per project and system libraries installed where a wheel needs them.",
    "Pin dependencies; an unpinned pip install on a server is a future outage.",
  ],
  [
    "Queues and workers",
    "Celery, BullMQ, Sidekiq or a plain worker reading from Redis: email sending, imports, video and image processing, anything slower than a page load.",
    "Size for the burst, not the average. A queue that backs up is a CPU problem.",
  ],
  [
    "Docker and Compose",
    "Your stack defined in one compose file, the same on the server as on a laptop. Useful for self-hosted tools and for apps that ship as images.",
    "Docker can publish ports past a host firewall like ufw. Bind internal services to 127.0.0.1.",
  ],
  [
    "Databases",
    "PostgreSQL, MySQL or MariaDB on the same box as the application, which is simpler and faster than it sounds for most small and medium projects.",
    "Never expose the database port publicly, and schedule logical dumps as well as snapshots.",
  ],
  [
    "Several sites on one server",
    "An agency or developer hosting client sites with their own nginx or Apache configuration, PHP versions per site and their own cache rules.",
    "One compromised site can reach the others. Separate system users per site.",
  ],
];

/** Who owns what, by plan type. A real table: it is genuinely tabular data. */
const DUTIES: ReadonlyArray<[task: string, unmanaged: string, managed: string]> = [
  ["Physical hardware, power and network", "Serverlys", "Serverlys"],
  ["Hypervisor and the host machine", "Serverlys", "Serverlys"],
  ["Operating system updates", "You", "Serverlys"],
  ["SSH, firewall and hardening", "You", "Serverlys"],
  ["Web server and standard services", "You", "Serverlys"],
  ["Monitoring and restarting failed services", "You", "Serverlys"],
  ["Backups configured and restores tested", "You", "Serverlys, with you"],
  ["Your application code and dependencies", "You", "You"],
  ["Your data and who has access to it", "You", "You"],
];

const FIRST_HOUR = [
  ["Log in with an SSH key", "Then turn off password logins in sshd_config. Bots try passwords on every public IP, all day."],
  ["Create a normal user", "Use sudo for admin work instead of working as root, and keep root login off over SSH."],
  ["Turn the firewall on", "Allow only what you serve, usually 22, 80 and 443, and deny the rest by default."],
  ["Apply updates, then automate them", "Run the updates on day one and enable automatic security updates so they keep happening."],
  ["Set up backups before data arrives", "Snapshots plus a scheduled database dump, copied somewhere other than this server."],
  ["Watch it", "Uptime checks from outside, plus disk and memory alerts. A full disk is the classic silent outage."],
] as const;

export default function VpsHostingPage() {
  return (
    <>
      <JsonLd data={faqGraph(FAQS, PATH)} />
      {/* Service only — no Offer, no price: the product is not on sale. */}
      <JsonLd
        data={serviceGraph({
          name: "Serverlys VPS Hosting (coming soon)",
          serviceType: "Virtual private server hosting",
          description: String(metadata.description ?? ""),
          path: PATH,
        })}
      />

      <ProductHero
        eyebrow="VPS hosting · coming soon"
        title="Root access, and a slice that is actually yours"
        lede="A virtual private server with reserved CPU and memory and full system access, managed or unmanaged. Not on sale yet: here is what it will be, who it is for, and what to use in the meantime."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Hosting", href: "/hosting" },
          { name: "VPS hosting" },
        ]}
        specs={[
          { label: "Status", value: "Coming soon" },
          { label: "Access", value: "Full root" },
          { label: "Resources", value: "Reserved" },
          { label: "Admin", value: "Managed or not" },
        ]}
        primary={{ label: "Ask to be told at launch", href: billing.sales }}
        secondary={{ label: "Cloud hosting, available now", href: "/cloud-hosting" }}
        visual={<TerminalMock />}
      />

      <section aria-labelledby="vps-status-heading" className="bg-canvas pt-16 lg:pt-24">
        <Container width="wide">
          <h2 id="vps-status-heading" className="sr-only">Availability</h2>
          <ComingSoonNotice product="Serverlys VPS hosting" />
        </Container>
      </section>

      {/* What root buys you, in plain terms. */}
      <Band labelledBy="vps-cap-heading">
        <Heading
          id="vps-cap-heading"
          title="The things shared hosting will not let you do"
          lede="This is the whole reason the tier exists. If none of it applies to you, save the money and the administration and use a managed website plan."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Choose your runtime", "A specific Node, Python, Ruby or PHP version, held there while the rest of the world moves.", "$ nvm use 22"],
              ["Install system packages", "Image libraries, a headless browser, a search engine, a message broker.", "$ apt install imagemagick"],
              ["Run background work", "Queues, workers and schedulers, instead of hoping a web request finishes in time.", "$ systemctl start worker"],
              ["Tune the web server", "Your own nginx or Apache config, cache rules, upload limits and timeouts.", "$ nginx -t && systemctl reload nginx"],
              ["Reserved resources", "The allocation is set aside for your server, so a neighbour's spike is not your problem.", "$ nproc && free -h"],
              ["Your own firewall", "Ports, rules and access policy set the way your security review wants.", "$ ufw allow 443/tcp"],
            ] as const
          ).map(([t, d, cmd]) => (
            <li key={t} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
              <h3 className="text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 flex-1 text-small text-fg-secondary">{d}</p>
              <code aria-hidden="true" className="mt-5 block truncate rounded-lg bg-[#0d1117] px-3 py-2 font-mono text-[12px] text-[#7ee787]">
                {cmd}
              </code>
            </li>
          ))}
        </ul>
      </Band>

      {/* Fit test. */}
      <Band tone="subtle" labelledBy="vps-fit-heading">
        <Heading
          id="vps-fit-heading"
          title="Who a VPS is for, and who it is not for"
          lede="A VPS is more control and more responsibility in equal measure. It is the right tier for a specific kind of project, not the next step up for every website."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-canvas p-7 ring-1 ring-line sm:p-9">
            <Pill tone="success">A VPS suits this</Pill>
            <ul className="mt-6 flex flex-col gap-3.5">
              {FOR_YOU.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body text-fg">
                  <Tick />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-brand-50 p-7 sm:p-9">
            <Pill tone="brand">Choose a different tier for this</Pill>
            <ul className="mt-6 flex flex-col gap-3.5">
              {NOT_FOR_YOU.map((f) => (
                <li key={f} className="flex items-start gap-3 text-body text-fg">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">→</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-fg-secondary">
              For websites,{" "}
              <Link href="/cloud-hosting" className="font-semibold text-primary hover:text-primary-hover">
                cloud hosting
              </Link>{" "}
              gives you the headroom with none of the administration. For sustained heavy load,{" "}
              <Link href="/dedicated-servers" className="font-semibold text-primary hover:text-primary-hover">
                a dedicated server
              </Link>{" "}
              may be cheaper per unit of work.
            </p>
          </div>
        </div>
      </Band>

      {/* Typical workloads. */}
      <ShowcaseSplit
        id="workloads"
        eyebrow="Typical workloads"
        title="What people actually run on a VPS"
        body="Most VPS servers end up looking alike: a reverse proxy in front, one or two application processes, a worker draining a queue, and a database and cache on the same box. All of it supervised, all of it restarted automatically, and none of it reachable from the internet except through the proxy."
        points={[
          { label: "One front door", detail: "nginx terminates HTTPS and forwards to the app on a local port.", icon: "globe" },
          { label: "Supervised processes", detail: "systemd or a process manager restarts anything that dies.", icon: "gauge" },
          { label: "Private data stores", detail: "Database and cache listen on localhost, not the public IP.", icon: "shield" },
        ]}
        visual={<WorkloadsMock />}
        side="right"
        surface="light"
      />

      <section aria-labelledby="vps-work-heading" className="bg-canvas pb-16 lg:pb-24">
        <Container width="wide">
        <h2 id="vps-work-heading" className="sr-only">Workloads in detail</h2>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {WORKLOADS.map(([t, d, w]) => (
            <li key={t} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
              <h3 className="text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 flex-1 text-small text-fg-secondary">{d}</p>
              <p className="mt-4 rounded-lg bg-canvas px-3 py-2 text-small text-fg ring-1 ring-line">
                <span className="font-semibold">Watch out: </span>
                {w}
              </p>
            </li>
          ))}
        </ul>
        </Container>
      </section>

      <ShowcaseSplit
        id="managed"
        eyebrow="The question that decides it"
        title="Managed or unmanaged"
        body="Unmanaged is cheaper and it is a job. You own patching, hardening, monitoring and the 2am restart. Managed means we do all of that on your server and you keep root anyway. Most businesses buying their first VPS want managed and do not know it is an option. We plan to offer both."
        points={[
          { label: "Unmanaged", detail: "You administer it. Right if you have someone who wants to.", icon: "wrench" },
          { label: "Managed", detail: "We patch, harden and monitor. You still get root.", icon: "shield" },
          { label: "Either way", detail: "Migration help and backups are planned on every VPS.", icon: "compass" },
        ]}
        cta={{ label: "Ask which one fits", href: billing.sales, external: true }}
        visual={<ResponsibilityMock />}
        side="left"
        surface="subtle"
        bleed
      />

      {/* Responsibility table. */}
      <section aria-labelledby="vps-duty-heading" className="bg-canvas-secondary pb-16 lg:pb-24">
        <Container width="wide">
        <Heading
          id="vps-duty-heading"
          title="Who does what, line by line"
          lede="The planned split. Whichever you choose, the line between us and you is written down before you buy, not discovered during an incident."
        />
        <div className="mx-auto mt-10 max-w-[860px] overflow-x-auto rounded-2xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[520px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">Task</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">Unmanaged</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">Managed</th>
              </tr>
            </thead>
            <tbody>
              {DUTIES.map(([task, u, m]) => (
                <tr key={task} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="px-5 py-3 font-normal text-fg">{task}</th>
                  <td className={`px-5 py-3 ${u === "You" ? "font-semibold text-fg" : "text-fg-secondary"}`}>{u}</td>
                  <td className={`px-5 py-3 ${m === "You" ? "font-semibold text-fg" : "text-fg-secondary"}`}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </Container>
      </section>

      {/* First hour on an unmanaged server. */}
      <Band labelledBy="vps-hour-heading">
        <Heading
          id="vps-hour-heading"
          title="The first hour on an unmanaged server"
          lede="If you are going to run it yourself, this is the minimum, on any provider. None of it is optional on a machine with a public IP address."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FIRST_HOUR.map(([t, d], i) => (
            <li key={t} className="flex flex-col rounded-2xl bg-canvas-secondary p-6">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-micro font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-body-lg font-medium text-fg">{t}</h3>
              <p className="mt-2 text-small text-fg-secondary">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-2xl text-center text-small text-fg-secondary">
          If reading that list felt like work, that is useful information: it is the job a managed
          plan does for you.
        </p>
      </Band>

      {/* What the plan will include. */}
      <Band tone="dark" labelledBy="vps-plan-heading">
        <Heading
          id="vps-plan-heading"
          dark
          title="What we are building into the plan"
          lede="Planned for launch, not available today. Sizes and prices are published when the plans open, and not before."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Full root access", "On managed plans too. Managed changes who does the work, not what you are allowed to do."],
            ["Reserved CPU and memory", "An allocation set aside for your server, rather than a share that shrinks when a neighbour is busy."],
            ["NVMe storage", "The same storage class our cloud plans run on today."],
            ["Your own IP address", "A public IPv4 address for the server, so mail reputation and firewall rules are yours alone."],
            ["Resizing", "Move up a size as a resource change rather than a rebuild."],
            ["Backups and migration help", "Server backups, plus help moving an existing application across."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <Pill tone="on-dark">Planned</Pill>
              <h3 className="mt-4 text-body-lg font-medium text-white">{t}</h3>
              <p className="mt-1.5 text-small text-fg-on-dark-secondary">{d}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* Sizing guidance. */}
      <Band labelledBy="vps-size-heading">
        <Heading
          id="vps-size-heading"
          title="Start smaller than you think"
          lede="Rules of thumb for any provider, not Serverlys plan sizes. Over-buying on day one is the expensive mistake, not under-buying."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["One busy WordPress site with a cache", "2 vCPU · 4 GB", "PHP worker count before CPU"],
            ["A Node or Python application", "2 vCPU · 4 GB", "Memory, first and always"],
            ["App plus its own database", "4 vCPU · 8 GB", "Disk I/O and connection limits"],
            ["Several client sites on one box", "4 vCPU · 8 GB", "Memory, then storage"],
            ["Queues or media processing", "4 vCPU · 16 GB", "CPU during the burst, not the average"],
            ["A Docker Compose stack", "Sum the containers", "Each container's memory, plus headroom"],
          ].map(([a, b, c]) => (
            <li key={a} className="rounded-2xl bg-canvas-secondary p-6">
              <p className="text-body-lg font-medium text-fg">{a}</p>
              <p className="mt-4 flex items-center gap-2">
                <Pill tone="neutral">Rule of thumb</Pill>
                <span className="text-body font-semibold text-fg">{b}</span>
              </p>
              <p className="mt-3 text-small text-fg-secondary">Watch: {c}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center text-small text-fg-secondary">
          Starting points for a conversation, not a quote. The honest way to size is to measure for
          a couple of weeks: memory, CPU at your busiest hour, and disk I/O.
        </p>
      </Band>

      {/* VPS vs cloud, and the cloud plans that exist today. */}
      <Band tone="subtle" labelledBy="vps-cloud-heading">
        <Heading
          id="vps-cloud-heading"
          title="VPS or cloud hosting: what you can use today"
          lede="Cloud hosting is on sale now and is fully managed. For websites it is usually the better answer anyway. Here is the honest comparison."
        />
        <div className="mx-auto mt-10 max-w-[960px] overflow-x-auto rounded-2xl bg-canvas ring-1 ring-line">
          <table className="w-full min-w-[600px] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg"><span className="sr-only">Feature</span></th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">
                  Cloud hosting <Pill tone="success">Available now</Pill>
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-fg">
                  VPS <Pill tone="warning">Coming soon</Pill>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["What it is", "A managed website platform", "A virtual machine with its own operating system"],
                ["Server administration", "Done for you", "Yours, or ours on a managed plan"],
                ["System access", "Control panel, no root", "Full root"],
                ["Best at", "WordPress, WooCommerce, PHP sites", "Custom apps, workers, containers"],
                ["Background processes", "Not the purpose of the platform", "Yes, supervised by you"],
                ["Install system packages", "No", "Yes"],
                ["Price", "Published below", "Not published yet"],
              ].map(([k, c, v]) => (
                <tr key={k} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="px-5 py-3 font-medium text-fg">{k}</th>
                  <td className="px-5 py-3 text-fg-secondary">{c}</td>
                  <td className="px-5 py-3 text-fg-secondary">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CloudPlansToday />
      </Band>

      <Band labelledBy="vps-ask-heading">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-canvas-secondary p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 id="vps-ask-heading" className="text-h3 font-medium tracking-[-0.02em] text-fg">
              Need root, or not sure you do?
            </h2>
            <p className="mt-3 max-w-2xl text-body text-fg-secondary">
              Tell our sales team what the application is, what it runs on today and roughly what
              traffic it gets. We will tell you honestly whether cloud hosting covers it now, and
              let you know when VPS plans open if it does not.
            </p>
          </div>
          <Button href={billing.sales} external>
            Talk it through
          </Button>
        </div>
      </Band>

      <FaqSection items={FAQS} surface="subtle" />
      <FinalCta />
      <PageBreadcrumbs trail={breadcrumbTrail(PATH)} />
    </>
  );
}
