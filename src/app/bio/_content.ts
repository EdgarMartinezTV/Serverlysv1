/**
 * /bio copy. Every capability named here exists in the bio app today
 * (bio/src/lib/bio/catalog.ts lists the 30 block types). Two things are
 * stated as limits on purpose, because a free product that over-promises is
 * worse than one that says what it doesn't do:
 *   · no built-in payments — product cards link to the owner's own checkout;
 *   · analytics are first-party and cookieless, so there is no ad-pixel
 *     integration.
 */

export const FAQS = [
  {
    question: "Is Serverlys Bio really free?",
    answer:
      "Yes — completely. There is no Pro plan, no trial, no upgrade screen and no card, ever. Every feature — all 45 templates, the editor, full analytics, lead forms, QR codes, removing our branding and connecting your own domain — is free for everyone, with no feature held back.",
  },
  {
    question: "How does Serverlys make money from a free product?",
    answer:
      "Serverlys sells hosting, domains, websites and business software. Serverlys Bio is a free product that introduces people to us; when a business outgrows a one-page bio, we'd like to be the ones who build the next thing. Your page carries a small “Made with Serverlys Bio” line, which you can switch off.",
  },
  {
    question: "What's the address of my page?",
    answer:
      "bio.serverlys.com/your-username. You choose the username when you publish and can change it later; the old address keeps redirecting to your page for 90 days.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes, at no cost. Add the domain in your dashboard, create the two DNS records we show you (a TXT record to prove ownership and a CNAME), and once it's verified, your page is served on your domain.",
  },
  {
    question: "Can I sell products?",
    answer:
      "You can showcase products and services with prices, images and badges, and link each one to the checkout you already use. Serverlys Bio doesn't process payments itself.",
  },
  {
    question: "What do the analytics count?",
    answer:
      "Page views, unique visitors per day, and clicks on every link and button, plus traffic sources, devices and countries where available. Known bots are excluded, no cookies are set on your visitors, and IP addresses are never stored.",
  },
  {
    question: "Do my edits go live immediately?",
    answer:
      "Edits save to a draft automatically. Visitors see the last version you published until you click Publish again, so you can work on changes without breaking your live page.",
  },
  {
    question: "Can I have more than one page?",
    answer:
      "Yes — as many as you need, each with its own username, design, analytics and leads. There's no per-page charge and no plan to upgrade.",
  },
] as const;
