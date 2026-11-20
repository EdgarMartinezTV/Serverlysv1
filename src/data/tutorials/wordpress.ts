import type { Tutorial } from "./types";

export const wordpressTutorials: readonly Tutorial[] = [
  {
    slug: "wordpress-fast-on-day-one",
    published: "2026-09-09",
    title: "Install WordPress and make it fast on day one",
    summary:
      "A handful of settings that are painful to change later. Make them right on the first day and your site starts out fast and tidy.",
    category: "WordPress",
    minutes: 25,
    intro:
      "WordPress is the tool most websites are built with. A few of its settings are like the foundations of a house: easy to get right before you move in, and expensive to change once the furniture is there. This tutorial walks you through those settings in order, so your site has clean web addresses, a secure connection, fast pages and a safety net of backups from day one.",
    terms: ["wordpress", "wp-admin", "cpanel", "permalinks", "https", "redirect", "theme", "plugin", "cache", "server", "php", "backup", "jetbackup"],
    done:
      "Open a new post on your site and check its address ends in the post's name, like yourdomain.com/my-first-post/. Then open your site in a private window: it should load quickly and show a padlock next to the address.",
    before: [
      "A hosting plan and a domain that already points at it. If your domain does not open your hosting yet, follow the \"Point your domain\" tutorial first.",
      "Your Serverlys account email and password, so you can open cPanel. The \"Log in to cPanel\" tutorial shows how.",
      "About half an hour, before you publish any posts or pages.",
    ],
    steps: [
      {
        title: "Install WordPress",
        detail:
          "If you bought a WordPress plan, WordPress is already installed for you, so skip to the next step. On a general hosting plan, open cPanel (the \"Log in to cPanel\" tutorial shows how), type \"WordPress\" in the search box at the top and open the WordPress installer it finds. Choose your domain and an administrator username and password, then click install.",
        where: ["Serverlys account", "Websites", "Hosting", "Open cPanel"],
        check: "When you go to yourdomain.com/wp-admin you see a WordPress login page, and after logging in you see the WordPress dashboard with a dark menu on the left.",
      },
      {
        title: "Log in to the WordPress dashboard",
        detail:
          "In your browser, go to yourdomain.com/wp-admin and log in with the administrator username and password you chose. Every WordPress step below happens in this dashboard.",
        where: ["yourdomain.com/wp-admin"],
        code: "https://yourdomain.com/wp-admin",
        check: "You see the WordPress dashboard, with menu items such as Posts, Pages, Appearance, Plugins, Users and Settings on the left.",
      },
      {
        title: "Set the permalink structure to Post name",
        detail:
          "Permalinks are the web addresses of your posts and pages. Choose Post name, then click Save Changes at the bottom. Do this before you publish anything. Changing it later changes the address of every page on your site, so every link anyone has shared stops working unless you set up redirects for each one.",
        where: ["WordPress dashboard", "Settings", "Permalinks", "Post name", "Save Changes"],
        code: "/%postname%/",
        check: "A message at the top says \"Permalink structure updated\", and the Custom Structure box shows /%postname%/.",
      },
      {
        title: "Make both addresses start with https://",
        detail:
          "On the General settings page there are two address boxes: WordPress Address (URL) and Site Address (URL). Both must start with https://, the secure version of your address. Change both, then click Save Changes. Setting only one of them causes a redirect loop, where the browser bounces between two addresses forever, and that is genuinely confusing to fix. WordPress logs you out after this change, so log in again.",
        where: ["WordPress dashboard", "Settings", "General", "Save Changes"],
        check: "Both boxes start with https://, and after logging in again your browser shows a padlock next to the address.",
      },
      {
        title: "Delete the themes you are not using",
        detail:
          "WordPress comes with several themes, the designs that control how your site looks. Keep the one you are using and delete the rest: click a theme you do not use, then click Delete in the bottom corner of the window that opens. Unused themes still have code on your hosting that needs updating, which gives attackers a way in with no benefit to you.",
        where: ["WordPress dashboard", "Appearance", "Themes"],
        check: "Only your active theme is left on the Themes page.",
      },
      {
        title: "Delete the plugins you are not going to keep",
        detail:
          "Plugins add extra features. For each plugin you do not plan to use, click Deactivate, then click Delete. A plugin that is switched off (inactive) still has code on your hosting and still needs security updates. It is a door left open with nothing behind it worth having.",
        where: ["WordPress dashboard", "Plugins", "Installed Plugins"],
        check: "The Installed Plugins list only shows plugins you mean to use.",
      },
      {
        title: "Install the LiteSpeed Cache plugin",
        detail:
          "A cache keeps ready-made copies of your pages so they load faster. On Serverlys, the server already runs LiteSpeed caching for you. Search for \"LiteSpeed Cache\", click Install Now, then Activate. This plugin talks to the server's own cache. Do not add a second caching plugin that builds its own cache in PHP, the language WordPress runs on: two caches that do not know about each other serve old pages nobody can explain.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "LiteSpeed Cache shows as active on the Installed Plugins page, and a LiteSpeed Cache item appears in the left menu.",
      },
      {
        title: "Set your theme's content width",
        detail:
          "Your theme decides how wide the main column of text and pictures is. Look in your theme's settings, usually under Appearance, for a setting called content width or layout width, and set it to the width you want. WordPress then knows what size your images are really shown at.",
        where: ["WordPress dashboard", "Appearance"],
        check: "Your pages show text and images at the width you chose.",
      },
      {
        title: "Shrink photos before you upload them",
        detail:
          "Stop uploading photos straight from a phone camera. A 4000-pixel-wide photo shown 800 pixels wide on your page is the most common cause of a slow WordPress homepage. Resize photos on your computer to roughly the size they will be shown, then upload them. No plugin fixes this as well as simply not doing it.",
      },
      {
        title: "Find your backups now, while things are calm",
        detail:
          "Every Serverlys plan makes daily backups of your whole account at the server level, and restoring one is free. Open cPanel and click JetBackup so you know where they are. Do it now, on a calm afternoon, rather than for the first time in an emergency. The \"Restore a backup\" tutorial shows how to use them.",
        where: ["cPanel", "Files", "JetBackup"],
        shot: { id: "jetbackup", caption: "JetBackup in cPanel. Your daily backups are here, with Restore and Download options for the whole account, files, databases and email." },
        check: "You see the JetBackup page with options such as Full Backups, Home Directory and Databases.",
      },
    ],
    gotcha:
      "Publishing posts before setting the permalinks. When you fix it later, every web address on your site changes, and search engines such as Google have to learn each new address one by one.",
    products: ["/wordpress-hosting", "/managed-hosting"],
    related: ["harden-wordpress-login", "wordpress-automatic-backups", "install-ssl-certificate-wordpress"],
  },
  {
    slug: "move-wordpress-to-a-new-host",
    published: "2026-10-26",
    title: "Move WordPress to a new host manually",
    summary:
      "Copy your website's files and database yourself, test the copy on the new server before anyone else sees it, then send visitors to it.",
    category: "WordPress",
    minutes: 90,
    intro:
      "Moving a WordPress site is like moving house: you pack everything at the old place, unpack it at the new one, check it all works, and only then change your address so visitors come to the new home. A WordPress site has two parts to pack: its files (the pictures, theme and plugins) and its database (the posts, pages and settings). This tutorial copies both, lets you test the new copy privately, and then switches your domain over.",
    terms: ["wordpress", "hosting", "server", "cpanel", "file-manager", "public-html", "database", "phpmyadmin", "wp-config", "wp-cli", "plugin", "theme", "permalinks", "dns", "a-record", "nameservers", "ttl", "propagation", "ip-address", "ssl", "autossl", "ftp"],
    done:
      "Once DNS has switched and you have removed your hosts file line, open your site in a private window: it loads, you can log in at yourdomain.com/wp-admin, and pages other than the homepage open too. In cPanel on the new host, SSL/TLS Status shows a valid certificate for your domain.",
    before: [
      "A way into your files and database on the old host: usually File Manager and phpMyAdmin in its control panel. FTP or SFTP (programs for copying files to a server) and SSH (typing commands on the server) also work but are optional.",
      "A hosting account on the new server, which you can open in cPanel.",
      "Your DNS TTL lowered at least a day in advance, so the switch at the end takes effect quickly. The \"Lower your TTL before a migration\" tutorial shows how.",
      "An hour or two when few people use your site.",
    ],
    steps: [
      {
        title: "Pause changes on the old site",
        detail:
          "Stop publishing posts and editing pages until the move is finished, because anything changed on the old server from now on will not come across. If your site is a shop, write down the time: orders taken on the old server after this will not be copied either.",
      },
      {
        title: "Find your database name",
        detail:
          "On the old host, open File Manager, go into the folder WordPress lives in (usually public_html) and open wp-config.php to view it. Find the line with DB_NAME. The name in quotes is your database. Write it down and close the file without changing it.",
        where: ["Old host's control panel", "File Manager", "public_html", "wp-config.php"],
        check: "You have the database name written down, for example something like olduser_wp.",
      },
      {
        title: "Export the database",
        detail:
          "On the old host, open phpMyAdmin. Click your database's name in the list on the left, then click the Export tab at the top. Leave the format as SQL and click Export (or Go). Your browser downloads one file that holds all your posts, pages and settings. If you are comfortable typing commands over SSH, the commands below do the same job; this is optional.",
        where: ["Old host's control panel", "phpMyAdmin", "Your database", "Export"],
        code: "# Optional, over SSH instead of phpMyAdmin:\nwp db export site.sql\n# or\nmysqldump -u dbuser -p dbname > site.sql",
        check: "A file ending in .sql is in your computer's Downloads folder.",
      },
      {
        title: "Show hidden files in File Manager",
        detail:
          "Some important files have names that start with a dot, such as .htaccess, and File Manager hides them unless you ask. Click Settings at the top right of File Manager, tick Show Hidden Files (dotfiles), and click Save. The .htaccess file holds the rules that make your page addresses work, so it must come with you.",
        where: ["Old host's control panel", "File Manager", "Settings", "Show Hidden Files (dotfiles)", "Save"],
        check: "You can see .htaccess in the folder WordPress lives in.",
      },
      {
        title: "Pack every file into one archive",
        detail:
          "Copy the whole WordPress folder, not just the wp-content folder inside it: wp-config.php and the hidden .htaccess file matter too. In File Manager, open the WordPress folder, click Select All, then click Compress and choose Zip Archive. One archive file transfers much faster than thousands of small files, and nothing gets left behind.",
        where: ["Old host's control panel", "File Manager", "public_html", "Select All", "Compress"],
        check: "A new .zip file appears in the folder.",
      },
      {
        title: "Download the archive",
        detail:
          "Click the .zip file once to select it, then click Download. Keep it somewhere you will find it, next to the .sql file from the database export.",
        where: ["Old host's control panel", "File Manager", "Download"],
        check: "The .zip file is on your computer, and its size looks about right for your site (photos make sites big).",
      },
      {
        title: "Create a database on the new host",
        detail:
          "Open cPanel on the new host and go to Manage My Databases. Under Create New Database, type a short name such as wp and click Create Database. cPanel puts your account username in front of every name, so the full name looks like cpuser_wp. Write down the full name it shows.",
        where: ["cPanel", "Databases", "Manage My Databases", "Create New Database"],
        shot: { id: "mysql-databases", caption: "Databases → Manage My Databases. Every name starts with your account prefix (shown here as username_). Further down the same page, Database Users creates the user and Add User To Database gives it ALL PRIVILEGES." },
        check: "Your new database appears in the Current Databases list.",
      },
      {
        title: "Create a database user",
        detail:
          "On the same page, scroll down to Database Users. Type a username such as wpuser, then create a strong password (the Password Generator button makes one for you). Click Create User. Write down the full username, which also starts with your account prefix, and the password.",
        where: ["cPanel", "Databases", "Manage My Databases", "Database Users"],
        check: "The new user appears in the Current Users list.",
      },
      {
        title: "Give the user full access to the database",
        detail:
          "Still on the same page, under Add User To Database, choose your new user and your new database, then click Add. On the next screen tick ALL PRIVILEGES and click Make Changes. Without this, WordPress cannot read its own database.",
        where: ["cPanel", "Databases", "Manage My Databases", "Add User To Database", "ALL PRIVILEGES", "Make Changes"],
        check: "In the Current Databases list, your user's name is shown next to your database.",
      },
      {
        title: "Import the database",
        detail:
          "Open phpMyAdmin on the new host, click your new database on the left, then click the Import tab. Click Choose File, pick the .sql file you downloaded, and click Import (or Go) at the bottom. If the file is bigger than the upload limit shown on that page, you can import it over SSH instead with the optional command below.",
        where: ["cPanel", "Databases", "phpMyAdmin", "Your new database", "Import"],
        code: "# Optional, over SSH, for files too big for phpMyAdmin:\nmysql -u cpuser_wpuser -p cpuser_wp < site.sql",
        check: "phpMyAdmin says the import finished successfully, and your database now lists tables with names like wp_posts and wp_options.",
      },
      {
        title: "Upload the archive to the new host",
        detail:
          "Open File Manager on the new host and go into public_html, the folder your website is served from. Click Upload, choose the .zip file, and wait for the progress bar to finish.",
        where: ["cPanel", "Files", "File Manager", "public_html", "Upload"],
        check: "The .zip file appears inside public_html.",
      },
      {
        title: "Unpack the archive",
        detail:
          "Back in File Manager, click the .zip file once, then click Extract and confirm. Make sure the files end up directly inside public_html (you should see wp-config.php there), not inside an extra folder. Turn on Show Hidden Files in Settings here too, and check that .htaccess came across.",
        where: ["cPanel", "Files", "File Manager", "public_html", "Extract"],
        check: "public_html contains wp-config.php, .htaccess and the folders wp-admin, wp-content and wp-includes.",
      },
      {
        title: "Put the new database details in wp-config.php",
        detail:
          "Right-click wp-config.php and choose Edit. Change the four lines below to the full database name, user and password you wrote down. DB_HOST stays localhost. Leave the line with $table_prefix exactly as it was on the old server: if it does not match the imported tables, WordPress shows its install screen as if your site were empty. Click Save Changes.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "define( 'DB_NAME', 'cpuser_wp' );\ndefine( 'DB_USER', 'cpuser_wpuser' );\ndefine( 'DB_PASSWORD', 'the-password-you-set' );\ndefine( 'DB_HOST', 'localhost' );",
        check: "The four lines show your new details and the file saved without an error.",
      },
      {
        title: "Find the new server's IP address",
        detail:
          "An IP address is the number that identifies a server on the internet. In cPanel on the new host, look at the General Information panel on the right of the home page. Your server's IP address is listed there (labelled Shared IP Address on most plans). Write it down.",
        where: ["cPanel", "General Information"],
        check: "You have a number in the form 192.0.2.10 written down.",
      },
      {
        title: "Point only your own computer at the new server",
        detail:
          "Your computer has a small text file called the hosts file. A line in it tells only your computer to open your domain from the new server, while everyone else still sees the old site. Add the line below, using your new server's IP address. On macOS and Linux the file is /etc/hosts: open the Terminal app, type sudo nano /etc/hosts, enter your computer's password, add the line, then press Ctrl+O, Enter and Ctrl+X to save and close. On Windows the file is C:\\Windows\\System32\\drivers\\etc\\hosts: open Notepad with \"Run as administrator\", open that file, add the line and save.",
        code: "# Replace 192.0.2.10 with your new server's IP address\n192.0.2.10  yourdomain.com www.yourdomain.com",
        check: "The line is saved at the bottom of the hosts file.",
      },
      {
        title: "Test the site on the new server",
        detail:
          "Open your site in a private window so your browser does not show a saved copy. Browse a few pages, log in at yourdomain.com/wp-admin and submit a form. You may see a security warning because the new server has no certificate for your domain yet; that is expected at this stage. If pages other than the homepage show \"Not Found\", open Settings, then Permalinks in the WordPress dashboard and click Save Changes.",
        check: "Your pages, images and login all work on the new server.",
      },
      {
        title: "Switch DNS to the new server",
        detail:
          "Now send everyone to the new server. Where your domain's DNS is managed, either change the A record for yourdomain.com and www to the new IP address, or change the domain's nameservers to the new host's. The \"Point your domain\" tutorial walks through both. Then delete the line you added to your hosts file, so your computer goes back to using DNS like everyone else.",
        check: "Within the TTL you set (usually minutes to a few hours), your site in a private window loads from the new server even without the hosts file line.",
      },
      {
        title: "Get a security certificate on the new server",
        detail:
          "On Serverlys, AutoSSL issues a free SSL certificate automatically once your domain points at the new server. Open SSL/TLS Status in cPanel to see where it stands. It can only succeed after the DNS switch has taken effect.",
        where: ["cPanel", "Security", "SSL/TLS Status"],
        shot: { id: "ssl-tls-status", caption: "Security → SSL/TLS Status. Until the domain points at this server, AutoSSL shows an error like this one. After the DNS switch, the next run issues the certificate." },
        check: "SSL/TLS Status shows a valid certificate for yourdomain.com, and the site shows a padlock.",
      },
      {
        title: "Keep the old hosting for a few days",
        detail:
          "Do not cancel the old hosting account straight away. Keep it for a few days in case something was missed, such as a file or an email setting you need to copy across.",
      },
    ],
    gotcha:
      "Leaving the hidden .htaccess file behind. The homepage loads, so the move looks finished, but every other page shows a \"404 Not Found\" error until the address rules are rebuilt. To fix it, open Settings, then Permalinks in the WordPress dashboard and click Save Changes: that recreates the file.",
    products: ["/migrations", "/wordpress-hosting"],
    related: ["lower-ttl-before-migration", "change-wordpress-site-url", "wordpress-fast-on-day-one"],
  },
  {
    slug: "change-wordpress-site-url",
    published: "2026-10-26",
    title: "Change your WordPress site URL safely",
    summary:
      "Move WordPress to a new domain or address without breaking links, settings or your own login.",
    category: "WordPress",
    minutes: 30,
    intro:
      "Your WordPress site's address (its URL) is written into the site in many places, like a home address printed on letters, business cards and your shop sign. Changing to a new domain means updating the main setting, then every place the old address is still printed, and finally leaving a forwarding notice at the old address so visitors and Google find you. This tutorial does all three in a safe order.",
    terms: ["wordpress", "wp-admin", "domain", "ssl", "https", "database", "backup", "wp-config", "wp-cli", "file-manager", "cpanel", "ftp", "plugin", "theme", "permalinks", "cache", "cdn", "redirect"],
    done:
      "Open your old address, such as olddomain.com/about, in a private window: it should jump straight to newdomain.com/about. Then log in at newdomain.com/wp-admin and open a few posts to check images and links use the new domain.",
    before: [
      "A fresh backup of your database. The \"WordPress automatic backups\" and \"Restore a backup\" tutorials show where Serverlys keeps yours.",
      "The new domain already pointing at your server, with a valid security certificate, so https://newdomain.com opens without a warning.",
      "A way to edit wp-config.php in case you get locked out: File Manager in cPanel, or FTP. SSH with WP-CLI (typing commands on the server) is optional.",
    ],
    steps: [
      {
        title: "Understand the two address settings",
        detail:
          "WordPress stores its address twice, in its database. The Site Address (called home inside WordPress) is what visitors type. The WordPress Address (called siteurl) is where WordPress's own files live. For most sites they are exactly the same. Always write them without a slash at the end: https://newdomain.com, not https://newdomain.com/.",
      },
      {
        title: "Change both addresses in the dashboard",
        detail:
          "Log in at your current address, open the General settings, and type the new address into both WordPress Address (URL) and Site Address (URL). Click Save Changes. If the two boxes are greyed out and you cannot type in them, the addresses are fixed in wp-config.php: use the next step instead.",
        where: ["WordPress dashboard", "Settings", "General", "Save Changes"],
        check: "WordPress saves and then logs you out. That is normal.",
      },
      {
        title: "Log in again at the new address",
        detail:
          "Saving logs you out because your login belongs to the old address. Go to newdomain.com/wp-admin and log in with the same username and password.",
        where: ["newdomain.com/wp-admin"],
        code: "https://newdomain.com/wp-admin",
        check: "You see the dashboard, and the browser's address bar shows the new domain.",
      },
      {
        title: "If you are locked out, set the addresses in wp-config.php",
        detail:
          "Skip this step if you got back in. If you cannot reach the dashboard, open File Manager in cPanel, go to public_html, right-click wp-config.php and choose Edit. Add the two define lines below, above the line that says to stop editing, and click Save Changes. These lines override the database, and they are what greys out the dashboard boxes, so remove them later if you want to change the address from the dashboard again. If you use WP-CLI, the two wp option commands do the same job; this is optional.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "define( 'WP_HOME', 'https://newdomain.com' );\ndefine( 'WP_SITEURL', 'https://newdomain.com' );\n\n# or, optionally, with WP-CLI:\nwp option update home 'https://newdomain.com'\nwp option update siteurl 'https://newdomain.com'",
        check: "newdomain.com/wp-admin now shows the login page and you can log in.",
      },
      {
        title: "Replace the old address inside your content",
        detail:
          "Links and pictures in your posts, widgets and theme settings still point at the old domain. Do not use a plain find-and-replace in the database or on an exported file. WordPress saves some settings in a special packed format (called serialised data) that records how long each piece of text is. Changing the text without fixing the length breaks those settings. Use a tool that understands this. The clicking way: install a search-and-replace plugin that says it handles serialised data, such as Better Search Replace, from Plugins, then Add New Plugin. Run it first as a test (a dry run) to see how many changes it would make, then for real. If the tool lets you skip the guid column, skip it: those are permanent ID numbers for your posts and should not change.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin"],
        check: "The test run reports a number of matches, and after the real run your posts' images and links use the new domain.",
      },
      {
        title: "Optional: replace the old address with WP-CLI",
        detail:
          "If you prefer typing commands over SSH, WP-CLI's search-replace does the same job and handles serialised data correctly. Run the first line (--dry-run is a test that changes nothing) and check the count, then run the second line to make the change. --skip-columns=guid leaves your posts' permanent IDs alone.",
        code: "wp search-replace 'https://olddomain.com' 'https://newdomain.com' --skip-columns=guid --dry-run\nwp search-replace 'https://olddomain.com' 'https://newdomain.com' --skip-columns=guid",
        check: "The last line of output says how many replacements were made.",
      },
      {
        title: "Re-save your permalinks",
        detail:
          "Open the Permalinks settings and click Save Changes without changing anything. This rebuilds the rules that make your page addresses work.",
        where: ["WordPress dashboard", "Settings", "Permalinks", "Save Changes"],
        check: "A message says \"Permalink structure updated\".",
      },
      {
        title: "Clear the cache",
        detail:
          "Saved copies of your pages still contain the old links. Purge (empty) the page cache: with LiteSpeed Cache, use its purge all option in the LiteSpeed Cache menu or the top bar. If you use a CDN, purge its cache from its own website too.",
        check: "Opening a page in a private window shows links and images from the new domain.",
      },
      {
        title: "Keep the old domain pointing at your server",
        detail:
          "Do not let the old domain stop working. It needs to keep pointing at your server so it can forward every visitor to the new one. In cPanel, open Domains and check the old domain is still listed.",
        where: ["cPanel", "Domains", "Domains"],
        check: "The old domain is listed in cPanel's Domains page.",
      },
      {
        title: "Redirect the old domain permanently",
        detail:
          "A permanent (301) redirect tells browsers and Google that the site has moved for good. Send each old page to the same page on the new domain, so olddomain.com/about goes to newdomain.com/about. Add the lines below at the top of the .htaccess file in the folder the old domain opens. In File Manager, turn on Settings, then Show Hidden Files (dotfiles) to see .htaccess, then right-click it and choose Edit.",
        where: ["cPanel", "Files", "File Manager", "Settings", "Show Hidden Files (dotfiles)"],
        code: "# Sends every page on olddomain.com to the same page on newdomain.com\nRewriteEngine On\nRewriteCond %{HTTP_HOST} ^(www\\.)?olddomain\\.com$ [NC]\nRewriteRule ^(.*)$ https://newdomain.com/$1 [L,R=301]",
        check: "olddomain.com/about in a private window lands on newdomain.com/about.",
      },
      {
        title: "Tell Google about the move",
        detail:
          "If your old domain is set up in Google Search Console, Google's free tool for site owners, open the old domain there and use its Change of Address tool, found in its settings. This helps Google move your search listings to the new domain.",
        where: ["Google Search Console", "Settings", "Change of address"],
        check: "Search Console confirms the change of address request for the old domain.",
      },
    ],
    gotcha:
      "Running a find-and-replace in phpMyAdmin or in a text editor on an exported database file. Settings whose text length changed stop loading, and your widgets, menus and theme settings quietly reset to their defaults.",
    products: ["/wordpress-hosting", "/migrations"],
    related: ["move-wordpress-to-a-new-host", "install-ssl-certificate-wordpress", "restore-a-backup"],
  },
];
