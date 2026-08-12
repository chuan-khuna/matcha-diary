# Matcha Diary — UI prototype

Clickable, non-production prototype of the app. Static HTML, one stylesheet, one script — no build
step. Open `index.html` in a browser; the top nav links all five pages.

| File | Screen |
|---|---|
| `index.html` | Feed — single-column timeline, uniform posts, no ratings |
| `review.html` | Review detail — gallery, diary body, taste notes, taste ratings |
| `create.html` | New entry — photo tray with cover selection, taste-note builder, click-to-rate bars |
| `database.html` | Powder database — searchable index of powders beside the open record |
| `design-system.html` | Colour, type, space, shape, controls, post anatomy |
| `styles.css` | The design system itself — all tokens live here |
| `ratings.js` | The taste-rating bar, in both its read-only and editable modes |

## Design system

**Warm ceramic minimal.** Paper-toned surfaces (`oklch(0.9793 0.0070 88.64)`), one matcha accent
(`oklch(0.5406 0.0773 152.71)`), clay neutrals. Green is reserved for state and data — active nav,
filled rating cells, primary button — never decoration.

**Colour is written in OKLCH**, here and everywhere else in the repo — see `CLAUDE.md`. `styles.css`
holds every value; nothing in the markup carries a colour of its own except the photo stand-ins.

**Type.** Inter for anything the author wrote; JetBrains Mono for anything factual — café, date,
handle, taste notes, axis labels, rating values.

**Shape.** Near-flat. `r-flat 0` for taste notes and rating cells, `r-xs 2` for overlay labels and
nav, `r-sm 3` for buttons and fields, `r-md 5` for cards and photos, `r-lg 8` for the review cover
only. Circles appear in two places: brand mark and avatars.

**Taste ratings.** Each note is rated 0–5 in half steps and drawn as five segmented cells — one cell
per point. **There is no overall score** — nothing is averaged and nothing collapses to a single
number or star count. Ratings appear on the review page only, never in the feed.

**The set of notes is not fixed.** Six are suggested to start; the author drops what doesn't apply,
adds from the vocabulary, or names their own. Two reviews of the same cup can rate different things.

| Group | Notes |
|---|---|
| Default six | `umami` `sweetness` `bitterness` `astringency` `aroma` `aftertaste` |
| Texture | `body` `creaminess` `smoothness` `froth` |
| Flavour | `vegetal` `marine` `nutty` `floral` `cocoa` `roasty` |
| Impression | `freshness` `balance` |
| Custom | anything the author types |

Astringency is deliberately separate from bitterness: bitterness is a taste, astringency is the
drying, grippy feel on the tongue. Most rating systems collapse the two; drinkers can tell them
apart.

**One rating control.** The bar you read is the bar you click — there is no separate slider. Left
half of a cell sets the half step, right half sets the whole, clicking the current value clears it,
and arrow keys nudge by 0.5. Read-only bars are 10px tall; editable ones are 22px and preview the
pending value in a lighter green. Both modes come from `ratings.js`:

```html
<span class="bar-track" data-value="4.5"></span>          <!-- read  -->
<div class="axis" data-axis="umami" data-init="4.5"></div> <!-- rate  -->
```

## Powder database

A review is about one cup; a powder outlives every cup made from it. `database.html` is the
reference side of the app — one record per powder, six fields and no more:

| Field | Shape |
|---|---|
| brand | The maker |
| name | The powder or blend name |
| cultivars | Tags — the named varieties, no blend shares or ratios |
| description | Long prose — what the powder is and how it behaves |
| taste notes | Tags, from the same vocabulary the reviews use |
| photos | A cover plus a thumb strip |

Deliberately **not** here: price, grade, harvest year, stock. Those change; a powder does not.
There is also no score — a powder is described, never ranked, exactly as a cup is.

**Layout.** A card grid. Each card is the compact form of a record — cover photo with a photo
count, brand, name, cultivars, the first paragraph clamped to three lines, taste notes pinned to
the bottom edge so cards in a row line up. Clicking a card opens the full record as a sheet:
gallery, both fields of tags with their labels, and the description unclipped.

**Two kinds of tag, one chip.** Cultivars are tinted (`.chip-cv`, matcha-soft) because a cultivar
is a fact about the powder; taste notes stay neutral because they are somebody's impression. The
cultivar filter above the grid uses the same chip a third way — solid green when pressed, so an
action never looks like data.

Records are defined as one array at the bottom of `database.html`; the cultivar filter chips are
built from that array rather than hand-maintained.

## Known stand-ins

- Photos are CSS gradients (`.ph-1`–`.ph-8`). Swap for `<img>` when real uploads exist.
- Database records name real makers, but every cultivar split, description and taste note attached
  to them is invented placeholder copy. The page says so above the index.
- Fonts load from Google Fonts with a system fallback stack; the pages hold up offline.
- Interactions are demo-only (cover swap, chip add/remove, rating bars). No data layer, no routing.
