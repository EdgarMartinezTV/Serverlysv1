/**
 * Second article published 2026-11-25.
 *
 *   · php-8-2-end-of-life-update-php-version
 *                         "php 8.2 end of life", "how to check php version
 *                         cpanel", "how to update php version wordpress",
 *                         "multiphp manager", "select php version cpanel".
 *                         Timely: PHP 8.2 security support ends 2026-12-31.
 *                         No existing post covers PHP versions; links out to
 *                         staging, backup, white-screen and maintenance posts
 *                         instead of repeating them.
 *
 * PHP dates: php.net supported-versions as cited by several sources
 * (2026-11-25): 8.1 ended 2025-12-31, 8.2 ends 2026-12-31, 8.3 2027-12-31,
 * 8.4 2028-12-31, 8.5 2029-12-31. 8.6 status deliberately NOT stated (not
 * confirmed), hence "8.3 or newer" and a link to php.net for the live table.
 * cPanel tool names checked on the Serverlys cPanel server over SSH the same
 * day: CloudLinux selectorctl ("Select PHP Version", alt-php 4.4–8.6) and
 * EasyApache ea-php 5.4–8.5 ("MultiPHP Manager") are both present, so the
 * post names both. Matches /shared-hosting ("Choosing your PHP version from
 * the supported list" = You) and /managed-hosting ("PHP version changes" on
 * request). No invented stats, no named competitor, no price. No cover yet.
 */
import type { Article } from "./types";

export const batch20261125b: readonly Article[] = [
  {
    slug: "php-8-2-end-of-life-update-php-version",
    title: "PHP 8.2 reaches end of life on December 31, 2026: how to check and update your PHP version",
    seoTitle: "PHP 8.2 end of life: how to update your PHP version",
    description:
      "PHP 8.2 stops getting security fixes on December 31, 2026. Here is how to find out which PHP version your website runs, how to switch it safely in cPanel, and what to do if something breaks after the update.",
    category: "Hosting",
    published: "2026-11-25",
    body: [
      {
        type: "p",
        text: "Most websites built with WordPress, WooCommerce, Joomla or a hand-written contact form run on **PHP**, the programming language that turns your site's files into the pages visitors see. Like any software, each version of PHP is only looked after for a few years. When a version reaches **end of life**, no more security fixes are released for it, ever.",
      },
      {
        type: "p",
        text: "The next version to reach that point is **PHP 8.2, on December 31, 2026**. If your website still runs on 8.2 or anything older, now is a good time to move it forward, on your own schedule rather than in a hurry after a problem.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "Check your PHP version in cPanel or in WordPress under **Tools → Site Health → Info → Server**. If it says **8.2 or lower**, take a backup, update your plugins and theme, then switch to **PHP 8.3 or newer**. Test the site straight after. If something breaks, switch back in one click and fix the plugin that caused it.",
      },
      { type: "h2", id: "what-end-of-life-means", text: "What \"end of life\" actually means" },
      {
        type: "p",
        text: "Your website does not stop working on January 1. PHP 8.2 will keep running exactly as it does today. What changes is that when a new security flaw is found in PHP 8.2, **nobody will fix it**. Over time, an unsupported version builds up known holes that attackers can look up and try against every site still running it.",
      },
      {
        type: "p",
        text: "There is a second, slower effect: plugin and theme developers stop testing on old PHP versions, and eventually new releases simply require a newer one. Sites stuck on old PHP end up stuck on old plugins too, which is its own security problem.",
      },
      {
        type: "table",
        head: ["PHP version", "Security fixes until", "Status in late 2026"],
        rows: [
          ["8.1 and older", "Ended (8.1 on December 31, 2025)", "Unsupported. Move off as soon as you can."],
          ["8.2", "December 31, 2026", "Last weeks of support. Plan the update now."],
          ["8.3", "December 31, 2027", "Supported (security fixes only)."],
          ["8.4", "December 31, 2028", "Supported."],
          ["8.5", "December 31, 2029", "Supported."],
        ],
      },
      {
        type: "p",
        text: "The official, always-current table is on [php.net's supported versions page](https://www.php.net/supported-versions.php).",
      },
      { type: "h2", id: "check-your-version", text: "How to check which PHP version your site runs" },
      { type: "h3", text: "In WordPress" },
      {
        type: "ol",
        items: [
          "Log in to your WordPress dashboard.",
          "Go to **Tools → Site Health**, then open the **Info** tab.",
          "Expand the **Server** section. The line **PHP version** shows the number, for example 8.2.29.",
        ],
      },
      {
        type: "p",
        text: "The **Status** tab of Site Health also shows a warning when WordPress thinks your PHP version is out of date.",
      },
      { type: "h3", text: "In cPanel" },
      {
        type: "p",
        text: "Log in to cPanel and search for **PHP** in the search box at the top. Depending on how the server is set up, you will see one or both of these tools:",
      },
      {
        type: "ul",
        items: [
          "**MultiPHP Manager** lists every domain on your account with the PHP version each one uses.",
          "**Select PHP Version** shows the current version for your account and lets you turn PHP extensions on or off.",
        ],
      },
      { type: "h3", text: "For any website, with a tiny test file" },
      {
        type: "p",
        text: "If your site is not WordPress, create a file called `version.php` in your website's main folder (usually `public_html`) using cPanel's **File Manager**, with this one line inside:",
      },
      { type: "code", lang: "php", code: "<?php echo PHP_VERSION;" },
      {
        type: "p",
        text: "Open `yourdomain.com/version.php` in your browser and it prints the version number. **Delete the file afterwards.** There is no reason to leave server details lying around for anyone to read.",
      },
      { type: "h2", id: "before-you-switch", text: "Before you switch: four things to do" },
      {
        type: "ol",
        items: [
          "**Take a full backup** of files and database, and download it. Our [website backup tutorial](/blog/website-backup-tutorial) shows how in cPanel.",
          "**Update everything first**: WordPress itself, every plugin and your theme. Most PHP update problems are an old plugin that its developer already fixed months ago.",
          "**Remove plugins you do not use.** A deactivated plugin is usually harmless, but an abandoned one with no updates in years is the most likely thing to break on newer PHP. Deleting it is the simplest fix.",
          "**Test on a copy if the site earns money.** For an online store or booking site, try the new PHP version on a [staging site](/blog/wordpress-staging-site) first, so customers never see a broken page.",
        ],
      },
      { type: "h2", id: "how-to-switch", text: "How to switch PHP version in cPanel" },
      { type: "h3", text: "With MultiPHP Manager" },
      {
        type: "ol",
        items: [
          "In cPanel, open **MultiPHP Manager** (in the **Software** section).",
          "Tick the box next to the domain you want to change.",
          "Pick the new version, for example **PHP 8.3**, from the drop-down at the top right, then click **Apply**.",
        ],
      },
      { type: "h3", text: "With Select PHP Version" },
      {
        type: "ol",
        items: [
          "In cPanel, open **Select PHP Version** (also in the **Software** section).",
          "Click the current version number and choose the new one from the list.",
          "Open the **Extensions** tab and check that the extensions your site needs are still ticked. Most sites are fine with the defaults.",
        ],
      },
      {
        type: "p",
        text: "The change takes effect within a few seconds. Nothing is uploaded or deleted: your files and database stay exactly as they were, which is also why switching back is just as quick.",
      },
      { type: "h2", id: "test-afterwards", text: "What to test straight after" },
      {
        type: "ul",
        items: [
          "**The home page and a few inner pages**, opened in a private browser window so you are not looking at a cached copy.",
          "**Your contact form**: send yourself a test message and check it arrives.",
          "**Logging in** to the WordPress dashboard or your site's admin area.",
          "**Checkout or booking**, if you have them: run one test order or appointment from start to finish.",
          "**Site Health** again, to confirm the new version number and look for new warnings.",
        ],
      },
      { type: "h2", id: "if-something-breaks", text: "If something breaks" },
      {
        type: "p",
        text: "A blank white page, a \"critical error on this website\" message or a missing section usually means one plugin or theme is not ready for the newer PHP. The fix is calm and quick:",
      },
      {
        type: "ol",
        items: [
          "**Switch back to the previous PHP version** in the same cPanel tool. The site should return within seconds.",
          "**Find the plugin responsible.** WordPress often emails the site's admin address with the name of the plugin that caused the error. If not, our guide to the [WordPress white screen](/blog/wordpress-white-screen-death) shows how to find it.",
          "**Update, replace or remove that plugin**, then try the new PHP version again.",
        ],
      },
      {
        type: "callout",
        title: "Do not stay on the old version \"for now\" forever",
        text: "Switching back is fine for a day while you sort out a plugin. Leaving a site on an unsupported PHP version for months is how small, fixable problems turn into a [hacked website](/blog/website-hacked-recovery).",
      },
      { type: "h2", id: "serverlys", text: "How it works at Serverlys" },
      {
        type: "ul",
        items: [
          "**On shared and WordPress hosting, you choose your PHP version** from the supported list in cPanel, using either of the tools above. You can change it whenever you like and change it back just as easily.",
          "**On managed hosting, just ask.** PHP version changes are part of what we do on request: open a ticket and we will switch it, check the site and tell you if any plugin needs attention.",
          "**Either way, our support team can help.** If you are not sure which version to pick, or a plugin breaks after the switch, open a ticket from your client area.",
        ],
      },
      {
        type: "p",
        text: "If you want PHP updates to stop being a yearly chore, add them to a regular [WordPress maintenance routine](/blog/wordpress-maintenance-routine): check the PHP version every few months, right alongside plugin updates and backups.",
      },
      { type: "h2", id: "faq", text: "Common questions" },
      { type: "h3", text: "Will my website stop working on January 1, 2027?" },
      {
        type: "p",
        text: "No. PHP 8.2 keeps running after its end-of-life date. It just stops receiving security fixes, so the risk grows the longer you stay on it.",
      },
      { type: "h3", text: "Should I jump straight to the newest PHP version?" },
      {
        type: "p",
        text: "Not necessarily. The newest version gives you the longest support, but some plugins take a few months to catch up with a new release. For most sites, a version one step behind the newest is a sensible balance between support time and compatibility. Anything **8.3 or newer** is supported through at least the end of 2027.",
      },
      { type: "h3", text: "Will a newer PHP version make my site faster?" },
      {
        type: "p",
        text: "Often a little, because each PHP release brings performance work. Do not expect a miracle, though. Caching and image size usually matter far more. See [how to speed up WordPress](/blog/speed-up-wordpress).",
      },
      { type: "h3", text: "Can changing the PHP version delete my website?" },
      {
        type: "p",
        text: "No. Changing the version only changes which PHP program reads your files. Your files, database and email are not touched. You should still take a backup first, because it is the safety net for everything else on this list.",
      },
    ],
  },
];
