# Handoff: Portfolio UI refactor (aniszadri.dev)

## Overview

A visual refactor of https://aniszadri.dev — the existing Next.js 15 / Tailwind 4 portfolio at `github.com/aniszad/portfolio-website`. Content, routes, i18n, and data layer stay exactly as they are. What changes is the visual system: the phosphor-CRT presentation layer is removed and replaced with a restrained editorial one.

Target audience for the site: recruiters screening for a September 2026 alternance, engineering managers and tech leads, and freelance clients. The design brief was explicitly "professional, not playful, not cheesy."

## About the design files

`Portfolio Pages - 1a.dc.html` is a **design reference created in HTML** — a prototype showing the intended look, not production code to copy. It renders all eight views stacked on one canvas as labelled cards (2a–2h), each 1180px wide. `support.js` is only the harness that renders it; it has nothing to do with the real site.

The task is to **recreate this design inside the existing Next.js codebase**, using its established patterns: the `lib/data.ts` content source, `lib/i18n.ts` for EN/FR, `lib/constants.ts` for site metadata, Tailwind 4 `@theme` tokens in `styles/globals.css`, and the existing route structure under `app/`. Do not port the HTML.

## Fidelity

**High fidelity.** Colors, type sizes, weights, line-heights, rules, and spacing in the prototype are final. Recreate them faithfully. Where the prototype and the current codebase disagree, the prototype wins for styling and the codebase wins for data, routing, and behavior.

---

## What to remove from the current codebase

These are the "costume" layers the refactor is deliberately deleting. All of them are visual only — removing them should not touch data or routing.

| File / class | Action |
| --- | --- |
| `.retro-*` rules in `styles/globals.css` (workspace, machine, machine-header/footer, brand-mark, screen-shell, screen-glass, scanlines, module-bar, bootline, terminal, control-panel, chat-panel, command-panel, record-id) | Delete |
| `components/layout/RetroComputerShell.tsx` | Delete |
| `components/ui/PrecisionCursor.tsx` + `.has-precision-cursor` rule | Delete |
| `components/layout/CursorGlow.tsx` | Delete |
| `components/layout/Ambient.tsx` | Delete (or reduce to nothing) |
| `components/ui/PlanetHero.tsx`, `PlanetHeroLoader.tsx`, `public/textures/venus.jpg` | Delete |
| `components/ui/WavyRail.tsx` | Delete |
| `moduleNames` map in `PageShell.tsx` ("SYSTEM PROFILE", "WORK LOG", "PROJECT DATABASE"…) | Delete — page titles are plain now |
| Rotating hero title (`copy.home.rotatingTitle` cycling every 2300ms in `Hero.tsx`) | Delete — the headline is static |
| Accent `#b7f34a` everywhere | Replace per the token table below |
| `html.timeline-snap-page` scroll-snap rules | Delete — Education is a plain list now |

Keep: `LanguageProvider` / `LanguageSwitch`, `CommandPalette` (⌘K), `ChatWidget`, `FadeInOnScroll`, `RevealText`, `lib/*`, `app/api/*`, all metadata/SEO/sitemap/robots code, `next/image` usage, the `prefers-reduced-motion` block, and the `:focus-visible` ring (recolor it — see tokens).

---

## Design tokens

Replace the `@theme` block in `styles/globals.css` with these. Note that the per-page `theme` objects in `lib/constants.ts` become redundant: **every page now uses one surface**. Either strip `theme` from `PageMeta` or set all six to identical values.

```css
@theme {
  --color-surface:      #0b0b0a;  /* page background, all routes */
  --color-raised:       #111110;  /* placeholder fields, image mattes */
  --color-line:         #26251f;  /* primary hairline: section rules, borders */
  --color-line-soft:    #1c1b18;  /* secondary hairline: list-row separators */
  --color-line-strong:  #33322b;  /* inactive underline on secondary buttons */

  --color-muted:        #8f8b82;  /* labels, captions, metadata, inactive nav */
  --color-body:         #a9a49a;  /* body prose */
  --color-body-strong:  #c9c5bb;  /* lead paragraph, org names, skill lists */
  --color-heading:      #f0ede5;  /* headings, active nav, emphasis */

  --color-paper:        #f7f4ee;  /* logo plate background only */

  --font-serif: "Instrument Serif", Georgia, serif;
  --font-sans:  "Public Sans", ui-sans-serif, system-ui, sans-serif;
}
```

**There is no accent color.** `#f0ede5` at full strength is the accent. It marks: the active nav item, the "Current" / "Starting" labels, the CTA underline, the Outcome rule and text, and the focus ring. Never introduce a hue.

Do not use any grey darker than `#8f8b82` for text — every text token above clears 4.5:1 on `#0b0b0a`.

### Type scale

| Role | Font | Size / line-height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Home display | Instrument Serif | 78px / 0.98 | 400 | -0.015em |
| Case-study title | Instrument Serif | 66px / 1.02 | 400 | -0.015em |
| Page title | Instrument Serif | 58px / 1.0 | 400 | -0.01em |
| Featured project name | Instrument Serif | 38px / 1.05 | 400 | — |
| Large numeral / metric | Instrument Serif | 34px / 1.0 | 400 | — |
| Outcome statement | Instrument Serif | 34px / 1.28 | 400 | — |
| Section h2, role title | Instrument Serif | 30px / 1.1 | 400 | — |
| Sequence-nav target | Instrument Serif | 26px / 1.0 | 400 | — |
| Education degree, skill category | Instrument Serif | 26px / 1.15, 20px / 1.2 | 400 | — |
| Lead paragraph | Public Sans | 18px / 1.65 | 300 | — |
| Body prose | Public Sans | 17px / 1.72 | 300 | — |
| Hero tagline | Public Sans | 16.5px / 1.6 | 300 | — |
| Page blurb, list body | Public Sans | 16px / 1.6, 15px / 1.65 | 300 | — |
| Org name, metric caption | Public Sans | 14px / 1, 12.5px / 1.5 | 400 / 300 | — |
| Nav link | Public Sans | 12.5px / 1 | 400 | — |
| Eyebrow label | Public Sans | 10.5px / 1 | 400 | 0.16em, uppercase |
| Tag chip | Public Sans | 11.5px / 1 | 300 | — |

Both families are on Google Fonts. Load them the way the repo already loads Geist (`next/font/google`), and drop Geist and Geist Mono — **the refactor uses no monospace font at all.** Where the old design used mono for technical metadata, use Public Sans 300 with letter-spacing instead.

### Spacing and rules

- Page gutter: `56px` desktop (`px-14`), `24px` mobile.
- Masthead: `26px` top, `22px` bottom, `1px solid var(--color-line)` beneath.
- Page header → first content: `44px` rule, then `36–44px` padding.
- List rows: `18–36px` vertical padding, separated by `1px solid var(--color-line-soft)`.
- Section groups: separated by `1px solid var(--color-line)`.
- Sequence nav: `56px` top margin, `1px solid var(--color-line)` above, `26px` row padding.
- Border radius: `2px` on tag chips and logo plates. **Nothing else is rounded.** No shadows anywhere.

---

## Global chrome

### Masthead (replaces `HomeSideNav`'s fixed rail)

Horizontal, full width, not fixed. Left: "Anis Zadri" in Instrument Serif 17px `--color-heading`, then "Lille, France" in Public Sans 300 12px `--color-muted` with 0.06em tracking, 18px gap, baseline-aligned. Right: the six section links at 12.5px `--color-muted`, 26px gap, then a 1px × 13px `--color-line-strong` divider, then "EN · FR" at 11px `--color-muted`.

Active link: `--color-heading` with a `1px solid` underline 4px below the baseline. Hover on inactive: `--color-heading`, 200ms. The numbered `01–06` prefixes move out of the nav and into each page's eyebrow (`01 — About`).

The ⌘K palette trigger and the chat entry point are not drawn in the prototype. Keep both; style the trigger as a `--color-muted` 12.5px item in the masthead right group, and the chat launcher as a bottom-right text button in the same greys — no pill, no glow, no gradient.

### Sequence nav (footer of every section page)

Two-column grid, `1px solid var(--color-line)` on top. Left cell = previous, right cell = next and right-aligned. Each: caption in Public Sans 300 12px `--color-muted`, then target label in Instrument Serif 26px `--color-heading`. Keep the existing hover treatment from `PageShell` (a rule scaling in from the left over 500ms) but draw it in `--color-heading`, not accent.

---

## Screens

All eight are in the prototype file, anchored `#2a` … `#2h`.

### 2a — Home (`/`)

Five bands, top to bottom:

1. **Hero.** Grid `minmax(0,1fr) 310px`, 64px gap, bottom-aligned, 78px top padding. Left: h1 in Instrument Serif 78px, two lines — "I build websites and web apps" then "that ship" in italic `--color-body`. Below at 34px: the tagline, max-width 560px. Right column: a `1px solid var(--color-line)` left border, 26px padding-left, three stacked blocks 20px apart — "Currently" (AI Engineer Intern, Limpidius / EuraTechnologies, Lille), "From September" (MSc Artificial Intelligence / Université de Lille), "Available" (Alternance, September 2026, in `--color-heading`). Each has an eyebrow label above and 14px/1.45 `--color-body-strong` beneath.
2. **CTAs.** 66px above, rule on top, 26px padding. "Start with the work" — 15px 500 `--color-heading`, 1px `--color-heading` underline 5px below. "Get in touch" — 15px 400 `--color-muted`, 1px `--color-line-strong` underline. 34px apart.
3. **Metrics.** Three equal columns, rules between and above. Each: Instrument Serif 34px numeral, then 12.5px/1.5 `--color-muted` caption. Content verbatim: "3,000 / scans a day through the barcode library, in French retail"; "Three / roles, from a bus fleet system in Béjaïa to production retail software"; "Open source / Android library published on JitPack".
4. **Featured artifact.** Rule on top, grid `minmax(0,1fr) 300px`, 44px gap, top-aligned. Left: eyebrow "Selected work", h2 "Limpscanner" (Instrument Serif 34px), the project description, and "Read the case study" as an underlined CTA. Right: `limpscanner-1.jpeg` at 300px wide, `aspect-ratio: 3/4`, `object-fit: cover`, `1px solid var(--color-line)`, with a 11.5px `--color-muted` caption 10px beneath.
5. Footer note: "Built with Next.js and Tailwind CSS." — keep as-is in `--color-muted`.

**Do not** reinstate the rotating job-title line. The headline is one fixed sentence.

### 2b — About (`/about`)

Eyebrow `01 — About`, title "About", blurb, rule. Then grid `minmax(0,1fr) 300px`, 56px gap, top-aligned.

Left: the three `ABOUT_PARAGRAPHS` verbatim, 17px/1.72, 22px apart, max-width 620px. First paragraph `--color-body-strong`, the other two `--color-body`. Then "Download CV (PDF)" as an underlined CTA linking `CV_PATH`.

Right: `anis.webp` at 100% of the 300px track, `aspect-ratio: 4/5`, `object-fit: cover`, hairline border. Beneath at 14px: three definition rows, `space-between`, 12.5px, label `--color-muted` / value `--color-body-strong`, separated by `--color-line-soft` — "Based in / Lille, France", "Languages / FR · EN · AR", "Looking for / Alternance, Sept 2026". **Verify the languages row with Anis before shipping — it is not in `lib/data.ts`.**

### 2c — Experience (`/experience`)

Eyebrow `02 — Experience`, title, blurb, rule. Then one row per `EXPERIENCES` entry: grid `190px minmax(0,1fr)`, 48px gap, 36px vertical padding, `--color-line-soft` beneath.

Left column: dates at 13px/1.5. For the current role only, add an eyebrow-styled "Current" in `--color-heading` 8px below. Right column: role in Instrument Serif 30px; 12px below, a flex row with the company logo on a `--color-paper` plate (28×28, 4px padding, 2px radius, `object-fit: contain`) and the org line "Limpidius — EuraTechnologies, Lille" at 14px `--color-body-strong`; the freelance entry has no logo and no plate. Then highlights as an unordered list, 12px apart, each with a `1px solid var(--color-line)` left border and 16px padding-left, 15px/1.65 `--color-body`. Then tags: flex-wrap, 7px gap, each `1px solid var(--color-line)`, 6px/9px padding, 2px radius, 11.5px 300 `--color-muted`.

Note the em-dash separator between company and location replaces the old two-line layout.

### 2d — Projects (`/projects`)

Eyebrow `03 — Projects`, title, blurb, rule. Three zones:

1. **Limpscanner**, grid `minmax(0,1fr) 262px`, 44px gap, 40px padding, `--color-line-soft` beneath. Left: eyebrow "Featured — proprietary source", name in Instrument Serif 38px, description, tags, "Case study" CTA. Right: the screenshot at 100% width of the 262px track, `aspect-ratio: 9/16`, cover; below it a 262×110 slot for the demo video (a striped placeholder in the prototype — see Assets).
2. **Two featured**, 50/50 grid, 48px gap, 36px padding, rule beneath. Each: eyebrow "Featured", name in Instrument Serif 28px, description, tags. Timetable Scheduler and AndroidDrivePreview.
3. **Index**, eyebrow "Index", then one row per remaining project: grid `32px minmax(0,1fr) 260px`, 22px gap, 18px padding, `--color-line-soft` beneath. Ordinal in Instrument Serif 18px `--color-muted`; name 16px 500 `--color-heading` with a truncated one-line description under it at 13.5px `--color-muted`; tech list right-aligned, 12.5px `--color-muted`, joined with " · ". Rows 04–08: Heart Attack Prediction, Medical Expert System, Estin Connect, BacPrep, Lavinia.

The repo has `estin-connect-1.webp` and `bacprep-1.webp` unused by this layout. Leave them out, or add a 56px square thumbnail in the ordinal column for rows that have one — the prototype does not.

Row hover: name → `--color-heading`, whole row background unchanged. No card, no lift, no shadow.

### 2e — Projects / Limpscanner (`/projects/limpscanner`)

The most important page for a tech lead. Order:

1. "← Back to projects", 12.5px `--color-muted`.
2. 52px down: eyebrow "Production case study", h1 in Instrument Serif 66px (max-width 900px), then the intro at 18px/1.65 `--color-body-strong`, max-width 680px.
3. 48px down: three metrics in a `repeat(3,1fr)` grid, rules above and below, `1px solid var(--color-line)` between columns with 32px left padding. Values in Instrument Serif 32px: "~3,000 / scans per day in production", "2 threads / camera and decoding kept apart", "0 / native app installs required".
4. 44px down: rule on top, 36px padding, grid `340px 420px`, 44px gap, `justify-content: start`, top-aligned. Left: the screenshot at 340px, `aspect-ratio: 9/16`, cover. Right: eyebrow "In the field" and a short 15px/1.7 paragraph. (This paragraph is new copy written for the mockup — replace it or clear it with Anis.)
5. Three numbered sections, each grid `300px minmax(0,1fr)`, 56px gap, 52px apart. Left: numeral in Instrument Serif 26px `--color-muted`, then h2 in Instrument Serif 30px. Right: prose 17px/1.72 `--color-body`, max-width 680px. Content verbatim from `LimpScannerCaseStudy.tsx`: "The system", "The bug that mattered", "Making performance measurable".
6. Outcome: 64px down, `1px solid var(--color-heading)` on top (the only full-strength rule in the design), 28px padding, eyebrow "Outcome" in `--color-heading`, then the outcome paragraph set as a statement in Instrument Serif 34px/1.28 `--color-heading`, max-width 900px.

The French copy in that component is already written — keep both locales.

### 2f — Education (`/education`)

Eyebrow `04 — Education`, title, blurb, rule. One row per `EDUCATION` entry, no alternating timeline, no scroll-snap, no connecting spine: grid `160px minmax(0,1fr) 150px`, 44px gap, 32px padding, baseline-aligned, `--color-line-soft` beneath.

Left: dates 13px. For the upcoming Master 1 IA, dates in `--color-body-strong` plus an eyebrow-styled "Starting" in `--color-heading`. Middle: degree in Instrument Serif 26px, then a 12px-down flex row with the school logo on a `--color-paper` plate (24×24) and the institution line at 13.5px `--color-body-strong`, then the description at 14.5px/1.65 `--color-body`, max-width 660px. Right: the website domain right-aligned, 12px `--color-muted`, with a `↗`, linking `website`.

The `side: "left" | "right"` field in `EducationEntry` becomes dead — remove it.

### 2g — Skills (`/skills`)

Eyebrow `05 — Skills`, title, blurb, rule. One row per `SKILL_GROUPS` entry: grid `220px minmax(0,1fr)`, 44px gap, 26px padding, baseline-aligned, `--color-line-soft` beneath. Category in Instrument Serif 20px `--color-heading`; skills as a single 15px/1.7 `--color-body-strong` line joined with " · ".

No chips, no badges, no proficiency bars, no icons. This is a reference table.

### 2h — Contact (`/contact`)

Eyebrow `06 — Contact`, title "Get in Touch", blurb, rule. Grid `minmax(0,1fr) 320px`, 64px gap, 44px top padding.

Left, max-width 620px: three fields 22px apart. Each is an eyebrow label with an underlined input beneath — `1px solid var(--color-line)` bottom border only, 11px padding-bottom, 15px 300 text, placeholder in `--color-muted`. Message field has 66px of padding-bottom. Then "Send message" as an underlined CTA. On focus, the field's bottom border goes `--color-heading`.

Right: `1px solid var(--color-line)` left border, 28px padding-left, four blocks 22px apart — "Direct" (the email at 15px `--color-heading`), "Elsewhere" (GitHub ↗ / LinkedIn ↗ at 14.5px `--color-body-strong`), "Based in" (Lille, France), "Response" (Usually within a day). **Confirm the response-time claim with Anis — it is not in the repo.**

Keep the existing `app/api/contact` handler and its validation. Success and error states: replace the field group with a single line of 15px text in `--color-heading` (success) or `--color-body-strong` (error) — no toast, no colored banner, no icon.

---

## Interactions

Restraint is the point. The complete list:

- **Link hover** — color to `--color-heading`, 200ms ease.
- **CTA hover** — the underline scales in from the left, `transform: scaleX(0→1)`, 500ms `cubic-bezier(0.16,1,0.3,1)`, `transform-origin: left`. Already implemented in `PageShell`/`Hero`; keep it, recolor it.
- **Sequence-nav hover** — same rule animation on the top border, plus label to `--color-heading`.
- **List-row hover** — name to `--color-heading`. Nothing else moves.
- **Page enter** — keep `FadeInOnScroll` / `RevealText`, but cap them: opacity 0→1 with a 14px rise, 600ms `easeOut`, stagger 60ms, and only on the page header and the first content block. No per-row staggering down a long list.
- **Route change** — a plain crossfade. The old 700ms `background-color` transition can go; every route now shares one surface.
- **Focus** — `2px solid var(--color-heading)`, 4px offset. Never remove.
- **Reduced motion** — keep the existing `@media (prefers-reduced-motion: reduce)` block verbatim.

No parallax, no magnetic buttons, no tilt, no cursor effects, no scroll-jacking, no counters that animate up.

## Responsive

The prototype is desktop only (1180px). Rules for narrower viewports:

- **≥1024px** — as drawn.
- **768–1023px** — gutters to 32px; hero collapses to one column with the "Currently / From September / Available" block moving below the tagline as a three-column row; metrics stay three across; case-study section grids collapse to one column with the numeral and h2 inline.
- **<768px** — gutters 24px; single column throughout; masthead becomes name + a menu button opening the existing drawer (keep `MobileDrawer`, restyle to the new tokens: `--color-surface` background, `--color-line` border, no rounding); home display type down to `clamp(2.75rem, 11vw, 3.5rem)`; page titles to 38px; case-study title to 40px; metrics stack with `--color-line-soft` between; experience/education date columns move above their content; the projects index drops the right-hand tech column and puts tech beneath the description.
- Never let body text fall below 15px, or labels below 10.5px.

## Assets

All copied from the repo and bundled here:

| File | Used in |
| --- | --- |
| `anis.webp` | 2b portrait |
| `projects/limpscanner-1.jpeg` | 2a artifact, 2d featured, 2e case study — **720×1600 portrait**; only ever place it in a portrait or square frame, never a wide band |
| `companies/limpidius.png`, `companies/etus.png` | 2c logo plates |
| `schools/estin.png`, `schools/univ-lille.png` | 2f logo plates |

Missing: a **Limpscanner demo video still**. The prototype leaves a striped placeholder at 262×110 in 2d. The repo's resolver already looks for `{slug}-demo`; drop a file there and it appears.

Also worth capturing, none of which exist yet: a second and third Limpscanner screenshot, and any Timetable Scheduler visual (a schedule grid, a training curve). The layouts hold without them.

Icons: only two glyphs are used, `↗` and `←`, as text. No icon library is needed. `components/ui/Icons.tsx` can be reduced to whatever the palette and chat widget still require.

## Files

- `Portfolio Pages - 1a.dc.html` — all eight views, anchors `#2a`–`#2h`. Open directly in a browser.
- `support.js` — rendering harness for the above. Not part of the design.
- Source repo: `github.com/aniszad/portfolio-website`, branch `main`.

## Open questions for Anis

1. The languages row on About (FR · EN · AR) and the "Usually within a day" response line are invented — confirm or cut.
2. The "In the field" paragraph on the case study is written for the mockup — replace with his own words.
3. Fully achromatic was a judgment call. If he wants one accent back, introduce it in exactly one place (the active nav underline) and nowhere else.
