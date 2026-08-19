---
version: alpha
name: Matcha Diary
description: >-
  Warm ceramic minimal. Paper-toned surfaces, one matcha accent, monospace reserved for data,
  near-flat corners. The photographs carry the colour; the interface stays out of their way.
colors:
  primary: "oklch(0.5406 0.0773 152.71)"
  primary-hover: "oklch(0.4609 0.0652 153.33)"
  primary-container: "oklch(0.9456 0.0164 142.56)"
  primary-outline: "oklch(0.8715 0.0402 142.92)"
  on-primary: "oklch(1 0 0)"
  on-primary-container: "oklch(0.4609 0.0652 153.33)"
  background: "oklch(0.9793 0.0070 88.64)"
  surface: "oklch(1 0 0)"
  surface-sunk: "oklch(0.9497 0.0127 86.83)"
  on-surface: "oklch(0.2530 0.0133 140.45)"
  on-surface-variant: "oklch(0.4327 0.0184 136.18)"
  on-surface-muted: "oklch(0.6181 0.0204 86.17)"
  outline: "oklch(0.8650 0.0188 86.15)"
  outline-variant: "oklch(0.9225 0.0128 86.83)"
  placeholder: "oklch(0.7489 0.0195 86.16)"
  scrim: "oklch(0.2028 0.0115 139.43 / 0.62)"
  on-scrim: "oklch(1 0 0)"
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-prose:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.02em
    fontFeature: "'tnum' 1"
  data-md-caps:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08em
    textTransform: uppercase
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.04em
  data-xs:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.08em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.12em
  label-axis:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.1em
rounded:
  none: 0px
  xs: 2px
  sm: 3px
  md: 5px
  lg: 8px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  "2xl": 32px
  "3xl": 48px
  "4xl": 64px
  gutter: 24px
  timeline-gutter: 16px
  topbar-height: 60px
  content-max: 1080px
  reading-max: 720px
  timeline-max: 620px
components:
  topbar:
    backgroundColor: "oklch(0.9793 0.0070 88.64 / 0.88)"
    borderColor: "{colors.outline-variant}"
    height: "{spacing.topbar-height}"
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.data-md}"
    rounded: "{rounded.xs}"
    padding: 6px 10px
  nav-link-hover:
    backgroundColor: "{colors.surface-sunk}"
    textColor: "{colors.on-surface}"
  nav-link-active:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 9px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    borderColor: "{colors.outline}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 9px 16px
  button-ghost-hover:
    backgroundColor: "{colors.surface-sunk}"
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 9px 16px
  button-quiet-hover:
    backgroundColor: "{colors.surface-sunk}"
    textColor: "{colors.on-surface}"
  button-sm:
    typography: "{typography.data-sm}"
    padding: 5px 11px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    borderColor: "{colors.outline}"
    typography: "{typography.data-sm}"
    rounded: "{rounded.none}"
    padding: 4px 9px
  chip-hover:
    backgroundColor: "{colors.primary-container}"
    borderColor: "{colors.primary-outline}"
  chip-selected:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    borderColor: "{colors.primary-outline}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.outline-variant}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.outline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 11px 14px
  input-field-focus:
    borderColor: "{colors.primary}"
  input-field-placeholder:
    textColor: "{colors.placeholder}"
  helper-text:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.data-sm}"
  section-label:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-caps}"
  rating-cell:
    backgroundColor: "{colors.surface-sunk}"
    rounded: "{rounded.none}"
    height: 10px
  rating-cell-filled:
    backgroundColor: "{colors.primary}"
  rating-cell-editable:
    height: 22px
  rating-cell-preview:
    backgroundColor: "{colors.primary-outline}"
  rating-label:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-axis}"
  rating-value:
    textColor: "{colors.on-surface}"
    typography: "{typography.data-md}"
  photo:
    backgroundColor: "{colors.surface-sunk}"
    borderColor: "{colors.outline-variant}"
    rounded: "{rounded.md}"
  photo-cover:
    rounded: "{rounded.lg}"
  badge:
    backgroundColor: "{colors.scrim}"
    textColor: "{colors.on-scrim}"
    typography: "{typography.data-sm}"
    rounded: "{rounded.xs}"
    padding: 4px 9px
  avatar:
    backgroundColor: "{colors.surface-sunk}"
    rounded: "{rounded.full}"
    size: 34px
---

# Matcha Diary — Design System

## Overview

Matcha Diary is a diary, not a scoreboard. People log the bowl they drank, the photograph they took
of it, and what they noticed — and the interface's job is to stay out of the way of those three
things. Every surface is a warm paper tone so that photographs of green tea, which are almost always
a narrow band of green and beige, look like the brightest object on the screen.

The personality is **warm ceramic minimal**: quiet, tactile, and a little utilitarian. It should feel
like a well-kept notebook rather than a social product — dense enough to read quickly, generous
enough that nothing feels cramped, and completely free of the badges, streaks, and score-chasing
furniture that a rating app would normally accumulate.

Two rules carry more weight than anything else here, and everything downstream follows from them:

1. **Green means state or data — never decoration.** The accent appears on the active nav item, the
   filled cells of a rating bar, and the single primary action on a screen. If green is being used
   because a surface looked plain, it is being used wrongly.
2. **There is no overall score.** A cup is described by the shape of its individual taste ratings and
   by what the author wrote. Nothing is averaged, nothing collapses to a star count, and ratings
   never appear in the timeline — only on the review page. Do not add a summary number, however
   convenient it would be for sorting.

When a rule or token does not cover a case, resolve it toward *less*: fewer weights, flatter corners,
more whitespace, no new colour.

## Colors

One accent, one family of warm neutrals, and no second hue. The palette is deliberately small so that
the only saturated thing on a screen is either a photograph or a piece of interactive state.

**Every colour is authored in `oklch(L C H)`** — tokens, stylesheets, prototype markup. The sRGB
column below is a reference for design tools that still speak hex; it is not a second source of
truth. Each hex is the exact round-trip of the OKLCH value beside it, to the byte.

- **Primary — Matcha:** The one accent. Primary buttons, filled rating cells, focus rings, and the
  active-tab underline. Reaches 4.9:1 on white and 4.6:1 on paper, so it is safe for text.
- **Primary Container — Matcha Soft:** The tinted background for a selected state — the active nav
  pill, a selected taste-note chip. Always paired with Matcha Deep for text.
- **Background — Paper:** The page. Warm off-white, never pure white, because pure white makes the
  photographs look grey.
- **Surface — White:** Raised material only: cards, inputs, ghost buttons. White is the *higher*
  surface here, which inverts the usual convention and is intentional.
- **Surface Sunk:** Recessed material: the empty cells of a rating bar, hover washes, the well behind
  a photograph that has not loaded.
- **Ink / Ink 2 / Clay:** The three text weights — body copy, secondary copy, and metadata. Clay is
  the quietest and the one to watch: see Do's and Don'ts.
- **Outline / Outline Variant:** Hairlines. Outline Variant separates rows and cards; Outline is the
  stronger edge on things you can type into or press.

| Token | CSS variable | OKLCH | sRGB | Role |
| --- | --- | --- | --- | --- |
| `primary` | `--matcha` | `0.5406 0.0773 152.71` | `#4A7C59` | Accent — state and data only |
| `primary-hover` | `--matcha-deep` | `0.4609 0.0652 153.33` | `#3A6347` | Pressed/hover accent, text on tint |
| `primary-outline` | `--matcha-line` | `0.8715 0.0402 142.92` | `#C6DCC4` | Selected border, pending rating preview |
| `primary-container` | `--matcha-soft` | `0.9456 0.0164 142.56` | `#E7F0E6` | Selected background |
| `background` | `--paper` | `0.9793 0.0070 88.64` | `#FAF8F3` | Page |
| `surface` | `--surface` | `1 0 0` | `#FFFFFF` | Cards, fields, ghost buttons |
| `surface-sunk` | `--paper-sunk` | `0.9497 0.0127 86.83` | `#F2EEE5` | Empty rating cells, hover wash |
| `outline-variant` | `--line` | `0.9225 0.0128 86.83` | `#E9E5DC` | Dividers, card edges |
| `outline` | `--line-strong` | `0.8650 0.0188 86.15` | `#D8D2C5` | Interactive edges |
| `placeholder` | — | `0.7489 0.0195 86.16` | `#B3ADA0` | Field hint — 2.2:1, never load-bearing |
| `on-surface-muted` | `--clay` | `0.6181 0.0204 86.17` | `#8B8578` | Metadata — 3.5:1 on paper |
| `on-surface-variant` | `--ink-2` | `0.4327 0.0184 136.18` | `#4C5349` | Secondary text — 7.5:1 on paper |
| `on-surface` | `--ink` | `0.2530 0.0133 140.45` | `#1F241E` | Body text — 14.9:1 on paper |
| `scrim` | — | `0.2028 0.0115 139.43 / 0.62` | — | Blurred overlay behind labels on photos |

**Two inconsistencies the conversion exposed.** Both are recorded, not fixed — changing them changes
the design, which is a separate decision:

- **The accent is not one hue.** `primary` and `primary-hover` sit at H ≈ 153, but `primary-outline`
  and `primary-container` sit at H ≈ 142.7. The tints are about 10° yellower than the solids, so the
  ramp drifts as it lightens instead of holding a hue.
- **The neutral ramp changes hue at the dark end.** `background` through `on-surface-muted` are all
  H ≈ 86–89, a warm yellow-leaning grey. But `on-surface-variant` (H 136) and `on-surface` (H 140)
  are green. The family reads as "warm neutrals" at the top and as desaturated matcha at the bottom.

If either is regularised later, do it by holding H constant and moving L and C — that is the whole
reason for authoring in OKLCH — and re-check the contrast ratios afterwards rather than assuming
they survived.

**Not yet defined.** There is no error, warning, or success palette, because no screen in the current
prototype has a failure state. When validation and upload errors land, add a single `error` /
`on-error` / `error-container` triad in the same warm register — a clay-leaning red, not a pure red —
and record it here before using it. Do not improvise a status colour inline.

**Photography placeholders.** The prototype fakes uploads with eight CSS gradients (`.ph-1`–`.ph-8`)
in the green-to-beige range. The app generates them instead — one of four patterns (a linear *wash*,
a two-blob *bloom*, a *sweep* around a point, soft *strata* bands), with stops drawn from a seed and
held between H 83 and H 152, so every photograph in a review looks like a different photograph.
Either way they are stand-ins for `<img>`, not palette members; do not derive tokens from them or use
them as decorative fills.

Two properties of the generator are load-bearing rather than incidental. It is **seeded, never
random at render**: the same seed gives the same picture on the server, after hydration, and in both
the timeline and the open review. And its stops **deliberately drift in hue**, because a photograph
is not a token ramp — light across a bowl of tea changes hue as it darkens. That drift is the one
place in this repo where two stops of one gradient disagreeing on H is correct, and it is confined to
values nothing else may read.

## Typography

One split, drawn twice — once per script. It is semantic rather than aesthetic: on either side of it
sits *what a person wrote in their own voice* and *what is a recorded fact about the cup*. Reading a
screen, you can tell the two apart without reading a word.

In Latin the split is carried by family. **Inter** carries the voice — titles, diary bodies,
descriptions. **JetBrains Mono** carries the record — café name, date, handle, taste-note chips,
rating axis labels, and rating values.

- **Display (36):** One per page at most, on the design-system and empty-state headers.
- **Headlines (24 / 17):** `headline-lg` for a review title, `headline-md` for a post title in the
  feed. Both semi-bold with tightened tracking; post titles clamp at two lines.
- **Body (18 / 15):** `body-prose` (18/1.75) is the review diary body — the loosest leading in the
  system, because it is the one place people read paragraphs. `body-lg` (18/1.55) is a lead-in
  paragraph. `body-md` (15/1.6) is the default, and it is also the feed and card description —
  clamped to four lines so every post keeps the same rhythm. There was briefly a second 15px style
  for that job, `body-excerpt` at 1.65; it differed from `body-md` by 0.75px of line box, which over
  a four-line clamp is 3px of block height. Two names for one style is worse than one name, because
  it puts a choice at every call site that has no consequence and no rule to settle it. If a
  description ever needs to differ from body copy, differentiate it on something a reader can see —
  measure, colour, or a clamp baked into the style — not on 0.05 of leading.
- **Label (13, Inter, 500):** Button text. The only place Inter appears at a weight other than 400 or
  600, and the only sans label style.
- **Data (13 / 11 / 9, mono):** `data-md` for dates, cafés, handles, and rating values, with tabular
  figures so columns of numbers do not jitter. `data-sm` for chips, small buttons, and helper text.
  `data-xs` only for labels sitting on top of a photograph.
- **Data caps (13, mono, uppercase):** `data-md-caps` for a recorded value that is set in capitals —
  an origin, a cultivar list. It is a *value*, not a heading, which is what separates it from
  `label-caps`: in the powder dialog the heading "Origin" is `label-caps` at 11px and the value
  `UJI, KYOTO` beneath it is `data-md-caps` at 13px. Its 0.08em is the whole reason it is a token
  rather than `uppercase` composed onto `data-md`. Capitals need *more* tracking than lowercase, not
  less, and `data-md` is the least-tracked style in the mono set at 0.02em — so composing the two
  produced the one style in this system that was set in caps and tracked as if it were not. The
  0.08em sits between `data-md`'s 0.02em and `label-caps`'s 0.12em, nearer the latter because that
  is what capitals ask for and slightly under it because a value need not be as airy as a heading.
- **Label caps (11, mono, uppercase):** `label-caps` at 0.12em tracking for section headers such as
  TASTE NOTES. `label-axis` at 0.1em for rating axis names, which sit in a fixed 84px column and need
  the slightly tighter setting to fit. Both are uppercased in CSS, not in the source text.

Weight is used sparingly: 400 for prose, 500 for button labels and an author's display name, 600 for
headlines. Nothing is bold, and no screen shows more than these three weights.

**Italic is allowed in one place: emphasis inside a record's prose.** This rule used to read "nothing
is italic," and the records broke it the moment they were written — a cultivar history sets botanical
binomials (*Camellia sinensis* var. *assamica*), gene symbols, and journal titles, and a scientific
record cannot set those in roman. The rule was wrong rather than the content. What made it worse than
a dead rule is that believing it meant nobody loaded the face: `next/font` defaults to
`style: ['normal']`, so every one of those was a browser-synthesized oblique — the upright sheared,
with no true italic *a*, *f* or *g* — on the one surface whose whole job is comfortable reading. Inter
is now loaded with its italic, so `em` renders in a drawn face. Outside a record's prose, italic
stays unused: not for UI copy, not for emphasis in the interface's own voice, and never on a mono
style, where the recorded/authored split does the work instead.

The Thai face has no italic either, and `IBM_Plex_Sans_Thai_Looped` offers none to load — so a Thai
record's `em` is still synthesized. That is open rather than decided, and it belongs with the other
per-script work below.

### Thai

Thai is set in **IBM Plex Sans Thai Looped**, one face for both stacks. Looped (มีหัว) is the
traditional, bookish setting and the more readable one at paragraph length, which is what
`body-prose` asks for. It is the same superfamily as the rest of Plex, so its skeleton and vertical
metrics are drawn against a Latin neo-grotesque, and weights 400 / 500 / 600 map onto the three the
system already uses.

It sits directly behind the Latin face in **both** stacks rather than in a stack of its own. Fallback
is per glyph, so Latin and **digits never leave Inter or JetBrains Mono** whatever the surrounding
language — which is what preserves mono's tabular figures in a Thai interface.

**The consequence to know about:** the authored/recorded split above is Latin-only. Neither Latin
face covers Thai, and no monospace on Google Fonts covers it at all, so there is no Thai equivalent of
JetBrains Mono to reach for — a Thai café name and a Thai diary sentence are set in the same face. In
Thai that distinction has to come from somewhere other than the typeface: the mono slots already
carry `clay` colour, chip borders and label casing, and those are what remain load-bearing.

**Two rules above do not survive the script, and are open rather than decided:**

- **The tight leadings clip.** Thai stacks vowel and tone marks above and below the baseline, so it
  needs more room than Latin. `display` (1.15), `label-lg` (1.2) and `data-xs` (1.2) are too tight to
  set Thai in safely; roughly 1.3 is the floor for headings and 1.5 for anything read as text. Raise
  them per script rather than globally — the Latin scale is not wrong, it is just Latin.
- **`label-caps` and `label-axis` lose their mark.** Thai is unicameral, so `text-transform:
  uppercase` does nothing, and the 0.12em / 0.1em tracking is actively harmful: Thai does not space
  between words, so letterspacing breaks the grouping a reader uses to find word boundaries. A Thai
  section header needs a different mark — weight, colour, or a rule — not a transform that no-ops and
  a tracking that damages.

## Layout & Spacing

A 4px base scale governs everything, with the mid-range steps (12, 16, 24) doing most of the work.
Layout is single-column by intent — the timeline is a column of identical posts, and there is no
grid of cards, no masonry, and nothing promoted or featured.

Three content widths, each matched to a reading task:

- **`content-max` 1080px** — application chrome and the design-system reference. Gutter 24px.
- **`reading-max` 720px** — the review page and the compose form. Wide enough for a 3:2 cover photo,
  narrow enough that an 18px diary body stays near 70 characters per line.
- **`timeline-max` 620px** — the feed. Gutter drops to 16px so photographs get the width back on a
  phone.

The top bar is a fixed 60px, sticky and translucent with a 12px backdrop blur; the feed's tab bar
sticks beneath it at that same 60px offset. Posts are separated by a single hairline rather than by
gaps or shadows, and hover paints a sunk wash that bleeds 16px past the row so the whole post reads
as one target.

Breakpoints are few and content-driven rather than device-driven: 640px collapses the two-column
rating panel to one, 600px reflows paired form fields and drops the photo tray from four columns to
three, and 760px collapses the design-system reference grids.

## Elevation & Depth

Depth is carried almost entirely by **hairlines and tone**, not by shadow. The stack is shallow on
purpose — a diary page should feel like paper on a desk, not like cards floating over a void.

- **Level 0 — Page.** Paper background. No border, no shadow.
- **Level 1 — Resting material.** Cards, inputs, ghost buttons: white fill, 1px `outline-variant`
  border, and `0 1px 2px oklch(0.2878 0.0225 84.41 / 0.05)`. The border does the separating; the
  shadow only keeps the edge from looking printed on.
- **Level 2 — Photography.** The review cover carries `0 2px 10px oklch(0.2878 0.0225 84.41 / 0.07)`,
  the one place a shadow is allowed to be visible, because a photograph is a physical object in this
  metaphor.
- **Level 3 — Reserved.** `0 12px 32px oklch(0.2878 0.0225 84.41 / 0.10)` exists for overlays and
  menus. No current screen uses it; anything that needs it should be a genuine overlay.

Every shadow is one warm-tinted colour at H 84 — `oklch(0.2878 0.0225 84.41 / …)` — never neutral
black, and every one is low-opacity. Only the alpha changes between levels. Sticky chrome uses translucency plus blur instead of a shadow to signal that content is
passing underneath it. Recession is expressed with `surface-sunk` — an empty rating cell reads as a
groove waiting to be filled rather than as an outlined box.

## Shapes

**Corners are softened, never rounded.** The radius scale tops out at 8px and is assigned by
material, not by size — the same button is 3px whether it is 28px or 40px tall.

| Token | Value | Applied to |
| --- | --- | --- |
| `none` | `0px` | Taste-note chips, rating cells |
| `xs` | `2px` | Nav pills, labels overlaid on photos |
| `sm` | `3px` | Buttons, inputs, thumbnails, photo-tray slots |
| `md` | `5px` | Cards, feed photographs |
| `lg` | `8px` | The review cover photograph only |
| `full` | `9999px` | Brand mark and avatars only |

The zero is the load-bearing decision. A taste note is a **stamped label, not a bubble** — square
corners, monospace, no icon, no dot, no removal affordance until you hover. It is the sharpest shape
in the system and the only component that never softens, which is what makes a row of them read as a
record rather than as tags on a blog post. Rating cells share that zero for the same reason: they are
measurement, not chrome.

Circles are rationed to two things — the brand mark and avatars — so that roundness always means
"this is a person or this is the product," and never anything else.

## Components

### Buttons

Three levels, one per intent, and at most one primary per screen. **Primary** is solid matcha with
white text at 4.9:1. **Ghost** is a white fill with an `outline` border, for the several equal
secondary actions on a review (like, save, share). **Quiet** is borderless clay text for tertiary
actions such as Edit. All three sit at `sm` (3px) and depress 1px on `:active`. The `button-sm`
variant swaps the Inter label for mono `data-sm` at 11px — used for chips-as-buttons like Follow and
sort controls, so small controls read as data rather than as shrunken buttons.

### Taste-note chips

Zero radius, mono at 11px, 4px×9px padding. The resting chip is white with an `outline` border; the
selected chip fills with `primary-container` and switches its border and text to the accent family.
In the composer, chips gain a `×` and the suggestion row moves a chip into the note box on click.
Chips wrap and overflow is **cut, not scrolled** — the feed shows up to four.

### Rating bars

The signature component, and the one place the system is opinionated about interaction. Each taste
note is rated 0–5 in half steps, drawn as five zero-radius cells: filled cells are `primary`, empty
cells are `surface-sunk`, and a half value splits one cell with a hard-edged 50% gradient.

**The bar you read is the bar you click — there is no separate slider.** The same component has two
modes: read-only cells are 10px tall, editable cells are 22px. On an editable bar the left half of a
cell sets the half step and the right half sets the whole, clicking the current value clears it to
zero, hover previews the pending value in `primary-outline` (lighter than a committed value), and
arrow keys nudge by 0.5 with Home and End jumping to 0 and 5. The editable host exposes
`role="slider"` with `aria-valuenow` and `aria-valuetext`.

Axis names use `label-axis` in a fixed 84px column; values use `data-md` with tabular figures in a
34px right-aligned column, so a stack of bars aligns on both edges. **The set of axes is not fixed** —
six are suggested (umami, sweetness, bitterness, astringency, aroma, aftertaste), and the author
drops, adds, or names their own. Astringency stays separate from bitterness on purpose: one is a
taste, the other is a mouthfeel, and drinkers can tell them apart.

### Cards and photographs

Cards are white at `md` (5px) with an `outline-variant` hairline and 24px padding. Feed photographs
are 4:3 at `md`; the review cover is 3:2 at `lg` and is the only element in the system allowed an
8px corner. Thumbnails and composer slots are 1:1 at `sm`, and selection is shown with a 2px matcha
outline offset 2px — an outline, never a border, so the photograph never shifts.

### Inputs

White fill, `outline` border, `sm` radius, 11px×14px padding. Focus swaps the border to `primary` and
adds a 3px `primary-container` ring. Helper text is mono `data-sm` in clay, sitting 6px below the
field. The composer's title input is set at `headline-lg` so it reads as the headline it becomes. The
taste-note box is a bordered container that adopts the focus treatment via `:focus-within`, holding
chips and a borderless mono input on the same line.

### Overlay labels

Labels that sit on a photograph — the `1 / 6` counter, `COVER` — use the `scrim` fill with a 6px
backdrop blur and white mono text at `data-sm` or `data-xs`, at `xs` radius. This is the only context
where white text appears outside a primary button.

> **On border tokens.** `borderColor` is not in the spec's component property list, but hairline
> borders are how this system expresses hierarchy, so it is used throughout. Consumers accept
> unknown component properties; a linter may warn.

## Do's and Don'ts

- **Do** keep green for state and data — active nav, filled rating cells, focus rings, the one
  primary button per screen.
- **Don't** use green as decoration: no green dividers, no green headings, no tinted section
  backgrounds because a page looked empty.
- **Do** put anything factual in JetBrains Mono and anything authored in Inter. The family is the
  signal.
- **Don't** set a person's own words in monospace, or a date in the sans face.
- **Do** show taste ratings on the review page only.
- **Don't** introduce an overall score, an average, or a star count anywhere — not in the feed, not
  in sorting, not in a profile summary. The system has no single number by design.
- **Do** keep taste-note chips and rating cells at `rounded.none`. They are the system's fixed point.
- **Don't** round anything past `lg` (8px), and don't add a circle outside the brand mark and avatars.
- **Do** express depth with a hairline and a tone change first; reach for a shadow only for
  photography and real overlays.
- **Don't** use neutral-black shadows — every shadow is warm-tinted at H 84.
- **Do** write every colour as `oklch(L C H)`, including alpha as `oklch(L C H / A)`. Hex and `rgb()`
  belong only in a reference column beside an OKLCH value, never as the thing a stylesheet reads.
- **Don't** infer contrast from L. OKLCH lightness is perceptual and useful for building a ramp, but
  WCAG ratios are computed in sRGB — two tokens 0.2 apart in L can still fail. Measure, don't assume.
- **Do** treat `on-surface-muted` (clay) as a **large-text and non-text colour only**. At 3.5:1 on
  paper it fails WCAG AA for normal-size body copy, and the system currently uses it at 11–13px for
  metadata and helper text. Darken it toward `oklch(0.5252 0.0193 88.06)` — the same H and C, L down
  by 0.09 — before shipping anything a user must read, and never use it for an interactive label.
- **Don't** rely on `placeholder` (2.2:1) to communicate anything. It is a hint, and every field also
  needs a real label.
- **Do** ship one rating control: the bar you read is the bar you click. Keep the keyboard path
  (arrows, Home, End) and the `role="slider"` semantics wherever it appears.
- **Don't** add a second rating input — no numeric field, no separate slider, no dropdown of values.
- **Do** clamp the feed excerpt to four lines and cut chip overflow, so every post in the timeline
  holds the same height rhythm.
- **Don't** promote, feature, or visually rank a post. Every entry in the timeline is drawn
  identically.
- **Do** define an `error` palette here before building the first failure state.
- **Don't** derive colours from the `.ph-*` photo gradients; they are upload stand-ins, not tokens.

---

Reference implementation: [`docs/artifacts/ui-prototype/`](docs/artifacts/ui-prototype/) — four
clickable screens plus a living design-system page. Visual preview of this file:
[`DESIGN.html`](DESIGN.html).
