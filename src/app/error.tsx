"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { billing, company } from "@/data/company";

/**
 * Route-level error boundary.
 *
 * ⚠ THIS FILE DID NOT EXIST, AND ITS ABSENCE WAS THE ONLY REAL DEFECT THE SEO
 * AUDIT FOUND IN THE ERROR-HANDLING LAYER. Without it, an unhandled render
 * error anywhere under the root layout fell through to Next's built-in page —
 * unstyled, no header, no navigation, and on the client the bare string
 * "Application error: a client-side exception has occurred." On a site selling
 * hosting that is the worst possible page to show: it looks like the hosting is
 * what broke.
 *
 * ── WHY IT MATTERS FOR SEARCH, NOT JUST FOR USERS ───────────────────────────
 *
 * A visitor who lands on an unstyled dead end leaves immediately, and the one
 * signal Google reads from that is a very short visit to a page it fetched
 * successfully. There is no markup on the default page that says "this is an
 * error" — no heading, no status copy, nothing — so it reads as a thin page
 * rather than as a failure. This page is the fix for that: it says plainly what
 * happened, it offers the way back, and it is `noindex` at the HTTP level via
 * the 500 status Next already sends for server errors.
 *
 * ⚠ IT DELIBERATELY REUSES THE 404's SHAPE. Centred column, one primary action,
 * one quiet secondary, the same type scale and tokens. A visitor who hits both
 * in one session should recognise the second as the same site being honest
 * twice, not as two different failure screens. No new design vocabulary.
 *
 * ⚠ NO `metadata` EXPORT IS POSSIBLE HERE. `error.tsx` is a client component by
 * requirement — it takes `reset` — and client components cannot export
 * metadata. The page therefore inherits the title of whatever route failed,
 * which is imperfect and unavoidable. It does NOT need a robots directive: the
 * 500 status is what keeps it out of the index, and a 500 is never indexed.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /*
     * ⚠ THE DIGEST, NOT THE MESSAGE. Next replaces server-error messages with
     * an opaque `digest` in production precisely so stack contents never reach
     * a browser, and logging `error.message` here would either be that same
     * placeholder or — for a client-side error — real internals in a console a
     * visitor can read. The digest is the value that correlates to the full
     * error in the server log, which is where the detail belongs.
     */
    console.error("[serverlys] route error", { digest: error.digest });
  }, [error]);

  return (
    <section className="bg-canvas pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-36">
      <Container>
        <div className="mx-auto max-w-[680px] text-center">
          <p className="font-mono text-caption uppercase text-primary">Error</p>

          <h1 className="mt-5 text-h1 text-fg">Something went wrong on our side</h1>

          {/*
            ⚠ "OUR SIDE" IS LOAD-BEARING COPY. The single most likely reader of
            this page is an existing customer, and their first thought is that
            their own site or account has broken. Saying whose fault it is, in
            the first sentence, is the whole job of the paragraph.
          */}
          <p className="mx-auto mt-6 max-w-[54ch] text-body-lg text-fg-secondary">
            This page failed to load. It is a fault on {company.name}, not with your
            site, your account or anything you did. Your services are unaffected.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {/*
              `reset` re-renders the failed segment without a full navigation,
              which recovers a transient failure — a dropped fetch, a hydration
              race — without losing the visitor's place. It is the primary
              action because it is the one that most often works.
            */}
            <Button onClick={reset} size="lg">
              Try again
            </Button>
            <Button href="/" variant="ghost" size="lg">
              Back to home
            </Button>
          </div>

          {/*
            A real contact route, because "try again" will not fix a persistent
            fault and the visitor should not have to hunt for support from a
            broken page. Both values come from `data/company.ts` — the same
            source the footer and the support page read.
          */}
          <p className="mt-8 text-small text-fg-secondary">
            If it keeps happening, email{" "}
            <a
              href={`mailto:${company.email}`}
              className="font-medium text-primary underline underline-offset-4"
            >
              {company.email}
            </a>{" "}
            or call{" "}
            <a
              href={company.phoneHref}
              className="font-medium text-primary underline underline-offset-4"
            >
              {company.phone}
            </a>
            . Account and billing are at{" "}
            <a
              href={billing.login}
              className="font-medium text-primary underline underline-offset-4"
            >
              the client area
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
