# Matcha Diary — UI prototype

Clickable, non-production prototype of the app. Static HTML, no build step. Open `index.html` in a
browser; the top nav links all six screens.

| File | Screen |
|---|---|
| `index.html` | Feed — single-column timeline, uniform posts, no ratings |
| `review.html` | Review detail — gallery, diary body, taste notes, taste ratings |
| `create.html` | New entry — photo tray with cover selection, taste-note builder, click-to-rate bars |
| `database.html` | Powder database — searchable index of powders beside the open record |
| `cultivars.html` | Cultivar lineage — the pedigree graph, a key, and an index of every record |
| `cultivar.html` | Cultivar record — `?id=asahi`; facts, prose, its own line of descent |
| `design-system.html` | Colour, type, space, shape, controls, post anatomy |
| `styles.css` | The design system itself — all tokens live here |
| `ratings.js` | The taste-rating bar, in both its read-only and editable modes |
| `lineage.css` | Lineage components — nodes, edges, records. Tokens come from `styles.css` |
| `lineage.js` | The layered graph layout and its SVG renderer |
| `cultivar-data.js` | The cultivars, their parentages, and the evidence for each |

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

## Cultivar lineage

The database page treats a cultivar as a tag. `cultivars.html` gives it a record and a pedigree,
because the pedigree is most of the answer to why two powders made the same way taste unalike —
Saemidori is Yabukita crossed with Asatsuyu, and it tastes like both of them. Design rationale and
the data model are in [ADR 002](../adr/2026-08-15-002-model-cultivar-lineage-as-graph.md).

**It is a graph, not a tree.** A cross has two parents and one plant fathers several, so Seimei
reaches Yabukita by two separate paths. `d3.hierarchy` — and therefore `d3.tree` — allows one parent
per node, so `lineage.js` does the layered (Sugiyama) layout itself in about sixty lines: rank by
longest path from a root, order within a rank by the barycentre of what each node connects to, then
give each node the mean height of its parents and push apart whatever overlaps. d3 draws the curves,
the zoom and the transitions.

**Three things a pedigree has to say that a `parent` field cannot.**

| | Drawn as | Because |
|---|---|---|
| Selected from a landrace | Loose dashes to a recessed node | The Uji cultivars were *picked out of* a seed-grown population in the 1950s. Their parent is a gene pool, not a plant |
| Contested or unassigned | Dotted, and a stub ending in an open circle | "No parent" and "a parent nobody recorded" are different claims. Yutakamidori's record and its markers disagree, and both are shown |
| Confirmed by markers | A heavier solid line | SSR analysis has confirmed some pedigrees and supplied fathers for others. Weight rises with how well the claim is attested |

**Evidence is carried by stroke pattern, never by hue.** The system has one accent and it is already
spoken for; a second colour for "disputed" would buy a palette entry to say what a dash already
says. Nothing here adds to `DESIGN.md`.

**The diagram is not the only rendering.** The same array is written out as a nested list under
*read it as a list* — which is what a screen reader gets, what prints, and what is on the page when
d3 fails to load from its CDN. One data source, two renderings, so they cannot disagree.

## Known stand-ins

- Photos are CSS gradients (`.ph-1`–`.ph-8`). Swap for `<img>` when real uploads exist.
- Database records name real makers, but every cultivar split, description and taste note attached
  to them is invented placeholder copy. The page says so above the index.
- **The cultivar data is the exception: it is real.** Parentages, years, breeders and registration
  numbers are sourced from the references below. Taste notes on a cultivar record are an editorial
  reading rather than a measurement, and the page says so. Japanese names are given only where they
  could be confirmed; the rest are left blank rather than guessed.
- Fonts load from Google Fonts with a system fallback stack; the pages hold up offline. **d3 is the
  one hard CDN dependency** (`d3@7.9.0`, pinned) — without it the lineage pages fall back to the
  list view and say why.
- Interactions are demo-only (cover swap, chip add/remove, rating bars). No data layer, no routing.

## References for the cultivar data

- Yamashita et al., *Parentage analysis of tea cultivars in Japan based on simple sequence repeat
  markers*, Breeding Science 71(5), 2021 — the confirmed, resolved and contested parentages
- Kyoto Prefectural Tea Research Institute material on the Uji varieties, via
  [MATCHA DIRECT](https://matchadirect.kyoto/blogs/matcha-101/cultivars-of-tea-for-tencha-matcha-production-in-the-uji-area)
  and [Tealife](https://japanesetea.sg/japanese-tea-pedia/cultivars/asahi/)
- [Japanese Tea Cultivars](https://www.teanursery.com/tag/cultivar/) — per-cultivar registration data
- [UNEARTHED gallery](https://unearthed-gallery.com/blogs/founders-blog/matcha-cultivars) and
  [Slow Social Club](https://slowsocialclub.com/blogs/journal/matcha-cultivars-understanding-their-role-in-taste-and-texture)
  — the flavour framing this feature was asked for
