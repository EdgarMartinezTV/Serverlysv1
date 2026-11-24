import type { FaqItem } from "@/components/ref/faqs";

/**
 * /daily-backups — copy.
 *
 * LAYOUT is /free-ssl's (itself rebuilt from hostinger.com/free-ssl-certificate),
 * at Edgar's request 2026-11-24: "build the daily backups page just like we did
 * with this one". The reference has no backups page of its own, so the two
 * header feature pages share one layout: dark hero → three plan cards →
 * split on the tinted surface → four alternating reasons → three numbered
 * cards → FAQ.
 *
 * FACTS this page relies on (keep them true):
 *   · Hosting runs on cPanel with JetBackup 5 (the cPanel plugin is installed
 *     on the hosting server: frontend/jupiter/jetbackup5, checked 2026-11-24).
 *     JetBackup lets the account owner restore files, databases and email
 *     themselves from cPanel.
 *   · Backups are daily and restores cost nothing (the site's standing claim;
 *     legal-information: "daily backups and backup restores are included on
 *     hosting plans at no additional charge").
 * Deliberately NOT claimed until confirmed: a retention period (how many days
 * are kept), where the copies are stored, or an off-site/geo-redundant copy.
 * The privacy policy only says "on the retention cycle of your plan".
 * The terms ask customers to keep their own copy too, so the FAQ says so.
 */

export const HERO = {
  title: "Daily backups that bring your site back in a few clicks",
  lede: "Every night we take a full copy of your website, databases and email. If an update breaks something or a file goes missing, restore it yourself from cPanel, or ask us. Restores are always free.",
  cta: "Start now",
} as const;

export const PLANS_HEAD = {
  title: "Hosting with daily backups included",
  description: "Every plan is backed up automatically every day, and every restore is free.",
  cta: "Choose plan",
  upfront:
    "Plans paid for longer terms are charged upfront. The monthly rate shown is the total plan price divided by the number of months.",
} as const;

export const WHY: Record<string, string> = {
  turbo: "The most headroom for the price. A good long-term home for a growing site.",
};

export const SPLIT = {
  title: "What a Serverlys backup includes",
  paragraphs: [
    "Each daily backup is a complete copy of your hosting account: your website files, every database behind them, and your email, so a restore brings back the whole site rather than just part of it.",
    "Backups run automatically overnight. There is nothing to switch on, no plugin to install and nothing to schedule, and they do not slow your site down during the day.",
    "You choose what to bring back. Restore a single file, one database or one mailbox from a particular day, or roll the whole account back to how it was.",
    "Restores are included on every plan at no extra charge, whether you do it yourself or ask our support team to do it for you.",
  ],
} as const;

export const WHY_HEAD = { title: "Why does your site need daily backups?" } as const;

export const REASONS = [
  {
    id: "hacked",
    title: "Recover from a hack or malware",
    body: "If your site is ever compromised, a clean copy from before the problem started is the fastest way back. Restore it, change your passwords, and you are online again without rebuilding anything.",
  },
  {
    id: "update",
    title: "Undo an update that went wrong",
    body: "A plugin, theme or WordPress update can break a page or take the whole site down. Roll back to yesterday's copy in a few clicks, then update again when the fix is out.",
  },
  {
    id: "deleted",
    title: "Get back what was deleted by mistake",
    body: "A page removed by accident, an overwritten file, a mailbox emptied too eagerly. Pick the day before it happened and restore just that item, leaving everything else as it is.",
  },
  {
    id: "calm",
    title: "Change things without worrying",
    body: "Redesign a page, try a new plugin or tidy up old files knowing there is a copy from last night. Backups are what make it safe to keep improving your site.",
  },
] as const;

export const HOW = {
  title: "How daily backups work",
  steps: [
    {
      title: "A copy every night",
      body: "Once a day, automatically, your whole account is backed up: files, databases and email. It runs overnight, when your site is quietest.",
    },
    {
      title: "Kept apart from your site",
      body: "The copies are kept separately from your website's own files, so a broken update, a deleted folder or a compromised site does not reach the backups themselves.",
    },
    {
      title: "Restore in a few clicks",
      body: "Open cPanel, go to the backups section, choose a date and pick what to restore: the whole account, a file, a database or a mailbox. Prefer not to? Our support team will do it for free.",
    },
  ],
} as const;

export const FAQ_HEAD = {
  title: "Daily backup FAQs",
  description: "Answers to the most common questions about backups and restores.",
} as const;

export const FAQS: readonly FaqItem[] = [
  {
    q: "What is a website backup?",
    a: [
      { type: "p", runs: [{ text: "A backup is a copy of your website taken at a point in time: the files that make up the site, the databases that hold its content, and your email. If something goes wrong later, you can restore the copy and put the site back exactly as it was on that day." }] },
    ],
  },
  {
    q: "How often are backups taken?",
    a: [
      { type: "p", runs: [{ text: "Every day, automatically, on every Serverlys hosting plan. You do not need to switch anything on." }] },
    ],
  },
  {
    q: "What is included in a backup?",
    a: [
      {
        type: "ul",
        items: [
          "Website files, including WordPress core, themes, plugins and uploads.",
          "Databases, such as the WordPress database that holds your pages, posts and orders.",
          "Email accounts and the messages in them.",
        ],
      },
    ],
  },
  {
    q: "How do I restore my website from a backup?",
    a: [
      { type: "p", runs: [{ text: "Log in to cPanel and open the backups section. Choose the date you want to go back to, then pick what to restore: the full account, individual files or folders, a database, or a mailbox. If you would rather not do it yourself, " }, { text: "contact support", href: "/support" }, { text: " and we will restore it for you." }] },
    ],
  },
  {
    q: "Can I restore a single file or database instead of the whole site?",
    a: [
      { type: "p", runs: [{ text: "Yes. You can restore one file, one folder, one database or one mailbox from any available day, and leave everything else exactly as it is now." }] },
    ],
  },
  {
    q: "Does restoring a backup cost anything?",
    a: [
      { type: "p", runs: [{ text: "No. Daily backups and restores are included on every hosting plan at no extra charge, including restores our support team does for you." }] },
    ],
  },
  {
    q: "Do backups slow down my website?",
    a: [
      { type: "p", runs: [{ text: "No. Backups run automatically overnight, when traffic is lowest, so your visitors will not notice them." }] },
    ],
  },
  {
    q: "Should I still keep my own backups?",
    a: [
      { type: "p", runs: [{ text: "We recommend it. Our backups are there for when something goes wrong, but for anything you cannot afford to lose, keeping your own copy as well is good practice. " }, { text: "Ask support", href: "/support" }, { text: " if you need a copy of your site to keep." }] },
    ],
  },
  {
    q: "What happens to my backups if I move my site to Serverlys?",
    a: [
      { type: "p", runs: [{ text: "Daily backups start automatically from your first day with us. Our " }, { text: "free migration", href: "/migrations" }, { text: " moves your site across, and from then on it is backed up every night like every other site we host." }] },
    ],
  },
  {
    q: "Are backups included on every plan?",
    a: [
      { type: "p", runs: [{ text: "Yes. Every Serverlys hosting plan includes daily backups and free restores, along with " }, { text: "free SSL", href: "/free-ssl" }, { text: " and free migration." }] },
    ],
  },
];
