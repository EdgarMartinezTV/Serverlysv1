import type { Tutorial } from "./types";

export const recoveryTutorials: readonly Tutorial[] = [
  {
    slug: "restore-a-backup",
    published: "2026-09-09",
    title: "Restore a backup without making it worse",
    summary:
      "What to check before you put an old copy of your site back, and what a restore will replace.",
    category: "Recovery",
    minutes: 20,
    intro:
      "A backup is a saved copy of your website from an earlier day. Restoring it puts that copy back, like rewinding a video to before something went wrong. It is the quickest way out of most disasters, but anything that happened after the backup was taken is rewound too. This guide helps you pick the right day, restore only the part that broke, and keep the work you have done since.",
    terms: ["backup", "restore", "jetbackup", "cpanel", "database", "plugin", "cache", "cdn", "staging", "private-window", "wp-admin"],
    done:
      "Open your site in a private window and it looks and works the way it did before the problem. You can log in to your WordPress dashboard at yourdomain.com/wp-admin, and anything you saved before the restore is back in place.",
    before: [
      "Access to cPanel through your Serverlys account (see the tutorial \"Log in to your Serverlys control panel\"), or a support ticket open if you would rather we do the restore.",
      "A rough idea of when the site last worked. A note of what you changed recently helps a lot.",
      "Ten quiet minutes. Take a breath: a broken site is almost always fixable, and the backups are still there.",
    ],
    steps: [
      {
        title: "Stop and work out when it broke",
        detail:
          "Before you click anything, work out the day and time the problem started. If you restore a copy from after that moment, you just get the same problem back. Think about what changed: an update, a new page you published, a plugin you installed. The error log in cPanel can help too. It is a list of problems the server noticed, each with a date and time.",
        where: ["cPanel", "Metrics", "Errors"],
        check: "You can say \"the site last worked on this day\", and you know which backup date is from before that.",
      },
      {
        title: "Decide whether you need the files, the database, or both",
        detail:
          "Your site has two halves that are restored separately. The files are the software, the design and your uploaded images. The database holds your posts, pages, settings, orders and comments. A broken plugin usually needs the files only. A post that went wrong or a bad import needs the database. If you restore both when you only needed one, you lose everything written in between.",
        where: ["cPanel", "Files", "JetBackup 5", "Restore & Download"],
        shot: { id: "jetbackup", caption: "In Serverlys cPanel, Files, then JetBackup 5, then Restore & Download keeps your files (Home Directory), Databases, Email Accounts and more as separate choices, so you can restore only what broke." },
        check: "You know which choice you will use: Home Directory for files, Databases for the database, or both.",
      },
      {
        title: "Save anything written since the backup",
        detail:
          "Orders, comments, form submissions and posts created after the backup date will disappear when you restore. If they matter, save them first. For posts and pages, the WordPress dashboard can export them to a file under Tools, then Export. For orders and form messages, download or copy them somewhere safe. This is the step people skip and regret.",
        where: ["WordPress dashboard", "Tools", "Export"],
        check: "Everything you would hate to lose since the backup date is saved on your own computer.",
      },
      {
        title: "Run the restore",
        detail:
          "In JetBackup 5, open Restore & Download and pick the part you chose earlier (Home Directory, Databases or both). Choose the backup dated before the problem started, then start the restore. Pick the date carefully: it decides how far back the site goes.",
        where: ["cPanel", "Files", "JetBackup 5", "Restore & Download"],
        check: "JetBackup shows that the restore has been queued and then completed. A large site can take several minutes.",
      },
      {
        title: "Clear every cache",
        detail:
          "A cache is a saved copy of your pages that makes them load faster. After a restore, old saved copies can still show the broken version. Clear every cache you have: the server cache, your caching plugin's cache (most have a clear or purge button in the WordPress dashboard), and any CDN in front of the site. If the restore seems not to have worked, it usually has, and you are looking at a saved copy of the broken site.",
        check: "You open the site in a private window and see the working version.",
      },
      {
        title: "Find the cause before you redo anything",
        detail:
          "You are back to a working site. Whatever broke it will break it again if you simply repeat it. Apply updates again one at a time, and try them on a staging site first. That is a private copy of your site where mistakes do not reach visitors.",
        check: "You know which update or change caused the problem, and you have tested the fix on staging before using it on the real site.",
      },
    ],
    gotcha:
      "Restoring the database to fix a plugin problem. It fixes the plugin, and it also deletes every order taken since the backup date. A plugin problem lives in the files, so restore the files only.",
    products: ["/site-management", "/wordpress-hosting"],
    related: ["wordpress-automatic-backups", "fix-error-establishing-database-connection"],
  },
  {
    slug: "reset-wordpress-password-phpmyadmin",
    published: "2026-10-26",
    title: "Reset a WordPress admin password in phpMyAdmin",
    summary:
      "Get back into your WordPress site when the \"lost password\" email never arrives.",
    category: "Recovery",
    minutes: 15,
    intro:
      "Being locked out of your own site is stressful, but your account is still there and you can set a new password yourself. WordPress keeps every user and password in its database. phpMyAdmin lets you open that database and write a new password straight into your account, a bit like a locksmith changing the lock when the key is lost. Nothing else on the site changes.",
    terms: ["wp-admin", "cpanel", "database", "phpmyadmin", "wp-config", "file-manager", "public-html", "wp-cli", "wordpress"],
    done:
      "You go to yourdomain.com/wp-login.php, log in with your username and the new password, and land in your WordPress dashboard.",
    before: [
      "Access to cPanel through your Serverlys account (see the tutorial \"Log in to your Serverlys control panel\"). phpMyAdmin is inside cPanel.",
      "Your WordPress username, or the email address on your account. You will see it in the database if you have forgotten it.",
      "Optional: SSH and WP-CLI, if you prefer typing commands. SSH is a way to type commands on the server from a terminal app. You do not need it: the clicking way below works on its own.",
    ],
    steps: [
      {
        title: "Try the normal reset first",
        detail:
          "On your login page, click the link \"Lost your password?\", type your username or email, and WordPress emails you a reset link. Check your spam folder. If the email never arrives, the site probably cannot send email. That is worth fixing separately, but the steps below do not need it.",
        where: ["yourdomain.com/wp-login.php", "Lost your password?"],
        code: "https://yourdomain.com/wp-login.php?action=lostpassword",
        check: "Either the email arrives and you can reset your password from it (you are done), or nothing has arrived after ten minutes and you carry on below.",
      },
      {
        title: "Open wp-config.php in File Manager",
        detail:
          "In cPanel, open File Manager and go into public_html, where your main site lives. If your site is in a folder inside it, open that folder. Find the file wp-config.php, select it and click Edit. You only need to read it, so do not change anything.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        check: "The file is open and you can see lines that start with define.",
      },
      {
        title: "Note the database name and the table prefix",
        detail:
          "Find the line with DB_NAME: the name in quotes is your site's database. Then find $table_prefix: it is the start of every table name in that database. It is wp_ by default, but is often something else. Write both down. If your account has several WordPress sites, each one has its own database, so check you have the right one before editing anything.",
        code: "define( 'DB_NAME', 'cpuser_wp' );\n$table_prefix = 'wp_';",
        check: "You have written down a database name (for example cpuser_wp) and a prefix (for example wp_).",
      },
      {
        title: "Open phpMyAdmin and choose the database",
        detail:
          "Back on the cPanel home page, open phpMyAdmin. It opens in a new tab. In the list of databases on the left, click the database name you wrote down. Its tables appear.",
        where: ["cPanel", "Databases", "phpMyAdmin", "Your database (list on the left)"],
        check: "You see a list of tables that all start with your prefix, such as wp_options, wp_posts and wp_users.",
      },
      {
        title: "Open your user's row",
        detail:
          "Click the users table: your prefix followed by users, for example wp_users. Each row is one person who can log in. Find your username in the user_login column and click Edit on that row.",
        where: ["wp_users", "Edit (on your row)"],
        check: "A form opens with one line per field: ID, user_login, user_pass, user_email and so on.",
      },
      {
        title: "Type the new password and choose MD5",
        detail:
          "Go to the user_pass line. In its Function dropdown, choose MD5. MD5 scrambles the password the way WordPress expects to read it. In the Value box on the same line, delete the old jumble of characters and type your new password in plain text. Then click Go at the bottom.",
        where: ["user_pass", "Function", "MD5", "Value", "Go"],
        check: "phpMyAdmin shows a green message saying 1 row affected.",
      },
      {
        title: "Or make the same change with an SQL query",
        detail:
          "This is optional and does exactly the same as the last two steps. SQL is the language databases understand. With your database selected in phpMyAdmin, click the SQL tab at the top, paste the line below, and change three things: wp_ to your prefix, the password, and yourusername to your username. Then click Go. WordPress accepts the MD5 password once, and the first time you log in it replaces it with its own stronger scrambling.",
        where: ["phpMyAdmin", "Your database", "SQL", "Go"],
        code: "-- Change wp_, the password and the username before you click Go\nUPDATE wp_users SET user_pass = MD5('a-new-strong-password') WHERE user_login = 'yourusername';",
        check: "phpMyAdmin says 1 row affected. If it says 0 rows, the username or prefix does not match: check them and try again.",
      },
      {
        title: "Or, if you use SSH, do it with WP-CLI",
        detail:
          "Also optional. If you already connect to the server over SSH, WP-CLI sets the password the same way WordPress itself does, with no database editing at all. Go to the folder where WordPress is installed (usually public_html), then run the command below with your username and new password.",
        code: "cd ~/public_html\nwp user update yourusername --user_pass='a-new-strong-password'",
        check: "WP-CLI replies with a line starting Success: Updated user.",
      },
      {
        title: "Log in with the new password",
        detail:
          "Go to your login page and sign in with your username and the new password. If it still fails, the most common reason is that you edited a different site's database: go back to the database name in wp-config.php and compare.",
        where: ["yourdomain.com/wp-login.php"],
        check: "You are in your WordPress dashboard.",
      },
      {
        title: "Check who else is an administrator",
        detail:
          "In the dashboard, open Users and click Administrator in the filter links above the list. Administrators can change everything on the site. If you were locked out unexpectedly and you see an account you do not recognise, your site may have been broken into. Delete that account, then change every admin password, the database password, and the salts in wp-config.php. Salts are the long random lines in that file that keep logins secure; changing them signs everyone out.",
        where: ["WordPress dashboard", "Users", "Administrator"],
        check: "Every administrator on the list is someone you know.",
      },
    ],
    gotcha:
      "Editing the users table of the wrong database on an account with more than one site. phpMyAdmin says it worked, your password still fails, and a different site now has a changed admin password. Always match the database to DB_NAME in that site's wp-config.php first.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["harden-wordpress-login", "fix-error-establishing-database-connection", "restore-a-backup"],
  },
  {
    slug: "wordpress-automatic-backups",
    published: "2026-10-26",
    title: "Set up automatic WordPress backups",
    summary:
      "Add a copy of your files and database that is made on a schedule and kept away from your server, and prove you can restore it.",
    category: "Recovery",
    minutes: 30,
    intro:
      "A backup is a saved copy of your site that you can put back if something goes wrong. Your Serverlys plan already makes one every day, but it lives with your hosting. This guide adds a second copy, made automatically and kept somewhere you own, like keeping a spare house key at a friend's place as well as under your own mat. Then you test it, so you know it really works before you ever need it.",
    terms: ["backup", "restore", "jetbackup", "cpanel", "database", "plugin", "wp-admin", "cron", "wp-cli", "public-html", "staging", "subdomain", "server"],
    done:
      "Your backup plugin (or your cron job) shows a finished backup from the last day, the copy is in your cloud storage, and you have restored it once onto a staging site and logged in there.",
    before: [
      "Access to your WordPress dashboard at yourdomain.com/wp-admin. For the cron way instead, access to cPanel and SSH (a way to type commands on the server from a terminal app).",
      "Somewhere away from your server to keep the copies: cloud storage you control, such as Google Drive, Dropbox or Amazon S3.",
    ],
    steps: [
      {
        title: "Know what your host already keeps",
        detail:
          "Every Serverlys plan includes daily backups made by the server. You can see them in cPanel under JetBackup 5. Before you rely on any host's backups, find out how many days they go back. A problem you notice after that window cannot be rolled back.",
        where: ["cPanel", "Files", "JetBackup 5"],
        shot: { id: "jetbackup", caption: "Files, then JetBackup 5, in Serverlys cPanel shows the backups the server keeps for your account, and lets you restore or download each part on its own." },
        check: "You can see a list of backups with dates, and you know the oldest date on it.",
      },
      {
        title: "Plan a second copy somewhere else",
        detail:
          "A backup that lives only on the same server or account is lost along with it. The common rule is three copies, on two kinds of storage, with one off-site (in a different place from your server). For a small site, that means your host's backups plus a scheduled copy in cloud storage you own.",
        check: "You have picked where your second copy will go, and you can sign in to it.",
      },
      {
        title: "Install a backup plugin",
        detail:
          "The easiest way is a backup plugin such as UpdraftPlus. In the WordPress dashboard, go to Plugins, then Add New Plugin, search for UpdraftPlus, click Install Now, then Activate.",
        where: ["WordPress dashboard", "Plugins", "Add New Plugin", "Install Now", "Activate"],
        check: "The plugin shows as active on your Plugins page.",
      },
      {
        title: "Set separate schedules for files and database",
        detail:
          "In the plugin's settings, set a schedule for files and a separate one for the database. The database changes every time someone orders or comments. The files change mostly when you update something. Also choose how many copies to keep, so your storage does not fill up.",
        check: "The settings show a schedule for files, a schedule for the database, and how many copies to keep of each.",
      },
      {
        title: "Send the copies to your cloud storage",
        detail:
          "In the same settings, choose your remote storage, for example Google Drive, Dropbox or Amazon S3, and follow the plugin's prompts to connect your account. Save the settings, then run one backup by hand to check it works.",
        check: "After the first backup finishes, you can open your cloud storage and see the new backup files there.",
      },
      {
        title: "Or schedule it with a cron job",
        detail:
          "This is the alternative to a plugin, for people comfortable with commands. A cron job runs a command on a schedule. In cPanel, open Cron Jobs. Set Cron Email to an address you read, so the server tells you if something fails. Then fill in Add New Cron Job with the lines below: the first exports (saves) the database every night at 03:00, and the second deletes copies older than 14 days. Make the backups folder first in File Manager, in your home folder and not inside public_html, because anything in public_html can be downloaded by anyone. In cron, every % must be written as \\%, as shown. The path to wp can differ from server to server: run `which wp` over SSH to find yours.",
        where: ["cPanel", "Advanced", "Cron Jobs", "Add New Cron Job"],
        code: "0 3 * * * cd ~/public_html && wp db export ~/backups/db-$(date +\\%F).sql\n30 3 * * * find ~/backups -name 'db-*.sql' -mtime +14 -delete",
        shot: { id: "cron-jobs", caption: "Advanced, then Cron Jobs. Set Cron Email to an address you read, then use Add New Cron Job with the schedule and the command." },
        check: "The next morning, a file named db- followed by the date (for example db-2026-11-21.sql) is in your backups folder in File Manager. Copy these files off the server regularly, since they live on the same server as your site.",
      },
      {
        title: "Back up more often if the database is busy",
        detail:
          "A shop or a membership site can lose a whole day of orders or sign-ups with a daily schedule. On sites like that, back up the database several times a day. The files can stay daily.",
        check: "Your database schedule matches how often new orders, sign-ups or comments come in.",
      },
      {
        title: "Test a restore",
        detail:
          "Restore your latest copy onto a staging site and log in to it. A staging site is a private copy of your site, often on a subdomain such as staging.yourdomain.com. A backup that has never been restored is only a hope. The time to find a missing table or a broken archive is now, not on the day you need it.",
        check: "The staging site opens, you can log in, and your latest posts or orders are there.",
      },
    ],
    gotcha:
      "Keeping backups only on the same server, or inside public_html. A server failure or a hacked account takes the backups with it. A backup file in public_html can also be downloaded by anyone who guesses its name, and it contains your database passwords.",
    products: ["/site-management", "/wordpress-hosting"],
    related: ["restore-a-backup", "set-up-subdomain", "harden-wordpress-login"],
  },
  {
    slug: "fix-error-establishing-database-connection",
    published: "2026-10-26",
    title: "Fix “Error establishing a database connection”",
    summary:
      "Find out which of the four usual causes it is, checking the quickest ones first.",
    category: "Recovery",
    minutes: 25,
    intro:
      "This message means WordPress cannot reach its database, the store that holds all your posts, pages and settings. Your content is almost always still safe. It is like a shop whose key no longer fits the storeroom door: the stock is there, but nobody can get to it. There are four usual causes, and this guide checks them one by one, quickest first.",
    terms: ["wordpress", "database", "wp-config", "wp-admin", "cpanel", "file-manager", "public-html", "phpmyadmin", "wp-cli", "server", "cache"],
    done:
      "Your site opens normally in a private window, with no database error, and you can log in to the WordPress dashboard at yourdomain.com/wp-admin.",
    before: [
      "Access to cPanel through your Serverlys account (see the tutorial \"Log in to your Serverlys control panel\").",
      "A way to edit wp-config.php. File Manager in cPanel is enough.",
      "Optional: SSH, a way to type commands on the server from a terminal app. One check below uses it; everything else works without it.",
    ],
    steps: [
      {
        title: "Check /wp-admin as well as the homepage",
        detail:
          "Open yourdomain.com/wp-admin. If it says one or more database tables are unavailable and the database may need to be repaired, good news: WordPress did reach the database, but some tables are damaged. Skip to the step \"Turn on the repair page\". If /wp-admin shows the same connection error, the login details or the database server are the problem. Carry on with the next step.",
        where: ["yourdomain.com/wp-admin"],
        check: "You know which message you have: \"tables unavailable\" (go to the repair steps) or the same connection error (keep going).",
      },
      {
        title: "Open wp-config.php and find the four database lines",
        detail:
          "In cPanel, open File Manager, go into public_html (or the folder your site is in), select wp-config.php and click Edit. Before you change anything, use Download to keep a copy on your computer. Find the four lines below. They are the login details WordPress uses for its database: the database name, the database user, that user's password, and the database server (DB_HOST).",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "define( 'DB_NAME', 'cpuser_wp' );\ndefine( 'DB_USER', 'cpuser_wpuser' );\ndefine( 'DB_PASSWORD', '…' );\ndefine( 'DB_HOST', 'localhost' );",
        check: "You can see DB_NAME, DB_USER, DB_PASSWORD and DB_HOST, each with a value in quotes.",
      },
      {
        title: "Compare them with Manage My Databases",
        detail:
          "In a second tab, open Manage My Databases in cPanel. It lists your databases and your database users, and shows which users are added to which database. DB_NAME and DB_USER must match names on that page exactly, including the part before the underscore. After a move from another host, the usual causes are a wrong start of the name, or a user that was never added to the database.",
        where: ["cPanel", "Databases", "Manage My Databases"],
        check: "The database from DB_NAME is listed, and the user from DB_USER appears next to it as a privileged user.",
      },
      {
        title: "Add the user to the database if it is missing",
        detail:
          "If the user exists but is not added to the database, scroll down on Manage My Databases to Add User To Database. Choose the user and the database, click Add, then tick All Privileges and click Make Changes. Privileges are what the user is allowed to do in the database; WordPress needs all of them.",
        where: ["cPanel", "Databases", "Manage My Databases", "Add User To Database", "Add"],
        check: "Back on Manage My Databases, the user now appears next to the database.",
      },
      {
        title: "Set a new database password if you are unsure",
        detail:
          "cPanel cannot show you a database user's password, only change it. On Manage My Databases, under Current Users, click Change Password next to the user from DB_USER and set a new one. Copy it.",
        where: ["cPanel", "Databases", "Manage My Databases", "Current Users", "Change Password"],
        check: "cPanel confirms the password was changed, and you have the new one copied.",
      },
      {
        title: "Put the same password in wp-config.php and check DB_HOST",
        detail:
          "In the wp-config.php tab, paste the new password between the quotes on the DB_PASSWORD line, then click Save Changes. Look at DB_HOST too: on most cPanel servers it is localhost, which means \"this same server\". A site moved from another host may still carry that host's value. Reload your site.",
        where: ["File Manager", "wp-config.php", "Save Changes"],
        check: "The site loads, or the error changes. Either way you have ruled out a wrong password.",
      },
      {
        title: "Test the login details directly (SSH, optional)",
        detail:
          "If you use SSH, you can try the same details yourself. The first command asks for the password, then connects. \"Access denied\" means the user, password or privileges are wrong. \"Can't connect to the server\" means the database service itself is not answering. In that case there is nothing to fix in WordPress: send that exact message to your host. The second command, wp db check, uses the values already in wp-config.php.",
        code: "mysql -u cpuser_wpuser -p -h localhost cpuser_wp\n# or, using wp-config.php's own values:\nwp db check",
        check: "You get a database prompt or a success message (the details are right), or one of the two error messages above, which tells you which side the problem is on.",
      },
      {
        title: "Turn on the repair page",
        detail:
          "If WordPress said tables need repairing, open wp-config.php in File Manager again and add the line below on its own line, above the line that says \"That's all, stop editing!\". Click Save Changes.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        code: "define( 'WP_ALLOW_REPAIR', true );",
        check: "The file is saved with the new line in it.",
      },
      {
        title: "Run Repair Database",
        detail:
          "Open yourdomain.com/wp-admin/maint/repair.php and click Repair Database. WordPress checks every table and repairs the damaged ones. You can also do the same repair from cPanel: on Manage My Databases, under Modify Databases, choose the database under Repair Database.",
        where: ["yourdomain.com/wp-admin/maint/repair.php", "Repair Database"],
        shot: { id: "mysql-databases", caption: "The same repair from cPanel: Databases, then Manage My Databases, then Modify Databases, then choose the database under Repair Database." },
        check: "The page lists each table with the word OK, or says it was repaired.",
      },
      {
        title: "Remove the repair line straight away",
        detail:
          "Go back to wp-config.php, delete the WP_ALLOW_REPAIR line, and click Save Changes. The repair page works without any login, so leaving it switched on lets anyone use it.",
        where: ["cPanel", "Files", "File Manager", "public_html", "wp-config.php", "Edit"],
        check: "Opening yourdomain.com/wp-admin/maint/repair.php no longer shows the Repair Database button.",
      },
      {
        title: "Look for a resource limit if the error comes and goes",
        detail:
          "If the error appears only sometimes, especially when you have many visitors, your account may be hitting its limit on database connections or memory. The error log in cPanel shows when it happens. Caching your pages helps: when a saved copy of a page is shown, that visit does not need the database at all.",
        where: ["cPanel", "Metrics", "Errors"],
        check: "You can match the times in the error log to your busy periods, and with caching turned on the error stops appearing.",
      },
    ],
    gotcha:
      "Leaving WP_ALLOW_REPAIR in wp-config.php. The repair page does not ask for a login, so anyone who finds it can run repairs and optimisations on your database whenever they like. Delete the line the moment the repair is done.",
    products: ["/wordpress-hosting", "/site-management"],
    related: ["restore-a-backup", "move-wordpress-to-a-new-host", "reset-wordpress-password-phpmyadmin"],
  },
];
