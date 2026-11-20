import type { Tutorial } from "./types";

/**
 * Email tutorials. cPanel labels are the Serverlys cPanel (Jupiter) strings:
 * Email → Email Accounts / Forwarders / Default Address / Email Routing /
 * Email Deliverability, and Domains → Zone Editor → Manage → Add Record.
 * Google and Microsoft admin screens are described, not given as `where`
 * paths, because their labels change without notice.
 *
 * DNS checks: `dig` is shown for people with a Mac or Linux Terminal; every
 * check also names Google's free web version at toolbox.googleapps.com/apps/dig.
 */
export const emailTutorials: readonly Tutorial[] = [
  {
    slug: "email-deliverability",
    published: "2026-09-09",
    title: "Set up email that actually gets delivered",
    summary:
      "SPF, DKIM and DMARC explained in plain words, and the order to add them in so your email lands in the inbox, not spam.",
    category: "Email",
    minutes: 30,
    intro:
      "When you send an email, the receiving side asks: is this really from yourdomain.com, or is someone pretending? Three short DNS records answer that question: SPF, DKIM and DMARC. Think of them as a guest list, a wax seal and the instructions for the doorman. Without them, more of your email ends up in spam, and anyone can send email that looks like it came from you.",
    terms: ["dns", "dns-record", "txt", "spf", "dkim", "dmarc", "zone", "nameservers", "cpanel", "mailbox", "domain"],
    done:
      "Send an email from your domain to a Gmail address, open it, click the three-dot menu and choose Show original. You want to see SPF: PASS, DKIM: PASS and DMARC: PASS. After the last step, your DMARC record reads p=reject and your reports show no real senders failing.",
    before: [
      "A way to change your domain's DNS records. If your domain uses the Serverlys nameservers (ns1.serverlys.com and ns2.serverlys.com), that is the Zone Editor in cPanel. If not, it is wherever those nameservers point, often the company you bought the domain from.",
      "A list of everything that sends email as your domain. Step one shows you how to make it.",
      "About 30 minutes now, then a few minutes every week or two over the next month while you read the reports.",
    ],
    steps: [
      {
        title: "List every sender first",
        detail:
          "Write down every service that sends email with your domain in the From address. Think of: your own mailboxes, your website's contact form, your invoicing tool, your newsletter service and your CRM (the system that keeps your customer list). Each one sends as your domain. Any you forget will start failing the moment you switch on a strict policy at the end. This list is the real job. The DNS records are the easy part.",
        check: "You have a written list. For each service, you know how to log in to its settings.",
      },
      {
        title: "Open your DNS records",
        detail:
          "If your domain uses the Serverlys nameservers, open cPanel (see the tutorial on logging in to cPanel), find the Domains section and click Zone Editor. Next to your domain, click Manage. If your DNS is somewhere else, log in there and find its DNS settings instead.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        shot: { id: "zone-records", caption: "Zone Editor → Manage lists every DNS record of your domain. Your SPF record, if you have one, is a TXT record whose value starts with v=spf1." },
        check: "You see a list of records for yourdomain.com, with columns for name, TTL, type and value.",
      },
      {
        title: "Look for an SPF record you already have",
        detail:
          "SPF is a list of the services allowed to send as your domain. Look through the TXT records for a value that starts with v=spf1. You may only have ONE SPF record per domain. Two is a permanent error, and that is worse than having none. If you already have one, you will edit it in the next step, not add another.",
        check: "You know whether you have zero or one record starting with v=spf1. If you find two, you will merge them into one in the next step.",
      },
      {
        title: "Publish one SPF record",
        detail:
          "Put every sender on your list into a single record. Each service's setup page tells you its include: part. In the example below, the first include is for a hosting server and the second is for Google. The ~all at the end means \"treat mail from anywhere else as suspicious\". If you are editing an existing record, click its Edit button. Otherwise, click Add Record, choose type TXT, put your domain itself in the name field and paste the record as the value. Then click Save Record.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "v=spf1 include:_spf.yourhost.com include:_spf.google.com ~all",
        check: "There is exactly one TXT record starting with v=spf1, and it names every sender on your list.",
      },
      {
        title: "Turn on DKIM for the email you send from Serverlys",
        detail:
          "DKIM adds a digital signature to every email, so the receiver can tell it was not changed on the way. In cPanel, go to the Email section, click Email Deliverability, and click Manage next to your domain. The page shows the exact DKIM record to publish, with a Copy button for the name and the value. If your DNS is on Serverlys, cPanel can add it for you. The tutorial on setting up DKIM walks through this screen in detail.",
        where: ["cPanel", "Email", "Email Deliverability", "Manage"],
        shot: { id: "email-deliverability-dkim", caption: "For mail sent from your Serverlys hosting, Email → Email Deliverability → Manage shows the exact DKIM record to publish, with a Copy button for the name and the value." },
        check: "The DKIM line on the Email Deliverability page shows as valid.",
      },
      {
        title: "Turn on DKIM at every other sender",
        detail:
          "Every service on your list gives you its own key to publish as a TXT record (or a CNAME record that points to one). Each sits at a name the service chooses, called its selector. Do this for every sender on your list, not just your main mailbox. Look in each service's settings for a section named something like \"domain authentication\".",
        check: "Each service's settings page says your domain is authenticated or verified.",
      },
      {
        title: "Create an inbox for DMARC reports",
        detail:
          "DMARC asks other mail servers to send you reports. They need an address to send them to. In cPanel, go to Email Accounts and click Create. Make an address such as dmarc@yourdomain.com.",
        where: ["cPanel", "Email", "Email Accounts", "Create"],
        check: "dmarc@yourdomain.com appears in your list of email accounts.",
      },
      {
        title: "Start DMARC in monitor mode",
        detail:
          "DMARC tells receivers what to do when SPF and DKIM fail. Start with p=none, which changes nothing about delivery and only asks for reports. Do not skip this step. Going straight to reject is how real email disappears. In Zone Editor, click Add Record, choose type TXT, type _dmarc as the name, paste the record below as the value and click Save Record.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com",
        check: "A TXT record named _dmarc.yourdomain.com appears in the list with the value above.",
      },
      {
        title: "Read the reports for two weeks",
        detail:
          "The reports (called aggregate reports) arrive in your dmarc@ inbox as small compressed files. They show every source sending as your domain, including ones you forgot. Fix each real sender until it passes, by adding it to SPF or turning on its DKIM. Anything still failing after that is either set up wrong or is not yours.",
        check: "Every service you recognise in the reports shows as passing.",
      },
      {
        title: "Tighten the policy to quarantine",
        detail:
          "Once the reports are clean, edit your _dmarc record and change p=none to p=quarantine. That sends failing email to spam. Then watch the reports for another two weeks (a fortnight).",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com",
        check: "Your _dmarc record now shows p=quarantine, and your own test emails still reach the inbox.",
      },
      {
        title: "Tighten the policy to reject",
        detail:
          "If nothing real failed during those two weeks, edit the record again and change it to p=reject. This final record is what stops other people sending email that looks like it came from you.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com",
        check: "Your _dmarc record shows p=reject.",
      },
    ],
    gotcha:
      "Having two SPF records on one domain. It is a permanent failure, not a warning, and it makes delivery worse than having no SPF at all. When you add a new sender, edit the record you already have. Never add a second one.",
    products: ["/business-email", "/domain-name"],
    related: ["set-up-dkim", "set-up-dmarc", "connect-google-workspace-or-microsoft-365"],
  },
  {
    slug: "set-up-dmarc",
    published: "2026-10-26",
    title: "Set up DMARC step by step",
    summary:
      "Add a DMARC record, read what the reports tell you, and switch on protection without losing real email.",
    category: "Email",
    minutes: 25,
    intro:
      "DMARC is a short DNS record that tells other mail servers what to do with email that claims to be from you but fails the checks: deliver it, put it in spam, or refuse it. It also asks them to send you reports, so you can see everyone who sends as your domain. It is like telling the post office to return any letter with a forged return address, after first watching for a while to make sure your own letters are not the ones being returned.",
    terms: ["dmarc", "spf", "dkim", "dns", "dns-record", "txt", "zone", "subdomain", "ip-address", "mailbox", "cpanel", "propagation"],
    done:
      "Your DMARC record shows up when you look up _dmarc.yourdomain.com, reports arrive in your dmarc@ inbox, and by the end it reads p=reject while your own emails still reach Gmail and Outlook inboxes.",
    before: [
      "SPF and DKIM already set up for your main email service. The tutorials on email deliverability and DKIM cover both.",
      "A way to change your domain's DNS records: cPanel's Zone Editor if your domain uses ns1.serverlys.com and ns2.serverlys.com, or wherever your nameservers point.",
      "An inbox to receive DMARC reports, or a report-reading service. Step two shows how to create one.",
      "Patience: the full job takes about a month, with a few minutes of work every two weeks.",
    ],
    steps: [
      {
        title: "Understand alignment before you publish",
        detail:
          "DMARC passes when SPF or DKIM passes AND the domain that passed matches the domain in the visible From address. That match is called alignment. SPF checks a hidden sender address (the envelope sender, a bit like the return address on the back of an envelope). Other platforms often set that to their own domain. So SPF passes, but it does not match yours. That is why DKIM signed with YOUR domain is the dependable way to pass DMARC.",
      },
      {
        title: "Decide where reports go",
        detail:
          "Create an address such as dmarc@yourdomain.com. In cPanel, go to Email Accounts and click Create. Expect a steady flow of reports from large email providers. They arrive as compressed files of XML (a structured text format meant for computers, not people).",
        where: ["cPanel", "Email", "Email Accounts", "Create"],
        check: "dmarc@yourdomain.com is in your list of email accounts.",
      },
      {
        title: "Only if reports go to a different domain: authorise it",
        detail:
          "If you send reports to an address on a different domain, that other domain must publish a record allowing it. Otherwise receivers will not send the reports. Skip this step if your report address is on your own domain. In the example, reportdomain.com is the domain that receives the reports, and it adds this record in its own DNS.",
        code: "yourdomain.com._report._dmarc.reportdomain.com.  TXT  \"v=DMARC1\"",
        check: "The other domain's DNS has the record above.",
      },
      {
        title: "Open Zone Editor and start a new record",
        detail:
          "Open cPanel, find the Domains section and click Zone Editor. Click Manage next to your domain, then click Add Record. If your DNS is not at Serverlys, open the DNS settings where your nameservers point instead.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        check: "A new empty row opens with fields for name, TTL, type and value.",
      },
      {
        title: "Publish the record in monitor mode",
        detail:
          "Choose type TXT, type _dmarc as the name, and paste the value below. v=DMARC1 must come first, with the policy (p=) straight after it. p=none changes nothing about delivery: it only asks for reports. Click Save Record. Publish exactly one DMARC record. If receivers find two, they use neither.",
        code: "Host:  _dmarc\nType:  TXT\nValue: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com",
        shot: { id: "zone-add-record", caption: "On Serverlys cPanel: Zone Editor → Manage → Add Record, type TXT, name _dmarc, and paste the record as the value." },
        check: "The list shows one TXT record named _dmarc.yourdomain.com with your value.",
      },
      {
        title: "Check that it is live",
        detail:
          "Look the record up from outside. On a Mac or Linux computer, you can type the command below in the Terminal app. On any computer, you can use Google's free Dig page at toolbox.googleapps.com/apps/dig: choose TXT and enter _dmarc.yourdomain.com. New records can take a little while to show everywhere. If nothing comes back, the name field probably repeated the domain (_dmarc.yourdomain.com.yourdomain.com). Some DNS providers add your domain to the name for you, so there you type only _dmarc.",
        code: "dig +short TXT _dmarc.yourdomain.com",
        check: "The lookup returns \"v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com\".",
      },
      {
        title: "Work through the reports",
        detail:
          "Each report lists the IP addresses that sent email as your domain, and whether SPF and DKIM passed and matched your domain. Group them by service. For each real sender that fails, turn on DKIM with your domain at that service, or add it to SPF. Give it at least two weeks, so services that only send once a month, such as invoicing tools, show up.",
        check: "Every sender you recognise shows as passing and aligned.",
      },
      {
        title: "Move to quarantine",
        detail:
          "Edit your _dmarc record and change p=none to p=quarantine. That sends failing email to spam. Watch the reports for another two weeks.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com",
        check: "The record shows p=quarantine and your own test emails still reach the inbox.",
      },
      {
        title: "Move to reject",
        detail:
          "If nothing real failed, edit the record again and change it to p=reject. Failing email is now refused. Subdomains (like shop.yourdomain.com) follow the same policy unless you set a separate one with sp= in the record.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "v=DMARC1; p=reject; rua=mailto:dmarc@yourdomain.com",
        check: "The record shows p=reject, and a lookup of _dmarc.yourdomain.com returns the new value.",
      },
    ],
    gotcha:
      "Moving to p=reject because SPF passes for every sender. If a service's SPF pass is for its own domain rather than yours, it does not align, and that service's email is refused the day the policy changes.",
    products: ["/business-email", "/domain-name"],
    related: ["email-deliverability", "set-up-dkim", "set-up-email-forwarding"],
  },
  {
    slug: "set-up-dkim",
    published: "2026-10-26",
    title: "Set up DKIM for your domain",
    summary:
      "Turn on DKIM signing for each service that sends as your domain, publish the keys, and check that the signatures pass.",
    category: "Email",
    minutes: 25,
    intro:
      "DKIM puts an invisible signature on every email you send, and publishes the matching key in your domain's DNS. The receiver compares the two, like checking a wax seal against the sender's ring. When they match, the email is proven to come from you and to be unchanged, which helps it reach the inbox and is needed for DMARC.",
    terms: ["dkim", "dmarc", "spf", "dns", "dns-record", "txt", "cname", "zone", "nameservers", "google-workspace", "cpanel", "propagation"],
    done:
      "Send an email to a Gmail address, open it, click the three-dot menu and choose Show original. The summary at the top shows DKIM: PASS with your own domain. Do this once for each service that sends as you.",
    before: [
      "An admin login for each service that sends email as your domain: your Serverlys hosting, and any newsletter, invoicing or help desk tools.",
      "A way to change your domain's DNS records: cPanel's Zone Editor if your domain uses ns1.serverlys.com and ns2.serverlys.com, or wherever your nameservers point.",
    ],
    steps: [
      {
        title: "Understand selectors",
        detail:
          "A DKIM key is published as a record at selector._domainkey.yourdomain.com. The selector is just a label the sending service picks, and every signed email names its selector so the receiver knows which key to check. Because every service picks its own selector, a domain can have many DKIM records side by side. That is different from SPF, where there must be exactly one.",
      },
      {
        title: "Open Email Deliverability in cPanel",
        detail:
          "This covers email sent from your Serverlys hosting mailboxes. Open cPanel, find the Email section and click Email Deliverability. Then click Manage next to your domain.",
        where: ["cPanel", "Email", "Email Deliverability", "Manage"],
        check: "You see a DKIM section with a status and a suggested record.",
      },
      {
        title: "Read the DKIM record cPanel expects",
        detail:
          "cPanel shows whether DKIM is valid and the record it expects, normally at the selector default. The value starts with v=DKIM1 and ends in a long public key.",
        code: "default._domainkey  TXT  \"v=DKIM1; k=rsa; p=<public key from the panel>\"",
        shot: { id: "email-deliverability-dkim", caption: "Email → Email Deliverability → Manage. cPanel shows the DKIM record it signs with, named default._domainkey. The yellow note appears when the domain's DNS is hosted somewhere else: copy the Name and Value into that provider's DNS." },
        check: "You can see a record named default._domainkey with a long value.",
      },
      {
        title: "Install the record, or copy it to your DNS host",
        detail:
          "If your domain's DNS is on Serverlys, cPanel offers a button to install the suggested record for you: click it. If a yellow note says your DNS is hosted somewhere else, use the Copy buttons to copy the Name and the Value, then add them as a TXT record at that DNS provider.",
        where: ["cPanel", "Email", "Email Deliverability", "Manage"],
        check: "After a refresh, the DKIM status shows as valid. If DNS is elsewhere, this can take a while to update.",
      },
      {
        title: "Google Workspace: create the DKIM record",
        detail:
          "Skip this if you do not use Google Workspace. In the Google Admin console, go to Apps, then Google Workspace, then Gmail, then Authenticate email. Choose your domain and generate a new record with a 2048-bit key (the longer, stronger option).",
        check: "Google shows you a record name and a long value starting with v=DKIM1.",
      },
      {
        title: "Google Workspace: publish it and start signing",
        detail:
          "Add the record as a TXT record at the name google._domainkey (Google's default selector). Wait until it shows up in a lookup, then go back to the same Google page and click Start authentication. Google does not sign with your domain until you click it.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        check: "Google's Authenticate email page says it is authenticating email with DKIM.",
      },
      {
        title: "Microsoft 365: add the two CNAME records",
        detail:
          "Skip this if you do not use Microsoft 365. In the Microsoft Defender portal, open the DKIM page in the email authentication settings and select your domain. Microsoft asks for two CNAME records, selector1._domainkey and selector2._domainkey. Copy the targets exactly as shown, because their format differs from one Microsoft account to another. Add both in your DNS.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        check: "Your DNS list shows both CNAME records, selector1._domainkey and selector2._domainkey.",
      },
      {
        title: "Microsoft 365: enable signing",
        detail:
          "Once both records show up in a lookup, go back to the DKIM page in the Defender portal and turn on signing for your domain.",
        check: "The DKIM page shows signing enabled for your domain.",
      },
      {
        title: "Every other sender",
        detail:
          "Newsletter services, CRMs (customer list systems) and help desks have a domain authentication section that gives you their own records, usually CNAMEs. Add each one in your DNS. Without this, they sign with their own domain. That passes DKIM, but it does not count for your DMARC.",
        check: "Each service's settings page says your domain is authenticated or verified.",
      },
      {
        title: "Watch for long keys",
        detail:
          "A 2048-bit key is longer than the 255 characters one TXT text piece can hold. So it is stored as several quoted pieces that receivers join back together. Most panels split it for you. If yours cuts the value short instead, the signature fails. Compare the published record with what the service gave you, character by character at the end.",
        check: "The published value ends with the same characters as the key the service gave you.",
      },
      {
        title: "Confirm a real message passes",
        detail:
          "Send an email to a Gmail address. Open it, click the three-dot menu and choose Show original. You want DKIM: PASS with your own domain. You can also look the key up directly: type the command below in Terminal on a Mac or Linux computer, or use Google's free Dig page at toolbox.googleapps.com/apps/dig (choose TXT).",
        code: "dig +short TXT default._domainkey.yourdomain.com",
        check: "Show original says DKIM: PASS with yourdomain.com, and the lookup returns a value starting with v=DKIM1.",
      },
    ],
    gotcha:
      "Setting up DKIM for the main mailbox and stopping there. The newsletter and invoicing tools keep signing with their own domains, and they are the first email to fail once DMARC is switched on.",
    products: ["/business-email"],
    related: ["set-up-dmarc", "email-deliverability", "connect-google-workspace-or-microsoft-365"],
  },
  {
    slug: "connect-google-workspace-or-microsoft-365",
    published: "2026-10-26",
    title: "Connect your domain to Google Workspace or Microsoft 365",
    summary:
      "Prove you own the domain, switch your email to Google or Microsoft, and stop your hosting from keeping email meant for them.",
    category: "Email",
    minutes: 30,
    intro:
      "Google Workspace and Microsoft 365 can run your business email at your own domain, while your website stays on Serverlys. To switch, you change a few DNS records so email for yourdomain.com goes to Google or Microsoft instead of your hosting. It is like filing a change-of-address form: the website keeps living where it is, but the post goes somewhere new.",
    terms: ["google-workspace", "dns", "dns-record", "mx", "txt", "cname", "spf", "dkim", "nameservers", "zone", "cpanel", "mailbox", "propagation", "whois", "domain"],
    done:
      "Send an email from a personal address at another provider to you@yourdomain.com. It arrives in your Google or Microsoft inbox, and your reply arrives back. Then fill in your own website's contact form: that message must arrive in the new inbox too.",
    before: [
      "An admin account for Google Workspace or Microsoft 365.",
      "A way to change your domain's DNS records. The nameservers decide where that is: step one shows you how to find out.",
      "Mailboxes already created at Google or Microsoft for every address you use. Email to an address that does not exist there will bounce once you switch.",
    ],
    steps: [
      {
        title: "Find out where your DNS is managed",
        detail:
          "Use the free WHOIS lookup at serverlys.com/whois-lookup and enter your domain. Look at the nameservers. If they are ns1.serverlys.com and ns2.serverlys.com, you make every change below in cPanel's Zone Editor. If they are anything else, you make the changes in the DNS settings of the company those nameservers belong to.",
        where: ["serverlys.com/whois-lookup"],
        check: "You know whether your DNS is in cPanel or with another company.",
      },
      {
        title: "Get your verification record",
        detail:
          "Start the domain setup in your Google or Microsoft admin account. Both give you a TXT record that proves you own the domain. Google's starts with google-site-verification=. Microsoft's starts with MS=.",
        check: "You have a value starting with google-site-verification= or MS= ready to copy.",
      },
      {
        title: "Add the verification record",
        detail:
          "Add it as a TXT record at the bare domain, written @ by many providers. In cPanel Zone Editor, that means the name field is just yourdomain.com. It sits next to your SPF record. It does not replace it. Then go back to Google or Microsoft and click their verify button.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "@  TXT  google-site-verification=<value from Google>\n@  TXT  MS=ms12345678",
        check: "Google or Microsoft says your domain is verified.",
      },
      {
        title: "Delete the old MX records",
        detail:
          "In Zone Editor, find every MX record pointing at your previous mail server, such as mail.yourdomain.com, and click Delete on each one. If you leave even one, some senders still deliver to the old server (because of its priority number, or when the new one is briefly unreachable), and that email never reaches your new inbox.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        check: "Your domain has no MX records left.",
      },
      {
        title: "Add the new MX records",
        detail:
          "Click Add Record and choose type MX. Google Workspace uses a single MX record for new setups: smtp.google.com with priority 1. Microsoft 365 gives each domain its own MX target in its admin center under Settings, then Domains. Copy it exactly, because the format differs from one account to another. The lower the priority number, the more preferred the server.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "Google:     @  MX  1  smtp.google.com.\nMicrosoft:  @  MX  0  yourdomain-com.mail.protection.outlook.com.",
        shot: { id: "zone-add-record", caption: "If the domain uses Serverlys nameservers: Zone Editor → Manage → delete the old MX records, then Add Record with type MX for each record your provider gives you." },
        check: "Your domain's only MX record now points at Google or Microsoft.",
      },
      {
        title: "Microsoft only: add the autodiscover record",
        detail:
          "Microsoft also asks for an autodiscover CNAME record, so the Outlook app can set itself up. Click Add Record, choose type CNAME, type autodiscover as the name and the value below as the target. Skip this step for Google.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage", "Add Record"],
        code: "autodiscover  CNAME  autodiscover.outlook.com.",
        check: "A CNAME record named autodiscover.yourdomain.com points to autodiscover.outlook.com.",
      },
      {
        title: "Set cPanel email routing to remote",
        detail:
          "In cPanel, go to the Email section and click Email Routing. Select your domain, choose Remote Mail Exchanger and click Change. If it stays on Local, your hosting still believes it handles your email. Then messages your own website sends to your addresses, such as contact forms and order notifications, are delivered into a cPanel mailbox nobody reads.",
        where: ["cPanel", "Email", "Email Routing"],
        shot: { id: "email-routing", caption: "Email → Email Routing. Select Remote Mail Exchanger and press Change. The current setting is shown in bold; Local Mail Exchanger means the server still delivers your mail to itself." },
        check: "Remote Mail Exchanger is shown in bold as the current setting.",
      },
      {
        title: "Update SPF in the same record",
        detail:
          "Edit your existing SPF record (the TXT record starting with v=spf1) and add the new provider's include. Keep your hosting server in it too if your website sends email directly. There must still be only one SPF record.",
        where: ["cPanel", "Domains", "Zone Editor", "Manage"],
        code: "Google:     v=spf1 include:_spf.google.com ~all\nMicrosoft:  v=spf1 include:spf.protection.outlook.com ~all",
        check: "There is exactly one record starting with v=spf1, and it includes Google or Microsoft.",
      },
      {
        title: "Turn on DKIM at the provider",
        detail:
          "Switch on DKIM signing at Google or Microsoft. The tutorial on setting up DKIM has the steps for both.",
        check: "Google or Microsoft shows DKIM as on for your domain.",
      },
      {
        title: "Test from outside",
        detail:
          "Send an email to your address from an unrelated account, such as a personal address at another provider. Check it arrives in the new inbox, then reply to it and check the reply arrives. DNS changes can take a few hours to reach everyone, so if it fails at first, wait and try again.",
        check: "The test arrives in Google or Microsoft, and your reply arrives back.",
      },
      {
        title: "Confirm the MX change",
        detail:
          "Look up your MX records from outside. On a Mac or Linux computer, type the command below in the Terminal app. On any computer, use Google's free Dig page at toolbox.googleapps.com/apps/dig and choose MX.",
        code: "dig +short MX yourdomain.com",
        check: "The only answer is the Google or Microsoft server, with no old mail server listed.",
      },
    ],
    gotcha:
      "Leaving cPanel email routing on Local. Email from the outside world reaches Google or Microsoft, so everything looks fine. But every contact-form message from your own website lands in a hosting mailbox nobody checks.",
    products: ["/business-email", "/domain-name"],
    related: ["set-up-dkim", "email-deliverability", "set-up-dmarc"],
  },
  {
    slug: "set-up-email-forwarding",
    published: "2026-10-26",
    title: "Set up email forwarding",
    summary:
      "Send email for an address on your domain on to another inbox, and avoid the delivery problems forwarding can cause.",
    category: "Email",
    minutes: 15,
    intro:
      "A forwarder passes email sent to one address, like info@yourdomain.com, on to another inbox you already use, like your personal Gmail. It is like a mail redirection at the post office: nothing is stored at the old address, it just goes on to the new one. It is a quick way to have a professional address without checking another inbox.",
    terms: ["email-forwarder", "mailbox", "mx", "dns", "spf", "dkim", "dmarc", "cpanel", "google-workspace", "domain"],
    done:
      "Send an email from an unrelated account (not the inbox you forward to) to your new address. It arrives in the destination inbox, not in spam.",
    before: [
      "A login to whichever service handles email for your domain. Your MX records say which: step one shows you how to check.",
      "The destination address: the inbox you want the email to arrive in.",
    ],
    steps: [
      {
        title: "Check who receives the domain's email",
        detail:
          "Forwarders only work on the server your MX records point at. Look them up: on a Mac or Linux computer, type the command below in the Terminal app, or on any computer use Google's free Dig page at toolbox.googleapps.com/apps/dig and choose MX. If the answer mentions google.com or outlook.com, your email is at Google Workspace or Microsoft 365: set up forwarding or aliases (extra addresses for the same inbox) there. A forwarder created in cPanel would never see a message.",
        code: "dig +short MX yourdomain.com",
        check: "You know whether your email is handled by your Serverlys hosting or by Google or Microsoft. If it is Serverlys, carry on.",
      },
      {
        title: "Open Forwarders in cPanel",
        detail:
          "Open cPanel (see the tutorial on logging in to cPanel), find the Email section and click Forwarders.",
        where: ["cPanel", "Email", "Forwarders"],
        shot: { id: "forwarders", caption: "Email → Forwarders. Add Forwarder sends one address on; Add Domain Forwarder sends every address at a domain to another domain." },
        check: "You see the Forwarders page with the Add Forwarder and Add Domain Forwarder buttons.",
      },
      {
        title: "Create the forwarder",
        detail:
          "Click Add Forwarder. Type the address to forward (for example info) and pick your domain. Under the destination, choose to forward to an email address and type the inbox it should go to. Click Add Forwarder to save.",
        where: ["cPanel", "Email", "Forwarders", "Add Forwarder"],
        check: "Your new forwarder is listed, showing the address and where it goes.",
      },
      {
        title: "Decide whether you also want a copy kept",
        detail:
          "A forwarder with no mailbox behind it keeps no copy. The email only exists in the destination inbox. If you also want a copy on your hosting, create a mailbox with the same address in Email Accounts.",
        where: ["cPanel", "Email", "Email Accounts", "Create"],
        check: "If you made one, the address now appears in both Email Accounts and Forwarders.",
      },
      {
        title: "Forward a whole domain if that is what you need",
        detail:
          "Only if you need it: the same page has Add Domain Forwarder. It sends email for every address at one domain to the same address at another domain. It is the usual setup when a business keeps an old domain after renaming.",
        where: ["cPanel", "Email", "Forwarders", "Add Domain Forwarder"],
        check: "The domain forwarder appears in the list of domain forwarders.",
      },
      {
        title: "Set the default address to reject",
        detail:
          "Email to addresses that do not exist on your domain goes to the default address. In cPanel, go to Default Address and choose your domain. Pick the option that discards the email with an error message to the sender, then click Change. That way misspelt and made-up addresses are refused at the door instead of forwarded. A catch-all (a default address that forwards everything) mostly forwards spam.",
        where: ["cPanel", "Email", "Default Address"],
        shot: { id: "default-address", caption: "Email → Default Address. Discard the email while your server processes it by SMTP time with an error message is the setting to keep: the sender gets a bounce and you collect no spam." },
        check: "The page shows that unrouted email is discarded with an error message.",
      },
      {
        title: "Understand why some forwarded email fails",
        detail:
          "A forwarded email arrives from your server, and your server is not in the original sender's SPF record. DKIM usually survives forwarding. But if the original sender relies only on SPF and publishes a strict DMARC policy, the destination may refuse the message. For an address that matters, a real mailbox you open in your email app avoids the problem.",
      },
      {
        title: "Test from an unrelated account",
        detail:
          "Send an email from an address that is not the destination itself, for example a friend's address or a second account at another provider. Check that it arrives in the inbox rather than spam.",
        check: "The test email is in the destination inbox, not in spam.",
      },
    ],
    gotcha:
      "Testing by sending from the Gmail account you forward to. Gmail recognises the message as one you sent and does not show it in the inbox, so a working forwarder looks broken.",
    products: ["/business-email", "/domain-name"],
    related: ["email-deliverability", "connect-google-workspace-or-microsoft-365", "set-up-dkim"],
  },
];
