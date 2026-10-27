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
  /**
   * Site pages that sell what this tutorial is about, as registry paths. The
   * page resolves each through data/routes.ts and drops anything not built,
   * so a tutorial can never link a 404.
   */
  products?: readonly string[];
  /** Tutorials to recommend first, by slug, before the same-category fallback. */
  related?: readonly string[];
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
    products: ["/domain-name", "/hosting", "/whois-lookup"],
    related: ["change-nameservers", "add-a-or-cname-record", "transfer-a-domain"],
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
    products: ["/business-email", "/domain-name"],
    related: ["set-up-dkim", "set-up-dmarc", "connect-google-workspace-or-microsoft-365"],
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
    products: ["/wordpress-hosting", "/managed-hosting"],
    related: ["harden-wordpress-login", "wordpress-automatic-backups", "install-ssl-certificate-wordpress"],
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
    products: ["/wordpress-hosting", "/hosting"],
    related: ["install-ssl-certificate-wordpress", "change-wordpress-site-url"],
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
    products: ["/site-management", "/wordpress-hosting"],
    related: ["wordpress-automatic-backups", "fix-error-establishing-database-connection"],
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
    products: ["/migrations", "/domain-name"],
    related: ["move-wordpress-to-a-new-host", "change-nameservers"],
  },
  {
    slug: "change-nameservers",
    title: "Change your domain's nameservers",
    summary:
      "Hand a domain's DNS to a new provider without losing email, and know when the switch has actually happened.",
    category: "Domains & DNS",
    minutes: 15,
    before: [
      "A login at the registrar where the domain is registered",
      "The two (or more) nameserver hostnames of the new DNS provider — for Serverlys hosting, they are in your welcome email",
      "A copy of every DNS record the domain has today",
    ],
    steps: [
      {
        title: "Copy the current DNS zone",
        detail:
          "Nameservers decide who answers for ALL of the domain's records, not just the website. List every record at the current DNS provider — A, AAAA, CNAME, MX, every TXT (SPF, DKIM, DMARC, site verification) and any SRV. Many providers can export the zone as a text file; if yours cannot, take screenshots.",
      },
      {
        title: "Recreate those records at the new provider first",
        detail:
          "The new nameservers must already hold the records before the domain is pointed at them. On cPanel hosting, adding the domain to the account creates the website and mail records automatically; open Zone Editor and add anything else from your copy, especially MX and TXT records for Google Workspace, Microsoft 365 or any newsletter platform.",
      },
      {
        title: "Check whether DNSSEC is switched on",
        detail:
          "If the registrar shows DNSSEC enabled with DS records from the OLD provider, remove them before changing nameservers. A DS record that does not match the new provider's keys makes validating resolvers reject every answer, and the domain disappears for a large share of the internet. Re-enable DNSSEC with the new provider's values afterwards if it offers it.",
      },
      {
        title: "Replace the nameservers at the registrar",
        detail:
          "The setting is usually called Nameservers, DNS management or Custom nameservers. Remove every old entry and enter the new hostnames exactly as given, one per field. Do not keep one old nameserver alongside the new ones — resolvers pick among them at random, so visitors would get two different answers.",
        code: "ns1.example-dns.com\nns2.example-dns.com",
      },
      {
        title: "Confirm the delegation changed",
        detail:
          "Ask the registry, not your own computer. A WHOIS lookup shows the nameservers on record, and dig can ask a nameserver directly. For a .com, the gTLD servers hold the delegation.",
        code: "dig NS yourdomain.com @a.gtld-servers.net +norecurse\ndig +short A yourdomain.com @ns1.example-dns.com",
      },
      {
        title: "Allow up to two days for everyone to follow",
        detail:
          "The TTL on a delegation is set by the registry, not by you — for .com it is two days — so lowering your own TTLs does not speed this particular change up. Because both old and new providers now hold the same records, visitors get the same answer either way while caches expire.",
      },
    ],
    gotcha:
      "Switching nameservers before the new provider has the MX and TXT records. The website looks fine on the new host, and mail quietly stops arriving or starts failing SPF.",
    products: ["/domain-name", "/register-domain", "/whois-lookup"],
    related: ["point-your-domain", "add-a-or-cname-record", "transfer-a-domain"],
  },
  {
    slug: "add-a-or-cname-record",
    title: "Add an A record or a CNAME record",
    summary:
      "Which record a name needs, how to type the host field without doubling the domain, and how to check the result.",
    category: "Domains & DNS",
    minutes: 5,
    before: [
      "Access to wherever the domain's DNS is hosted — the nameservers decide where that is",
      "The IP address or hostname you were given",
    ],
    steps: [
      {
        title: "Choose the record type",
        detail:
          "An A record maps a name to an IPv4 address; AAAA does the same for IPv6. A CNAME makes a name an alias of another hostname, so it follows that hostname wherever it moves. If a service gave you an IP address, use A. If it gave you a hostname, use CNAME.",
      },
      {
        title: "Know where a CNAME is not allowed",
        detail:
          "A name that has a CNAME may have no other record at all. That rules out the bare domain (@), which must also carry the zone's SOA and NS records. Some DNS providers offer a substitute for the apex, called ALIAS, ANAME or CNAME flattening; whether you have it depends on the provider. Without it, the apex gets an A record.",
      },
      {
        title: "Open the zone editor and add the record",
        detail:
          "In cPanel it is Domains → Zone Editor → Manage next to the domain → Add Record. At a registrar it is usually under DNS settings. Every editor asks for the same four things: name (host), type, TTL and value.",
        code: "blog.yourdomain.com.   3600  IN  A      192.0.2.10\nshop.yourdomain.com.   3600  IN  CNAME  shops.example-platform.com.",
      },
      {
        title: "Type the name the way the editor expects",
        detail:
          "Panels differ: some want only the label (blog), some want the full name, and some want a trailing dot to mark a name as complete. If the editor appends your domain and you type the full name too, you create blog.yourdomain.com.yourdomain.com. After saving, read back the full name the editor displays.",
      },
      {
        title: "Remove what the new record replaces",
        detail:
          "If an A record already exists for the name you want to CNAME, delete it — the two cannot coexist. If you are changing an A record, edit it rather than adding a second one: two A records on one name split visitors between both addresses.",
      },
      {
        title: "Check the answer",
        detail:
          "Query the record directly. On Windows, nslookup does the same job. Expect the new value once the old record's TTL has run out.",
        code: "dig +short A blog.yourdomain.com\ndig +short CNAME shop.yourdomain.com\nnslookup -type=CNAME shop.yourdomain.com",
      },
    ],
    gotcha:
      "Adding a new A record next to the old one instead of editing it. DNS returns both, so roughly half of visitors keep landing on the old server and the problem looks intermittent.",
    products: ["/domain-name", "/hosting"],
    related: ["set-up-subdomain", "point-your-domain", "change-nameservers"],
  },
  {
    slug: "set-up-dmarc",
    title: "Set up DMARC step by step",
    summary:
      "Publish a DMARC record, read what the reports tell you, and move to an enforcing policy without losing real mail.",
    category: "Email",
    minutes: 15,
    before: [
      "SPF and DKIM already set up for your main mail service",
      "Access to the domain's DNS",
      "A mailbox, or a report-processing service, to receive DMARC reports",
    ],
    steps: [
      {
        title: "Understand alignment before you publish",
        detail:
          "DMARC passes when SPF or DKIM passes AND the domain that passed matches the domain in the visible From: address. SPF checks the envelope sender, which third-party platforms often set to their own domain — SPF passes, but it does not align. That is why DKIM signed with YOUR domain is the dependable route to a DMARC pass.",
      },
      {
        title: "Decide where reports go",
        detail:
          "Create an address such as dmarc@yourdomain.com. Expect a steady flow of compressed XML files from large receivers. If you send reports to an address on a different domain, that domain must publish a record authorising it, or receivers will not send them.",
        code: "yourdomain.com._report._dmarc.reportdomain.com.  TXT  \"v=DMARC1\"",
      },
      {
        title: "Publish the record in monitor mode",
        detail:
          "Add a TXT record at the host _dmarc. v=DMARC1 must come first, with the policy straight after it. p=none changes nothing about delivery; it only asks for reports. Publish exactly one DMARC record — if receivers find two, they apply neither.",
        code: "Host:  _dmarc\nType:  TXT\nValue: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com",
      },
      {
        title: "Check that it is live",
        detail:
          "Query the record directly. If nothing comes back, the host field probably doubled the domain (_dmarc.yourdomain.com.yourdomain.com).",
        code: "dig +short TXT _dmarc.yourdomain.com",
      },
      {
        title: "Work through the reports",
        detail:
          "Each aggregate report lists the IP addresses that sent mail as your domain and whether SPF and DKIM passed and aligned. Group them by source. For each legitimate sender that fails, turn on DKIM with your domain at that sender, or add it to SPF. Give it at least two weeks so monthly senders such as invoicing tools show up.",
      },
      {
        title: "Enforce in two stages",
        detail:
          "Move to p=quarantine, which sends failing mail to spam, and watch the reports for another two weeks. Then move to p=reject. Subdomains inherit the policy unless you set sp= separately.",
        code: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com\nv=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com",
      },
    ],
    gotcha:
      "Moving to p=reject because SPF passes for every sender. If a sender's SPF pass is for its own domain rather than yours, it does not align, and that sender's mail is rejected the day the policy changes.",
    products: ["/business-email", "/domain-name"],
    related: ["email-deliverability", "set-up-dkim", "set-up-email-forwarding"],
  },
  {
    slug: "set-up-dkim",
    title: "Set up DKIM for your domain",
    summary:
      "Turn on DKIM signing for each service that sends as your domain, publish the keys, and confirm the signatures pass.",
    category: "Email",
    minutes: 15,
    before: [
      "Admin access to each service that sends mail as your domain",
      "Access to the domain's DNS",
    ],
    steps: [
      {
        title: "Understand selectors",
        detail:
          "A DKIM public key is published as a record at selector._domainkey.yourdomain.com, and each signed message names its selector. Because every sender picks its own selector, a domain can have many DKIM records side by side — unlike SPF, where there must be exactly one.",
      },
      {
        title: "Hosting mailboxes on cPanel",
        detail:
          "Open Email → Email Deliverability and choose Manage for the domain. cPanel shows whether DKIM is valid and the record it expects, normally at the selector default. If the domain's DNS is on the same server, it can install the record for you; if DNS is elsewhere, copy the name and value it shows into that DNS host.",
        code: "default._domainkey  TXT  \"v=DKIM1; k=rsa; p=<public key from the panel>\"",
      },
      {
        title: "Google Workspace",
        detail:
          "Admin console → Apps → Google Workspace → Gmail → Authenticate email. Generate a 2048-bit record, publish it as a TXT record at google._domainkey (the default selector), wait for it to resolve, then return and click Start authentication. Google does not sign with your domain until you do.",
      },
      {
        title: "Microsoft 365",
        detail:
          "In the Microsoft Defender portal, open the DKIM page under the email authentication settings and select the domain. Microsoft asks for two CNAME records, selector1._domainkey and selector2._domainkey; copy the targets exactly as shown, because their format differs between tenants. Once they resolve, enable signing for the domain.",
      },
      {
        title: "Every other sender",
        detail:
          "Newsletter platforms, CRMs and help desks have a domain authentication section that gives you their own records, usually CNAMEs. Without this, they sign with their own domain, which passes DKIM but does not count for your DMARC.",
      },
      {
        title: "Watch for long keys",
        detail:
          "A 2048-bit key is longer than the 255 characters one TXT string can hold, so it is stored as several quoted strings that receivers join together. Most panels split it for you. If yours truncates the value instead, the signature fails — check the published record against what the sender gave you.",
      },
      {
        title: "Confirm a real message passes",
        detail:
          "Send a message to a Gmail address, open it, and choose Show original. You want DKIM: PASS with your own domain. You can also query the key directly.",
        code: "dig +short TXT default._domainkey.yourdomain.com",
      },
    ],
    gotcha:
      "Setting up DKIM for the main mailbox and stopping there. The newsletter and invoicing tools keep signing with their own domains, and they are the first mail to fail once DMARC is enforced.",
    products: ["/business-email"],
    related: ["set-up-dmarc", "email-deliverability", "connect-google-workspace-or-microsoft-365"],
  },
  {
    slug: "connect-google-workspace-or-microsoft-365",
    title: "Connect your domain to Google Workspace or Microsoft 365",
    summary:
      "Verify the domain, replace the MX records, and stop your hosting server from keeping mail meant for the new provider.",
    category: "Email",
    minutes: 20,
    before: [
      "An admin account for Google Workspace or Microsoft 365",
      "Access to the domain's DNS — the nameservers decide where that is",
      "Mailboxes created at the new provider for every address you use",
    ],
    steps: [
      {
        title: "Verify that you own the domain",
        detail:
          "Both providers give you a TXT record to add at the bare domain (@). Google's starts with google-site-verification=; Microsoft's starts with MS=. It sits alongside your SPF record — it does not replace it.",
        code: "@  TXT  google-site-verification=<value from Google>\n@  TXT  MS=ms12345678",
      },
      {
        title: "Delete the old MX records",
        detail:
          "Remove every MX record pointing at the previous mail server, such as mail.yourdomain.com. Leaving one in place means some senders deliver to the old server, by priority or on failure, and that mail never reaches the new inbox.",
      },
      {
        title: "Add the new MX records",
        detail:
          "Google Workspace uses a single MX record for new setups. Microsoft 365 gives each domain its own MX target in the admin center under Settings → Domains; copy it exactly, as the format varies between tenants. Microsoft also asks for an autodiscover CNAME so Outlook can configure itself.",
        code: "Google:     @  MX  1  smtp.google.com.\nMicrosoft:  @  MX  0  yourdomain-com.mail.protection.outlook.com.\n            autodiscover  CNAME  autodiscover.outlook.com.",
      },
      {
        title: "On cPanel hosting, set email routing to remote",
        detail:
          "Email → Email Routing → select the domain → Remote Mail Exchanger. If it stays on Local, the hosting server still believes it handles your mail, so messages your own website sends to your addresses — contact forms, order notifications — are delivered into a cPanel mailbox nobody reads.",
      },
      {
        title: "Update SPF in the same record",
        detail:
          "Add the new provider to your existing SPF record. Keep the hosting server in it if your website sends mail directly. There must still be only one SPF record.",
        code: "Google:     v=spf1 include:_spf.google.com ~all\nMicrosoft:  v=spf1 include:spf.protection.outlook.com ~all",
      },
      {
        title: "Turn on DKIM and test from outside",
        detail:
          "Enable DKIM at the provider (see the DKIM tutorial), then send a message from an unrelated account, such as a personal address at another provider, and reply to it. Confirm the MX change with dig.",
        code: "dig +short MX yourdomain.com",
      },
    ],
    gotcha:
      "Leaving cPanel email routing on Local. Mail from the outside world reaches Google or Microsoft, so everything looks fine — but every contact-form message from your own website lands in a hosting mailbox nobody checks.",
    products: ["/business-email", "/domain-name"],
    related: ["set-up-dkim", "email-deliverability", "set-up-dmarc"],
  },
  {
    slug: "install-ssl-certificate-wordpress",
    title: "Install an SSL certificate and switch WordPress to HTTPS",
    summary:
      "Get a valid certificate on the domain first, then move WordPress over to https without locking yourself out.",
    category: "Security",
    minutes: 15,
    before: [
      "The domain already resolving to your hosting server",
      "A backup of the WordPress database",
      "Control panel access, and ideally SSH with WP-CLI",
    ],
    steps: [
      {
        title: "Issue a free certificate",
        detail:
          "On cPanel, open Security → SSL/TLS Status, select the domain and its www name, and run AutoSSL. Validation works by reaching the domain, so it only succeeds once DNS points at this server. A name that does not resolve here, such as www without a DNS record, is left off the certificate.",
      },
      {
        title: "Or install a certificate you bought",
        detail:
          "Generate the private key and certificate signing request (CSR) in the same panel, under SSL/TLS, and give the CSR to the certificate authority. When the certificate arrives, open Manage SSL sites and paste the certificate; the panel matches it to the stored key. Include the CA bundle the authority supplies, or some browsers and API clients will report the chain as untrusted.",
      },
      {
        title: "Check the certificate before touching WordPress",
        detail:
          "Load https://yourdomain.com and https://www.yourdomain.com. Both must open without a warning. Changing WordPress first, while the certificate is invalid, leaves you with an admin area you cannot reach without clicking through errors.",
      },
      {
        title: "Change both WordPress addresses",
        detail:
          "Settings → General: WordPress Address (URL) and Site Address (URL) both become https://. If the fields are greyed out, they are set in wp-config.php as WP_HOME and WP_SITEURL — change them there.",
      },
      {
        title: "Rewrite old http links in the content",
        detail:
          "Posts and settings still contain http:// URLs. Use WP-CLI's search-replace, which handles WordPress's serialised data correctly. Run it with --dry-run first to see how many replacements it will make.",
        code: "wp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --skip-columns=guid --dry-run\nwp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --skip-columns=guid",
      },
      {
        title: "If a proxy or CDN terminates HTTPS",
        detail:
          "WordPress may not see the request as secure and keep redirecting to https forever. Tell it to trust the forwarded protocol by adding this to wp-config.php, above the line that says to stop editing. Only do this when a proxy you control sits in front of the site.",
        code: "if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {\n    $_SERVER['HTTPS'] = 'on';\n}",
      },
      {
        title: "Redirect http to https",
        detail:
          "Finish with a server-level 301 redirect and a mixed-content check, as described in the Force HTTPS tutorial.",
      },
    ],
    gotcha:
      "Switching the WordPress addresses to https before the certificate is valid. Every admin page then sits behind a browser warning, and some setups end in a redirect loop that can only be undone in wp-config.php or the database.",
    products: ["/wordpress-hosting", "/hosting"],
    related: ["force-https", "change-wordpress-site-url", "harden-wordpress-login"],
  },
  {
    slug: "move-wordpress-to-a-new-host",
    title: "Move WordPress to a new host manually",
    summary:
      "Copy the files and database yourself, test on the new server before anyone else sees it, then switch DNS.",
    category: "WordPress",
    minutes: 60,
    before: [
      "File and database access on the old host — File Manager or SFTP, plus phpMyAdmin or SSH",
      "A hosting account on the new server",
      "Your DNS TTL lowered at least a day in advance",
    ],
    steps: [
      {
        title: "Freeze changes and export the database",
        detail:
          "Pause publishing, and on a store, note the time — orders taken on the old server after this will not come across. Export the database from phpMyAdmin (select the database → Export → SQL) or over SSH.",
        code: "wp db export site.sql\n# or\nmysqldump -u dbuser -p dbname > site.sql",
      },
      {
        title: "Copy every file",
        detail:
          "Download the whole WordPress directory, not just wp-content: wp-config.php and the hidden .htaccess file matter too. Compressing the directory into one archive in File Manager first makes the transfer much faster and less error-prone.",
      },
      {
        title: "Create the database on the new host",
        detail:
          "On cPanel, open MySQL Databases: create a database, create a user with a strong password, then add the user to the database with ALL PRIVILEGES. cPanel prefixes both names with the account username, so note the full names it shows.",
      },
      {
        title: "Import the database",
        detail:
          "Use phpMyAdmin's Import tab on the new database. If the file is larger than phpMyAdmin's upload limit, import over SSH instead.",
        code: "mysql -u cpuser_wpuser -p cpuser_wp < site.sql",
      },
      {
        title: "Upload the files and update wp-config.php",
        detail:
          "Extract the archive into the document root, usually public_html. Then set the new database details. Leave $table_prefix exactly as it was on the old server — if it does not match the imported tables, WordPress shows its install screen as if the site were empty.",
        code: "define( 'DB_NAME', 'cpuser_wp' );\ndefine( 'DB_USER', 'cpuser_wpuser' );\ndefine( 'DB_PASSWORD', 'the-password-you-set' );\ndefine( 'DB_HOST', 'localhost' );",
      },
      {
        title: "Test it before changing DNS",
        detail:
          "Point only your own computer at the new server with a hosts file entry, then browse the site, log in and submit a form. The file is /etc/hosts on macOS and Linux and C:\\Windows\\System32\\drivers\\etc\\hosts on Windows.",
        code: "192.0.2.10  yourdomain.com www.yourdomain.com",
      },
      {
        title: "Switch DNS, then issue the certificate",
        detail:
          "Change the A record or nameservers, remove your hosts entry, and issue the SSL certificate once the domain resolves to the new server. Keep the old hosting account for a few days in case something was missed.",
      },
    ],
    gotcha:
      "Leaving the hidden .htaccess file behind. The homepage loads, so the move looks done, but every other page returns 404 until permalinks are rewritten — re-saving Settings → Permalinks recreates the file.",
    products: ["/migrations", "/wordpress-hosting"],
    related: ["lower-ttl-before-migration", "change-wordpress-site-url", "wordpress-fast-on-day-one"],
  },
  {
    slug: "change-wordpress-site-url",
    title: "Change your WordPress site URL safely",
    summary:
      "Move WordPress to a new domain or address without breaking links, serialised settings or your own login.",
    category: "WordPress",
    minutes: 20,
    before: [
      "A fresh backup of the database",
      "The new domain already resolving to the server, with a valid certificate",
      "SSH with WP-CLI, or FTP access to wp-config.php",
    ],
    steps: [
      {
        title: "Know the two settings",
        detail:
          "WordPress stores its address twice, in the options table: home (the Site Address, what visitors type) and siteurl (the WordPress Address, where its files live). For most sites they are identical. Write them without a trailing slash.",
      },
      {
        title: "Change them in the dashboard if you can",
        detail:
          "Settings → General. Saving logs you out, because your login cookie belongs to the old address; log in again at the new one. If the fields are greyed out, they are fixed in wp-config.php and must be changed there.",
      },
      {
        title: "Or change them from outside WordPress",
        detail:
          "If you are locked out, either define the addresses in wp-config.php or update the options with WP-CLI. Constants in wp-config.php override the database, so remove them later if you want the dashboard fields back.",
        code: "define( 'WP_HOME', 'https://newdomain.com' );\ndefine( 'WP_SITEURL', 'https://newdomain.com' );\n\n# or\nwp option update home 'https://newdomain.com'\nwp option update siteurl 'https://newdomain.com'",
      },
      {
        title: "Replace the old address in the content",
        detail:
          "Links and image URLs in posts, widgets and theme settings still use the old domain. Do not run a plain SQL REPLACE: WordPress stores some settings as serialised PHP, which records each string's length, and changing the text without the length corrupts them. WP-CLI's search-replace handles this. Skip the guid column — post GUIDs are identifiers and should not change.",
        code: "wp search-replace 'https://olddomain.com' 'https://newdomain.com' --skip-columns=guid --dry-run\nwp search-replace 'https://olddomain.com' 'https://newdomain.com' --skip-columns=guid",
      },
      {
        title: "Flush what is cached",
        detail:
          "Re-save Settings → Permalinks, then purge the page cache and any CDN. Cached pages still contain the old links.",
      },
      {
        title: "Redirect the old domain permanently",
        detail:
          "Keep the old domain pointing at the server and send every path to the same path on the new one with a 301. If the old domain was in Google Search Console, use its Change of Address tool as well.",
        code: "RewriteEngine On\nRewriteCond %{HTTP_HOST} ^(www\\.)?olddomain\\.com$ [NC]\nRewriteRule ^(.*)$ https://newdomain.com/$1 [L,R=301]",
      },
    ],
    gotcha:
      "Running a find-and-replace in SQL or a text editor on the database dump. Serialised values whose length changed stop loading, and widgets, menus and theme settings silently reset to defaults.",
    products: ["/wordpress-hosting", "/migrations"],
    related: ["move-wordpress-to-a-new-host", "install-ssl-certificate-wordpress", "restore-a-backup"],
  },
  {
    slug: "reset-wordpress-password-phpmyadmin",
    title: "Reset a WordPress admin password in phpMyAdmin",
    summary:
      "Get back into a WordPress site when the lost-password email never arrives.",
    category: "Recovery",
    minutes: 10,
    before: [
      "Control panel access with phpMyAdmin, or SSH with WP-CLI",
      "Read access to the site's wp-config.php",
    ],
    steps: [
      {
        title: "Try the normal reset first",
        detail:
          "The Lost your password? link on the login page emails a reset link. If it never arrives, the site probably cannot send mail, which is worth fixing separately — but the steps below do not depend on it.",
        code: "https://yourdomain.com/wp-login.php?action=lostpassword",
      },
      {
        title: "Find the right database and table prefix",
        detail:
          "Open wp-config.php. DB_NAME is the database and $table_prefix is the prefix on its tables — wp_ by default, often something else. Accounts with several WordPress installs have several databases, so check before editing.",
      },
      {
        title: "Edit the user in phpMyAdmin",
        detail:
          "In cPanel, open Databases → phpMyAdmin, select the database, then the users table (prefix + users). Click Edit on your user's row. In the user_pass row, choose MD5 in the Function column, type the new password as the value, and click Go.",
      },
      {
        title: "Or run it as a query",
        detail:
          "The same change in SQL, using your prefix and username. WordPress accepts the MD5 value once and replaces it with its own stronger hash the first time you log in.",
        code: "UPDATE wp_users SET user_pass = MD5('a-new-strong-password') WHERE user_login = 'yourusername';",
      },
      {
        title: "With SSH, use WP-CLI instead",
        detail:
          "WP-CLI hashes the password the same way WordPress does, with no database editing at all. Run it from the WordPress directory.",
        code: "wp user update yourusername --user_pass='a-new-strong-password'",
      },
      {
        title: "Check who else is an administrator",
        detail:
          "Log in and open Users, filtered to Administrator. If you were locked out unexpectedly, an account you do not recognise is a sign of a compromise — remove it and change every admin password, the database password and the salts in wp-config.php.",
      },
    ],
    gotcha:
      "Editing the users table of the wrong database on an account with more than one site. The query succeeds, the password still fails, and a different site now has a changed admin password.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["harden-wordpress-login", "fix-error-establishing-database-connection", "restore-a-backup"],
  },
  {
    slug: "wordpress-automatic-backups",
    title: "Set up automatic WordPress backups",
    summary:
      "Add a scheduled, off-server copy of your files and database, and prove you can restore it.",
    category: "Recovery",
    minutes: 20,
    before: [
      "WordPress admin access, or SSH and access to cron jobs",
      "Somewhere off the server to keep copies — cloud storage you control",
    ],
    steps: [
      {
        title: "Know what your host already keeps",
        detail:
          "Every Serverlys plan includes daily server-level backups. Before relying on any host's backups, find out how many days they go back, because a problem noticed after that window cannot be rolled back.",
      },
      {
        title: "Keep a second copy somewhere else",
        detail:
          "A backup that lives only on the same server or account is lost with it. The common rule is three copies, on two kinds of storage, with one off-site. For a small site, that means the host's backups plus a scheduled copy in cloud storage you own.",
      },
      {
        title: "Schedule it with a plugin",
        detail:
          "A backup plugin such as UpdraftPlus can run on a schedule and send copies to remote storage — Google Drive, Dropbox or Amazon S3, among others. Set files and database separately: the database changes every time someone orders or comments, the files mostly when you update something. Choose how many copies to retain so storage does not fill up.",
      },
      {
        title: "Or schedule it with cron",
        detail:
          "On cPanel, Advanced → Cron Jobs runs a command on a schedule. This exports the database nightly at 03:00 and deletes copies older than 14 days. In crontab every % must be escaped as \\%. The path to wp can differ from server to server — run `which wp` over SSH to find yours. Keep the folder outside public_html so it cannot be downloaded.",
        code: "0 3 * * * cd ~/public_html && wp db export ~/backups/db-$(date +\\%F).sql\n30 3 * * * find ~/backups -name 'db-*.sql' -mtime +14 -delete",
      },
      {
        title: "Back up more often if the database is busy",
        detail:
          "A store or a membership site can lose a day of orders or sign-ups to a daily schedule. Run database backups several times a day there; files can stay daily.",
      },
      {
        title: "Test a restore",
        detail:
          "Restore the latest copy onto a staging subdomain and log in. A backup that has never been restored is an assumption, and the time to find a missing table or a corrupt archive is now.",
      },
    ],
    gotcha:
      "Keeping backups only on the same server, or inside public_html. A server failure or a hacked account takes the backups with it — and an archive in public_html can be downloaded by anyone who guesses its name, database passwords included.",
    products: ["/site-management", "/wordpress-hosting"],
    related: ["restore-a-backup", "set-up-subdomain", "harden-wordpress-login"],
  },
  {
    slug: "harden-wordpress-login",
    title: "Harden your WordPress login",
    summary:
      "The changes that stop password-guessing and stolen-password attacks on wp-admin, in the order worth doing them.",
    category: "Security",
    minutes: 20,
    before: [
      "An administrator account",
      "FTP or File Manager access, in case a change locks you out",
    ],
    steps: [
      {
        title: "Retire the account named admin",
        detail:
          "It is the first username every automated attack tries. WordPress cannot rename a user from the dashboard, so create a new administrator with a different username, log in as it, then delete the old account and attribute its content to the new one when asked.",
      },
      {
        title: "Use unique passwords and remove spare administrators",
        detail:
          "Every administrator needs a long password used nowhere else. Open Users, filter by Administrator, and downgrade anyone who only writes content to Editor or Author. Each administrator account is a full set of keys to the site.",
      },
      {
        title: "Turn on two-factor authentication",
        detail:
          "Install a two-factor plugin, such as Two Factor or Wordfence Login Security, and enable an authenticator app for every administrator. Save the backup codes it offers somewhere outside the site.",
      },
      {
        title: "Limit failed logins",
        detail:
          "Out of the box, WordPress allows unlimited password attempts. A plugin such as Limit Login Attempts Reloaded locks an address out after a few failures, which turns a brute-force attack from millions of guesses into a handful.",
      },
      {
        title: "Close XML-RPC if nothing uses it",
        detail:
          "xmlrpc.php accepts many login attempts in a single request. Jetpack and some mobile and publishing apps depend on it, so check before blocking. If nothing does, deny it in .htaccess.",
        code: "<Files xmlrpc.php>\n  Require all denied\n</Files>",
      },
      {
        title: "Disable the built-in file editor",
        detail:
          "If an administrator account is ever compromised, the theme and plugin editor lets the attacker write PHP straight onto the server. Add this to wp-config.php to remove it.",
        code: "define( 'DISALLOW_FILE_EDIT', true );",
      },
    ],
    gotcha:
      "Enabling two-factor authentication without saving the backup codes. Lose the phone and the only way back in is disabling the plugin by renaming its folder over FTP.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["reset-wordpress-password-phpmyadmin", "install-ssl-certificate-wordpress", "wordpress-automatic-backups"],
  },
  {
    slug: "fix-error-establishing-database-connection",
    title: "Fix \u201cError establishing a database connection\u201d",
    summary:
      "Find out which of the four usual causes it is, in the order that is quickest to check.",
    category: "Recovery",
    minutes: 15,
    before: [
      "Control panel access, or SSH",
      "Access to wp-config.php",
    ],
    steps: [
      {
        title: "Check /wp-admin as well as the homepage",
        detail:
          "If /wp-admin says one or more database tables are unavailable and the database may need to be repaired, WordPress connected but found damaged tables — skip to the repair step. If it shows the same connection error, the credentials or the database server are the problem.",
      },
      {
        title: "Compare wp-config.php with the panel",
        detail:
          "DB_NAME, DB_USER, DB_PASSWORD and DB_HOST must match a real database and user. On cPanel, MySQL Databases lists both and shows whether the user is added to that database. After a migration, a wrong name prefix or a user never added to the database is the usual cause.",
        code: "define( 'DB_NAME', 'cpuser_wp' );\ndefine( 'DB_USER', 'cpuser_wpuser' );\ndefine( 'DB_PASSWORD', '…' );\ndefine( 'DB_HOST', 'localhost' );",
      },
      {
        title: "Reset the password if unsure",
        detail:
          "cPanel cannot show you a database user's password, only change it. Set a new one in MySQL Databases, then paste the same value into DB_PASSWORD. DB_HOST is localhost on most cPanel servers; a site moved from another host may still carry that host's value.",
      },
      {
        title: "Test the credentials directly",
        detail:
          "Over SSH, connect with the same details. Access denied means the user, password or privileges are wrong. Can't connect to the server means the database service itself is not answering — report that exact message to your host, as there is nothing to fix in WordPress.",
        code: "mysql -u cpuser_wpuser -p -h localhost cpuser_wp\n# or, using wp-config.php's own values:\nwp db check",
      },
      {
        title: "Repair damaged tables",
        detail:
          "Add the line below to wp-config.php, open /wp-admin/maint/repair.php and run Repair Database. Remove the line as soon as it finishes.",
        code: "define( 'WP_ALLOW_REPAIR', true );",
      },
      {
        title: "Look for a resource limit",
        detail:
          "If the error comes and goes under traffic, the account may be hitting its database connection or memory limits. The error log in the control panel shows when it happens; caching pages reduces how many requests reach the database at all.",
      },
    ],
    gotcha:
      "Leaving WP_ALLOW_REPAIR in wp-config.php. The repair page does not require a login, so anyone who finds it can run repairs and optimisations against your database whenever they like.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["restore-a-backup", "move-wordpress-to-a-new-host", "reset-wordpress-password-phpmyadmin"],
  },
  {
    slug: "set-up-subdomain",
    title: "Set up a subdomain",
    summary:
      "Create blog., shop. or staging. as its own site, with DNS and a certificate, and keep a staging copy out of search results.",
    category: "Domains & DNS",
    minutes: 10,
    before: [
      "A hosting account with the main domain on it",
      "Access to the domain's DNS if it is not hosted on the same server",
    ],
    steps: [
      {
        title: "Decide what the subdomain is for",
        detail:
          "If it points at another company's service — a shop builder, a help desk — it only needs a DNS record, usually a CNAME; see the A and CNAME tutorial. If it is a site on your own hosting, create it in the control panel as below.",
      },
      {
        title: "Create it in the control panel",
        detail:
          "In current cPanel versions, Domains → Domains → Create A New Domain, and type the full name, such as staging.yourdomain.com. Older versions have a separate Subdomains page. Untick the option to share the main domain's document root, so the subdomain gets its own folder.",
      },
      {
        title: "Make sure the name resolves",
        detail:
          "If the domain uses the hosting server's nameservers, the panel adds the DNS record itself. If DNS is hosted elsewhere, add an A record for the subdomain pointing at the server's IP address there.",
        code: "staging  A  192.0.2.10",
      },
      {
        title: "Get it a certificate",
        detail:
          "Once the name resolves, open SSL/TLS Status and run AutoSSL for the new name rather than waiting for the next scheduled run.",
      },
      {
        title: "Put the site in place",
        detail:
          "Install WordPress into the new document root with the panel's installer, or upload files there. For a staging copy of an existing site, the manual move tutorial covers copying files and the database.",
      },
      {
        title: "Keep a staging copy out of Google",
        detail:
          "Settings → Reading → Discourage search engines asks crawlers to stay away, but it is only a request. Password-protecting the folder (Directory Privacy in cPanel) actually keeps them out, along with everyone else.",
      },
    ],
    gotcha:
      "Creating the subdomain in the hosting panel while the domain's DNS is managed somewhere else. The panel's record is never consulted, so the subdomain does not resolve until you add the A record at the real DNS host.",
    products: ["/hosting", "/domain-name"],
    related: ["add-a-or-cname-record", "move-wordpress-to-a-new-host", "install-ssl-certificate-wordpress"],
  },
  {
    slug: "set-up-email-forwarding",
    title: "Set up email forwarding",
    summary:
      "Forward an address on your domain to another inbox, and avoid the delivery problems forwarding causes.",
    category: "Email",
    minutes: 10,
    before: [
      "Access to whichever service handles mail for the domain — the MX records say which",
      "The destination address",
    ],
    steps: [
      {
        title: "Check who receives the domain's mail",
        detail:
          "Forwarders only work on the server the MX records point at. If MX points at Google Workspace or Microsoft 365, set up forwarding or aliases there — a forwarder created in the hosting panel will never see a message.",
        code: "dig +short MX yourdomain.com",
      },
      {
        title: "Create the forwarder",
        detail:
          "On cPanel, Email → Forwarders → Add Forwarder. Enter the address to forward and the destination. A forwarder with no mailbox behind it keeps no copy; if you also want a copy on the server, create a mailbox with the same address.",
      },
      {
        title: "Forward a whole domain if that is what you need",
        detail:
          "The same page has Add Domain Forwarder, which sends mail for every address at one domain to the same address at another. It is the usual setup when a business keeps an old domain after renaming.",
      },
      {
        title: "Set the default address to reject",
        detail:
          "Mail to addresses that do not exist goes to the domain's default address. Set it to discard with an error to the sender, so misspelt and invented addresses are refused at the door rather than forwarded. A catch-all that forwards everything mostly forwards spam.",
      },
      {
        title: "Understand why some forwarded mail fails",
        detail:
          "A forwarded message arrives from your server, which is not in the original sender's SPF record. DKIM usually survives forwarding, but if the original sender relies on SPF and publishes a strict DMARC policy, the destination may reject the message. For an address that matters, a real mailbox checked from your mail app avoids the problem.",
      },
      {
        title: "Test from an unrelated account",
        detail:
          "Send a message from an address that is not the destination itself, and check that it arrives in the inbox rather than spam.",
      },
    ],
    gotcha:
      "Testing by sending from the Gmail account you forward to. Gmail recognises the message as one you sent and does not show it in the inbox, so a working forwarder looks broken.",
    products: ["/business-email", "/domain-name"],
    related: ["email-deliverability", "connect-google-workspace-or-microsoft-365", "set-up-dkim"],
  },
  {
    slug: "transfer-a-domain",
    title: "Transfer a domain to another registrar",
    summary:
      "Unlock it, get the authorisation code, keep DNS running during the move, and know how long each stage takes.",
    category: "Domains & DNS",
    minutes: 15,
    before: [
      "A login at the current registrar",
      "Access to the email address on the domain's registrant contact",
      "A domain registered, or last transferred, more than 60 days ago",
    ],
    steps: [
      {
        title: "Check that it can be transferred",
        detail:
          "Most generic domains such as .com cannot move within 60 days of registration or of a previous transfer, and some registrars apply the same lock after the owner's details change. Many country-code domains follow different rules — a .uk domain, for example, moves by changing its registrar tag rather than with a code. Check the extension's rules first.",
      },
      {
        title: "Move DNS first if the old registrar hosts it",
        detail:
          "A transfer normally keeps the domain's nameservers. But if those nameservers belong to the old registrar's free DNS service, the zone may be deleted when the domain leaves. Copy the records to your hosting or another DNS provider and switch nameservers before starting the transfer.",
      },
      {
        title: "Remove the transfer lock",
        detail:
          "In the current registrar, turn off the setting usually called registrar lock or transfer lock. Confirm it in a WHOIS lookup: the status list must no longer include clientTransferProhibited.",
        code: "whois yourdomain.com | grep -i status",
      },
      {
        title: "Get the authorisation code",
        detail:
          "Also called the auth code, EPP code or transfer key. The registrar shows it in the domain's settings or emails it to the registrant address. Treat it like a password — it is what allows the domain to move.",
      },
      {
        title: "Start the transfer at the new registrar",
        detail:
          "Enter the domain and the code, and pay. For most generic domains the transfer adds a year to the registration, and the time already paid for is kept.",
      },
      {
        title: "Approve it, or wait",
        detail:
          "Generic-domain transfers complete within five days. The old registrar may email you a link to approve it sooner; if you do nothing, it completes automatically at the end of that period unless you reject it.",
      },
      {
        title: "Check and lock it again",
        detail:
          "Once WHOIS shows the new registrar, turn the transfer lock back on and check that auto-renew and the contact details are right at the new registrar.",
      },
    ],
    gotcha:
      "Transferring a domain whose DNS is hosted by the old registrar. The domain arrives safely, and the website and email stop, because the zone they relied on was deleted on the way out.",
    products: ["/transfer-domain", "/whois-lookup", "/register-domain"],
    related: ["change-nameservers", "point-your-domain", "lower-ttl-before-migration"],
  },
];

export const tutorialCategories = [
  ...new Set(tutorials.map((t) => t.category)),
] as const;

const bySlug = new Map(tutorials.map((t) => [t.slug, t]));

export function tutorialBySlug(slug: string): Tutorial | undefined {
  return bySlug.get(slug);
}

export function tutorialPath(t: Pick<Tutorial, "slug">): string {
  return `/tutorials/${t.slug}`;
}

/**
 * Tutorials to recommend after this one: the curated `related` slugs first,
 * then same-category neighbours by ROTATION from this tutorial's position (not
 * the first N in array order, which starves everything after them of inbound
 * links — the bug seo-audit.mjs once caught in relatedArticles), then other
 * categories the same way.
 */
export function relatedTutorials(tutorial: Tutorial, limit = 3): readonly Tutorial[] {
  const picked: Tutorial[] = [];
  const take = (t: Tutorial | undefined) => {
    if (t && t.slug !== tutorial.slug && !picked.includes(t) && picked.length < limit) {
      picked.push(t);
    }
  };

  for (const slug of tutorial.related ?? []) take(bySlug.get(slug));

  const index = tutorials.indexOf(tutorial);
  const rotated = tutorials.map((_, i) => tutorials[(index + 1 + i) % tutorials.length]);
  for (const t of rotated) if (t.category === tutorial.category) take(t);
  for (const t of rotated) take(t);

  return picked;
}
