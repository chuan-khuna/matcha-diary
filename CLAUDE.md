# Colour

Every colour in this repo is written in **OKLCH** — design tokens, stylesheets, markup, prose.
`oklch(L C H)`, or `oklch(L C H / A)` with alpha. `L` is a 0–1 decimal to 4 places, `C` to 4, `H` in
degrees to 2. Fully neutral values collapse to `oklch(1 0 0)` rather than carrying a meaningless hue.

Hex and `rgb()` may appear **only** as a reference beside an OKLCH value — a table column, a comment —
never as the value a stylesheet or a token file reads. When you add one, it must be the exact
round-trip of the OKLCH beside it.

Why: `L` is perceptual, so a tint is a change to `L` alone and a ramp holds its hue instead of
drifting. That property is also the check — if two shades of one colour disagree on `H`, that is a
bug the hex hid. **But do not infer contrast from `L`.** WCAG ratios are computed in sRGB; compute
them, don't estimate them.

`DESIGN.md` is the source of truth for the palette. Add a colour there before using it anywhere else.

# Artifacts

Everything under `docs/artifacts/` follows this convention — files you create there, and files you
rename or move there. Do not invent an alternative scheme.

```
docs/artifacts/
├─ adr/
│  └─ 2026-08-05-001-choose-sqlite-over-postgres.md
├─ prd/
│  ├─ 2026-08-05-004-review-sharing.md            ← main
│  ├─ 2026-08-05-004.00-review-sharing.md         ← index
│  ├─ 2026-08-05-004.01-permissions-model.md      ← detail
│  └─ 2026-08-05-004.02-share-link-expiry.md      ← detail
└─ ui-prototype/
   └─ 2026-08-05-001-matcha-diary-showcase/       ← bundle; inner files named freely
      ├─ index.html
      └─ styles.css
```

## Category

The directory name: **singular noun**, lowercase, kebab-case. One per kind of document — not per
feature, not per sprint. Prefer an existing category to a near-duplicate (`bug`, never `bugs` or
`defect`); add a new one only when a document genuinely fits none.

Examples: `adr` · `prd` · `issue` · `bug` · `spec` · `research` · `postmortem` · `ui-prototype`

## Filename

```
yyyy-mm-dd-NNN[.MM]-topic.{md,html}
```

- `yyyy-mm-dd` — date the artifact was **created**. Never changes when the file is edited.
- `NNN` — required, zero-padded to 3, starting at `001`, and **per category**: each directory keeps
  its own counter, assigned in creation order and never reused. `adr/…-001-…` and `bug/…-001-…` are
  unrelated documents and both are correct.
- `.MM` — optional sub-document number, zero-padded to 2. See below.
- `topic` — lowercase kebab-case, two to five words. No dates, no numbers, no category name.
- extension — `.md` by default; `.html` only for artifacts that must render or be interactive.

## Sub-documents (`.MM`)

Only when one artifact is too large for a single file. Three roles, all under the same `NNN`:

- `NNN-topic` — the **main** document. Always exists, and is never renamed when parts are added.
- `NNN.00-topic` — the **index**: the table of contents pointing at the details below.
- `NNN.01`, `NNN.02`, … — the **details**, each one part of the main document at depth.

Never create a `.MM` for a number that has no `NNN-topic` document, and never leave a `.01` without
its `.00`. Each detail keeps its own creation date, not the parent's.

## Bundles

When an artifact is a bundle rather than a document — a prototype with its own stylesheet and assets
— the **directory** takes the number and follows the same grammar with no extension. The files
inside it use whatever internal names they need.

## Adding one

1. Pick the category directory. Create it only if no existing category fits.
2. Find the highest `NNN` **in that directory** and add one; an empty directory starts at `001`.
   ```bash
   ls docs/artifacts/adr | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-([0-9]{3}).*/\1/' | sort -u | tail -1
   ```
3. Use today's date and a kebab-case topic.
4. Open with an `# H1` that restates the topic in prose, then the body.
