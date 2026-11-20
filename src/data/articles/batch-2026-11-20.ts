/**
 * One article published 2026-11-20, written to catch a live news spike.
 *
 *   · wordpress-7-1-5-security-update
 *                         "WordPress 7.1.5", "WordPress 7.1.5 security
 *                         release", "WordPress security update November 2026",
 *                         "WordPress 7.2 release date", "WordPress 7.2 RC" —
 *                         7.1.5 shipped 2026-11-18 with 20 security fixes, one
 *                         unauthenticated and described as able to "lead to
 *                         remote code execution". Supports /wordpress-hosting
 *                         and /site-management. Follows on from
 *                         wordpress-7-1-3-update-and-wordpress-7-2 and links
 *                         to it.
 *
 * Every fact is from wordpress.org (checked 2026-11-20):
 *   wordpress.org/news/2026/11/wordpress-7-1-5-release/
 *   wordpress.org/news/2026/11/wordpress-7-2-release-candidate-1/
 *   make.wordpress.org/core/2026/11/17/preparing-for-jquery-4-with-wordpress-7-2/
 *   make.wordpress.org/core/2026/11/17/rest-api-changes-in-wordpress-7-2/
 *   make.wordpress.org/core/2026/11/11/the-secrets-api-in-wordpress-7-2/
 * Deliberately NOT stated, because they could not be confirmed: per-branch
 * backport version numbers, an RC2 date (sources disagree), any exploitation
 * in the wild, and any minimum-PHP change. Same editorial rules as
 * original.ts: no invented statistics or quotes. No Black Friday price is
 * quoted. No cover photo yet: falls back to the category thumbnail.
 */
import type { Article } from "./types";

export const batch20261120: readonly Article[] = [
  {
    slug: "wordpress-7-1-5-security-update",
    title: "WordPress 7.1.5 fixes 20 security issues: update now, then get ready for 7.2",
    seoTitle: "WordPress 7.1.5: 20 security fixes, update now",
    description:
      "WordPress 7.1.5 patches 20 security issues, including an unauthenticated flaw that could lead to remote code execution. What it fixes, how to check you have it, and what changes when 7.2 arrives on December 8.",
    category: "WordPress",
    published: "2026-11-20",
    body: [
      {
        type: "p",
        text: "On November 18, 2026, WordPress released **version 7.1.5**, a security release with **20 security fixes**. The [official announcement](https://wordpress.org/news/2026/11/wordpress-7-1-5-release/) asks site owners to update immediately, and this time that advice matters more than usual. One of the issues can be reached by a visitor who is not logged in, and WordPress says it \"could lead to remote code execution\", which means someone running their own code on your server.",
      },
      {
        type: "p",
        text: "It lands one day after the first release candidate of WordPress 7.2, which is due on December 8. This guide covers what 7.1.5 fixes, how to make sure your site actually has it, and what to check before 7.2 arrives.",
      },
      {
        type: "callout",
        title: "Do this first",
        text: "Open **Dashboard → Updates** on every WordPress site you run. If it shows anything older than 7.1.5, take a backup and click **Update Now**. Everything else in this article can wait until you have done that.",
      },
      { type: "h2", id: "whats-fixed", text: "What WordPress 7.1.5 fixes" },
      {
        type: "p",
        text: "The release notes list 20 items. Eighteen are vulnerabilities and two are hardening changes. Sorting them by **who can trigger them** shows what is urgent, because a flaw any visitor can reach is far more dangerous than one that needs an administrator's password.",
      },
      { type: "h3", text: "Anyone on the internet (no login needed)" },
      {
        type: "ul",
        items: [
          "**Privilege escalation through Template Part block attributes**, which WordPress says could lead to remote code execution. This is the headline fix.",
          "**Stored cross-site scripting (XSS) through shortcode attributes in comments.** Any site with open comments is exposed.",
          "**Denial of service through batched XML-RPC pingbacks**, which could be used to overload a server.",
          "**Disclosure of private taxonomy terms** through the REST API search.",
        ],
      },
      { type: "h3", text: "Logged-in users with low-level roles" },
      {
        type: "ul",
        items: [
          "**Subscriber and above:** information disclosure through XML-RPC `wp.getComments`.",
          "**Contributor and above:** three stored XSS issues, through oEmbed provider responses, the Comment Date block's date format, and media filenames when a media block is converted to a File block.",
          "**Author and above:** disclosure of users' email addresses through the REST comments endpoint, and an authorization bypass when editing comments in the admin.",
          "**Editor and above:** information disclosure through post and template author assignment in the REST API.",
        ],
      },
      { type: "h3", text: "Administrators and other issues" },
      {
        type: "ul",
        items: [
          "**Stored XSS through Customizer previews**, and on Multisite networks, a way for a site Administrator to take over a Super Admin account through Customizer menu previews.",
          "**Two SQL injection issues**, one in `WP_Meta_Query` through nested relation values and one through the front page setting in Customizer changeset previews.",
          "**Three further XSS issues**: in the legacy media library popup, in `wp_interactivity_data_wp_context()`, and in the block editor through Openverse image metadata.",
          "**Two hardening changes**: a stricter match for JSON media types and removal of the Imgur embed variation.",
        ],
      },
      {
        type: "p",
        text: "WordPress has not said that any of these is being exploited, and the full technical details are not public yet. That is normal for a coordinated security release, and it is exactly why the window right after release is the one to act in: once a fix is public, attackers can study it to work out what it was fixing.",
      },
      {
        type: "callout",
        title: "Open user registration? Read this twice",
        text: "Many of these issues need only a Subscriber, Contributor or Author account. If your site lets anyone register, as membership sites, forums, learning platforms and many WooCommerce stores do, those roles are open to strangers. Update first, then review who holds which role. Our guide on [who has access to your website](/blog/who-has-access-to-your-website) shows how.",
      },
      { type: "h2", id: "older-versions", text: "Running an older version of WordPress?" },
      {
        type: "p",
        text: "WordPress says the fixes are being **backported to every branch that still receives security updates, currently back to 4.7**, and that those backports ship as they become ready. So a site on an older major version can still get patched without a major upgrade.",
      },
      {
        type: "p",
        text: "Treat that as a safety net, not a plan. Only the latest version is actively supported. If a site is stuck on an old version because a plugin or theme breaks on newer ones, that plugin or theme is the real risk. Replace it, or have the site moved to a current, supported setup.",
      },
      { type: "h2", id: "check-your-site", text: "How to check your site is updated" },
      {
        type: "p",
        text: "WordPress says sites that support automatic background updates will start updating on their own. That covers most sites. It does not cover all of them, because hosts, security plugins and a single line in `wp-config.php` can turn automatic updates off. Check rather than assume:",
      },
      {
        type: "ol",
        items: [
          "**Take a backup** if your site has not been backed up in the last day. Our [backup tutorial](/blog/website-backup-tutorial) covers the options.",
          "Open **Dashboard → Updates**. The top of the page shows your version. Anything older than 7.1.5 on the 7.1 branch needs updating, so click **Update Now**.",
          "Look in `wp-config.php` for `AUTOMATIC_UPDATER_DISABLED` set to `true` or `WP_AUTO_UPDATE_CORE` set to `false`. Either one stops security releases installing on their own.",
          "If you manage several sites, `wp core version` in WP-CLI tells you the version in seconds and `wp core update` applies the update.",
          "**Update plugins and themes too**, and delete any you no longer use. Most WordPress break-ins start with an out-of-date plugin, not with WordPress itself.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        code: "# Check and update WordPress core with WP-CLI\nwp core version\nwp core update\nwp core verify-checksums",
      },
      {
        type: "p",
        text: "`wp core verify-checksums` compares your core files with the official copies, which is a quick way to spot files someone has tampered with. If it reports changes you did not make, or the site behaves strangely after the update, follow our [hacked website recovery guide](/blog/website-hacked-recovery).",
      },
      { type: "h2", id: "wordpress-7-2", text: "WordPress 7.2 arrives on December 8" },
      {
        type: "p",
        text: "The first release candidate of WordPress 7.2 came out on November 17, and the [RC1 announcement](https://wordpress.org/news/2026/11/wordpress-7-2-release-candidate-1/) puts the final release on **December 8, 2026**. A release candidate means the features are frozen, so what is in RC1 is what will ship. The highlights:",
      },
      {
        type: "ul",
        items: [
          "**Ipsum, a new default theme.**",
          "**More Gallery block controls**, plus new Global Styles and typography tools.",
          "**Canvas Notes** and a DataForm-based settings inspector for blocks in the editor.",
          "**Faster media uploads** and redrawn SVG admin icons.",
          "**An \"On This Day\" dashboard widget** and random post discovery.",
          "**Accessibility, security and PHP 8.6 compatibility improvements.**",
        ],
      },
      { type: "h3", text: "Changes from what was announced earlier" },
      {
        type: "p",
        text: "If you read our [earlier WordPress 7.2 preview](/blog/wordpress-7-1-3-update-and-wordpress-7-2), two plans have changed since:",
      },
      {
        type: "table",
        head: ["Item", "Earlier plan", "Now"],
        rows: [
          ["Secrets API", "Tentatively in 7.2, through WP-CLI only", "No longer shipping with 7.2, per the developer note updated November 17"],
          ["jQuery 4", "Preparation under way", "Not in 7.2. It ships jQuery Migrate 3.6.0 to prepare, and jQuery 4 itself is tentatively planned for 7.3"],
        ],
      },
      { type: "h3", text: "What your developer should check" },
      {
        type: "p",
        text: "According to the [REST API developer note](https://make.wordpress.org/core/2026/11/17/rest-api-changes-in-wordpress-7-2/), 7.2 makes three REST API changes, and two of them change data that existing code may rely on:",
      },
      {
        type: "ul",
        items: [
          "**Revision and autosave responses only include revisioned meta.** Code that reads other meta from those responses will get less than before.",
          "**The comments endpoint `status` parameter is now an array.** Code that compares it to a single string needs updating.",
          "**A new `rest_allowed_cors_methods` filter.** The default behaviour does not change.",
        ],
      },
      {
        type: "p",
        text: "These mostly affect custom plugins, headless sites and apps that talk to WordPress through its API. A typical brochure site or WooCommerce store using well-maintained plugins will not notice them, but it is worth asking whoever built your site.",
      },
      { type: "h2", id: "test-safely", text: "How to test 7.2 without risking your live site" },
      {
        type: "ol",
        items: [
          "**Make a staging copy** of your site. Our guide to [setting up a WordPress staging site](/blog/wordpress-staging-site) walks through it.",
          "Install the **WordPress Beta Tester** plugin on the copy and switch it to the release candidate channel.",
          "Click through every page that earns you money: home page, service and product pages, contact form, booking, basket and checkout.",
          "Open the editor and edit a page using the blocks you actually use, especially Gallery.",
          "Report anything that breaks to the plugin or theme author now, while there is still time before December 8.",
        ],
      },
      {
        type: "quote",
        text: "Security releases cannot wait for a quiet week. Major releases can wait until you have tested them.",
      },
      { type: "h2", id: "faq", text: "Frequently asked questions" },
      { type: "h3", text: "Is WordPress 7.1.5 safe to install right away?" },
      {
        type: "p",
        text: "Yes. It is a security release on the current 7.1 branch, not a new major version, so it fixes problems without adding features. WordPress recommends installing it immediately. Take a backup first as a matter of habit.",
      },
      { type: "h3", text: "Will my site update to 7.1.5 automatically?" },
      {
        type: "p",
        text: "If automatic background updates are enabled, which is the default, yes. Your host, a security plugin or a setting in `wp-config.php` may have turned them off, so confirm the version on **Dashboard → Updates** instead of assuming.",
      },
      { type: "h3", text: "Should I install WordPress 7.2 on December 8?" },
      {
        type: "p",
        text: "Install it once your staging copy passes. Many owners wait a few days for the first 7.2.x maintenance release. That is reasonable for a major version, but never a reason to skip security releases on the version you are running.",
      },
      { type: "h3", text: "Was my site hacked through one of these flaws?" },
      {
        type: "p",
        text: "WordPress has not reported attacks using them. Warning signs of a compromise include unknown admin users, unfamiliar plugins, spam pages showing in Google, or redirects you did not set up. If you see any of these, read our guide to [what to do when your website is hacked](/blog/website-hacked-recovery).",
      },
      { type: "h2", id: "how-we-help", text: "Where Serverlys can help" },
      {
        type: "p",
        text: "If you would rather not watch WordPress release notes at all, this is what our WordPress plans are for:",
      },
      {
        type: "table",
        head: ["If you need…", "Start with", "From"],
        rows: [
          [
            "Hosting with free SSL and daily backups, so an update is never a risk",
            "[WordPress hosting](/wordpress-hosting)",
            "$7.95/mo, renews at $7.95/mo",
          ],
          [
            "Someone to apply WordPress, plugin and theme updates for you every month, with daily backups and uptime alerts",
            "[ServerCare Essential](/site-management)",
            "$149.95/mo",
          ],
          [
            "A site stuck on an old WordPress version moved to a current, supported setup",
            "[Free migration](/migrations)",
            "Free with hosting",
          ],
        ],
      },
      {
        type: "callout",
        title: "The short version",
        text: "WordPress 7.1.5 fixes 20 security issues, including an unauthenticated one that could lead to remote code execution. Back up, update to 7.1.5 today, and update your plugins while you are there. Then test WordPress 7.2 on a staging copy before it ships on December 8.",
      },
    ],
  },
];
