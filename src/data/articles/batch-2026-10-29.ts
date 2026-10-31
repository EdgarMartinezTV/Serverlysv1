/**
 * Three articles published 2026-10-29, each answering a question people type
 * into Google at the moment something is wrong: the "Not secure" warning, a
 * website that will not load, and DNS changes that have not shown up yet.
 *
 * Same editorial rules as original.ts: no invented statistics, customer
 * counts, case studies or quotes. Numbers are published standards (CA/Browser
 * Forum certificate lifetimes, the .com delegation TTL, HTTP status codes) and
 * link to their source where a reader might want to check. Serverlys features
 * come from data/pricing.ts.
 */
import type { Article } from "./types";

export const batch20261029: readonly Article[] = [
  {
    slug: "website-not-secure-warning",
    title: "Why does my website say \"Not secure\"? How to fix it",
    seoTitle: "Website says \"Not secure\"? How to fix it",
    description:
      "What the \"Not secure\" and \"Your connection is not private\" warnings mean, their six usual causes, and how to fix each on any host or WordPress site.",
    category: "Security",
    published: "2026-10-29",
    body: [
      {
        type: "p",
        text: "You open your own website and the address bar says **Not secure**. Or worse, visitors get a full-page warning, **Your connection is not private**, and have to click through a scary button to reach you. Most people leave at that point, and some will message you to ask whether your site has been hacked.",
      },
      {
        type: "p",
        text: "In almost every case it has not. Both warnings are about the site's SSL certificate, the file that lets a browser load a page over encrypted `https://`. Either the certificate is missing, it is not being used, or something about it does not match. This guide shows how to tell which, and how to fix each cause.",
      },
      { type: "h2", id: "two-warnings", text: "Two different warnings, two different problems" },
      {
        type: "table",
        head: ["What you see", "What it means", "How serious"],
        rows: [
          [
            "\"Not secure\" in the address bar, page loads normally",
            "The page was loaded over plain `http://`. Either there is no certificate, or there is one but the site is not sending visitors to the `https://` version.",
            "Nothing is broken, but forms and logins on that page are sent unencrypted, and visitors notice the label.",
          ],
          [
            "Full-page \"Your connection is not private\" (or \"Warning: Potential Security Risk Ahead\")",
            "The site asked for `https://`, but the certificate it presented is expired, issued for a different name, or not trusted.",
            "Most visitors will not get past it. Fix this first.",
          ],
          [
            "Padlock missing or crossed out on an `https://` page",
            "The page itself is encrypted, but some images, scripts or fonts on it still load from `http://` (mixed content).",
            "Some of those resources are blocked, so parts of the page may look broken.",
          ],
        ],
      },
      {
        type: "p",
        text: "Click the icon to the left of the address to see the browser's own explanation. On the full-page warning, the small error code under the message (for example `NET::ERR_CERT_DATE_INVALID`) tells you exactly which cause you are dealing with, and the sections below are named after them.",
      },
      { type: "h2", id: "no-certificate", text: "1. There is no certificate at all" },
      {
        type: "p",
        text: "If `https://yourdomain.com` does not load, or shows a certificate for your hosting company's server name instead of your domain, no certificate has been issued for your site yet. On most hosting this is free and automatic. On cPanel hosting, look for **SSL/TLS Status** and click **Run AutoSSL**. Other control panels have an equivalent \"Let's Encrypt\" or \"free SSL\" switch.",
      },
      {
        type: "p",
        text: "AutoSSL can only issue a certificate when your domain already points at that server, because the certificate authority checks it by visiting your domain. If you have just moved your site or changed nameservers, wait until the change is visible everywhere (see [why DNS changes take time to show](/blog/dns-propagation-explained)) and run it again. Every Serverlys [shared hosting](/shared-hosting) plan includes a free certificate that is issued and renewed automatically, and our [free SSL setup guide](/blog/free-ssl-setup) walks through it step by step.",
      },
      { type: "h2", id: "no-redirect", text: "2. The certificate exists, but visitors land on http://" },
      {
        type: "p",
        text: "This is the most common cause of the \"Not secure\" label. Type `https://` in front of your domain: if the padlock appears, the certificate is fine and the site simply is not redirecting people to it. Anyone who types your domain without `https://`, or follows an old link, gets the plain version.",
      },
      {
        type: "p",
        text: "The fix is a permanent (301) redirect from every `http://` address to its `https://` twin. Many control panels have a **Force HTTPS** toggle in the domain settings; use that if you have it. On Apache or LiteSpeed hosting without one, add these lines near the top of the `.htaccess` file in your site's root folder:",
      },
      {
        type: "code",
        lang: "apache",
        code: "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [L,R=301]",
      },
      {
        type: "p",
        text: "Take a copy of `.htaccess` before editing it, so you can put it back in one step if the site stops loading. More redirect patterns are in our [.htaccess redirects guide](/blog/htaccess-redirects).",
      },
      {
        type: "callout",
        title: "On WordPress, change the site address too",
        text: "Go to **Settings → General** and make sure both **WordPress Address (URL)** and **Site Address (URL)** start with `https://`. If they still say `http://`, WordPress keeps generating plain links even after the server redirects, and some pages will show mixed-content warnings.",
      },
      { type: "h2", id: "mixed-content", text: "3. Mixed content: the page is https, some files are not" },
      {
        type: "p",
        text: "If the address bar shows `https://` but no padlock, the page is pulling in something over `http://`: usually images pasted in years ago, a logo set in a theme option, or an old embed. Browsers block insecure scripts outright and try to upgrade or block insecure images, so the page may also look broken.",
      },
      {
        type: "ol",
        items: [
          "Open the page, press **F12** (or right-click and choose **Inspect**) and select the **Console** tab. Each mixed-content warning names the exact file that loaded over `http://`.",
          "Fix the source of that link. In page content, edit the image or link. In a theme or page-builder setting, re-select the file so it is saved with the new address.",
          "On WordPress, a search-and-replace plugin can change every stored `http://yourdomain.com` to `https://yourdomain.com` in the database at once. Take a [backup](/blog/website-backup-tutorial) first, and run it in \"dry run\" mode before doing it for real.",
          "For a file hosted on someone else's site that has no `https://` version, download it and host it yourself, or remove it.",
        ],
      },
      { type: "h2", id: "expired", text: "4. NET::ERR_CERT_DATE_INVALID: the certificate expired" },
      {
        type: "p",
        text: "Certificates are only valid for a limited time and must be renewed. Free certificates from Let's Encrypt and AutoSSL renew themselves, so an expired one usually means renewal failed silently: the domain stopped pointing at the server, a firewall rule blocked the check, or the certificate was installed by hand and nobody set a reminder.",
      },
      {
        type: "p",
        text: "Renewal is about to become something nobody can do by hand. Under rules adopted by the [CA/Browser Forum](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/), the body that sets certificate standards, the longest a public certificate may last is 200 days from March 15, 2026, 100 days from March 15, 2027, and 47 days from March 15, 2029. If you still buy a certificate and install it manually every year, now is the time to move to automatic renewal.",
      },
      {
        type: "callout",
        title: "If only one visitor sees it",
        text: "The same error appears when the visitor's own computer or phone has the wrong date. If the site loads for you and only one person reports the warning, ask them to check that their device's date and time are set automatically.",
      },
      { type: "h2", id: "name-mismatch", text: "5. NET::ERR_CERT_COMMON_NAME_INVALID: the name does not match" },
      {
        type: "p",
        text: "A certificate lists the exact names it covers. If it was issued for `yourdomain.com` but the visitor typed `www.yourdomain.com`, or the other way round, the browser refuses it. The same happens on a new subdomain such as `shop.yourdomain.com` that the certificate never included.",
      },
      {
        type: "p",
        text: "Re-issue the certificate so it covers every name people use. With AutoSSL, make sure each name has a DNS record pointing at the server (the `www` record is the one most often missing) and run it again. Then pick one version as the main address and redirect the other to it, so search engines only see one. Our [DNS records explained](/blog/dns-records-explained) guide shows what the `www` record should look like.",
      },
      { type: "h2", id: "untrusted", text: "6. NET::ERR_CERT_AUTHORITY_INVALID: the certificate is not trusted" },
      {
        type: "p",
        text: "This means the browser does not recognise who issued the certificate. Usually it is a self-signed certificate the server generated as a placeholder, or a paid certificate installed without its **intermediate** (\"CA bundle\") file. The second case is tricky because it can work on your computer, which has cached the intermediate, and fail on phones and other people's browsers.",
      },
      {
        type: "p",
        text: "Replace a self-signed certificate with a free Let's Encrypt or AutoSSL one. For a paid certificate, re-install it and paste the CA bundle your certificate provider supplied into the field for it. The free [SSL Labs server test](https://www.ssllabs.com/ssltest/) checks your site from outside and reports a missing intermediate as a \"chain issue\".",
      },
      { type: "h2", id: "cloudflare", text: "If you use Cloudflare or another proxy" },
      {
        type: "p",
        text: "A proxy in front of your site adds a second connection: visitor to proxy, then proxy to your server. Two problems are common here:",
      },
      {
        type: "ul",
        items: [
          "**A redirect loop** (\"too many redirects\") after you force HTTPS. This usually means the proxy is set to talk to your server over plain HTTP (Cloudflare calls this **Flexible** mode) while your server redirects everything to HTTPS. Install a certificate on the server and set the proxy's SSL mode to **Full (strict)**.",
          "**A valid padlock that hides a broken server certificate.** The visitor sees the proxy's certificate, so everything looks fine until the proxy is turned off. Full (strict) mode also catches this, because it refuses an invalid certificate on your server.",
        ],
      },
      { type: "h2", id: "check", text: "Check the fix worked" },
      {
        type: "ol",
        items: [
          "Open the site in a private window and type the domain with no `https://`. It should land on `https://` with a padlock.",
          "Try both `www.` and the bare domain, and any subdomains you use.",
          "Open your three or four most important pages, including the contact form and checkout, and look for the padlock on each.",
          "Run the SSL Labs test linked above and confirm there are no certificate or chain errors.",
          "In Google Search Console, make sure the `https://` version of the site is the one being indexed.",
        ],
      },
      {
        type: "callout",
        title: "The short version",
        text: "\"Not secure\" in the address bar almost always means the site is not redirecting to `https://`: install a free certificate and force HTTPS. A full-page warning means the certificate is expired, issued for a different name, or incomplete: the error code tells you which. If you would rather hand this to someone, our [managed hosting](/managed-hosting) team takes care of certificates, renewals and redirects for you.",
      },
    ],
  },
  {
    slug: "is-my-website-down",
    title: "Is my website down? How to check and what to do next",
    seoTitle: "Is my website down? How to check and fix it",
    description:
      "How to tell in two minutes whether your website is down for everyone or just you, what each error message means, and what to fix or send to your host.",
    category: "Hosting",
    published: "2026-10-29",
    body: [
      {
        type: "p",
        text: "Your website will not load, a customer has just texted you a screenshot of an error, and you need to know two things fast: is it really down, and whose problem is it? This guide answers both in the order you should check them, explains what each common error message means, and lists exactly what to send your hosting company so the fix starts on the first reply rather than the third.",
      },
      { type: "h2", id: "just-you", text: "Step 1: Is it down for everyone, or just you?" },
      {
        type: "p",
        text: "A surprising number of \"outages\" are a problem with one computer or one network. Check these before anything else; together they take about two minutes:",
      },
      {
        type: "ol",
        items: [
          "**Open the site on your phone with Wi-Fi turned off**, so it uses mobile data. If it loads there, the site is up and the problem is on your computer or your office network.",
          "**Use an outside checker** such as downforeveryoneorjustme.com or isitdownrightnow.com. They try to load your site from their servers and tell you what they see.",
          "**Try a private or incognito window.** If the site loads there but not in your normal window, an old cached page or a browser extension is the cause.",
          "**Ask someone elsewhere** to open it. A customer, a friend in another city, anyone not on your network.",
        ],
      },
      {
        type: "callout",
        title: "Down only from your office? You may be blocked",
        text: "Hosting servers run firewalls that temporarily block an IP address after repeated failed logins, often from an old email password saved on one device. Everyone else sees the site; your whole office gets a timeout. If the site loads on mobile data but not on your Wi-Fi, tell your host your public IP address (search \"what is my IP\") and ask them to check the firewall.",
      },
      { type: "h2", id: "read-the-error", text: "Step 2: Read the error message" },
      {
        type: "p",
        text: "The error page is not just bad news; it is a clue. It tells you which part of the chain failed: the domain, the connection to the server, the server itself, or the website's own code. Use this table to find where to look.",
      },
      {
        type: "table",
        head: ["What you see", "What it usually means", "Where to look first"],
        rows: [
          [
            "\"This site can't be reached\" / `DNS_PROBE_FINISHED_NXDOMAIN`",
            "The domain is not pointing anywhere: it expired, the nameservers were changed, or a DNS record was deleted.",
            "Your domain registrar and DNS settings.",
          ],
          [
            "`ERR_CONNECTION_TIMED_OUT` or `ERR_CONNECTION_REFUSED`",
            "The domain points at a server that is not answering, or a firewall is blocking you.",
            "Check from mobile data, then contact your host.",
          ],
          [
            "Your host's \"Account suspended\" page",
            "The hosting account was suspended, usually for an unpaid invoice or a resource or policy issue.",
            "Your hosting account's billing area and email.",
          ],
          [
            "403 Forbidden",
            "The server is refusing to show the page: file permissions, a missing index file, or a security rule.",
            "Recent changes to files or security plugins.",
          ],
          [
            "500 Internal Server Error",
            "The website's code crashed. Often a broken `.htaccess` line, a PHP error or a faulty plugin.",
            "Undo the most recent change; check the error log.",
          ],
          [
            "502 Bad Gateway / 504 Gateway Timeout",
            "A front server or proxy could not get an answer from the server behind it in time.",
            "Your host, or your CDN if you use one.",
          ],
          [
            "503 Service Unavailable",
            "The server is overloaded or in maintenance mode.",
            "Your host; on WordPress, see the maintenance note below.",
          ],
          [
            "508 Resource Limit Is Reached",
            "On shared hosting, the account has used all of its CPU, memory or process allowance.",
            "Traffic spikes, bots, or a plan that is too small.",
          ],
          [
            "\"Error establishing a database connection\"",
            "WordPress cannot reach its database: wrong credentials, a stopped database server, or a full disk.",
            "Your host; `wp-config.php` if you just moved the site.",
          ],
          [
            "A blank white page",
            "A PHP fatal error with error display turned off.",
            "Our [white screen of death guide](/blog/wordpress-white-screen-death).",
          ],
          [
            "\"Your connection is not private\"",
            "The site is up, but its SSL certificate is expired or does not match.",
            "Our guide to the [\"Not secure\" warning](/blog/website-not-secure-warning).",
          ],
        ],
      },
      { type: "h2", id: "domain", text: "Step 3: Check the domain hasn't expired" },
      {
        type: "p",
        text: "If the error says the site cannot be found, check the domain before the hosting. An expired domain takes the website **and** your email offline at the same time, which is the giveaway. Look up your domain with our [WHOIS lookup](/whois-lookup) and read the expiry date and status. If it has expired, log in to your registrar and renew it straight away: after expiry there is usually a grace period when renewal costs the normal price, followed by a redemption period when it costs much more.",
      },
      {
        type: "p",
        text: "If the domain is current, compare its nameservers in the WHOIS result with the ones your host told you to use. A nameserver change made by someone else (a previous web designer, or a new service you signed up for) sends every visitor to the wrong place. Our guide to [keeping control of your domain](/blog/keep-control-of-your-domain) covers how to stop that happening again.",
      },
      { type: "h2", id: "what-changed", text: "Step 4: Ask what changed" },
      {
        type: "p",
        text: "Websites rarely break on their own. If the site worked yesterday, something changed between then and now, and finding it is usually faster than any diagnosis:",
      },
      {
        type: "ul",
        items: [
          "A plugin, theme or WordPress update, including automatic ones.",
          "An edit to `.htaccess`, `wp-config.php` or a theme file.",
          "A DNS or nameserver change, or a new email or CDN service.",
          "A new security plugin or firewall rule.",
          "An unpaid invoice or expired card on the hosting or domain account.",
        ],
      },
      {
        type: "p",
        text: "If you can identify the change, undo it. On WordPress, you can disable all plugins without logging in by renaming the `wp-content/plugins` folder in your host's file manager; rename it back and re-enable plugins one by one to find the culprit. If you cannot identify the change, restoring yesterday's backup is often the quickest fix. Read the restore steps in our [backup tutorial](/blog/website-backup-tutorial) before you need them.",
      },
      {
        type: "callout",
        title: "WordPress stuck on \"Briefly unavailable for scheduled maintenance\"",
        text: "WordPress shows this while it installs updates, using a file named `.maintenance` in the site's root folder. If an update is interrupted, the file stays and so does the message. Delete `.maintenance` in your file manager, then check the update finished in the dashboard.",
      },
      { type: "h2", id: "hacked", text: "If the site loads, but not as you left it" },
      {
        type: "p",
        text: "A page full of pharmacy or casino links, redirects to another site, or a Google warning that the \"site may be hacked\" is not downtime; it is a compromise. Do not just delete the visible spam, because the way in is usually still open. Follow our [hacked website recovery guide](/blog/website-hacked-recovery) from the first step.",
      },
      { type: "h2", id: "contact-host", text: "Step 5: What to send your host" },
      {
        type: "p",
        text: "If the steps above point at the server, contact your host. A ticket that answers the first round of questions up front gets fixed faster. Include:",
      },
      {
        type: "ol",
        items: [
          "The exact address that fails, and whether every page fails or only some.",
          "The exact error text or a screenshot, and the time it started.",
          "Whether it fails on mobile data as well as your own network.",
          "Your public IP address, in case you are being blocked.",
          "Anything that changed recently, from the list in Step 4.",
        ],
      },
      {
        type: "p",
        text: "Serverlys customers can open a ticket from the [support page](/support). Mark it urgent if the whole site is down.",
      },
      { type: "h2", id: "prevent", text: "So it doesn't catch you out next time" },
      {
        type: "ul",
        items: [
          "**Set up uptime monitoring.** Free monitoring services check your site every few minutes and email or text you when it stops responding, so you hear about it before a customer does. Our [uptime explained](/blog/hosting-uptime-explained) guide covers what to expect from a host.",
          "**Turn on auto-renew** for your domain and keep the card on file current. Use an email address for renewal notices that does not depend on the domain itself.",
          "**Keep automatic daily backups** stored away from the server, and test a restore once.",
          "**Update in a staging copy first** for anything bigger than a minor release. See our [WordPress staging guide](/blog/wordpress-staging-site).",
          "**Write down who has access** to your domain, hosting and DNS. Our guide on [who has access to your website](/blog/who-has-access-to-your-website) has a checklist.",
        ],
      },
      {
        type: "callout",
        title: "The short version",
        text: "First check from mobile data and an outside checker to see whether it is down for everyone. Then read the error: \"can't be reached\" points at the domain, a timeout at the server or a firewall, and a 500 or white page at the site's own code. Undo whatever changed most recently, and send your host the exact error, time and your IP. Our [managed hosting](/managed-hosting) plans include monitoring and daily backups, so a problem is noticed and rolled back without you doing the detective work.",
      },
    ],
  },
  {
    slug: "dns-propagation-explained",
    title: "DNS propagation: why your website changes aren't showing yet",
    seoTitle: "DNS propagation: why changes aren't showing yet",
    description:
      "Changed nameservers or DNS records and still seeing the old site? What \"propagation\" really is, how long it takes, how to check it, and how to speed it up.",
    category: "Domains",
    published: "2026-10-29",
    body: [
      {
        type: "p",
        text: "You moved your website to a new host, or pointed your domain at a new service, and you are still seeing the old site. Or your phone shows the new site and your laptop shows the old one. Or your email has gone quiet. Your new host says to \"wait for DNS propagation, up to 48 hours\", which is true but not very helpful when your business is on the other end.",
      },
      {
        type: "p",
        text: "This guide explains what is actually happening during those hours, why different people see different versions, how to check where the change has reached, and what you can do to shorten the wait next time.",
      },
      { type: "h2", id: "what-it-is", text: "What \"propagation\" really is" },
      {
        type: "p",
        text: "The word suggests your change is slowly travelling across the internet. It isn't. When you save a DNS change, it takes effect on your DNS provider's servers within seconds or minutes. What takes time is everyone else **forgetting the old answer**.",
      },
      {
        type: "p",
        text: "Looking up a domain name is slow by computer standards, so the answer is saved (cached) at several points: by your internet provider's DNS servers, by public resolvers such as Google's 8.8.8.8 and Cloudflare's 1.1.1.1, by your operating system and by your browser. Each saved answer carries a **TTL** (time to live), a number of seconds set by whoever owns the record, telling everyone how long they may reuse it before asking again. Until that time runs out, they keep using the old answer, and they are right to.",
      },
      {
        type: "p",
        text: "So \"propagation\" is the period during which caches all over the world expire at different moments. Someone whose provider looked up your domain just before the change sees the old site for the full TTL. Someone whose provider had never looked it up sees the new one immediately. That is why the results are inconsistent, and why a website can look fine for you and broken for a customer.",
      },
      { type: "h2", id: "how-long", text: "How long it actually takes" },
      {
        type: "table",
        head: ["What you changed", "Typical wait", "Why"],
        rows: [
          [
            "An A, CNAME, MX or TXT record",
            "Up to the record's old TTL. Often 1–4 hours; minutes if the TTL was low.",
            "Caches keep the old record for as long as its TTL allows.",
          ],
          [
            "Nameservers for a .com or .net domain",
            "Usually a few hours, up to 48.",
            "The .com registry publishes nameserver records with a TTL of 172,800 seconds, which is 48 hours.",
          ],
          [
            "Nameservers for other domain endings",
            "Varies by registry, usually hours to a day or two.",
            "Each registry sets its own TTL for delegation records.",
          ],
          [
            "A brand-new record that did not exist before",
            "Usually quick, but can be held up if someone looked it up before you created it.",
            "Resolvers also cache \"this name does not exist\" for a period set in your zone's SOA record.",
          ],
        ],
      },
      {
        type: "p",
        text: "The 48-hour figure your host quotes is a ceiling, not an estimate. Most visitors see a change much sooner. If something still has not updated after 48 hours, it is almost never propagation; there is a mistake in the setup, covered further down.",
      },
      { type: "h2", id: "check", text: "How to check where the change has reached" },
      {
        type: "p",
        text: "First find out what you are actually seeing, rather than guessing from how the page looks.",
      },
      {
        type: "ul",
        items: [
          "**A global checker** such as whatsmydns.net queries DNS servers in dozens of countries and shows which answer each one has. A mix of old and new answers means propagation is under way. All new means you are waiting on local caches. All old means check your setup.",
          "**Ask a specific public resolver directly** from a terminal. On a Mac or Linux use `dig`; on Windows use `nslookup`.",
        ],
      },
      {
        type: "code",
        lang: "shell",
        code: "# What do Google and Cloudflare currently return?\ndig yourdomain.com A @8.8.8.8 +short\ndig yourdomain.com A @1.1.1.1 +short\n\n# Which nameservers does the registry say are in charge?\ndig yourdomain.com NS +short\n\n# Windows\nnslookup yourdomain.com 8.8.8.8",
      },
      {
        type: "p",
        text: "Compare the IP address that comes back with the one your new host gave you. If the authoritative answer is right and only some resolvers are wrong, it is propagation, and it will sort itself out. The [WHOIS lookup](/whois-lookup) tool also shows which nameservers are set at the registrar.",
      },
      { type: "h2", id: "speed-up", text: "How to speed it up" },
      { type: "h3", text: "Before a change: lower the TTL" },
      {
        type: "p",
        text: "If you know a move is coming, this is the only step that really shortens the wait. A day or two before, lower the TTL on the records you will change (the A record for your domain and `www`, and MX if email is moving) to `300` seconds, which is five minutes. Wait at least as long as the **old** TTL so every cache has picked up the short one. Then make the change: the old answer now disappears within five minutes. Once everything is stable, raise the TTL back to an hour or more.",
      },
      {
        type: "p",
        text: "Lowering the TTL does not help nameserver changes, because the nameserver TTL belongs to the registry rather than to you. For a move with no visible gap, keep the old hosting running until the new nameservers have fully taken over. Our guide to [moving a website without downtime](/blog/move-a-website-without-downtime) covers the full order of steps.",
      },
      { type: "h3", text: "After a change: clear the caches you control" },
      {
        type: "p",
        text: "You cannot clear your internet provider's cache, but you can clear your own, and you can ask the big public resolvers to forget your domain:",
      },
      {
        type: "ul",
        items: [
          "**Mac:** run `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` in Terminal.",
          "**Windows:** run `ipconfig /flushdns` in Command Prompt.",
          "**Chrome:** open `chrome://net-internals/#dns` and click **Clear host cache**.",
          "**Phones:** turn airplane mode on and off.",
          "**Google Public DNS:** use the [flush cache](https://developers.google.com/speed/public-dns/cache) page.",
          "**Cloudflare 1.1.1.1:** use the [purge cache](https://one.one.one.one/purge-cache/) page.",
        ],
      },
      { type: "h3", text: "Preview the new server before DNS catches up" },
      {
        type: "p",
        text: "To check a migrated site before everyone sees it, you can point just your own computer at the new server by adding a line to its `hosts` file (`/etc/hosts` on a Mac, `C:\\Windows\\System32\\drivers\\etc\\hosts` on Windows) with the new IP address followed by your domain. Remove the line when you are done, or you will keep seeing that server whatever DNS says later.",
      },
      { type: "h2", id: "not-propagation", text: "Still wrong after 48 hours? It isn't propagation" },
      {
        type: "p",
        text: "If the global checker shows the old answer everywhere, or the change never arrives, one of these is almost always the reason:",
      },
      {
        type: "ol",
        items: [
          "**You edited records in the wrong place.** DNS records only count where your nameservers point. If your domain uses your host's or Cloudflare's nameservers, records edited at the registrar are ignored, and vice versa. Run the `NS` lookup above and edit the zone at whichever company it names.",
          "**The nameserver change was never saved,** or it was saved with a typo. Check it in the WHOIS result.",
          "**DNSSEC is still set for the old provider.** If DNSSEC was on and you changed nameservers without removing the old DS record at the registrar, validating resolvers reject your domain and visitors see \"can't be reached\". Remove or update the DS record.",
          "**You are looking at another cache.** A CDN, a caching plugin or the browser can serve an old copy of the page even after DNS is correct. Test in a private window, and purge the CDN or plugin cache.",
          "**The domain has expired or is on hold.** The WHOIS status shows this.",
        ],
      },
      { type: "h2", id: "email", text: "What about email during the change?" },
      {
        type: "p",
        text: "Email follows the same rules through your MX records, but it is more forgiving than a website: a sending server that cannot deliver keeps retrying, typically for several days, before it bounces a message. The risk during a move is mail arriving at the **old** mail server after you stop checking it. Keep the old mailbox working until the new MX records have been in place for longer than their old TTL, and check both. If you are also changing email providers, set up the SPF, DKIM and DMARC records described in our [email security guide](/blog/email-security-spf-dkim-dmarc) at the same time, so mail from the new provider is not marked as spam.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "DNS changes take effect instantly on your DNS provider, then reach everyone else as their cached copies expire, which depends on the TTL. Record changes usually show within hours; nameserver changes can take up to 48. Lower the TTL before planned changes, flush your own caches after, and if nothing has changed after 48 hours, look for records edited in the wrong place. Moving to Serverlys? Our team does the move and the DNS changes as part of free [website migration](/migrations).",
      },
    ],
  },
];
