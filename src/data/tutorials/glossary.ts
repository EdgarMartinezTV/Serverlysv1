/**
 * Plain-English definitions for the words tutorials cannot avoid.
 *
 * Written for someone who has never run a website: one or two short
 * sentences, an everyday comparison where it helps, and no definition that
 * leans on another unexplained term. A tutorial lists the keys it uses in
 * `terms`, and the page shows those definitions before step one, so nobody
 * has to leave the page to understand a step.
 *
 * Keep each definition true for Serverlys as well as in general: where a
 * thing has a Serverlys-specific location (the client area, cPanel), say so.
 */
export const GLOSSARY = {
  website: {
    term: "Website",
    def: "A set of pages and files stored on a computer that is always connected to the internet, so anyone can open them in a web browser.",
  },
  domain: {
    term: "Domain name",
    def: "Your address on the internet, like yourbusiness.com. You rent it by the year. On its own it is just a name: it has to be pointed at your hosting before it shows your website.",
  },
  hosting: {
    term: "Hosting",
    def: "The rented space on an always-on computer (a server) where your website's files, database and email live. If the domain is your address, hosting is the building.",
  },
  server: {
    term: "Server",
    def: "A computer in a data centre that stays on day and night and sends your website to anyone who asks for it.",
  },
  "client-area": {
    term: "Client area",
    def: "Your Serverlys account at serverlys.com/billing. It is where you see your plans, domains and invoices, and where the button to open cPanel lives.",
  },
  cpanel: {
    term: "cPanel",
    def: "The control panel for your hosting. It is a page of icons (Email Accounts, File Manager, Zone Editor and so on) where you manage everything on your plan. You open it from the client area with the Open cPanel button.",
  },
  registrar: {
    term: "Registrar",
    def: "The company you rent your domain name from, such as Serverlys, GoDaddy or Namecheap. You log in there to renew the domain or change its nameservers.",
  },
  dns: {
    term: "DNS",
    def: "The internet's address book. When someone types your domain, DNS tells their browser which server to go to for the website and which server handles your email.",
  },
  "dns-record": {
    term: "DNS record",
    def: "One line in that address book. Each record has a name (which part of your domain it is for), a type (what it is for) and a value (where to send people).",
  },
  zone: {
    term: "DNS zone / Zone Editor",
    def: "The full list of DNS records for one domain. In cPanel you change it under Domains → Zone Editor.",
  },
  nameservers: {
    term: "Nameservers",
    def: "Two addresses, like ns1.serverlys.com and ns2.serverlys.com, that tell the internet which company keeps your domain's address book. You set them at your registrar.",
  },
  "ip-address": {
    term: "IP address",
    def: "The number that identifies a server on the internet, written like 192.0.2.10. Domains exist so people do not have to remember these numbers.",
  },
  "a-record": {
    term: "A record",
    def: "A DNS record that says \"this domain's website is at this IP address\". It is what sends visitors to your hosting.",
  },
  cname: {
    term: "CNAME record",
    def: "A DNS record that says \"this name is another name for that one\". For example, it can make www.yourdomain.com go to the same place as yourdomain.com.",
  },
  mx: {
    term: "MX record",
    def: "A DNS record that says which server receives email for your domain. If it is wrong or missing, email to you stops arriving.",
  },
  txt: {
    term: "TXT record",
    def: "A DNS record that holds a line of text. Email security settings (SPF, DKIM, DMARC) and \"prove you own this domain\" checks are stored this way.",
  },
  ttl: {
    term: "TTL (time to live)",
    def: "How long, in seconds, other computers may remember a DNS record before checking it again. 3600 means one hour. A low number makes changes show up faster.",
  },
  propagation: {
    term: "Propagation",
    def: "The waiting time after a DNS change, while computers around the world forget the old answer and pick up the new one. Usually minutes to a few hours, occasionally up to two days.",
  },
  ssl: {
    term: "SSL certificate",
    def: "A small file on the server that lets browsers make a secure, encrypted connection to your site. It is what turns http:// into https:// and shows the padlock. Serverlys issues one for free.",
  },
  https: {
    term: "HTTPS",
    def: "The secure version of a web address (https:// instead of http://). Browsers mark sites without it as \"Not secure\".",
  },
  autossl: {
    term: "AutoSSL",
    def: "The cPanel feature that requests and renews your free SSL certificates automatically. It only works once your domain points at Serverlys.",
  },
  redirect: {
    term: "Redirect",
    def: "An instruction that sends a visitor who asks for one address to a different one automatically, for example from http:// to https://.",
  },
  subdomain: {
    term: "Subdomain",
    def: "A name in front of your domain, like shop.yourdomain.com or blog.yourdomain.com. It can show a different site or section without buying a new domain.",
  },
  "file-manager": {
    term: "File Manager",
    def: "The cPanel tool for seeing and editing the files of your website in your browser, a bit like the Finder on a Mac or File Explorer on Windows.",
  },
  "public-html": {
    term: "public_html",
    def: "The folder in File Manager that holds your main website. Whatever is in it is what visitors see.",
  },
  database: {
    term: "Database",
    def: "An organised store of your site's information: for WordPress, every post, page, setting and user account. The files are the building; the database is everything written inside it.",
  },
  phpmyadmin: {
    term: "phpMyAdmin",
    def: "A cPanel tool for looking inside a database. It shows the database as tables, a little like spreadsheets, that you can open and edit carefully.",
  },
  php: {
    term: "PHP",
    def: "The programming language WordPress is written in. Your hosting runs it to build each page. You usually only choose its version in cPanel.",
  },
  wordpress: {
    term: "WordPress",
    def: "Free software that lets you build and edit a website from a dashboard, without writing code. It runs a large share of the world's websites.",
  },
  "wp-admin": {
    term: "WordPress dashboard (wp-admin)",
    def: "The private back office of a WordPress site, at yourdomain.com/wp-admin. You log in there to write pages, install plugins and change settings.",
  },
  plugin: {
    term: "Plugin",
    def: "An add-on you install in WordPress to give it a new feature, like a contact form, a shop or extra security. Like an app on a phone.",
  },
  theme: {
    term: "Theme",
    def: "The design package of a WordPress site: layout, colours and fonts. Changing the theme changes the look without changing your content.",
  },
  "wp-config": {
    term: "wp-config.php",
    def: "A settings file in your WordPress folder. It holds, among other things, the name and password WordPress uses to reach its database. A small typo in it can take the site down, so copy it before editing.",
  },
  "wp-cli": {
    term: "WP-CLI",
    def: "A way to control WordPress by typing commands instead of clicking. Optional: every tutorial here also gives the clicking way.",
  },
  permalinks: {
    term: "Permalinks",
    def: "The pattern WordPress uses for page addresses, for example yourdomain.com/about-us. Saving the Permalinks settings page also repairs many \"page not found\" problems.",
  },
  cache: {
    term: "Cache",
    def: "A saved copy of something so it loads faster next time. Your browser, your site and the server can all keep one, which is why a change sometimes does not appear until the cache is cleared.",
  },
  cdn: {
    term: "CDN",
    def: "A network of servers around the world that keep copies of your site's images and files close to visitors, so pages load faster far from your server.",
  },
  staging: {
    term: "Staging site",
    def: "A private copy of your website for trying changes safely. If something breaks there, your real site is untouched.",
  },
  backup: {
    term: "Backup",
    def: "A saved copy of your website's files, database and email from a moment in time, so you can put things back the way they were.",
  },
  jetbackup: {
    term: "JetBackup",
    def: "The backup tool inside Serverlys cPanel. It keeps automatic daily copies of your account and lets you restore all of it or just one part.",
  },
  restore: {
    term: "Restore",
    def: "Putting a backup back in place, so the site, database or mailbox returns to how it was when the backup was taken.",
  },
  cron: {
    term: "Cron job",
    def: "A task the server runs automatically on a schedule, like an alarm clock for your website: \"every 15 minutes, run this\".",
  },
  ftp: {
    term: "FTP / SFTP",
    def: "A way to copy files between your computer and your hosting using an app such as FileZilla. SFTP is the encrypted version. File Manager in cPanel does the same job in the browser.",
  },
  spf: {
    term: "SPF",
    def: "A TXT record that lists which services are allowed to send email from your domain. Mail from anywhere else looks suspicious to the receiver.",
  },
  dkim: {
    term: "DKIM",
    def: "A digital signature added to every email you send, with a matching key published in your DNS. The receiver checks the two match, proving the email really came from you and was not changed.",
  },
  dmarc: {
    term: "DMARC",
    def: "A TXT record that tells other mail servers what to do with email that fails SPF and DKIM checks (deliver it, send it to spam, or reject it), and where to send reports.",
  },
  "email-forwarder": {
    term: "Email forwarder",
    def: "A rule that passes email sent to one address on to another, for example info@yourdomain.com to your personal inbox. It does not create a mailbox.",
  },
  mailbox: {
    term: "Mailbox (email account)",
    def: "A real inbox with its own password, like you@yourdomain.com, that stores email and that you can open in webmail or an email app.",
  },
  "google-workspace": {
    term: "Google Workspace / Microsoft 365",
    def: "Paid business email (and office apps) from Google or Microsoft. You can use them with your own domain, while your website stays on Serverlys.",
  },
  whois: {
    term: "WHOIS",
    def: "A public lookup that shows who a domain is registered with, when it expires, and its nameservers. Serverlys has a free WHOIS lookup tool.",
  },
  "auth-code": {
    term: "Auth code (EPP code)",
    def: "A password for moving a domain from one registrar to another. Your current registrar gives it to you. Keep it private.",
  },
  "transfer-lock": {
    term: "Transfer lock",
    def: "A setting at your registrar that stops anyone moving your domain away. It must be off to transfer, and should be on the rest of the time.",
  },
  "two-factor": {
    term: "Two-factor authentication (2FA)",
    def: "A second check when you log in, usually a six-digit code from an app on your phone, so a stolen password alone is not enough to get in.",
  },
  "private-window": {
    term: "Private / incognito window",
    def: "A browser window that ignores what you have saved and cached. Useful for seeing your site the way a first-time visitor does. Open one with Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac) in Chrome.",
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
