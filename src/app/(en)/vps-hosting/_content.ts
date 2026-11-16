import type { FaqItem } from "@/components/ref/faqs";

/**
 * /vps-hosting copy.
 *
 * LAYOUT is a 1:1 rebuild of hostinger.com/vps-hosting (measured at 1440 on
 * 2026-11-16). EVERY SENTENCE here is Serverlys' own — Edgar's call that day:
 * "same layout, our words". Nothing below was lifted from the reference.
 *
 * STANDING RULES FOR THIS FILE (all decided by Edgar, do not undo silently):
 *   · VPS IS NOT ON SALE. No WHMCS product exists (decided 2026-10-26), so no
 *     price, no discount, no "from $x", no Offer in structured data. The plan
 *     cards carry PLANNED sizes, labelled as planned, and every CTA goes to the
 *     sales desk, never to a cart.
 *   · NO RATINGS AND NO TESTIMONIALS. The reference's Trustpilot row and review
 *     wall are replaced by commitments a prospect can check on this site.
 *   · NO INFRASTRUCTURE CLAIMS WE HAVE NOT VERIFIED: no CPU vendor, no data
 *     centre count or cities, no latency figures, no renewable-energy claim, no
 *     DDoS vendor, no bandwidth allowance, no AI agent. Those were the
 *     reference's product facts; they are not ours.
 *   · Accent is the logo blue, never Hostinger purple.
 */

export const SALES_LABEL = "Get launch updates";

export const HERO = {
  accent: "Coming soon:",
  title: "VPS hosting",
  titleTail: "with full root access",
  lede: "A virtual server with its own CPU, memory and NVMe storage, and full root access. Run it yourself, or let us run it for you.",
  status: "Not on sale yet",
  statusNote: "Prices published at launch",
  cta: "Get launch updates",
  guarantee: "30-day money-back guarantee at launch",
  cards: [
    {
      title: "Resources reserved for you",
      body: "CPU and memory set aside for your server, so a busy neighbour never slows your app down.",
    },
    {
      title: "Backups from day one",
      body: "Server backups are planned on every size, with restores you can start from your client area.",
    },
    {
      title: "Root over SSH",
      body: "Log in with your key and install what your project needs: runtimes, packages, services.",
    },
  ],
  honesty: "Not orderable yet. We publish a price and a launch date only when both are real.",
} as const;

export type Plan = {
  name: string;
  blurb: string;
  vcpu: string;
  ram: string;
  disk: string;
  extra: string;
  featured?: boolean;
};

export const PLANS_HEAD = {
  title: "Pick a size when it opens",
  perks: ["Full root on every size", "Managed or unmanaged", "Help moving in"],
  badge: "Planned",
  featuredBadge: "Most asked for · Planned",
  price: "Coming soon",
  priceNote: "Price published at launch",
  cta: "Get notified",
  fine: "Planned configuration. Final sizes and prices are confirmed when plans open.",
  chips: ["Server backups", "Root access"],
  includedTitle: "Planned on every size",
  included: [
    "NVMe SSD storage",
    "Your own IPv4 address",
    "Firewall you control",
    "Resize as you grow",
    "Full root access",
    "Migration help",
  ],
  footnote:
    "Nothing on this page is orderable yet. Sizes are what we are building towards, not a quote.",
} as const;

export const PLANS: readonly Plan[] = [
  {
    name: "VPS 1",
    blurb: "For one app, a staging server or a side project that has outgrown shared hosting.",
    vcpu: "1 vCPU core",
    ram: "4 GB RAM",
    disk: "50 GB NVMe disk space",
    extra: "1 dedicated IPv4",
  },
  {
    name: "VPS 2",
    blurb: "For a production app with its own database, queue and background workers.",
    vcpu: "2 vCPU cores",
    ram: "8 GB RAM",
    disk: "100 GB NVMe disk space",
    extra: "1 dedicated IPv4",
    featured: true,
  },
  {
    name: "VPS 4",
    blurb: "For busy stores, Docker Compose stacks and several services on one box.",
    vcpu: "4 vCPU cores",
    ram: "16 GB RAM",
    disk: "200 GB NVMe disk space",
    extra: "1 dedicated IPv4",
  },
  {
    name: "VPS 8",
    blurb: "For agencies hosting many client sites and data-heavy applications.",
    vcpu: "8 vCPU cores",
    ram: "32 GB RAM",
    disk: "400 GB NVMe disk space",
    extra: "1 dedicated IPv4",
  },
];

export const USES_HEAD = {
  title: "One server.",
  titleMuted: "Whatever your project runs on",
  lede: "Apps, workers, containers, databases and client sites. If it runs on Linux, it runs on a Serverlys VPS.",
  stackLabel: "Typical stack:",
  cta: "Ask about yours",
} as const;

export const USES = [
  {
    title: "Node and Python apps",
    body: "Next.js, Express, Django or FastAPI as a long-running process behind nginx, on the runtime version you choose.",
    stack: ["Node", "Python", "nginx"],
    points: [
      "Pin the runtime your app was built on",
      "Restart on crash with systemd or PM2",
      "Serve HTTPS from your own proxy",
    ],
  },
  {
    title: "Queues and background work",
    body: "Email sending, imports, image and video processing: anything slower than a page load.",
    stack: ["Redis", "BullMQ", "Celery"],
    points: [
      "Run workers outside the web request",
      "Schedule jobs with cron or timers",
      "Size the server for the burst",
    ],
  },
  {
    title: "Docker Compose stacks",
    body: "The same compose file on the server as on your laptop, on a full virtual machine with its own kernel.",
    stack: ["Docker", "Compose", "Traefik"],
    points: [
      "Ship the images you already build",
      "Keep internal ports off the internet",
      "Roll back by changing a tag",
    ],
  },
  {
    title: "Databases next to your app",
    body: "PostgreSQL, MySQL or Redis on the same box, which is simpler and faster than it sounds for most projects.",
    stack: ["PostgreSQL", "MySQL", "Redis"],
    points: [
      "Keep the database on localhost",
      "Schedule logical dumps, not just snapshots",
      "Add memory before you add servers",
    ],
  },
  {
    title: "Several client sites",
    body: "An agency or developer hosting client sites with their own config, PHP versions and cache rules.",
    stack: ["nginx", "PHP-FPM", "WordPress"],
    points: [
      "One system user per site",
      "Per-site PHP versions and limits",
      "One bill, one server to look after",
    ],
  },
] as const;

export const STACK_HEAD = {
  title: "Choose your stack.",
  titleMuted: "Install what you need",
  lede: "Root means any software that runs on Linux runs here. These are the stacks people ask us about most.",
  tabs: ["Applications", "Operating systems", "Control panels"] as const,
  search: "Search apps, OS or panels",
  featuredLabel: "Most asked about",
  sortLabel: "Popular",
  more: "View more",
  less: "View less",
  empty: "Nothing matches that yet. Ask us: if it runs on Linux, it will run here.",
} as const;

export type StackItem = { name: string; tag: string; body: string };

export const STACK: Record<(typeof STACK_HEAD.tabs)[number], readonly StackItem[]> = {
  Applications: [
    { name: "n8n", tag: "Automation", body: "Workflow automation you host yourself, with your own credentials and data." },
    { name: "WordPress", tag: "CMS", body: "WordPress on your own nginx and PHP, tuned for one busy site or many small ones." },
    { name: "Docker", tag: "Containers", body: "Run any containerised app, alone or as part of a Compose stack." },
    { name: "Node.js", tag: "Runtime", body: "A long-running Node process behind nginx, on the version you pin." },
    { name: "PostgreSQL", tag: "Database", body: "A relational database next to your application, reachable only from localhost." },
    { name: "Nextcloud", tag: "Files", body: "File sync and sharing for a team, on a server whose disks you control." },
    { name: "Redis", tag: "Cache", body: "In-memory cache and queue backend for sessions, jobs and rate limits." },
    { name: "Uptime Kuma", tag: "Monitoring", body: "Self-hosted uptime checks and status pages for everything else you run." },
    { name: "Ghost", tag: "CMS", body: "A publishing platform for newsletters and blogs, on Node and MySQL." },
    { name: "Plausible", tag: "Analytics", body: "Privacy-friendly website analytics whose data never leaves your server." },
    { name: "Gitea", tag: "Developer", body: "A lightweight Git server for private repositories and code review." },
    { name: "Mattermost", tag: "Chat", body: "Team chat you host yourself, for teams that need to keep messages in-house." },
  ],
  "Operating systems": [
    { name: "Ubuntu 24.04 LTS", tag: "Linux", body: "The most common choice, with long-term security updates until 2029." },
    { name: "Debian 12", tag: "Linux", body: "Stable and conservative. A good base for servers you rarely want to touch." },
    { name: "AlmaLinux 9", tag: "Linux", body: "Binary-compatible with Red Hat Enterprise Linux, for RHEL-based tooling." },
    { name: "Rocky Linux 9", tag: "Linux", body: "Another RHEL-compatible option, community-run and long supported." },
    { name: "Fedora Server", tag: "Linux", body: "Newer packages sooner, for teams that want the latest kernel and tools." },
    { name: "Arch Linux", tag: "Linux", body: "Rolling release for people who want to build the system from the ground up." },
  ],
  "Control panels": [
    { name: "No panel", tag: "Bare server", body: "A clean server and an SSH key. The fastest and leanest option if you know Linux." },
    { name: "CyberPanel", tag: "Web panel", body: "OpenLiteSpeed-based panel for hosting several WordPress or PHP sites." },
    { name: "CloudPanel", tag: "Web panel", body: "Lightweight panel for PHP and Node sites on nginx." },
    { name: "Coolify", tag: "PaaS", body: "Self-hosted deploys from Git, a Heroku-style workflow on your own server." },
    { name: "Webmin", tag: "Admin", body: "Browser-based system administration for users, services and packages." },
    { name: "aaPanel", tag: "Web panel", body: "Point-and-click web stack management for LNMP and LAMP servers." },
  ],
};

export const PLACE_HEAD = {
  title: "Your server,",
  titleMuted: "close to your customers",
  pickerLabel: "Data centre regions",
  pickerValue: "Announced at launch",
  pickerNote: "We will list every region before plans open",
  you: "Your server",
  them: "Your customers",
  cta: "Get launch updates",
  features: [
    {
      title: "Region you choose",
      body: "Pick where your server lives when you order, so pages load from near the people who use them.",
    },
    {
      title: "Resize without rebuilding",
      body: "Move to a bigger size as a resource change, keeping your server, its data and its address.",
    },
    {
      title: "Your own IP address",
      body: "A public IPv4 for your server alone, so mail reputation and firewall rules are yours.",
    },
  ],
} as const;

export const MANAGE_HEAD = {
  title: "Run it yourself.",
  titleMuted: "Or let us run it",
  lede: "Unmanaged is cheaper and it is a job. Managed means our team patches, monitors and fixes your server, and you keep root anyway.",
} as const;

export const MANAGE_TABS = [
  {
    tab: "Troubleshoot",
    title: "Get help when something breaks",
    body: "On a managed plan, our team reads the logs, finds the cause and applies the fix with you, instead of leaving you with a ticket number.",
    ask: "My site is returning a 502. Can you take a look?",
    reply: "Your app stopped on port 3000, so nginx had nothing to forward to. We restarted it and set it to restart on its own next time.",
    lines: [
      "root@vps:~# tail -n 2 /var/log/nginx/error.log",
      "connect() failed (111) upstream 127.0.0.1:3000",
      "",
      "root@vps:~# systemctl restart app",
      "root@vps:~# curl -sI localhost:3000 | head -1",
      "HTTP/1.1 200 OK",
    ],
  },
  {
    tab: "Set up",
    title: "Start from a server that is ready",
    body: "We set up the base: SSH keys only, a normal user with sudo, the firewall on, automatic security updates and backups, before your first deploy.",
    ask: "Can you get the new server ready for a Node app?",
    reply: "Done. Password login is off, ufw allows 22, 80 and 443, Node 22 is installed and unattended upgrades are on.",
    lines: [
      "root@vps:~# ufw status",
      "Status: active",
      "22/tcp  80/tcp  443/tcp  ALLOW",
      "",
      "root@vps:~# node -v",
      "v22.11.0",
    ],
  },
  {
    tab: "Deploy",
    title: "Bring your project online",
    body: "Move an existing app across or put a new one live, with nginx in front, HTTPS on and the process supervised so it comes back after a reboot.",
    ask: "We need our Django app moved over from the old host.",
    reply: "It is live on the new server behind nginx with HTTPS. Gunicorn runs under systemd and the database was restored from last night's dump.",
    lines: [
      "root@vps:~# systemctl status gunicorn",
      "● gunicorn.service  active (running)",
      "",
      "root@vps:~# certbot certificates | grep Expiry",
      "Expiry Date: 2027-02-14 (VALID: 89 days)",
      "",
    ],
  },
  {
    tab: "Secure",
    title: "Keep the server hardened",
    body: "Security updates applied on schedule, logins watched, unused ports closed. Your application code stays yours, the operating system is our job.",
    ask: "Is anything on the server exposed that should not be?",
    reply: "Postgres was listening on all interfaces. It now binds to localhost only, and the firewall denies 5432 from outside.",
    lines: [
      "root@vps:~# ss -tlnp | grep 5432",
      "LISTEN 127.0.0.1:5432  postgres",
      "",
      "root@vps:~# apt list --upgradable 2>/dev/null | wc -l",
      "1",
      "",
    ],
  },
] as const;

export const TOOLS_HEAD = {
  title: "Full control.",
  titleMuted: "And the tools to keep it",
} as const;

export const TOOLS = [
  {
    icon: "terminal",
    title: "Full root access",
    body: "Install packages, edit any config and run any service. On managed plans too.",
  },
  {
    icon: "key",
    title: "SSH key login",
    body: "Add your public key at setup and leave password logins off from day one.",
  },
  {
    icon: "shield",
    title: "Firewall you control",
    body: "Open only the ports you serve and keep databases and admin tools private.",
  },
  {
    icon: "life",
    title: "Managed option",
    body: "Our team handles patching, hardening, monitoring and the 2am restart.",
  },
  {
    icon: "backup",
    title: "Backups and snapshots",
    body: "Server backups on every size, plus a snapshot before you change something risky.",
  },
  {
    icon: "box",
    title: "Docker ready",
    body: "A full virtual machine with its own kernel, so Docker and Compose run as they do locally.",
  },
] as const;

/**
 * The reference's review wall slot. Serverlys has no collected customer
 * reviews (checked 2026-09-14) and VPS has no customers yet, so the rail
 * carries commitments instead: each one checkable elsewhere on this site.
 * No quote marks on these cards — they are our promises, not someone's words.
 */
export const PROMISES_HEAD = {
  title: "No reviews yet.",
  titleMuted: "Here is what you can hold us to",
} as const;

export const PROMISES = [
  {
    mark: "$",
    title: "Price before you buy",
    body: "At launch, the first-term price and the renewal price sit side by side on every plan card. No surprise at renewal.",
  },
  {
    mark: "R",
    title: "Root on every plan",
    body: "Managed changes who does the work, not what you are allowed to do on your own server.",
  },
  {
    mark: "W",
    title: "Duties in writing",
    body: "Who patches, who monitors and who restores is written down before you order, not found out during an outage.",
  },
  {
    mark: "M",
    title: "Help moving in",
    body: "We help move an existing application and its database across, and check it works before you switch DNS.",
  },
  {
    mark: "30",
    title: "30 days to change your mind",
    body: "The same money-back guarantee as our other hosting plans applies to VPS at launch.",
  },
  {
    mark: "H",
    title: "An honest answer first",
    body: "If cloud hosting covers what you need, we will say so. An unmanaged VPS sold to the wrong person helps nobody.",
  },
] as const;

export const BANNER = {
  title: "Not sure a VPS is what you need?",
  body: "Tell us what your application runs on and how much traffic it gets. We will tell you whether cloud hosting covers it today, and let you know when VPS plans open.",
  primary: "Talk it through",
  secondary: "Cloud hosting, available now",
} as const;

export const FAQ_HEAD = { title: "VPS hosting FAQs" } as const;

const p = (text: string) => ({ type: "p" as const, runs: [{ text }] });

export const FAQS: readonly FaqItem[] = [
  {
    q: "What is a VPS, and what is it used for?",
    a: [
      p("A virtual private server (VPS) is a virtual machine with its own operating system, its own reserved share of CPU, memory and storage, and full root access. It runs on a physical host alongside other virtual machines, but none of them can see or slow down yours."),
      p("People move to a VPS when a project needs something a website plan does not allow:"),
      {
        type: "ul",
        items: [
          "A specific Node, Python, Ruby or PHP version",
          "Background workers, queues and scheduled jobs",
          "System packages such as image libraries or a headless browser",
          "Docker and Docker Compose stacks",
          "Several client sites with their own server configuration",
        ],
      },
    ],
  },
  {
    q: "Can I buy a Serverlys VPS today?",
    a: [
      {
        type: "p",
        runs: [
          { text: "Not yet. VPS hosting is coming soon, and we are not publishing a price or a launch date until both are real. If you need more than a website plan today, " },
          { text: "cloud hosting", href: "/cloud-hosting" },
          { text: " is available now and fully managed. If you specifically need root, contact our sales team and we will tell you when VPS plans open." },
        ],
      },
    ],
  },
  {
    q: "What is the difference between a VPS and shared hosting?",
    a: [
      p("On shared hosting you get a slice of a server that flexes with what your neighbours are doing, and no system-level access. On a VPS the resources are reserved for you and you get root, so you can install packages, choose runtime versions and run background processes. You are also responsible for keeping it patched, unless you choose a managed plan."),
    ],
  },
  {
    q: "What is the difference between a VPS and cloud hosting?",
    a: [
      p("Cloud hosting is a managed website platform: we run the server, the web stack and the control panel, and you deploy sites into it. A VPS is a virtual machine that you, or we on a managed plan, administer like any server. Cloud is the better choice for websites. A VPS is the better choice when the application needs system packages, long-running processes or a runtime the website platform does not offer."),
    ],
  },
  {
    q: "Managed or unmanaged: which do I need?",
    a: [
      p("If nobody on your team is going to apply security updates, read a system log or restart a service at an inconvenient hour, choose managed. Unmanaged is genuinely cheaper and genuinely a server administration job. There is real risk in choosing wrong, and we will give you an honest answer if you ask."),
    ],
  },
  {
    q: "Will I be able to run Docker?",
    a: [
      p("Docker needs a VPS that is a full virtual machine with its own kernel, rather than a container sharing the host's kernel. Ask that question of any VPS provider before you buy. Running Docker and Docker Compose is one of the workloads we are building the Serverlys VPS around, and we will state the virtualisation type plainly on the plan when it launches."),
    ],
  },
  {
    q: "How much CPU and memory will I need?",
    a: [
      p("Usually less than you think, and memory runs out before CPU for most web applications. As a rule of thumb, one Node or Python app or one busy WordPress site starts well on 2 vCPU and 4 to 8 GB of RAM, and an app with its own database on 4 vCPU and 8 to 16 GB. The honest way to size is to measure: watch memory, CPU at your busiest hour and disk I/O for a couple of weeks."),
    ],
  },
  {
    q: "Are backups included, and do they cover my database?",
    a: [
      p("Server backups are planned on every size. One detail applies to any provider: a disk-level snapshot of a running database is only crash-consistent. For a database you care about, also take a logical dump, such as pg_dump or mysqldump, on a schedule, and test a restore. On a managed plan we set that up with you."),
    ],
  },
  {
    q: "Who is responsible for security on a VPS?",
    a: [
      p("On an unmanaged VPS, you are: operating system updates, SSH configuration, the firewall and every service you install. We keep the physical host and network running. On a managed VPS we take on patching, hardening and monitoring of the operating system and standard services. Your application code stays yours in both cases."),
    ],
  },
];
