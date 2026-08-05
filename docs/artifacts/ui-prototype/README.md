# Matcha Diary — UI prototype

Clickable, non-production prototype of the app. Static HTML + one stylesheet, no build step.
Open `index.html` in a browser; the top nav links all four pages.

| File | Screen |
|---|---|
| `index.html` | Feed — single-column timeline, uniform posts, no ratings |
| `review.html` | Review detail — gallery, diary body, taste notes, taste ratings |
| `create.html` | New entry — photo tray with cover selection, taste-note builder, rating sliders |
| `design-system.html` | Colour, type, space, shape, controls, post anatomy |
| `styles.css` | The design system itself — all tokens live here |

## Design system

**Warm ceramic minimal.** Paper-toned surfaces (`#FAF8F3`), one matcha accent (`#4A7C59`),
clay neutrals. Green is reserved for state and data — active nav, filled score cells, primary
button — never decoration.

**Type.** Inter for anything the author wrote; JetBrains Mono for anything factual — café, date,
handle, taste notes, axis labels, score values.

**Shape.** Near-flat. `r-flat 0` for taste notes and score cells, `r-xs 2` for overlay labels and
nav, `r-sm 3` for buttons and fields, `r-md 5` for cards and photos, `r-lg 8` for the review cover
only. Circles appear in three places: brand mark, avatars, slider knob.

**Taste ratings.** Six notes (umami, sweetness, bitterness, creaminess, aroma, aftertaste), each
rated 0–10 in half steps and drawn as ten segmented cells. **There is no overall score** — nothing
is averaged and nothing collapses to a single number or star count. Ratings appear on the review
page only, never in the feed.

## Known stand-ins

- Photos are CSS gradients (`.ph-1`–`.ph-8`). Swap for `<img>` when real uploads exist.
- Fonts load from Google Fonts with a system fallback stack; the pages hold up offline.
- Interactions are demo-only (cover swap, chip add/remove, sliders). No data layer, no routing.
