import type { Tutorial } from "./types";

export const securityTutorials: readonly Tutorial[] = [
  {
    slug: "force-https",
    published: "2026-09-09",
    title: "Force HTTPS and clear mixed content",
    summary:
      "Get the padlock next to your address, keep it, and find anything on your pages that still loads the insecure way.",
    category: "Security",
    minutes: 20,
    intro:
      "HTTPS is the secure version of your web address, the one that shows a padlock in the browser. Having a certificate is like owning a lock; forcing HTTPS is actually locking the door, so every visitor is sent to the secure version even if they type the old http:// address. This tutorial sets that up, then finds the leftover pictures or scripts that still load insecurely and stop the padlock from showing.",
    terms: ["https", "ssl", "domain", "subdomain", "redirect", "server", "php", "plugin", "cpanel", "wordpress", "database", "wp-cli", "private-window"],
    done:
      "Type http://yourdomain.com (without the s) into a private window: it should switch to https://yourdomain.com on its own and show a padlock. Check a few of your busiest pages show the padlock too.",
    before: [
      "A valid SSL certificate already issued for your domain. On Serverlys this happens automatically; the \"Install an SSL certificate\" tutorial shows how to check.",
      "Access to cPanel. The \"Log in to cPanel\" tutorial shows how.",
    ],
    steps: [
      {
        title: "Check the certificate covers every address you use",
        detail:
          "Open https://yourdomain.com and https://www.yourdomain.com, typing the https:// yourself. A certificate issued for yourdomain.com does not always cover www.yourdomain.com: both names have to be on it. If you use both, both must open without a warning.",
        check: "Both addresses open with a padlock and no security warning.",
      },
      {
        title: "Turn on Force HTTPS Redirect in cPanel",
        detail:
          "A redirect automatically sends visitors from one address to another. Set it up once, at the server, rather than with a WordPress plugin. A plugin redirect only runs after PHP (the language WordPress runs on) has started, which is slower, and it stops working the moment the plugin is switched off. In cPanel, open Domains and switch Force HTTPS Redirect on for your domain. The switch only works once a valid certificate is in place.",
        where: ["cPanel", "Domains", "Domains", "Force HTTPS Redirect"],
        shot: { id: "domains", caption: "On Serverlys cPanel, Domains has a Force HTTPS Redirect switch for each domain. It does this server-level redirect for you once a valid certificate is in place." },
        check: "The Force HTTPS Redirect switch shows On next to your domain.",
      },
      {
        title: "Or add the redirect to .htaccess yourself",
        detail:
          "Skip this if you used the switch above. .htaccess is a hidden settings file in your website's main folder, public_html. In File Manager, click Settings, tick Show Hidden Files (dotfiles), then right-click .htaccess and choose Edit. Paste these lines at the very top and save. Use one way or the other, not both.",
        where: ["cPanel", "Files", "File Manager", "public_html", ".htaccess", "Edit"],
        code: "# Sends every http:// request to the same page on https://\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
        check: "Typing http://yourdomain.com in a private window lands on https://yourdomain.com.",
      },
      {
        title: "Find the mixed content",
        detail:
          "\"Mixed content\" means a secure page that still loads something, such as a picture, over plain http. It can hide the padlock or get blocked. Open one of your pages, then open the browser's console, a panel of technical messages: press F12 on Windows or Cmd+Option+J on a Mac in Chrome, and click the Console tab. Anything marked as blocked, mixed content or insecure is a file still requested over http. Usually it is an image address saved in your database, an embedded font, or a script from another company's website. Check a few different pages.",
        check: "You have a list of the http:// addresses the console reported, or the console shows no mixed content warnings at all.",
      },
      {
        title: "Fix the old addresses in the database properly",
        detail:
          "WordPress saves some settings in a special packed format (called serialised data) that records the length of each piece of text. A plain find-and-replace changes the text without fixing the length, which breaks those settings and your widgets. Use a tool that understands this. The clicking way is a search-and-replace plugin that says it handles serialised data, such as Better Search Replace: replace http://yourdomain.com with https://yourdomain.com, with a test run (dry run) first. If you use WP-CLI, its search-replace command does the same; the \"Install an SSL certificate\" tutorial has the exact commands. If you would rather not do it yourself, we can run it for you.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "Reloading the pages from the last step, the console no longer shows mixed content warnings for your own addresses.",
      },
      {
        title: "Only then consider HSTS",
        detail:
          "HSTS is an instruction your site sends that tells browsers to refuse http for your domain from then on. It is the right final step, but it is hard to undo: a browser that has seen it keeps obeying it for the length of time you set, called the max-age. Only turn it on once everything, including every subdomain you use, works over https.",
      },
    ],
    gotcha:
      "Turning on HSTS with a long max-age while one of your subdomains (such as shop.yourdomain.com) still has no certificate. Browsers then refuse to open that subdomain at all, and you cannot take it back until the max-age runs out.",
    products: ["/wordpress-hosting", "/hosting"],
    related: ["install-ssl-certificate-wordpress", "change-wordpress-site-url"],
  },
  {
    slug: "install-ssl-certificate-wordpress",
    published: "2026-10-26",
    title: "Install an SSL certificate and switch WordPress to HTTPS",
    summary:
      "Get a valid security certificate on your domain first, then move WordPress over to https without locking yourself out.",
    category: "Security",
    minutes: 25,
    intro:
      "An SSL certificate is what lets your site use https and show the padlock, like an ID card that proves to browsers your site is really yours. On Serverlys you usually get one free and automatically. Once the certificate works, you tell WordPress to use the https address everywhere. The order matters: certificate first, WordPress second, or you can lock yourself out of your own dashboard.",
    terms: ["ssl", "https", "autossl", "domain", "dns", "server", "cpanel", "wordpress", "wp-admin", "wp-config", "wp-cli", "database", "backup", "plugin", "cdn", "redirect", "file-manager", "public-html", "private-window"],
    done:
      "Open https://yourdomain.com and https://www.yourdomain.com in a private window: both show a padlock with no warning. In the WordPress dashboard, Settings, General shows both addresses starting with https://.",
    before: [
      "Your domain already pointing at your hosting server. If it does not yet, follow the \"Point your domain\" tutorial first.",
      "A backup of your WordPress database. Serverlys makes daily backups; the \"Restore a backup\" tutorial shows where they are.",
      "Access to cPanel. SSH with WP-CLI (typing commands on the server) helps but is optional.",
    ],
    steps: [
      {
        title: "Open SSL/TLS Status in cPanel",
        detail:
          "On Serverlys this part is automatic. AutoSSL issues a free certificate for your domain and its www name, and renews it, on its own schedule. Open cPanel and click SSL/TLS Status to see where it stands.",
        where: ["cPanel", "Security", "SSL/TLS Status"],
        shot: { id: "ssl-tls-status", caption: "Security → SSL/TLS Status. This example is a domain that does not point at the server yet, so AutoSSL could not check it. Once DNS points here, the next run issues the certificate and the padlock turns green." },
        check: "You see a list of your domain names, each with a certificate status.",
      },
      {
        title: "Read what the status says",
        detail:
          "AutoSSL proves you own the domain by visiting it, so it can only succeed once your DNS points at this server. Until then, the Status page shows an error instead of a certificate. A name that does not reach this server, such as www without a DNS record of its own, is left off the certificate. If you see an error, check your domain points here, then wait for the next AutoSSL run.",
        check: "Your domain and its www name both show a valid certificate (AutoSSL Domain Validated), not a self-signed one or an error.",
      },
      {
        title: "Or install a certificate you bought",
        detail:
          "Skip this if AutoSSL worked. If you bought a certificate from a certificate authority (a company that issues them), open SSL/TLS in cPanel and generate a certificate signing request, or CSR: a block of text you give the certificate authority. cPanel creates the matching private key, a secret file that stays on the server, at the same time. Copy the CSR and give it to the certificate authority.",
        where: ["cPanel", "Security", "SSL/TLS", "Certificate Signing Requests (CSR)"],
        check: "You have a block of text starting with -----BEGIN CERTIFICATE REQUEST----- to give the certificate authority.",
      },
      {
        title: "Install the bought certificate",
        detail:
          "When the certificate arrives, open SSL/TLS in cPanel again, click Manage SSL sites, choose your domain and paste the certificate. cPanel matches it to the private key it stored. Also paste the CA bundle the certificate authority supplies (sometimes called the intermediate or chain certificate), or some browsers and apps will report your certificate as untrusted. Then click Install Certificate.",
        where: ["cPanel", "Security", "SSL/TLS", "Manage SSL sites"],
        check: "cPanel says the certificate was installed for your domain.",
      },
      {
        title: "Check the certificate before touching WordPress",
        detail:
          "Open https://yourdomain.com and https://www.yourdomain.com in a private window. Both must open without a warning. If you change WordPress while the certificate is still invalid, every admin page sits behind a security warning you have to click through.",
        check: "Both addresses show a padlock and no warning.",
      },
      {
        title: "Change both WordPress addresses to https://",
        detail:
          "In the WordPress dashboard, open the General settings. Change WordPress Address (URL) and Site Address (URL) so both start with https://, then click Save Changes. WordPress logs you out; log in again at https://yourdomain.com/wp-admin. If the two boxes are greyed out, they are set in wp-config.php as WP_HOME and WP_SITEURL: open it in File Manager (right-click, Edit) and change http:// to https:// on those two lines there.",
        where: ["WordPress dashboard", "Settings", "General", "Save Changes"],
        check: "After logging in again, both boxes start with https:// and the dashboard shows a padlock.",
      },
      {
        title: "Rewrite the old http:// links in your content",
        detail:
          "Your posts and settings still contain addresses starting with http://. WordPress saves some settings in a special packed format (serialised data) that a plain find-and-replace breaks, so use a tool that handles it. The clicking way: a search-and-replace plugin that says it handles serialised data, such as Better Search Replace, from Plugins, then Add New Plugin. Replace http://yourdomain.com with https://yourdomain.com, as a test run first to see how many changes it would make, then for real. If it lets you skip the guid column, skip it.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "The test run reports how many matches it found, and after the real run your pages load images over https.",
      },
      {
        title: "Optional: rewrite the links with WP-CLI",
        detail:
          "If you prefer typing commands over SSH, WP-CLI's search-replace handles WordPress's serialised data correctly. Run the first line with --dry-run, a test that changes nothing, to see how many replacements it will make. Then run the second line to make them. --skip-columns=guid leaves your posts' permanent IDs alone.",
        code: "wp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --skip-columns=guid --dry-run\nwp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --skip-columns=guid",
        check: "The output ends with the number of replacements made.",
      },
      {
        title: "Only if a proxy or CDN handles your HTTPS",
        detail:
          "Skip this unless a service such as a CDN sits in front of your site and handles the secure connection itself, then talks to your server separately. In that setup WordPress may not realise the visit is secure and keep redirecting to https forever. Fix it by adding these lines to wp-config.php, above the line that says to stop editing. Only do this when the proxy or CDN in front of your site is one you control.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {\n    $_SERVER['HTTPS'] = 'on';\n}",
        check: "Your site and dashboard open normally over https with no endless redirect.",
      },
      {
        title: "Send every http visitor to https",
        detail:
          "Finish by turning on the server-level permanent (301) redirect and checking your pages for mixed content, as the \"Force HTTPS and clear mixed content\" tutorial explains. On Serverlys, the quickest way is the Force HTTPS Redirect switch in cPanel's Domains page.",
        where: ["cPanel", "Domains", "Domains", "Force HTTPS Redirect"],
        check: "Typing http://yourdomain.com in a private window lands on https://yourdomain.com.",
      },
    ],
    gotcha:
      "Switching the WordPress addresses to https before the certificate is valid. Every admin page then sits behind a browser warning, and some setups end in a redirect loop that can only be undone by editing wp-config.php or the database.",
    products: ["/wordpress-hosting", "/hosting"],
    related: ["force-https", "change-wordpress-site-url", "harden-wordpress-login"],
  },
  {
    slug: "harden-wordpress-login",
    published: "2026-10-26",
    title: "Harden your WordPress login",
    summary:
      "The changes that stop password guessing and stolen passwords from getting into your WordPress dashboard, in the order worth doing them.",
    category: "Security",
    minutes: 30,
    intro:
      "Automated programs try to log in to WordPress sites all day long, guessing common usernames and passwords. Hardening your login is like changing the locks, adding an alarm and limiting who has a key: each step makes the next guess less likely to work. Do them in order; the first ones give the most protection for the least effort.",
    terms: ["wordpress", "wp-admin", "plugin", "theme", "two-factor", "wp-config", "file-manager", "public-html", "cpanel", "ftp", "php", "server"],
    done:
      "Log out, then log back in at yourdomain.com/wp-admin with your new administrator username: WordPress should ask for your password and then for the six-digit code from your phone app. On the Users page, only the people who really need it are listed as Administrator.",
    before: [
      "An administrator account on your WordPress site.",
      "Access to cPanel File Manager, or FTP, in case a change locks you out. The \"Log in to cPanel\" tutorial shows how to open cPanel.",
      "Your phone, with an authenticator app such as Google Authenticator or Microsoft Authenticator installed, for the two-factor step.",
    ],
    steps: [
      {
        title: "Create a new administrator with a different username",
        detail:
          "If your site has an account named admin, retire it: it is the first username every automated attack tries. WordPress cannot rename a user from the dashboard, so make a new one instead. Choose a username that is not admin, enter your email, set a strong password, set Role to Administrator, and click Add New User.",
        where: ["WordPress dashboard", "Users", "Add New User"],
        check: "The new user appears in the Users list with the role Administrator.",
      },
      {
        title: "Delete the old admin account",
        detail:
          "Log out, then log in as the new administrator. Open Users, hover over the old admin account and click Delete. WordPress asks what to do with that account's posts and pages: choose \"Attribute all content to\", pick your new user, and click Confirm Deletion.",
        where: ["WordPress dashboard", "Users", "All Users", "Delete"],
        check: "The admin account is gone, and its posts now show your new user as the author.",
      },
      {
        title: "Give every administrator a unique password",
        detail:
          "Every administrator needs a long password that is used nowhere else. To change your own, open your profile, click Set New Password, and click Update Profile. Ask every other administrator to do the same.",
        where: ["WordPress dashboard", "Users", "Profile", "Set New Password", "Update Profile"],
        check: "WordPress says \"Profile updated\".",
      },
      {
        title: "Remove administrator rights from people who do not need them",
        detail:
          "Each administrator account is a full set of keys to your site. On the Users page, click the Administrator filter at the top to list only administrators. For anyone who only writes content, tick the box next to their name, choose Editor or Author in the \"Change role to\" menu, and click Change.",
        where: ["WordPress dashboard", "Users", "All Users", "Administrator"],
        check: "The Administrator filter only lists people who really manage the site.",
      },
      {
        title: "Install a two-factor plugin",
        detail:
          "Two-factor authentication asks for a code from your phone as well as your password. Search for a two-factor plugin, such as Two Factor or Wordfence Login Security, click Install Now, then Activate.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "The plugin shows as active on the Installed Plugins page.",
      },
      {
        title: "Turn on an authenticator app for every administrator",
        detail:
          "Open the plugin's settings (with the Two Factor plugin they are on your profile page; other plugins add their own menu item). Choose the authenticator app option, scan the square code it shows with your phone's authenticator app, and type in the six-digit code to confirm. Every administrator must do this for their own account.",
        check: "The plugin shows two-factor as enabled for your account.",
      },
      {
        title: "Save the backup codes somewhere outside the site",
        detail:
          "The plugin offers backup codes: one-time codes that get you in if you lose your phone. Generate them and save them somewhere outside your website, such as a password manager or a printed sheet kept safe.",
        check: "You have the backup codes stored somewhere you can reach without logging in to the site.",
      },
      {
        title: "Limit failed login attempts",
        detail:
          "Out of the box, WordPress lets anyone try passwords as many times as they like. A plugin such as Limit Login Attempts Reloaded locks out an address after a few wrong tries, which turns an attack of millions of guesses into a handful. Search for it, click Install Now, then Activate.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "The plugin is active. If you test with a wrong password a few times from another device, that device is told it is locked out for a while.",
      },
      {
        title: "Check whether anything uses XML-RPC",
        detail:
          "xmlrpc.php is a file that lets other apps talk to your site, and it accepts many login attempts in a single request, which attackers like. Jetpack and some mobile and publishing apps depend on it. Look at your Installed Plugins for Jetpack, and think about whether you post from a phone app or another service. If something does, stop here and skip the next step.",
        where: ["WordPress dashboard", "Plugins", "Installed Plugins"],
        check: "You know whether anything on your site uses XML-RPC.",
      },
      {
        title: "Block XML-RPC if nothing uses it",
        detail:
          "In File Manager, open public_html, click Settings and tick Show Hidden Files (dotfiles) so you can see .htaccess. Right-click .htaccess, choose Edit, add these lines at the end, and save.",
        where: ["cPanel", "Files", "File Manager", "public_html", ".htaccess", "Edit"],
        code: "# Blocks xmlrpc.php\n<Files xmlrpc.php>\n  Require all denied\n</Files>",
        check: "Opening yourdomain.com/xmlrpc.php in your browser shows a \"Forbidden\" error, while the rest of your site works normally.",
      },
      {
        title: "Turn off the built-in file editor",
        detail:
          "WordPress has an editor that lets administrators change theme and plugin code from the dashboard. If an administrator account is ever stolen, that editor lets the attacker write PHP code, which runs on the server, straight onto your site. To remove it, open wp-config.php in File Manager (right-click, Edit) and add this line above the line that says to stop editing, then save.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "define( 'DISALLOW_FILE_EDIT', true );",
        check: "The Theme File Editor and Plugin File Editor no longer appear in the WordPress dashboard menus.",
      },
    ],
    gotcha:
      "Turning on two-factor authentication without saving the backup codes. If you lose your phone, the only way back in is to switch the plugin off by renaming its folder (inside wp-content/plugins) using File Manager or FTP.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["reset-wordpress-password-phpmyadmin", "install-ssl-certificate-wordpress", "wordpress-automatic-backups"],
  },
];
