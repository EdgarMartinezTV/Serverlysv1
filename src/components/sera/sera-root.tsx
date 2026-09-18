"use client";

import { SeraProvider } from "./sera-provider";
import { SeraWidget } from "./sera-widget";

/**
 * The one thing the root layout mounts.
 *
 *     <SeraRoot>            ← this file
 *       <SeraProvider>      ← conversation state, no DOM of its own
 *         {children}        ← the entire existing site, untouched
 *         <SeraWidget />    ← launcher now, panel on first open
 *       </SeraProvider>
 *     </SeraRoot>
 *
 * ONE MOUNT, SITE-WIDE. No page component knows Sera exists and none needs to
 * be edited to get it — adding the assistant to a new route is not a task.
 *
 * ⚠ IT RENDERS NO ELEMENT OF ITS OWN, and that is load-bearing rather than
 * tidy. The root layout's `<body>` is `flex min-h-full flex-col`, and its
 * direct children — the announcement bar, the header, `<main class="flex-1">`
 * and the footer — are flex items whose sizing depends on being exactly that.
 * A wrapper `<div>` here would become a single flex item containing all of
 * them, and `flex-1` on `<main>` would stop pushing the footer down: every page
 * on the site would lose its sticky footer. Providers and context carry no
 * markup, so this composition is invisible to layout.
 *
 * `children` stays a prop rather than an import, so the pages inside remain
 * SERVER components. Putting `"use client"` above a layout would otherwise drag
 * the whole tree into the client bundle — which for a marketing site built on
 * static prerendering would be the most expensive possible way to add a chat
 * widget.
 */
export function SeraRoot({ children }: { children: React.ReactNode }) {
  return (
    <SeraProvider>
      {children}
      <SeraWidget />
    </SeraProvider>
  );
}
