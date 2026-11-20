import type { Tutorial } from "./types";

/**
 * The tutorial every other one assumes. Button labels are the live client
 * area's English strings (WHMCS Serverlys theme, 2026-11-20): sidebar
 * "Websites" → "Hosting", and "Open cPanel" on the home business cards and the
 * service page. If the client area is relabelled, update `where` here.
 */
export const gettingStartedTutorials: readonly Tutorial[] = [
  {
    slug: "log-in-to-cpanel",
    published: "2026-11-20",
    title: "Log in to your Serverlys control panel (cPanel)",
    summary:
      "Where your hosting is managed, how to open it from your Serverlys account, and a short tour of what you will see.",
    category: "Getting started",
    minutes: 5,
    intro:
      "Almost every tutorial here starts in cPanel, the control panel for your hosting. Think of your hosting plan as a rented shop and cPanel as the back office: it is where you create email addresses, look at your website's files, change your domain's settings and restore backups. You never need a separate password for it, because you open it from your Serverlys account with one click.",
    terms: ["client-area", "cpanel", "hosting", "domain"],
    done:
      "You are looking at a page full of icons with headings such as Email, Files, Databases and Domains, and your domain name is shown on the right. That is cPanel. Bookmark serverlys.com/login so you can get back to it.",
    before: [
      "The email address and password you used when you bought your Serverlys plan. Forgotten the password? The sign-in page has a link to reset it.",
      "An active hosting plan. If you only bought a domain, there is no cPanel yet: the domain is managed under Domains in your account instead.",
      "A computer is easiest. cPanel works on a phone, but the screens are crowded.",
    ],
    steps: [
      {
        title: "Open the Serverlys sign-in page",
        detail:
          "In your web browser, go to serverlys.com/login. This is your Serverlys account, also called the client area. It is where your plans, domains and invoices are, and it is the front door to cPanel.",
        where: ["serverlys.com/login"],
        code: "https://serverlys.com/login",
        check: "You see a sign-in form asking for your email address and password.",
      },
      {
        title: "Sign in",
        detail:
          "Type the email address and password from when you bought your plan, then click the sign-in button. If you have turned on two-step sign-in, enter the six-digit code from your phone app when asked.",
        check: "You land on your account home page, which greets you by name and lists your services.",
      },
      {
        title: "Find your hosting plan",
        detail:
          "Your home page has a section for your business with a card for each website. If you do not see it, use the menu on the left: click Websites, then Hosting. That page lists every hosting plan on your account. On a phone, the menu is behind the button with three lines at the top.",
        where: ["Websites", "Hosting"],
        check: "You can see your hosting plan with your domain name next to it and the status Active.",
      },
      {
        title: "Click Open cPanel",
        detail:
          "Click the Open cPanel button on your website's card, or click the plan to open its page and press Open cPanel there. cPanel opens in a new browser tab and signs you in automatically, so there is no second password to remember. If nothing happens, your browser may have blocked the new tab: look for a small blocked pop-up icon in the address bar and allow it.",
        where: ["Your hosting plan", "Open cPanel"],
        check: "A new tab opens on a page full of icons grouped under headings like Email, Files, Databases, Domains and Security.",
      },
      {
        title: "Take a quick look around",
        detail:
          "You do not need to change anything yet. Just notice where things are, because other tutorials will send you here. The search box at the top finds any tool by name: type \"zone\" and Zone Editor appears. Nothing in cPanel changes until you click a button such as Save or Create, so looking around is safe.",
        check: "You can find these sections on the page: Email (Email Accounts, Forwarders), Files (File Manager, JetBackup), Databases (phpMyAdmin) and Domains (Domains, Zone Editor).",
      },
      {
        title: "Know where the main tools are",
        detail:
          "These are the tools the other tutorials use most. Each one is an icon on the cPanel home page, under the heading shown.",
        code:
          "Email Accounts      Email     create inboxes like you@yourdomain.com\nForwarders          Email     pass mail from one address to another\nFile Manager        Files     see and edit your website's files\nJetBackup           Files     restore automatic daily backups\nphpMyAdmin          Databases look inside your website's database\nZone Editor         Domains   change your domain's DNS records\nSSL/TLS Status      Security  check your free security certificate",
      },
      {
        title: "Close it when you are done",
        detail:
          "When you finish, close the cPanel tab or use the account menu at the top right to log out. On a shared or public computer, also sign out of the client area. Next time, start again at serverlys.com/login.",
      },
    ],
    gotcha:
      "Looking for a separate cPanel username and password, or trying old addresses with a number like :2083 at the end. You do not need either: always go through your Serverlys account and click Open cPanel, which signs you in safely every time.",
    products: ["/hosting", "/wordpress-hosting"],
    related: ["point-your-domain", "force-https", "set-up-email-forwarding"],
  },
];
