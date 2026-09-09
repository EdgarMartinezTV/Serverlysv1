/**
 * Task tutorials.
 *
 * Distinct from `articles.ts` by intent: an article explains a subject, a
 * tutorial gets one job done. Everything here is a procedure someone can
 * follow start to finish, and every step is real — the DNS record types, the
 * SPF syntax and the WordPress settings are what they actually are.
 *
 * Rule: no step may say "contact support" as its substance. If the only
 * honest answer to a step is that it varies by provider, say what varies.
 */

export type Step = {
  title: string;
  detail: string;
  /** Optional literal to copy — a record value, a config line, a command. */
  code?: string;
};

export type Tutorial = {
  slug: string;
  title: string;
  summary: string;
  category: "Domains & DNS" | "Email" | "WordPress" | "Security" | "Recovery";
  minutes: number;
  /** Stated before step one, so nobody gets halfway and stops. */
  before: readonly string[];
  steps: readonly Step[];
  /** The mistake people actually make. */
  gotcha: string;
};

export const tutorials: readonly Tutorial[] = [
  {
    slug: "point-your-domain",
    title: "Point your domain at Serverlys",
    summary:
      "The two ways to connect a domain to your hosting, and how to choose between them.",
    category: "Domains & DNS",
    minutes: 10,
    before: [
      "Access to wherever your domain is registered",
      "Your Serverlys nameservers or server IP, both in your welcome email",
    ],
    steps: [
      {
        title: "Decide: nameservers or an A record",
        detail:
          "Changing nameservers hands all DNS for the domain to Serverlys — simplest, and right for most people. Changing only the A record points the website here while leaving everything else, including email, answered where it is now. If your email is with Google Workspace or Microsoft 365 and you do not want to recreate those records, use the A record.",
      },
      {
        title: "Write down what you have now",
        detail:
          "Before changing anything, screenshot the current DNS records — especially MX, TXT and any CNAME. If you switch nameservers without copying these across, email stops. This is the single most common way a domain move breaks a business.",
      },
      {
        title: "Lower the TTL, then wait",
        detail:
          "Set the TTL on the record you are about to change to 300 seconds and leave it for at least as long as the old TTL was. Resolvers around the world are caching the old value; this is how you stop them caching it for another day after you make the change.",
        code: "TTL: 300",
      },
      {
        title: "Make the change",
        detail:
          "For nameservers, replace the existing entries with the Serverlys pair. For an A record, set the host to @ and the value to your server IP, then add a CNAME for www pointing at your domain.",
        code: "A     @     your.server.ip.address\nCNAME www   yourdomain.com.",
      },
      {
        title: "Confirm it resolves here",
        detail:
          "Check from a device that has never visited the new server — a phone on mobile data is ideal. Your own machine may have the old answer cached for hours regardless of TTL.",
      },
      {
        title: "Issue the SSL certificate",
        detail:
          "Only after the domain resolves to us. Certificate issuance validates by looking up the domain, so it cannot succeed before DNS points here. Then raise the TTL back to something sensible, like 3600.",
      },
    ],
    gotcha:
      "Switching nameservers without copying your MX records first. The website comes up, everything looks fine, and email silently stops arriving — often for a day before anyone notices.",
  },
  {
    slug: "email-deliverability",
    title: "Set up email that actually gets delivered",
    summary:
      "SPF, DKIM and DMARC in plain terms, and the order to add them in.",
    category: "Email",
    minutes: 20,
    before: [
      "Access to your domain's DNS records",
      "A list of everything that sends mail as your domain",
    ],
    steps: [
      {
        title: "List every sender first",
        detail:
          "Your mail server, your website's contact form, your invoicing tool, your newsletter platform, your CRM. Each one sends as your domain, and any you forget will start failing the moment you publish a strict policy. This list is the whole job — the DNS records are the easy part.",
      },
      {
        title: "Publish one SPF record",
        detail:
          "SPF names the servers allowed to send as your domain. You may only have ONE SPF record per domain; two is a permanent error and worse than none. Merge every sender into a single record.",
        code: "v=spf1 include:_spf.yourhost.com include:_spf.google.com ~all",
      },
      {
        title: "Turn on DKIM at each sender",
        detail:
          "DKIM signs outgoing mail cryptographically so a receiver can tell it was not altered. Each platform gives you a public key to publish as a TXT record at its own selector. Do this for every sender on your list, not just the main mailbox.",
      },
      {
        title: "Start DMARC in monitor mode",
        detail:
          "DMARC tells receivers what to do when SPF and DKIM fail. Start with p=none, which changes nothing and only asks for reports. Do not skip this step — going straight to reject is how legitimate mail disappears.",
        code: "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com",
      },
      {
        title: "Read the reports for two weeks",
        detail:
          "The aggregate reports show every source sending as your domain, including ones you forgot. Fix each legitimate sender until it passes. Anything still failing after that is either misconfigured or is not yours.",
      },
      {
        title: "Tighten the policy",
        detail:
          "Once the reports are clean, move to p=quarantine, watch for another fortnight, then p=reject. That final record is what stops other people sending mail that looks like it came from you.",
        code: "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com",
      },
    ],
    gotcha:
      "Two SPF records on one domain. It is a permanent failure, not a warning, and it makes deliverability worse than having no SPF at all. If you are adding a sender, edit the existing record — never add a second.",
  },
  {
    slug: "wordpress-fast-on-day-one",
    title: "Install WordPress and make it fast on day one",
    summary:
      "The setup decisions that are painful to change later, made correctly at the start.",
    category: "WordPress",
    minutes: 15,
    before: ["A hosting plan and a domain already pointing at it"],
    steps: [
      {
        title: "Install, then set the permalink structure",
        detail:
          "Settings → Permalinks → Post name. Do this before you publish anything. Changing it later changes every URL on the site, which means every link anyone has shared stops working unless you write redirects.",
        code: "/%postname%/",
      },
      {
        title: "Choose HTTPS in both address fields",
        detail:
          "Settings → General. WordPress Address and Site Address must both start with https://. Setting only one causes redirect loops that are genuinely confusing to debug.",
      },
      {
        title: "Delete what you are not using",
        detail:
          "Every default theme except the active one, and every plugin you are not going to keep. An inactive plugin still has code on disk and still needs patching — it is attack surface with no benefit.",
      },
      {
        title: "Turn on server-side caching before adding a caching plugin",
        detail:
          "On Serverlys, LiteSpeed caching is configured for you. Install LiteSpeed Cache to talk to it rather than a plugin that implements its own PHP-level cache — running two caching layers that do not know about each other produces stale pages nobody can explain.",
      },
      {
        title: "Fix images at upload, not afterwards",
        detail:
          "Set your theme's content width, and stop uploading photos straight from a phone camera. A 4000-pixel JPEG displayed at 800 pixels is the most common cause of a slow WordPress homepage, and no plugin fixes it as well as not doing it.",
      },
      {
        title: "Set up backups before you need them",
        detail:
          "Daily backups run at the server level on every Serverlys plan and restores are free. Confirm you know where to find them now, while it is a calm afternoon rather than an emergency.",
      },
    ],
    gotcha:
      "Publishing content before setting permalinks. Every URL changes when you fix it, and search engines have to be told about all of them individually.",
  },
  {
    slug: "force-https",
    title: "Force HTTPS and clear mixed content",
    summary:
      "Get the padlock, keep it, and find what is still loading over http.",
    category: "Security",
    minutes: 10,
    before: ["A valid certificate already issued for the domain"],
    steps: [
      {
        title: "Confirm the certificate covers what you use",
        detail:
          "Load the site with https:// explicitly. A certificate issued for example.com may not cover www.example.com unless both were requested. If you use both, both need to be on the certificate.",
      },
      {
        title: "Redirect http to https at the server",
        detail:
          "Do it once, at the server or in .htaccess, rather than in a plugin. A plugin redirect runs after PHP has started, which is slower and stops working the moment the plugin is disabled.",
        code: "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
      },
      {
        title: "Find the mixed content",
        detail:
          "Open the browser console on a few pages. Anything reported as blocked or insecure is a resource still requested over http — usually an image URL hardcoded in the database, an embedded font, or a script from a third party.",
      },
      {
        title: "Fix the database references properly",
        detail:
          "WordPress stores some settings as serialised data, where a naive find-and-replace corrupts the value and breaks widgets. Use a tool that understands serialisation, or ask us to run it.",
      },
      {
        title: "Only then consider HSTS",
        detail:
          "HSTS tells browsers to refuse http for your domain in future. It is the right end state and it is hard to undo — a browser that has seen the header will honour it for the max-age you set. Turn it on once everything genuinely works over https, not before.",
      },
    ],
    gotcha:
      "Enabling HSTS with a long max-age while a subdomain still has no certificate. Browsers will refuse to load that subdomain at all, and you cannot take it back until the max-age expires.",
  },
  {
    slug: "restore-a-backup",
    title: "Restore a backup without making it worse",
    summary:
      "What to check before you roll back, and what a restore will overwrite.",
    category: "Recovery",
    minutes: 10,
    before: ["Access to your hosting control panel or a support ticket open"],
    steps: [
      {
        title: "Stop and work out when it broke",
        detail:
          "Restoring to a point after the problem started just reproduces the problem. Check the error log and your own timeline — an update, a publish, a plugin install — and pick a restore point from before it.",
      },
      {
        title: "Decide what you are restoring",
        detail:
          "Files and database are separate decisions. A broken plugin usually needs files only; a corrupted post or a bad import needs the database. Restoring both when you needed one loses everything written in between.",
      },
      {
        title: "Save anything written since",
        detail:
          "Orders, comments, form submissions and posts created after the restore point will be gone. Export them first if they matter. This is the step people skip and regret.",
      },
      {
        title: "Restore, then clear every cache",
        detail:
          "Server cache, plugin cache, and any CDN in front of the site. A restore that appears not to have worked has usually worked fine and you are looking at a cached copy of the broken version.",
      },
      {
        title: "Find the cause before re-applying anything",
        detail:
          "You have rolled back to a working state, which means the thing that broke it will break it again if you simply redo it. Reapply updates one at a time on staging.",
      },
    ],
    gotcha:
      "Restoring the database to fix a plugin problem. It fixes the plugin and deletes every order taken since the restore point.",
  },
  {
    slug: "lower-ttl-before-migration",
    title: "Lower your TTL before a migration",
    summary:
      "The one preparation step that turns a day of split traffic into minutes.",
    category: "Domains & DNS",
    minutes: 5,
    before: ["Access to your domain's DNS, at least a day before you move"],
    steps: [
      {
        title: "Find out what your TTL is now",
        detail:
          "TTL is how long resolvers are allowed to cache a DNS answer, in seconds. 3600 is an hour; 86400 is a day. Whatever it says, that is how long some visitors will keep reaching your old server after you change anything.",
      },
      {
        title: "Lower it to 300",
        detail:
          "Set the TTL on the records you will be changing — usually A and CNAME — to 300 seconds. Do not change the record values yet, only the TTL.",
        code: "TTL: 300",
      },
      {
        title: "Wait one full old TTL",
        detail:
          "If it was 86400, wait a day. Resolvers holding the old answer also hold the old TTL, and they will not learn about the shorter one until their existing cache expires. Lowering the TTL an hour before a migration achieves nothing.",
      },
      {
        title: "Do the migration",
        detail:
          "Now the change propagates in about five minutes rather than a day, which means the window where some visitors see the old site and some see the new one is short enough not to matter.",
      },
      {
        title: "Put it back afterwards",
        detail:
          "Once you are happy, raise it to 3600 or higher. A permanently low TTL means more lookups for every visitor and slightly slower first connections.",
      },
    ],
    gotcha:
      "Lowering the TTL and migrating the same afternoon. The old TTL is still cached, so the change takes exactly as long as it would have anyway.",
  },
];

export const tutorialCategories = [
  ...new Set(tutorials.map((t) => t.category)),
] as const;
