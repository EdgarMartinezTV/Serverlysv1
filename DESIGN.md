# Serverlys design system

The contract every page follows. If something here is wrong, change it here —
not locally in a component.

## Decisions already made (do not silently reverse)

| Decision | Value | Why |
|---|---|---|
| Deploy target | Node runtime on Easypanel | Full Next.js; see DEPLOY.md |
| SEO positioning | Global brand, **no local/Miami targeting** | One unambiguous entity |
| Schema | Plain `Organization`, one `@id` graph | No address/geo/LocalBusiness |
| Canvas | Light, with deliberate dark **bands** | Dark mode is NOT shipped in v1 |
| Renewal pricing | Always rendered beside the promo price | Core commercial position |

## Tokens

All in `src/app/globals.css` under `@theme`. **No arbitrary values in
components.** If a value is needed twice, it becomes a token.

- **Brand** `brand-50…950`, anchored on `#227eff` (the existing Serverlys blue).
  `brand-600` is the interactive step and the lightest that clears 4.5:1 on white.
- **Ink** `ink-50…950`, a cool neutral ramp. `ink-950` is the dark-band canvas.
- **Status** `success` / `warn` / `danger` — carry meaning, never chosen for looks.
- **Type** fluid `display-1…3` via `clamp()` (375px → 1440px), fixed `body-*`.
  Body text does not scale with viewport.
- **Fonts** Inter Tight (display), Inter (body), JetBrains Mono (numeric/spec).
- **Radii** restrained — cards are `rounded-xl` (12px). Large radii read
  consumer-app, not infrastructure.
- **Elevation** `shadow-e1…e5`, cool-tinted. Never pure-black shadows.
- **Motion** two easings (`--ease-out`, `--ease-inout`), three durations.
  All motion is decorative and fully removed under `prefers-reduced-motion`.

## Contrast floor (verified, not assumed)

Ratios were computed, not eyeballed. Re-check with the formula in
`scripts/` if a colour changes.

**On white / `canvas-subtle`:**
- Body `ink-800` (14.4:1), muted `ink-600` (7.6:1), secondary `ink-500` (5.3:1)
- `ink-400` is **2.95:1 — FAILS as text on light.** Use `ink-500` for labels.
- Warn *text* must use `warn-600` (4.87:1). `warn-500` is decorative only.

**On the dark band (`#0b0e14`):**
- Primary: white / `ink-200`. Secondary: `ink-300` (11.8:1). Muted: `ink-400` (6.6:1).
- `ink-500` (3.65:1) and `ink-600` (2.53:1) **FAIL as text on dark.** Never use them there.

## Component rules

- **`Button` is the only button.** It exposes typed `variant`/`size` props.
  Do **not** pass `className` that overrides `display` or `color` — those
  collide with the base classes and the losing class is decided by stylesheet
  order, not by you. Add a variant instead. (`inverseOutline` exists for exactly
  this reason.) To hide responsively, wrap it: `<span className="hidden sm:block">`.
- **`Section`** owns vertical rhythm and surface colour. Sections do not invent
  their own padding.
- **`Container`** owns horizontal gutters: 20px → 32px (sm) → 40px (lg), 1200px max.
- Spec values are terse because they render against their own `<dt>` label
  ("Storage: Unlimited NVMe"). Repeating the noun forces a wrap and breaks row
  alignment across the plan grid.

## Accessibility, built in

- Skip link, one `<h1>` per page, no heading-level skips.
- Every `<nav>` is labelled. All four landmarks present.
- Focus is always visible; `:focus-visible` is styled globally and never removed.
- Interactive targets ≥24px (WCAG 2.2). The inline-in-a-sentence exception is
  the only place smaller is allowed.
- Mega menu: real `aria-expanded`/`aria-controls`, Escape restores focus to the
  trigger, closed panels use `hidden` so links leave the tab order.
- Mobile drawer: `role="dialog" aria-modal`, scroll lock, Tab cycle, Escape.
- Pricing: real `tablist` with Arrow/Home/End; term choice is a `radiogroup`.
- FAQ uses native `<details>` — works with JS disabled.

## Known gaps (honest list)

1. **No reversed/white logo asset exists.** `/brand/serverlys-logo.webp` is
   blue-on-transparent, for light surfaces only. The footer therefore uses a
   typographic wordmark. Supply a reversed asset and swap the `light` branch in
   `wordmark.tsx`. (`dark-version-logo.webp` in the old repo is a **ConvoAI**
   logo — a different product. Do not use it.)
2. **Dark mode is not implemented.** Deliberate — shipping it half-working is
   worse than not shipping it.
3. **Only the homepage is built.** 32 further service/legal pages and 73 blog
   posts exist in `~/Desktop/Archive` and are not yet ported.
4. **Domain search is not built.** It must call a real registrar/EPP or WHMCS
   endpoint. The previous build faked availability with a hash of the query —
   do not reintroduce that.
