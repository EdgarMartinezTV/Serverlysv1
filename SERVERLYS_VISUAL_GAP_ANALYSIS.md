# Serverlys — Visual Gap Analysis

**Date:** 2026-09-09
**Image 1 (target):** supplied reference homepage screenshot.
**Image 2 (current):** captured from the running build — `1280 × 11,596px` CSS,
14 sections. Only Image 1 was attached, so Image 2 was generated rather than
described from memory.

**Method.** Section heights and content density were measured from the live DOM
at 1440px, not estimated. "Content" is the union height of text and media
descendants; the remainder is empty band.

| Section | Height | Content | Used |
|---|---:|---:|---:|
| Final CTA | 513px | 289px | **56%** |
| Split cards | 612px | 391px | **64%** |
| Migration | 741px | 484px | **65%** |
| Plan finder | 652px | 447px | **69%** |
| Essentials | 737px | 513px | 70% |
| Tabbed showcase | 982px | 710px | 72% |
| Scale stepper | 1043px | 772px | 74% |
| AI band | 1307px | 1037px | 79% |
| Pricing | 1285px | 1047px | 81% |
| Footer | 836px | 676px | 81% |
| FAQ | 713px | 585px | 82% |
| Automation | 994px | 826px | 83% |
| Hero | 962px | 810px | 84% |

**The headline number:** five sections run below 70% density, and the page is
11,596px tall for 14 sections — ~830px per section. The target fits more
distinct visual events into a comparable run.

---

## 1. HERO

1. The target's card strip contains **photographic content inside product
   chrome** — a wedding site preview, a food photo behind a domain search, a
   person. Ours contains only UI chrome and synthetic data, so it reads as
   diagram rather than product.
2. Target strip cards **vary in width and content type** (a tall site preview
   beside a short chat tile). Ours are five uniform 248px panels — the
   regularity signals "component set", not "screenshots".
3. Target strip cards are **taller and show more rows** of real content; ours
   cap at ~216px with 3–6 data points each.
4. The target hero ground is a **saturated brand gradient with a visible light
   source and falloff**. Ours is a deep navy with a low-opacity radial — closer
   to flat than atmospheric.
5. The target places a **domain/prompt search inside the nav row itself**, above
   the hero, so the primary action is present before the headline. Ours has one
   search, inside the hero.
6. The target's strip is **clipped by the fold with cards bleeding off both
   edges**, implying more beyond frame. Ours is centred and fully contained on
   desktop, so it reads as a finished row rather than a window into a system.
7. No element in our hero **overlaps another**. The target overlaps the strip
   with the section boundary.
8. Our hero is 84% dense — genuinely the strongest section we have. The gap here
   is fidelity of the visuals, not layout.

## 2. NAVIGATION

9. Our mega menu is **structurally ahead of the target's** in this screenshot:
   three zones, category rail, promo panel. This is not a gap.
10. The target's nav bar carries a **persistent utility row** (search + account +
    language) that survives scroll. Ours consolidates to a single row.
11. The target header sits on the hero's own gradient; ours switches between
    transparent and solid, which is arguably better but produces a **harder
    boundary** when solid.

## 3. TYPOGRAPHY

12. Our display type is **larger relative to line length** — the hero H1 runs to
    ~80px at 1440 where the target's sits nearer 56–64px, so the target fits
    more supporting content in the same vertical space.
13. The target uses a **tighter body size in dense areas** (~13–14px in cards)
    against our uniform 14px, so its cards carry more lines per unit height.
14. Section headings in our build are all `text-h1`/`text-h2` at similar scale;
    the target **varies heading scale by section importance**, creating rhythm.
15. We have no **numeric display treatment** — the target uses large tabular
    figures as visual anchors in pricing and metrics.
16. Our eyebrow labels are consistent but **always the same size and colour**;
    the target varies eyebrow treatment between light and dark bands.

## 4. SPACING

17. Five sections below 70% density (table above) — the empty band is **inside**
    sections, not between them, so reducing section padding would not fix it.
18. Our final CTA is **56% used**: a 513px band carrying one heading, one
    paragraph and two buttons.
19. Split cards at 64%: two cards with large internal bottom voids.
20. Vertical rhythm is **uniform** (`py-20 sm:py-24 lg:py-28` almost everywhere).
    The target varies band height substantially — some sections are short
    strips, others are tall visual moments.
21. Our container is a constant 1200px for every section. The target alternates
    between **contained and full-bleed**, which the eye reads as pace.

## 5. VISUAL DENSITY

22. The target averages **more distinct elements per section** — its essentials
    row alone carries four photo cards each with an overlaid UI fragment.
23. Our essentials cards contain **one graphic each**, no overlay, no second
    layer.
24. The target repeatedly places **two visual systems in one section** (photo +
    UI panel). We place one.
25. Our dark sections carry **large uninterrupted ground** — the AI band is
    1307px tall with three tiles and one panel.
26. We use **whitespace as separation**; the target uses **overlap and layering**
    as separation, which costs less vertical space.

## 6. PRODUCT VISUALIZATION

27. Target product UI shows **realistic data volume** — order tables with many
    rows, an email builder with a real layout, analytics with axes and legends.
    Our panels show 3–6 data points.
28. Our mockups have **no navigation chrome** (sidebars, tabs, breadcrumbs).
    Real software has these; their absence is why ours read as diagrams.
29. No **cursor, selection state, hover state or focus ring** appears in any of
    our mockups. The target shows a cursor mid-interaction.
30. Our panels are **static compositions**; the target implies a moment in a flow
    (a message being typed, a build in progress).
31. We have no **device framing** anywhere — no browser window at scale, no
    laptop, no phone.
32. Our product visuals occupy roughly **40% of their section's area**; the
    target's routinely occupy 55–65%.
33. There is **no Serverlys dashboard** anywhere on the page — no single view
    that shows sites, domains, agents and automations together. This is the
    largest single missing asset.

## 7. BACKGROUNDS

34. We use **three grounds** (canvas, canvas-secondary, canvas-abyss) plus one
    lavender. The target uses a wider set with intermediate tints.
35. Our light sections are **flat**; the target's carry very soft directional
    tints that keep them from reading as plain white.
36. Our grid overlay is used at **one density and one opacity** everywhere it
    appears; the target varies texture per section.
37. No section uses a **background image or photographic ground**. Every dark
    band is gradient-on-solid.

## 8. GRADIENTS

38. Our radial washes are **low-opacity and centred**; the target's have a clear
    directional origin, so they read as lighting rather than tint.
39. We have **no gradient that crosses a section boundary** — each band's
    gradient resolves inside its own box, which is why sections feel separate.
40. No **gradient borders or edge treatments** anywhere; the target uses them on
    card edges in dark bands.

## 9. CARDS

41. Nearly every content group in our build is **a rounded rectangle with a
    ring**. Counted on the current page: products, essentials, AI tiles, pricing,
    migration steps, FAQ rows, footer sister products — seven card systems.
42. Our cards are **uniform in radius (12–16px) and elevation**; the target
    varies both by role.
43. No card in our build **breaks its own bounds** — no image bleeding past an
    edge, no element overlapping two cards.
44. Our card grids are **equal-width columns**; the target uses unequal spans
    (one wide + two narrow).

## 10. SECTION COMPOSITION

45. We repeat **centred-heading-then-grid** five times (products, essentials,
    pricing, automation, FAQ).
46. We use **two-column split** four times (split cards, tabbed showcase, AI
    band, scale stepper).
47. Only one section (AI band) uses **overlap**; nothing else layers.
48. No section is **full-bleed**; all are container-width.
49. No **editorial/asymmetric grid** anywhere — no large-visual-plus-small-feature
    arrangement.

## 11. VISUAL STORYTELLING

50. The page states capabilities in **prose** where the target shows them. Our
    automation section describes backups and scaling; the target shows a flow
    diagram with nodes.
51. There is **no visual through-line** connecting hosting → domain → AI →
    automation. Each is an isolated statement.
52. The AI section names ConvoAI and CallFlow but **never shows the outcome** —
    a lead captured, an appointment booked, a CRM record created.

## 12. ANIMATION

53. We have **scroll reveal and two float loops**. The target implies scroll-linked
    product animation and stepped state changes.
54. No element **animates its content** — numbers do not count, charts do not
    draw, chat does not type.
55. Hover states are **colour-only** on most surfaces; no lift, no parallax, no
    content shift.

## 13. INTERACTION

56. Three interactive surfaces exist (tabs, stepper, accordion) and all are
    **click-to-switch**. Nothing responds to scroll position.
57. The domain search is genuinely interactive and is our **strongest
    interactive moment** — but it lives on `/register-domain`, not the homepage
    hero, where it is a plain form.

## 14. PRICING

58. Our three cards are **equal height with a highlighted middle** — correct, but
    the layout is otherwise conventional.
59. There is **no billing-term toggle** on the homepage pricing (it exists in the
    full table elsewhere), so the annual/monthly story is untold here.
60. Feature lists are **plain text rows**; the target groups them under labelled
    headings with denser typography.
61. No **trust row directly beneath the cards** (payment, guarantee, support) —
    ours sits above.

## 15. DARK SECTIONS

62. We have **four dark bands** (hero, AI, automation, scale) that read as four
    separate blocks rather than one environment.
63. Each dark band **restarts its own gradient** at the top edge, producing a
    visible seam.
64. Dark sections carry **less content per pixel** than light ones — the AI band
    is our tallest section at 1307px.

## 16. CTA

65. The final CTA is our **least dense section at 56%**, and is pure type plus
    two buttons on flat brand blue.
66. It contains **no product visual, no proof, no imagery** — the last thing a
    visitor sees is a coloured box with text.

## 17. FOOTER

67. Recently rebuilt and now matches the header system. The remaining gap is that
    the **brand column runs taller than the link columns**, leaving a right-side
    void.

## 18. MOBILE

68. Our hero strip becomes a **horizontal scroller** on mobile — good — but the
    cards do not change composition, so they are simply smaller.
69. Product visuals **shrink rather than recompose**; none drop rows or switch to
    a mobile-appropriate arrangement.
70. Dark sections lose their layering entirely on mobile (the AI band's
    overlapping panel stacks below the tiles).

## 19. RESPONSIVE BEHAVIOUR

71. Grids collapse **3 → 2 → 1** predictably everywhere; no section reflows into
    a different composition.
72. Typography scales via `clamp()` uniformly; no section adjusts its **hierarchy**
    at small sizes.

## 20. OVERALL BRAND PERCEPTION

73. The page currently reads as **"a well-built hosting site"** rather than "a
    technology platform with software behind it".
74. The single biggest cause is #33: **there is no product to look at.** Nothing
    on the page shows the thing a customer would log into.
75. Secondary cause is #41: **seven card systems** and almost no other visual
    device, so the page's vocabulary is narrow.
76. The engineering is ahead of the art direction. Accessibility, tests,
    performance and SEO are strong; the visual layer has not kept pace.

---

## Priority order for reconstruction

Ranked by visual impact per unit of work.

1. **Build a Serverlys dashboard visual** (#33) — sites, domains, agents,
   automations in one view, with real chrome. Use it as the hero's focal point
   and reuse fragments elsewhere.
2. **Add device/browser framing at scale** (#31, #28) — one large framed product
   moment per major section.
3. **Recompose the five low-density sections** (#17–20) by layering rather than
   padding — overlap, bleed, unequal spans.
4. **Break the card monoculture** (#41–44) — full-bleed visuals, editorial grids,
   elements crossing bounds.
5. **Unify the dark bands** (#62–64) into one continuous environment with
   gradients that cross boundaries.
6. **Rebuild the final CTA** (#65–66) around a visual, not type on flat colour.
7. **Add content animation** (#54) — counting figures, drawing charts, typing
   chat — tied to scroll.
8. **Vary section rhythm** (#20–21, #45–49) — alternate contained and full-bleed,
   short strips and tall moments.

## Constraint that shapes all of the above

**No photography exists in the brand assets.** The target leans heavily on
photographic content inside its product cards (#1). Every visual in this
reconstruction must therefore be built in code, or real photography must be
acquired. Code-built UI can close most of the gap — dashboards, charts, chat,
flows — but it cannot supply the human warmth the target gets from photos of
people and products. That is a genuine ceiling on fidelity and should be an
explicit decision rather than a silent shortfall.
