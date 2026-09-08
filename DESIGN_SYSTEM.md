# Serverlys Design System

**Source of truth:** `src/app/globals.css` (tokens) + `src/components/ui/` (components).
**Live reference:** `/design-system` — every primitive rendered. Start there.
**Enforced by:** `npm run validate:tokens` (dead-token + contrast check).

This file supersedes the earlier `DESIGN.md`.

---

## 0. How the system is organised

Three tiers. **Markup consumes tier 2 and 3 only.**

| Tier | What | Where | Used in markup? |
|---|---|---|---|
| 1 — Primitives | Raw ramps: `brand-600`, `ink-700`, `green-500` | `@theme` | **No** |
| 2 — Semantic | What a colour *means*: `primary`, `fg-muted`, `line-input` | `@theme` | Yes |
| 3 — Variants | Component maps: `Button` variants, `Card` variants | TypeScript | Yes |

**Why the separation:** a primitive answers "which blue"; a semantic token answers
"what is this *for*". Only the second survives a rebrand or a dark-mode pass.

### The rule that keeps it honest

Tailwind **silently ignores** a class it cannot resolve — a renamed token
produces no build error, the style just disappears. This actually happened
during the build of this system (a status dot vanished). So:

```bash
npm run validate:tokens
```

walks every colour utility in the codebase, fails on any that does not resolve,
and re-computes all 14 documented contrast floors. It runs inside `npm run verify`.

---

## 1. Typography

Display/H1/H2/H3/H4 are **fluid** — `clamp(min, preferred, max)` where min is the
375px size and max is the 1440px size. Body sizes are **fixed**: body text must
not grow with the viewport.

| Token | Size (375 → 1440) | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|
| `text-display` | 40 → 80px | 1.04 | −0.035em | 600 | Hero only. One per site. |
| `text-h1` | 34 → 56px | 1.08 | −0.03em | 600 | Page title. One per page. |
| `text-h2` | 28 → 40px | 1.14 | −0.025em | 600 | Section title |
| `text-h3` | 24 → 30px | 1.24 | −0.02em | 600 | Subsection |
| `text-h4` | 20 → 23px | 1.32 | −0.015em | 600 | Card title |
| `text-body-lg` | 18px | 1.6 | −0.005em | 400 | Ledes, intros |
| `text-body` | 16px | 1.65 | — | 400 | Default paragraph |
| `text-small` | 14px | 1.6 | — | 400 | Supporting detail, dense UI |
| `text-caption` | 12px | 1.4 | +0.08em | 600 | Eyebrows, labels, meta |

**Families**

| Token | Face | Job |
|---|---|---|
| `font-display` | Inter Tight | Headings — tighter, more engineered |
| `font-sans` | Inter | Body and UI |
| `font-mono` | JetBrains Mono | Specs, eyebrows, anything numeric-technical |

Headings get `font-display` automatically from the base layer. Negative tracking
scales with size — large type needs it, small type is damaged by it.

**`.tabular`** — apply to any number a user compares (prices, RAM, uptime).
Proportional figures make a price column look ragged.

> **Open decision:** dropping Inter Tight and rendering display sizes in Inter
> with tighter tracking would remove ~170 KB of the 528 KB font payload. Flagged
> in `ARCHITECTURE.md §10`; not actioned without sign-off.

---

## 2. Spacing

**4px base** (`--spacing: 0.25rem`), so Tailwind's numeric scale is the ramp:
`2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px, `20`=80px.

Approved steps — pick from these rather than inventing values:

```
4px · 8px · 12px · 16px · 20px · 24px · 32px · 40px · 48px · 64px · 80px · 96px · 112px
```

**Named rhythm tokens** (owned by layout components, not set ad hoc):

| Token | Value | Owner |
|---|---|---|
| `--space-section-tight` | 56px | `<Section spacing="tight">` |
| `--space-section` | 80px | `<Section spacing="base">` |
| `--space-section-loose` | 96px | `<Section spacing="loose">` |
| `--space-gutter-mobile` | 20px | `<Container>` |
| `--space-gutter-tablet` | 32px | `<Container>` |
| `--space-gutter-desktop` | 40px | `<Container>` |

**Rule:** sections never set their own vertical padding; components never set
their own horizontal page inset. If you are writing `px-` on a section, the
container is missing.

---

## 3. Containers

| Token | Max width | Use |
|---|---|---|
| `max-w-reading` | 680px | Long-form prose — legal, blog. ~72ch measure. |
| `max-w-hero` | 1120px | Hero and focused bands |
| `max-w-desktop` | 1200px | **Default** page width |
| `max-w-tablet` | 768px | Narrow embedded layouts |
| `max-w-wide` | 1440px | Feature grids that earn extra room |

```tsx
<Container width="reading">…</Container>   // gutters handled automatically
```

Gutters are responsive by intent, not one value: **20px** mobile (tighter feels
cramped), **32px** tablet, **40px** desktop.

---

## 4. Colour

### Semantic tokens — the component-facing API

| Requested name | Token | Value | Contrast |
|---|---|---|---|
| Primary | `primary` | `#1163e0` | 5.41:1 on white |
| Primary Hover | `primary-hover` | `#0f4eb4` | 7.58:1 |
| Primary Soft | `primary-soft` | `#eff6ff` | fill only |
| Background | `canvas` | `#ffffff` | — |
| Background Secondary | `canvas-secondary` | `#f7f8fa` | — |
| Surface | `surface` | `#ffffff` | — |
| Surface Elevated | `surface-elevated` | `#ffffff` + `shadow-e3` | — |
| Text Primary | `fg` | `#0b0e14` | 19.32:1 |
| Text Secondary | `fg-secondary` | `#4a5466` | 7.63:1 |
| Text Muted | `fg-muted` | `#616c80` | 5.30:1 |
| Border | `line` | `#dfe3ea` | decorative |
| Success | `success` | `#0f7f55` | 5.02:1 |
| Warning | `warning` | `#8e6c18` | 4.87:1 |
| Error | `error` | `#c8383a` | 5.14:1 |

Plus: `primary-active`, `canvas-inset`, `line-subtle`, `line-strong`,
`line-input`, and `*-fill` / `*-soft` variants for each status.

### Brand identity

The ramp is anchored on **`#227eff`** — the established Serverlys blue, carried
forward from the existing site. It is `brand-500`.

**`primary` is `brand-600`, not `brand-500`.** 500 is only 3.6:1 on white and
fails as text or as a link colour. 600 is the lightest step that clears 4.5:1,
so it is the interactive step. 500 remains available for large fills where the
brand hue matters more than legibility.

Nothing here is derived from Hostinger or any other host. The blue is Serverlys';
the ramp around it was tuned for contrast, not generated by a tint function.

### Two rules that are not negotiable

**1. Status text uses the `600` step, fills use `500`.**
`green-500`, `amber-500`, `red-500` are 3.4:1 or lower on white — legal for an
icon, illegal for text. `text-success` / `text-warning` / `text-error` already
resolve to the safe step; `*-fill` is the icon/fill step.

**2. Dark surfaces have their own foreground set.**

| Surface | Primary | Secondary | Muted |
|---|---|---|---|
| Light (`canvas`) | `fg` 19.3:1 | `fg-secondary` 7.6:1 | `fg-muted` 5.3:1 |
| Dark (`canvas-dark`) | `fg-on-dark` 19.3:1 | `fg-on-dark-secondary` 11.8:1 | `fg-on-dark-muted` 6.6:1 |

`fg-muted` (ink-500) is **3.65:1 on the dark band and fails.** `ink-600` is
2.53:1. Never use the light set on dark. `<Section surface="dark">` selects the
correct set for you — that is what the surface contract is for.

`ink-400` is **2.95:1 on white** and is a border/icon value only, never text.

### Borders

| Token | Contrast | Use |
|---|---|---|
| `line-subtle` | 1.1:1 | Internal dividers inside a card |
| `line` | 1.3:1 | Card edges, section rules |
| `line-strong` | 1.6:1 | Hover emphasis |
| `line-input` | **3.19:1** | **Form controls** |

Decorative borders have no contrast minimum. A form control's border *is* the
control boundary, so WCAG 1.4.11 requires 3:1 — hence a separate token.

---

## 5. Radius

| Token | Value | Use |
|---|---|---|
| `rounded-xs` | 4px | Focus rings, checkbox |
| `rounded-sm` | 6px | Inputs, small controls |
| `rounded-md` | 8px | Buttons |
| `rounded-lg` | 12px | **Cards — the default** |
| `rounded-xl` | 16px | Large panels, mega menu |
| `rounded-2xl` | 20px | Hero media |
| `rounded-full` | — | Pills, avatars, badges |

Deliberately restrained. 20px+ radii on cards read consumer-app; this is
infrastructure.

---

## 6. Elevation

| Token | Job |
|---|---|
| `shadow-e1` | Barely lifted — secondary buttons, flat cards |
| `shadow-e2` | Resting card, primary button |
| `shadow-e3` | Elevated card — a distinct object |
| `shadow-e4` | Hover lift, prominent panels |
| `shadow-e5` | Overlays — mega menu, drawer, modal |

All layered (two shadows: a tight contact shadow plus a diffuse one) and
**cool-tinted** `rgb(11 14 20 / …)`. Pure-black shadows read muddy over a cool
neutral ramp. Elevation carries meaning — do not pick a level for looks.

---

## 7. Motion

| Duration | Value | Use |
|---|---|---|
| `duration-fast` | 120ms | Colour/opacity on hover and press |
| `duration-normal` | 200ms | The default |
| `duration-slow` | 320ms | Disclosure, drawer, larger movement |

| Easing | Curve | Use |
|---|---|---|
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Decelerate — things arriving |
| `ease-hover` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric — reversible states |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Accelerate — things leaving |

**Motion never carries information.** Anything conveyed by movement is also
conveyed by text, state, or ARIA — which is why `prefers-reduced-motion: reduce`
can strip all of it globally, and does.

No animation on above-the-fold content: it delays LCP and reads as latency.

---

## 8. Buttons

`src/components/ui/button.tsx` — the only button in the system.

| Variant | Appearance | Use |
|---|---|---|
| `primary` | Solid brand, `shadow-e2` | The one highest-intent action in a view |
| `secondary` | White, `ring-line`, `shadow-e1` | Companion to primary |
| `outline` | Transparent, brand edge | Secondary CTA on tinted surfaces |
| `ghost` | No chrome until hover | Dense UI, toolbars, nav |
| `text` | Reads as a link | Inline, tertiary |
| `inverse` | White on dark | Dark bands only |
| `inverseOutline` | Outlined on dark | Dark bands only |

**Sizes:** `sm` 36px · `md` 44px · `lg` 48px. All clear the 24px WCAG 2.2 target
minimum with margin.

**States:** hover, active, `disabled`, `loading` (spinner + `aria-busy` +
interaction blocked), and a focus ring on every variant.

```tsx
<Button variant="primary" size="lg">Get started</Button>
<Button href="/pricing" variant="outline">See plans</Button>
<Button loading>Checking</Button>
<IconButton label="Open menu"><MenuIcon /></IconButton>   // label REQUIRED
```

`IconButton` makes the accessible name a **required prop** — there is no visible
text to fall back on, so it cannot be forgotten.

### ⚠ The one rule that has already caused a bug

**Never pass a `className` that overrides `display` or `color`.** It collides
with the base classes, and the winner is decided by stylesheet order — not by
which class you wrote last.

```tsx
<Button className="hidden sm:inline-flex">   // ✗ silently stays visible
<span className="hidden sm:block"><Button/></span>   // ✓ wrap it
```

This shipped once (`Log in` failed to hide on mobile) and recurred in the form
inputs (`ring-error` losing to `ring-line-input`). Both are now structurally
impossible: variants own colour, and the input ring colour is applied by exactly
one of the valid/invalid class strings, never layered.

---

## 9. Cards

`src/components/ui/card.tsx`

| Variant | Treatment | Use |
|---|---|---|
| `basic` | Flat, `ring-line` | Dense grids where elevation is noise |
| `elevated` | `shadow-e3` | Content that should read as a distinct object |
| `interactive` | `shadow-e2` → `e4` on hover, ring on focus-within | **Only when the card is a link** |

**Composites:** `FeatureCard` (icon + title + copy + optional link),
`TestimonialCard` (`<figure>`/`<blockquote>`/`<figcaption>` so attribution is
programmatically tied to the quote), and `PricingCard` — which lives in
`components/pricing/`, not `ui/`, because it knows about the `Plan` type and
`ui/` must stay domain-free.

**Interactive cards use a stretched link**, not a click handler on a div:

```tsx
<Card variant="interactive">
  <h3><CardLink href="/cloud-hosting">Cloud hosting</CardLink></h3>
  <p>…</p>
</Card>
```

`CardLink` covers the card with an `::after` overlay. The whole card is
clickable, the accessible name stays on the real link, and there are no nested
interactive elements. Exactly one `CardLink` per card.

---

## 10. Forms

`ui/field.tsx` · `ui/input.tsx` · `ui/choice.tsx`

**These are server components.** IDs are derived deterministically from `name`
rather than `useId`, because forms on this site post directly to WHMCS and must
work with JavaScript disabled. Nothing here requires hydration to be labelled
correctly.

| Component | Notes |
|---|---|
| `Field` | Label + description + control + error + success, correctly associated |
| `Input` | 44px, `line-input` border |
| `Textarea` | Vertically resizable only |
| `Select` | **Native** `<select>` — correct mobile picker and keyboard behaviour |
| `Checkbox` | Native input, `appearance-none`, custom mark via `peer-checked` |
| `Radio` | Native input — arrow-key group navigation for free |
| `ChoiceGroup` | `<fieldset>`/`<legend>` — required, or options are announced with no question |

```tsx
<Field name="email" label="Email" error="Enter a valid email address." required>
  <Input name="email" type="email" invalid required />
</Field>
```

**States:** default · hover · focus · disabled · `invalid` · `success` · loading
(via `<Button loading>`).

**Accessibility contract:**
- Visible `<label>` always. **A placeholder is not a label.**
- `invalid` drives both the red ring and `aria-invalid` from one prop, so they
  can never disagree.
- The error node is `role="alert" aria-live="polite"` and is **always rendered**
  (hidden when empty) so the live region exists before a message arrives.
- Errors appear inline at the field, never only as a summary.
- Required fields carry a visual `*` **and** a screen-reader-only "(required)".
- Native controls are kept and styled, never re-implemented with divs and ARIA.

---

## 11. Verification

```bash
npm run verify   # typecheck → lint → validate:tokens → build
```

| Script | Checks |
|---|---|
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |
| `validate:tokens` | Dead colour utilities + 14 contrast floors |
| `build` | Production build |
| `format` | Prettier |

Plus `scripts/shoot.mjs` (true responsive screenshots — Chrome headless clamps
its viewport at 500px, so this drives CDP instead) and `scripts/a11y.mjs`
(heading order, landmarks, accessible names, target sizes).

---

## 12. Known gaps

Stated so they read as tracked, not overlooked.

1. **No reversed logo asset.** `/brand/serverlys-logo.webp` is blue-on-transparent,
   for light surfaces only. The dark footer uses a typographic wordmark until a
   reversed asset exists. (`dark-version-logo.webp` in the old repo is a
   **ConvoAI** logo — a different product. Do not use it.)
2. **Dark mode is not shipped.** The token structure supports it — `canvas`,
   `surface` and `fg` are already separated — but shipping it half-working is
   worse than not shipping it.
3. **No imagery.** One logo file. Product screenshots and photography are an
   asset-acquisition task, tracked in `PROJECT_AUDIT.md §6.1`.
4. **Three font families.** Reduction to two is proposed and unactioned.
5. **`min-h-14` on plan summaries** reserves two lines to hold card alignment.
   Breaks if a summary ever needs three; CSS subgrid is the structural fix.
