import type { Tutorial } from "./types";

export const domainsTutorials: readonly Tutorial[] = [
  {
    slug: "point-your-domain",
    published: "2026-09-09",
    title: "Point your domain at Serverlys",
    summary:
      "The two ways to connect your domain name to your Serverlys hosting, how to pick the right one, and how to do it without breaking your email.",
    category: "Domains & DNS",
    minutes: 20,
    intro:
      "Buying a domain name and buying hosting are two separate things. Until you connect them, typing your domain does not open your website, a bit like having a new address that the post office does not know about yet. This tutorial tells the internet that your domain now lives at Serverlys. It also makes sure your email keeps arriving while you do it.",
    terms: [
      "domain",
      "hosting",
      "registrar",
      "dns",
      "dns-record",
      "zone",
      "nameservers",
      "ip-address",
      "a-record",
      "cname",
      "mx",
      "txt",
      "google-workspace",
      "ttl",
      "propagation",
      "cache",
      "private-window",
      "ssl",
      "https",
      "autossl",
      "client-area",
      "cpanel",
    ],
    done:
      "On a phone using mobile data (not Wi-Fi), or in a private window, yourdomain.com opens your Serverlys website with a padlock in the address bar. Then send a test email to an address on your domain and check that it arrives.",
    before: [
      "Your login for the company where you bought the domain (your registrar). If you bought it from Serverlys, that is your Serverlys account.",
      "Your Serverlys nameservers (ns1.serverlys.com and ns2.serverlys.com) or your server's IP address. Both are in your welcome email. The IP address is also shown in cPanel, in the General Information box on the right of the home page.",
      "About 20 minutes now, plus some waiting time later while the change spreads around the internet.",
    ],
    steps: [
      {
        title: "Decide: nameservers or an A record",
        detail:
          "There are two ways to connect your domain. Option one: change the nameservers. This hands your whole DNS (the domain's address book) to Serverlys. It is the simplest choice and right for most people. Option two: change only the A record. This sends your website to Serverlys but leaves everything else, including email, where it is now. If your email is with Google Workspace or Microsoft 365 and you do not want to recreate those records, choose the A record.",
        check: "You know which option you are using: nameservers or A record.",
      },
      {
        title: "Write down the DNS records you have now",
        detail:
          "Before you change anything, find the DNS settings where your domain is managed today and take a screenshot of every record. Pay special attention to records of type MX, TXT and CNAME. If you switch nameservers without copying these across, your email stops. This is the single most common way a domain move breaks a business.",
        check: "You have screenshots or notes of every record, including all MX and TXT records.",
      },
      {
        title: "Lower the TTL",
        detail:
          "Every DNS record has a TTL: the number of seconds other computers may remember it before checking again. On the record you are about to change, set the TTL to 300 seconds (five minutes).",
        code: "TTL: 300",
        check: "The record now shows 300 in its TTL column.",
      },
      {
        title: "Wait as long as the old TTL",
        detail:
          "Leave it for at least as long as the old TTL was. For example, if it said 86400, that is one day, so wait a day. Computers around the world still remember the old value. Waiting is what stops them remembering it for another full day after you make the real change.",
      },
      {
        title: "Option one: change the nameservers",
        detail:
          "Log in at your registrar and open your domain's settings. Look for a section called Nameservers, DNS or DNS management. Remove the existing entries and type the two Serverlys nameservers, one per box. If your domain is registered with Serverlys, sign in to your account and find the domain under Domains, then Domain portfolio. Skip the next two steps if you use this option.",
        where: ["serverlys.com/login", "Domains", "Domain portfolio"],
        code: "ns1.serverlys.com\nns2.serverlys.com",
        check: "Your registrar's page lists only ns1.serverlys.com and ns2.serverlys.com as nameservers.",
      },
      {
        title: "Option two: change the A record",
        detail:
          "Open the DNS settings where your domain is managed today. Find the A record whose name is @ (the @ sign means the domain itself, with nothing in front). Edit it so its value is your Serverlys server's IP address. Edit the existing record, do not add a second one. If you are managing DNS in Serverlys cPanel, the path is shown here.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "# Replace your.server.ip.address with the IP from your welcome email\nA     @     your.server.ip.address",
        shot: { id: "zone-records", caption: "Serverlys cPanel, Domains, Zone Editor, Manage. The nameservers to use are listed at the top (ns1.serverlys.com and ns2.serverlys.com). The A record for the bare domain holds your server's IP address." },
        check: "The A record for @ shows your Serverlys IP address as its value.",
      },
      {
        title: "Option two: point www at your domain",
        detail:
          "So that www.yourdomain.com works too, add a CNAME record. Its name is www and its value is your domain, with a dot at the end. The dot tells the editor the name is complete. If a www record already exists, edit it instead of adding another.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "CNAME www   yourdomain.com.",
        check: "The list shows a CNAME record named www pointing at yourdomain.com.",
      },
      {
        title: "Check that the domain opens here",
        detail:
          "Open yourdomain.com on a device that has never visited the new server. A phone on mobile data, with Wi-Fi turned off, is ideal. Your own computer may keep showing the old site for hours because it has the old answer saved, whatever the TTL says. A private window helps, but a different device on a different network is the surest test.",
        check: "yourdomain.com shows your website from Serverlys, not the old one.",
      },
      {
        title: "Get your free SSL certificate",
        detail:
          "Do this only after the domain opens at Serverlys. AutoSSL issues your free certificate by looking up your domain, so it cannot work while the domain still points somewhere else. Open SSL/TLS Status in cPanel. If your domain still shows an error, click Run AutoSSL, or simply wait for its next automatic run.",
        where: ["cPanel", "Security", "SSL/TLS Status"],
        shot: { id: "ssl-tls-status", caption: "SSL/TLS Status while the domain still points elsewhere: AutoSSL reports that the domain resolved to an IP address that is not on this server. Once DNS points here, the next run replaces the temporary self-signed certificate with a real one." },
        check: "Your domain shows a green, valid certificate, and https://yourdomain.com opens with a padlock.",
      },
      {
        title: "Put the TTL back up",
        detail:
          "Once everything works, raise the TTL on the record you changed back to a normal value, such as 3600 (one hour).",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "TTL: 3600",
        check: "The record shows 3600 in its TTL column.",
      },
    ],
    gotcha:
      "Switching nameservers without copying your MX records first. The website comes up and everything looks fine, but email silently stops arriving, often for a day before anyone notices.",
    products: ["/domain-name", "/hosting", "/whois-lookup"],
    related: ["change-nameservers", "add-a-or-cname-record", "transfer-a-domain"],
  },
  {
    slug: "lower-ttl-before-migration",
    published: "2026-09-09",
    title: "Lower your TTL before a migration",
    summary:
      "One small change, made a day before you move your website, that makes the move take minutes instead of a day.",
    category: "Domains & DNS",
    minutes: 10,
    intro:
      "When you move a website to a new server, computers around the world keep using the old address they remember until their memory of it runs out. The TTL is how long that memory lasts. Shortening it a day before the move is like telling everyone in advance \"check my address again in five minutes\", so on moving day they find the new place almost at once.",
    terms: ["dns", "dns-record", "ttl", "propagation", "cache", "a-record", "cname", "server", "cpanel", "zone"],
    done:
      "On moving day, after you change the record, a phone on mobile data (or a private window) shows the new site within about five to ten minutes instead of hours.",
    before: [
      "Access to your domain's DNS settings. If your DNS is at Serverlys, that is cPanel's Zone Editor.",
      "Time: you need to do this at least a day before you move. If the current TTL is longer than a day, start earlier.",
    ],
    steps: [
      {
        title: "Open your DNS records",
        detail:
          "Open the place where your domain's DNS records are managed. At Serverlys, that is the Zone Editor in cPanel: click Manage next to your domain. If you are new to cPanel, the tutorial \"Log in to your Serverlys control panel\" shows how to get in.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        check: "You see a list of records with columns for name, TTL, type and value.",
      },
      {
        title: "Find out what your TTL is now",
        detail:
          "Look at the TTL column for the records you plan to change. The number is in seconds: 3600 is one hour, 14400 is four hours and 86400 is a day. Write it down. However long it is, that is how long some visitors will keep reaching your old server after you change anything.",
        shot: { id: "zone-records", caption: "The TTL column in cPanel's Zone Editor, in seconds. 14400 is four hours. Click Edit on a record to change it." },
        check: "You have written down the current TTL of each record you will change.",
      },
      {
        title: "Lower the TTL to 300",
        detail:
          "Click Edit on each record you will be changing, usually the A record and the CNAME records. Change only the TTL to 300 seconds (five minutes) and save. Do not change the record's value yet.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Edit"],
        code: "TTL: 300",
        check: "Those records now show 300 in the TTL column, and their values are unchanged.",
      },
      {
        title: "Wait one full old TTL",
        detail:
          "Wait at least as long as the old TTL you wrote down. If it was 86400, wait a full day. Computers that saved the old answer also saved the old TTL, and they will not learn about the shorter one until their saved copy runs out. Lowering the TTL an hour before the move achieves nothing.",
      },
      {
        title: "Do the move",
        detail:
          "Now change the record's value to the new server. The change spreads in about five minutes instead of a day. That keeps the time when some visitors see the old site and others see the new one short enough not to matter.",
        check: "Within a few minutes, a phone using mobile data (not your Wi-Fi) opens the new site.",
      },
      {
        title: "Put the TTL back afterwards",
        detail:
          "Once you are happy with the new site, edit the records again and raise the TTL to 3600 or higher. A TTL that stays low forever means more lookups for every visitor and slightly slower first visits.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Edit"],
        code: "TTL: 3600",
        check: "The records show 3600 or higher in the TTL column.",
      },
    ],
    gotcha:
      "Lowering the TTL and moving the site the same afternoon. The old TTL is still remembered everywhere, so the change takes exactly as long as it would have anyway.",
    products: ["/migrations", "/domain-name"],
    related: ["move-wordpress-to-a-new-host", "change-nameservers"],
  },
  {
    slug: "change-nameservers",
    published: "2026-10-26",
    title: "Change your domain's nameservers",
    summary:
      "Move your domain's DNS to a new provider without losing email, and know for sure when the switch has happened.",
    category: "Domains & DNS",
    minutes: 25,
    intro:
      "Your nameservers decide which company keeps your domain's address book: the list that says where your website is and where your email goes. Changing them is like moving that whole address book to a new office in one go. The trick is to copy every entry into the new book before you move, so nothing goes missing on the way.",
    terms: [
      "domain",
      "registrar",
      "nameservers",
      "dns",
      "dns-record",
      "zone",
      "a-record",
      "cname",
      "mx",
      "txt",
      "spf",
      "dkim",
      "dmarc",
      "google-workspace",
      "ttl",
      "propagation",
      "whois",
      "cpanel",
      "hosting",
    ],
    done:
      "A WHOIS lookup (Serverlys has a free one) shows only the new nameservers, your website opens on a phone using mobile data, and a test email sent to an address on your domain arrives.",
    before: [
      "Your login for the registrar, the company where the domain is registered.",
      "The two (or more) nameserver names of your new DNS provider. For Serverlys hosting they are ns1.serverlys.com and ns2.serverlys.com, and they are also in your welcome email.",
      "A copy of every DNS record the domain has today. Step one shows how to make it.",
    ],
    steps: [
      {
        title: "Copy the current DNS records",
        detail:
          "Nameservers decide who answers for ALL of your domain's records, not just the website. At your current DNS provider, list every record: A, AAAA (the same as A but for the newer, longer kind of IP address), CNAME, MX, every TXT (SPF, DKIM, DMARC and any \"verify you own this domain\" codes) and any SRV (a record some phone and chat services use). Many providers let you export everything as a text file. If yours does not, take screenshots.",
        shot: { id: "zone-records", caption: "In Serverlys cPanel, Zone Editor, Manage lists every record for the domain. Use the A, CNAME, MX and TXT filter buttons to check nothing is missing before you switch." },
        check: "You have a file or screenshots showing every record, including all MX and TXT records.",
      },
      {
        title: "Add your domain to the new hosting",
        detail:
          "The new nameservers must already hold your records before you point the domain at them. On Serverlys cPanel hosting, adding the domain to your account creates the website and email records for you automatically. Your main domain is added when the plan is set up.",
        where: ["cPanel", "Domains", "Domains"],
        check: "Your domain is listed on the Domains page in cPanel.",
      },
      {
        title: "Recreate any missing records",
        detail:
          "Open the Zone Editor and compare it with your copy from step one. Add anything that is missing, especially MX and TXT records for Google Workspace, Microsoft 365 or any newsletter service you send email through.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        check: "Every record from your copy now also appears in the new Zone Editor.",
      },
      {
        title: "Check whether DNSSEC is switched on",
        detail:
          "DNSSEC is an optional security setting at your registrar that signs your DNS answers, using records called DS records. Look in your domain's settings at the registrar for DNSSEC. If it is on, with DS records from the OLD provider, remove them before you change nameservers. A DS record that does not match the new provider makes many internet providers reject every answer, and your domain disappears for a large share of the internet. If the new provider offers DNSSEC, turn it back on with their values afterwards.",
        check: "DNSSEC is either off, or you have removed the old DS records.",
      },
      {
        title: "Replace the nameservers at the registrar",
        detail:
          "Log in at your registrar and open the domain's settings. The section is usually called Nameservers, DNS management or Custom nameservers. Remove every old entry and type the new names exactly as given, one per box. Do not keep one old nameserver next to the new ones: computers pick among them at random, so visitors would get two different answers.",
        code: "# Use your new provider's names. For Serverlys: ns1.serverlys.com and ns2.serverlys.com\nns1.example-dns.com\nns2.example-dns.com",
        check: "The registrar lists only the new nameservers and has saved the change.",
      },
      {
        title: "Confirm the change was recorded",
        detail:
          "Check with the official registry for your domain ending, not with your own computer, which may remember old answers. The easy way is a WHOIS lookup, which shows the nameservers on record. If you are comfortable typing commands, dig asks a server directly: open Terminal on a Mac and type the lines below. For a .com, the servers named a.gtld-servers.net hold the official answer. The second line asks your new nameserver for the website's address.",
        code: "dig NS yourdomain.com @a.gtld-servers.net +norecurse\ndig +short A yourdomain.com @ns1.example-dns.com",
        check: "The lookup shows only the new nameservers, and the second command returns your new server's IP address.",
      },
      {
        title: "Allow up to two days for everyone to follow",
        detail:
          "The TTL on a nameserver change is set by the registry, not by you. For .com it is two days, so lowering your own TTLs does not speed this change up. That is fine: because the old and the new provider now hold the same records, visitors get the same answer either way while the old answers expire.",
      },
    ],
    gotcha:
      "Switching nameservers before the new provider has your MX and TXT records. The website looks fine on the new host, while email quietly stops arriving or starts failing its SPF check and landing in spam.",
    products: ["/domain-name", "/register-domain", "/whois-lookup"],
    related: ["point-your-domain", "add-a-or-cname-record", "transfer-a-domain"],
  },
  {
    slug: "add-a-or-cname-record",
    published: "2026-10-26",
    title: "Add an A record or a CNAME record",
    summary:
      "Which record a name needs, how to type the name field without doubling your domain, and how to check the result.",
    category: "Domains & DNS",
    minutes: 10,
    intro:
      "When a service such as a shop builder or a booking tool says \"add this record to your DNS\", this is how you do it. An A record points a name at a numbered address, like writing down a street number. A CNAME record says one name is a nickname for another, so it follows that name wherever it moves.",
    terms: ["dns", "dns-record", "zone", "nameservers", "registrar", "a-record", "cname", "ip-address", "subdomain", "ttl", "propagation", "cpanel"],
    done:
      "A free online DNS lookup, or the commands in the last step, shows your new record with the value you entered, and the name (for example blog.yourdomain.com) opens what it should.",
    before: [
      "Access to wherever your domain's DNS is managed. Your nameservers decide where that is: if they are ns1.serverlys.com and ns2.serverlys.com, it is cPanel's Zone Editor. Otherwise it is usually at your registrar.",
      "The IP address or the name (hostname) the service gave you.",
    ],
    steps: [
      {
        title: "Choose the record type",
        detail:
          "Look at what the service gave you. If it is a number like 192.0.2.10 (an IP address), use an A record. If it is a name like shops.example-platform.com (a hostname), use a CNAME. An A record is for the common, shorter kind of IP address. A longer address with colons in it, the newer kind, needs an AAAA record instead, which works the same way.",
        check: "You know whether you need A, AAAA or CNAME.",
      },
      {
        title: "Know where a CNAME is not allowed",
        detail:
          "A name that has a CNAME may have no other record at all. That rules out the bare domain (yourdomain.com with nothing in front, written as @), because it must also carry two built-in records called SOA and NS. Some DNS providers offer a replacement for the bare domain called ALIAS, ANAME or CNAME flattening, but not all do. Without it, the bare domain gets an A record.",
      },
      {
        title: "Open the Zone Editor",
        detail:
          "In cPanel, open Zone Editor and click Manage next to your domain. At another registrar, look for the DNS settings of your domain. If you are new to cPanel, the tutorial \"Log in to your Serverlys control panel\" shows how to get in.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        check: "You see the list of your domain's records.",
      },
      {
        title: "Add the record",
        detail:
          "Click Add Record. Pick the type first, because the value box changes with it: an IP address for A, a hostname for CNAME. Then fill in the name, the TTL (3600 is a good default) and the value, and save. Every DNS editor asks for these same four things. The examples below show one of each.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "# name                 TTL   class type  value\nblog.yourdomain.com.   3600  IN  A      192.0.2.10\nshop.yourdomain.com.   3600  IN  CNAME  shops.example-platform.com.",
        shot: { id: "zone-add-record", caption: "Add Record opens a row at the top of the list: name, TTL, type, then the value. Pick the type first; the value box changes with it (an IP address for A, a hostname for CNAME)." },
        check: "The new record appears in the list.",
      },
      {
        title: "Check the name came out right",
        detail:
          "DNS editors differ. Some want only the first part (blog), some want the full name, and some want a dot at the end to mark the name as complete. If the editor adds your domain itself and you type the full name too, you get blog.yourdomain.com.yourdomain.com. After saving, read the full name the editor shows. If it is doubled, edit it.",
        check: "The record's name reads blog.yourdomain.com (or whatever you intended), with your domain only once.",
      },
      {
        title: "Remove what the new record replaces",
        detail:
          "A name cannot have both an A record and a CNAME. If you are adding a CNAME and an A record already exists for that name, delete the A record. If you are changing an A record, click Edit on the existing one instead of adding a second. Two A records on one name split visitors between both addresses.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        check: "Each name has only the one record you want.",
      },
      {
        title: "Check the answer",
        detail:
          "Ask DNS for the record. On a Mac, open Terminal and type the dig lines. On Windows, open Command Prompt and use the nslookup line, which does the same job. A free online DNS lookup website works too. Expect the new value once the old record's TTL has run out.",
        code: "dig +short A blog.yourdomain.com\ndig +short CNAME shop.yourdomain.com\nnslookup -type=CNAME shop.yourdomain.com",
        check: "The lookup returns the IP address or hostname you entered.",
      },
    ],
    gotcha:
      "Adding a new A record next to the old one instead of editing it. DNS returns both, so roughly half of visitors keep landing on the old server and the problem looks like it comes and goes.",
    products: ["/domain-name", "/hosting"],
    related: ["set-up-subdomain", "point-your-domain", "change-nameservers"],
  },
  {
    slug: "set-up-subdomain",
    published: "2026-10-26",
    title: "Set up a subdomain",
    summary:
      "Create blog., shop. or staging. as its own site, with its DNS record and a free certificate, and keep a test copy out of Google.",
    category: "Domains & DNS",
    minutes: 15,
    intro:
      "A subdomain is a name in front of your domain, like blog.yourdomain.com or staging.yourdomain.com. It costs nothing extra and can hold a whole separate site, a bit like a separate entrance to the same building. A common use is a staging site: a private copy of your website for trying changes safely.",
    terms: [
      "subdomain",
      "domain",
      "hosting",
      "cpanel",
      "dns",
      "dns-record",
      "nameservers",
      "a-record",
      "cname",
      "ip-address",
      "ssl",
      "https",
      "autossl",
      "public-html",
      "file-manager",
      "database",
      "wordpress",
      "wp-admin",
      "staging",
      "private-window",
    ],
    done:
      "In a private window, https://staging.yourdomain.com (or your subdomain) opens with a padlock and shows the new site, not your main one.",
    before: [
      "A Serverlys hosting plan with your main domain on it.",
      "If your domain's nameservers are not ns1.serverlys.com and ns2.serverlys.com, access to wherever its DNS is managed.",
    ],
    steps: [
      {
        title: "Decide what the subdomain is for",
        detail:
          "If it should open another company's service, such as a shop builder or a help desk, it only needs a DNS record, usually a CNAME. The tutorial \"Add an A record or a CNAME record\" covers that. If it should be a site on your own Serverlys hosting, carry on here.",
        check: "You know the subdomain will be a site on your own hosting.",
      },
      {
        title: "Open the Domains page in cPanel",
        detail:
          "Open cPanel from your Serverlys account (the tutorial \"Log in to your Serverlys control panel\" shows how) and click Domains under the Domains heading. Older cPanel versions have a separate Subdomains page instead.",
        where: ["cPanel", "Domains", "Domains"],
        shot: { id: "domains", caption: "Domains, Domains. Create A New Domain is at the top right. Each domain's folder (its document root) and its Force HTTPS Redirect switch are shown in the list." },
        check: "You see a list of your domains and a Create A New Domain button.",
      },
      {
        title: "Create the subdomain",
        detail:
          "Click Create A New Domain and type the full name, such as staging.yourdomain.com. Untick the option to share the document root with your main domain. The document root is the folder that holds a site's files. Unticking it gives the subdomain its own folder, so it does not just show your main site. Then click Submit.",
        where: ["cPanel", "Domains", "Domains", "Create A New Domain"],
        check: "The new name appears in the Domains list with its own folder, not public_html.",
      },
      {
        title: "Make sure the name works",
        detail:
          "If your domain uses the Serverlys nameservers, cPanel adds the DNS record for you, so there is nothing to do. If your DNS is managed somewhere else, go there and add an A record for the subdomain pointing at your server's IP address (in your welcome email).",
        code: "# Only if your DNS is managed outside Serverlys. Use your server's IP.\nstaging  A  192.0.2.10",
        check: "Opening the subdomain in a private window shows a Serverlys page instead of a \"site can't be reached\" error.",
      },
      {
        title: "Get it a free certificate",
        detail:
          "Once the name works, AutoSSL issues a free certificate on its next automatic run. Open SSL/TLS Status and find the new name. It should move from an error to a valid certificate. To start a check right away, click Run AutoSSL. If it still shows an error a few hours after the name works, open a ticket and we will check it.",
        where: ["cPanel", "Security", "SSL/TLS Status"],
        check: "The subdomain shows a valid certificate, and https://staging.yourdomain.com opens with a padlock.",
      },
      {
        title: "Put the site in place",
        detail:
          "Install WordPress into the subdomain's own folder with the WordPress installer in cPanel, or upload your files to that folder with File Manager. For a staging copy of an existing site, the tutorial on moving WordPress by hand covers copying the files and the database.",
        where: ["cPanel", "Files", "File Manager"],
        check: "Opening the subdomain shows your new site.",
      },
      {
        title: "Ask search engines to stay away",
        detail:
          "If this is a staging copy, keep it out of Google. In the WordPress dashboard of the staging site, open Settings, then Reading, tick \"Discourage search engines from indexing this site\" and save. This is only a polite request, so do the next step too.",
        where: ["WordPress dashboard", "Settings", "Reading"],
        check: "The box is ticked and WordPress shows \"Settings saved\".",
      },
      {
        title: "Password-protect the staging folder",
        detail:
          "To actually keep search engines out, along with everyone else, use Directory Privacy in cPanel. Choose the subdomain's folder, turn on password protection, give it a name and create a username and password. Visitors then have to sign in before they see anything.",
        where: ["cPanel", "Files", "Directory Privacy"],
        check: "Opening the subdomain in a private window asks for a username and password.",
      },
    ],
    gotcha:
      "Creating the subdomain in cPanel while the domain's DNS is managed somewhere else. That other DNS never sees cPanel's record, so the subdomain does not work until you add the A record where your DNS really lives.",
    products: ["/hosting", "/domain-name"],
    related: ["add-a-or-cname-record", "move-wordpress-to-a-new-host", "install-ssl-certificate-wordpress"],
  },
  {
    slug: "transfer-a-domain",
    published: "2026-10-26",
    title: "Transfer a domain to another registrar",
    summary:
      "Unlock your domain, get its transfer code, keep your website and email running during the move, and know how long each stage takes.",
    category: "Domains & DNS",
    minutes: 20,
    intro:
      "Transferring a domain means moving where you rent it from, for example from another company to Serverlys, so you renew and manage it in a new place. It is like moving your phone number to a new carrier: the number stays the same, only the company changes. Done in the right order, visitors and email never notice.",
    terms: ["domain", "registrar", "transfer-lock", "auth-code", "whois", "nameservers", "dns", "dns-record", "zone", "mx", "hosting"],
    done:
      "A WHOIS lookup shows the new registrar's name and the transfer lock is back on, and your website and email still work as before.",
    before: [
      "Your login for the registrar you are leaving.",
      "Access to the email address listed as the domain's owner (the registrant contact). Approval emails and the transfer code may be sent there.",
      "A domain registered, or last transferred, more than 60 days ago.",
      "Up to a week of patience: the transfer itself can take five days.",
    ],
    steps: [
      {
        title: "Check that it can be transferred",
        detail:
          "Most common domain endings, such as .com, cannot move within 60 days of being registered or of a previous transfer. Some registrars apply the same 60-day lock after you change the owner's details. Many country endings follow different rules: a .uk domain, for example, moves by changing its registrar tag (a label the old registrar sets) rather than with a code. Check the rules for your ending first.",
        check: "Your domain is more than 60 days old (or since its last transfer) and its ending uses a transfer code.",
      },
      {
        title: "Find out who runs your DNS",
        detail:
          "Look up your domain's nameservers with a WHOIS lookup. A transfer normally keeps them as they are. But if the nameservers belong to the old registrar's free DNS service, your DNS records may be deleted when the domain leaves.",
        check: "You know whether your nameservers belong to the old registrar or to someone else, such as your hosting.",
      },
      {
        title: "Move DNS first if the old registrar runs it",
        detail:
          "If the old registrar runs your DNS, copy every record (especially the MX records for email) to your hosting or another DNS provider. Then change the nameservers to that provider before you start the transfer. The tutorial \"Change your domain's nameservers\" walks through this. If your DNS is already elsewhere, skip this step.",
        check: "Your nameservers point at your hosting or a DNS provider that is not the old registrar, and your site and email still work.",
      },
      {
        title: "Remove the transfer lock",
        detail:
          "At the registrar you are leaving, open the domain's settings and turn off the setting usually called registrar lock or transfer lock. Then confirm it with a WHOIS lookup: the status list must no longer include clientTransferProhibited. If you are comfortable typing commands, the line below does the same check in a Mac's Terminal.",
        code: "whois yourdomain.com | grep -i status",
        check: "The WHOIS status no longer shows clientTransferProhibited.",
      },
      {
        title: "Get the authorisation code",
        detail:
          "This code is also called the auth code, EPP code or transfer key. The old registrar shows it in the domain's settings or emails it to the owner's address. Treat it like a password: it is what allows the domain to move.",
        check: "You have the code copied somewhere safe.",
      },
      {
        title: "Start the transfer at the new registrar",
        detail:
          "At the new registrar, choose to transfer a domain. Enter the domain and the code, then pay. For most common endings the transfer adds a year to the registration, and the time you have already paid for is kept. At Serverlys, you can follow a transfer under Domains, then Transfers, in your account.",
        where: ["serverlys.com/login", "Domains", "Transfers"],
        check: "The new registrar shows the transfer as pending or in progress.",
      },
      {
        title: "Approve it, or wait",
        detail:
          "Transfers of common endings complete within five days. The old registrar may email you a link to approve it sooner. If you do nothing, it completes automatically at the end of that period, unless you reject it.",
        check: "WHOIS shows the new registrar's name.",
      },
      {
        title: "Lock it again and check the details",
        detail:
          "Once WHOIS shows the new registrar, turn the transfer lock back on at the new registrar. Then check that auto-renew is switched on and that the contact details are correct.",
        check: "WHOIS shows clientTransferProhibited again, and auto-renew is on.",
      },
    ],
    gotcha:
      "Transferring a domain whose DNS is run by the old registrar. The domain arrives safely, but the website and email stop, because the DNS records they relied on were deleted on the way out.",
    products: ["/transfer-domain", "/whois-lookup", "/register-domain"],
    related: ["change-nameservers", "point-your-domain", "lower-ttl-before-migration"],
  },
];
