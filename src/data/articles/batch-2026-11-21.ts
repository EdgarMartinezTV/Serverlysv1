/**
 * One article published 2026-11-21.
 *
 *   · why-are-my-emails-going-to-spam
 *                         "why are my emails going to spam", "emails going to
 *                         junk", "business email going to spam", "Gmail
 *                         marking my emails as spam", "Outlook junk folder
 *                         my emails" — a problem-first query the archive did
 *                         not answer. Supports /business-email. Deliberately
 *                         does not repeat email-security-spf-dkim-dmarc or the
 *                         email tutorials (which own the step-by-step DNS
 *                         setup); it diagnoses, then links to them.
 *
 * Every mailbox-provider rule is from the providers' own pages (checked
 * 2026-11-21):
 *   support.google.com/a/answer/81126              Gmail sender guidelines
 *   senders.yahooinc.com/best-practices/           Yahoo sender requirements
 *   techcommunity.microsoft.com (2025-04-02 post)  Outlook high-volume senders
 *   support.google.com/mail/answer/9981691         Postmaster Tools
 * SPF's single-record rule and 10-lookup limit are RFC 7208.
 * Deliberately NOT stated, because they could not be confirmed: Yahoo's bulk
 * sender volume threshold, whether Outlook has started rejecting (official
 * text: Junk routing from 2025-05-05, rejection "date to be announced"), and
 * that Postmaster Tools is free. Same editorial rules as original.ts: no
 * invented statistics or quotes. No price quoted. No cover photo yet: falls
 * back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261121: readonly Article[] = [
  {
    slug: "why-are-my-emails-going-to-spam",
    title: "Why are my emails going to spam? 9 causes and how to fix each one",
    seoTitle: "Why are my emails going to spam? 9 causes and fixes",
    description:
      "If your business emails land in spam or junk, one of nine causes is almost always to blame. How to find which one in five minutes, and how to fix it.",
    category: "Getting started",
    published: "2026-11-21",
    body: [
      {
        type: "p",
        text: "You send a quote, an invoice or a reply to a customer, and a day later they tell you it was sitting in their spam folder. It is one of the most common email problems a small business runs into, and it is rarely bad luck. Gmail, Outlook and Yahoo decide where a message goes by checking a short list of things about **who sent it, how it was sent and how people reacted to earlier mail** from the same sender.",
      },
      {
        type: "p",
        text: "This guide shows how to find out which check your email is failing, then walks through the nine causes we see most often and the fix for each.",
      },
      {
        type: "callout",
        title: "The five-minute check",
        text: "Send an email from your business address to a Gmail account you own. Open it, click the three-dot menu and choose **Show original**. Near the top you will see **SPF**, **DKIM** and **DMARC**, each with PASS or FAIL. Anything other than three PASS results is very likely your problem, and causes 1 to 4 below explain how to fix it.",
      },
      { type: "h2", id: "how-filters-decide", text: "How Gmail and Outlook decide what is spam" },
      {
        type: "p",
        text: "Spam filters look at three things, roughly in this order:",
      },
      {
        type: "ol",
        items: [
          "**Authentication.** Can the receiving server prove the message really came from your domain? That is what SPF, DKIM and DMARC are for.",
          "**Reputation.** Has mail from your domain and your sending server been wanted in the past, or have people marked it as spam?",
          "**The message itself.** Does it look like the kind of email people complain about?",
        ],
      },
      {
        type: "p",
        text: "Since **February 2024**, Gmail and Yahoo have made the first of these a requirement rather than a nice extra. Google's [sender guidelines](https://support.google.com/a/answer/81126) say every sender must use SPF or DKIM, have valid forward and reverse DNS, send over an encrypted (TLS) connection and keep their spam rate below **0.3%**. Senders of more than 5,000 messages a day to Gmail must also publish DMARC and offer one-click unsubscribe on marketing mail. Microsoft started applying similar rules to Outlook.com, Hotmail and Live addresses on **May 5, 2025**, sending mail from non-compliant high-volume domains to the Junk folder.",
      },
      {
        type: "p",
        text: "A small business sending a few dozen emails a day is not a bulk sender. But the filters still use the same signals for everyone, so meeting the full list is the simplest way to stay out of spam.",
      },
      { type: "h2", id: "causes", text: "The 9 most common causes, and the fix for each" },
      { type: "h3", text: "1. Your domain has no SPF record, or the wrong one" },
      {
        type: "p",
        text: "SPF is a DNS record that lists the servers allowed to send email for your domain. If it is missing, receivers have no way to tell your real email from a forgery. If it exists but leaves out a service you send from, mail from that service fails.",
      },
      {
        type: "p",
        text: "**Fix:** publish one SPF record that includes every service that sends as your domain: your mailbox provider, your website, your invoicing tool and your newsletter tool. The [email deliverability tutorial](/tutorials/email-deliverability) walks through it step by step.",
      },
      { type: "h3", text: "2. You have two SPF records" },
      {
        type: "p",
        text: "This one catches a lot of people. Each new tool's setup page says \"add this SPF record\", so the domain ends up with two or three records that start with `v=spf1`. The SPF standard (RFC 7208) allows exactly **one**. With more than one, SPF fails for every message, including the ones that were fine before. The same standard caps an SPF check at **10 DNS lookups**, and every `include:` counts towards that, so a record that keeps growing can break on its own.",
      },
      {
        type: "p",
        text: "**Fix:** merge them into a single record, for example `v=spf1 include:_spf.google.com include:servers.mcsv.net ~all`, and remove any `include:` for tools you no longer use.",
      },
      { type: "h3", text: "3. DKIM is not turned on" },
      {
        type: "p",
        text: "DKIM adds a digital signature to every message, so the receiver can confirm it came from your domain and was not changed on the way. Many services support it but leave it switched off until you publish a DNS record. Google requires DKIM keys of at least 1024 bits and recommends 2048.",
      },
      {
        type: "p",
        text: "**Fix:** turn DKIM on at every service that sends as your domain. For mailboxes on Serverlys hosting, cPanel shows the exact record under **Email → Email Deliverability → Manage**. The [DKIM tutorial](/tutorials/set-up-dkim) covers cPanel, Google Workspace and Microsoft 365.",
      },
      { type: "h3", text: "4. No DMARC record, or the domains do not line up" },
      {
        type: "p",
        text: "DMARC tells receivers what to do with mail that fails SPF and DKIM, and sends you reports about who is sending as your domain. It also checks **alignment**: the domain in the From line has to match the domain that passed SPF or DKIM. A message can pass SPF for a newsletter tool's domain and still fail DMARC, because it was not your domain that passed.",
      },
      {
        type: "p",
        text: "**Fix:** start with a monitor-only record such as `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`, read the reports for a couple of weeks, then tighten it. Our [DMARC tutorial](/tutorials/set-up-dmarc) explains each stage, and [SPF, DKIM and DMARC explained](/blog/email-security-spf-dkim-dmarc) covers the background.",
      },
      { type: "h3", text: "5. Your website form sends \"from\" the visitor's address" },
      {
        type: "p",
        text: "Many contact forms are set up to send each enquiry with the visitor's own address in the From line, so you can hit Reply. When that address is a Gmail or Yahoo account, your web server is effectively claiming to be Gmail or Yahoo. Those providers publish strict DMARC policies, so the message fails and goes to spam or never arrives. You then miss the leads your website was built to collect.",
      },
      {
        type: "p",
        text: "**Fix:** send form emails from an address on your own domain, such as `forms@yourdomain.com`, and put the visitor's address in the **Reply-To** field instead. You can still click Reply as before. Our [contact form guide](/blog/contact-form-guide) has more on setting forms up well.",
      },
      { type: "h3", text: "6. The server you send from has a poor reputation" },
      {
        type: "p",
        text: "Receivers keep track of the IP address mail comes from. If a server shares an address with someone who sent spam, or the address appears on a public blocklist, your mail can suffer for it. Google also requires the sending IP to have **reverse DNS (a PTR record)** that matches its hostname, which home internet connections and some cheap servers do not have.",
      },
      {
        type: "p",
        text: "**Fix:** look at the **Received** lines in Show original to find the sending IP, and check it against a public blocklist lookup. If it is listed, ask your provider to deal with it. A good host monitors its mail servers and fixes listings without being asked. Never send business email straight from a home connection or a server that has no reverse DNS.",
      },
      { type: "h3", text: "7. People are marking your email as spam" },
      {
        type: "p",
        text: "This is the signal that counts most, and it is the one you control least directly. Google asks senders to keep their reported spam rate below **0.1%** and never let it reach **0.3%**. That is roughly one complaint per thousand messages. Sending to lists you bought, to people who signed up years ago, or to people who have no clear way to stop receiving your mail pushes that number up fast.",
      },
      {
        type: "p",
        text: "**Fix:** email only people who asked to hear from you. Put a clear unsubscribe link in every marketing email and honour it promptly; Yahoo asks for unsubscribes to be honoured within two days. Remove addresses that have not opened anything in months. Send newsletters through a proper email marketing service, not your everyday mailbox.",
      },
      { type: "h3", text: "8. Your domain is brand new or has never sent mail" },
      {
        type: "p",
        text: "A domain with no history has no reputation, good or bad, so filters are cautious with it. Suddenly sending hundreds of messages from a domain registered last week looks exactly like a spammer setting up shop.",
      },
      {
        type: "p",
        text: "**Fix:** start with normal one-to-one email to people who will reply, and increase volume gradually over a few weeks. Replies, and people moving your mail out of spam, build reputation faster than anything else.",
      },
      { type: "h3", text: "9. The message itself looks like spam" },
      {
        type: "p",
        text: "Content matters less than it used to, but it still counts once the other checks are borderline. Common triggers:",
      },
      {
        type: "ul",
        items: [
          "**Link shorteners**, which spammers use to hide where a link goes.",
          "**An email that is one large image** with little or no text.",
          "**Links to a website that is hacked or flagged.** If your own site has been compromised, every email linking to it is affected. See our [hacked website recovery guide](/blog/website-hacked-recovery).",
          "**Attachments people did not expect**, especially zip files or documents with macros. Link to the file instead.",
          "**A From name or subject line that does not match the content**, such as \"Re:\" on a message that is not a reply.",
        ],
      },
      { type: "h2", id: "diagnose", text: "How to find out which one it is" },
      {
        type: "p",
        text: "Work through these in order. Most problems show up at the first or second step.",
      },
      {
        type: "ol",
        items: [
          "**Read the headers.** Use Show original in Gmail, or View message source in Outlook. Look for the SPF, DKIM and DMARC results, and note which domain each one checked.",
          "**List your DNS records.** In your DNS host or cPanel's **Zone Editor**, look for TXT records starting with `v=spf1` (there should be one) and `v=DMARC1` at `_dmarc`, and the DKIM record for each sender.",
          "**Test each tool separately.** Your mailbox, your website form, your invoicing software and your newsletter tool each send in their own way. One can fail while the rest pass.",
          "**Check the sending IP** from the Received lines against a public blocklist lookup.",
          "**Set up Google Postmaster Tools** if you send to many Gmail users. It shows your spam rate, reputation and authentication results for mail sent to Gmail addresses. Expect empty charts if you send only a small number of messages a day.",
          "**Read any bounce messages.** A Gmail rejection that mentions `5.7.26` means authentication failed. An Outlook rejection with `5.7.515` means your domain does not meet Outlook's authentication requirements.",
        ],
      },
      {
        type: "table",
        head: ["What you see", "Most likely cause", "Where to start"],
        rows: [
          ["SPF: FAIL or NEUTRAL", "Sender missing from SPF, or two SPF records", "Causes 1 and 2"],
          ["DKIM: FAIL or missing", "DKIM not turned on for that sender", "Cause 3"],
          ["SPF and DKIM pass, DMARC fails", "Domains do not align", "Cause 4"],
          ["Only form enquiries go to spam", "Form sends as the visitor's address", "Cause 5"],
          ["Everything passes but still lands in spam", "Reputation or complaints", "Causes 6 to 8"],
          ["Only some messages go to spam", "Content or links", "Cause 9"],
        ],
      },
      { type: "h2", id: "serverlys", text: "Email at Serverlys" },
      {
        type: "p",
        text: "Every Serverlys [hosting plan](/hosting) lets you create mailboxes on your own domain, and cPanel's **Email Deliverability** page shows whether SPF and DKIM are valid for each domain, with the exact record to publish when they are not. If you would rather keep email separate from your website, our [business email](/business-email) plans give you a dedicated mailbox service. If you are not sure which records your domain needs, [contact support](/support) and we will check them with you.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Why do my emails go to spam in Gmail but not Outlook?" },
      {
        type: "p",
        text: "Each provider runs its own filters and keeps its own view of your reputation, so the same message can land differently. Check the authentication results in Gmail's Show original first. If all three pass, the difference usually comes down to how Gmail users have reacted to your earlier mail.",
      },
      { type: "h3", text: "Will asking people to add me to their contacts fix it?" },
      {
        type: "p",
        text: "It helps for that one person, and replies or \"Not spam\" clicks are good signals. It does not fix a failing SPF, DKIM or DMARC check, and Microsoft has said that safe-sender lists will not get around its authentication rules for high-volume senders.",
      },
      { type: "h3", text: "How long does it take to get out of spam after fixing the records?" },
      {
        type: "p",
        text: "DNS changes usually take effect within a few hours. See [DNS propagation explained](/blog/dns-propagation-explained). Authentication results change as soon as the new records are visible. Reputation takes longer, and improves as people open, reply to and rescue your messages over the following weeks.",
      },
      { type: "h3", text: "Do I need DMARC if I only send a few emails a day?" },
      {
        type: "p",
        text: "Gmail only requires it for senders of more than 5,000 messages a day, but it is a short record that costs nothing and stops other people sending mail that pretends to be from your domain. Starting with `p=none` changes nothing about delivery while you read the reports.",
      },
      { type: "h3", text: "Can my hosting company cause my email to go to spam?" },
      {
        type: "p",
        text: "Yes, if your email is sent from the hosting server and that server's IP address has a poor reputation, no reverse DNS, or no DKIM signing. Ask your host what they do about blocklist monitoring, and check the Received lines to see which server actually sent your mail.",
      },
    ],
  },
];
