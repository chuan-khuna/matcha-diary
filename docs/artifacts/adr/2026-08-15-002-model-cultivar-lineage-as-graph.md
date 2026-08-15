# Model cultivar lineage as a graph, not a tree

**Status:** Accepted · 2026-08-15

Extends the `Cultivar` row sketched in
[ADR 001](2026-08-08-001-choose-django-and-nextjs.md), which made cultivars a shared tag vocabulary
and stopped there. This ADR gives that row a record, a pedigree, and a page. It does not reopen any
part of the stack.

Prototype: [`cultivars.html`](../ui-prototype/cultivars.html) and
[`cultivar.html`](../ui-prototype/cultivar.html).

## Context

The powder database already carries cultivars, as tags: `Aoarashi` lists Okumidori and Yabukita,
`Wako` lists Samidori. That is enough to filter by and no help at all in answering the question the
tag provokes — *and what does that mean for the cup?*

It has an answer, and it is genealogical. Saemidori is Yabukita crossed with Asatsuyu, and it tastes
like the argument between them: Yabukita's structure carrying Asatsuyu's sweetness. Okumidori buds
eleven days after Yabukita, which is why the two are planted together and why they are blended
together. Asahi and Samidori were both picked out of the same Uji field within a year of each other
and behave nothing alike. A drinker who knows the pedigree can predict a powder they have never had.

So: a cultivar gets a record, and the records get wired to each other. Eight things about that
lineage constrain how it is stored and drawn. Everything else is preference.

1. **A cultivar has two parents, so lineage is not a tree.** Yabukita is a parent of four cultivars
   in the prototype set alone. Saemidori is a child of Yabukita *and* a parent of Seimei — so Seimei
   descends from Yabukita by one path and from Asatsuyu by two. Diamonds are the normal case here,
   not a pathological one, and they are precisely the interesting part.

2. **Half of the important cultivars were never bred.** Asahi, Samidori, Gokou, Ujihikari, Ujimidori
   and Komakage were *selected* out of the Uji landrace between about 1953 and 1954 — someone walked
   a field of seed-grown plants and marked one. Yabukita is the same act performed in Shizuoka in
   1908. Their parent is a population, not a plant, and drawing that as the same kind of edge as a
   deliberate cross states something false.

3. **Parentage is evidence, not fact.** SSR marker analysis across the Japanese cultivar set
   confirmed some recorded pedigrees, supplied missing fathers for others — Houshun turns out to be
   Samidori × Rokurou, Tenmyo to be Samidori × Asahi — and contradicted at least one record outright:
   Yutakamidori is registered as a selfing of Asatsuyu and reads as an outcrossing. Okumidori's
   recorded pollen parent has a reported paternity mismatch. A schema with one parent field per node
   cannot hold any of that, and a diagram that draws every line identically asserts a confidence
   the sources do not have.

4. **Parents are frequently unknown.** The same analysis confirmed *uniparental* origin for 25
   cultivars: one parent identified, the other unassigned. "Unknown" is a value this model has to
   carry deliberately, because an omitted edge and an unknown parent render identically and mean
   opposite things.

5. **Names are ambiguous and the vocabulary is shared.** `uji hikari`, `Ujihikari`, `宇治光`. The
   powder records in the prototype already spell one cultivar two ways. ADR 001 constraint 3 put tags
   in rows with a slug for exactly this reason; lineage makes it load-bearing, because an edge to the
   wrong spelling is a broken pedigree rather than a duplicated filter chip.

6. **The graph is small, curated and slow-moving.** Twenty-two nodes and twenty-seven edges in the
   prototype; a hundred nodes would be a generous ceiling for what this app cares about. It is edited
   by a curator through the Django admin (ADR 001 constraint 2) and changes a few times a year, not a
   few times a minute.

7. **It is a reference surface, not a social one.** No score, no ranking, no "best for koicha"
   ordering — `DESIGN.md` is explicit that nothing in this product collapses to a number, and a
   cultivar is described exactly as a cup and a powder are. Where a cultivar is hard to farm, that
   is a fact about farming it and not a mark against it.

8. **The design system has one accent and no second hue.** Green means state or data. Any encoding
   this feature invents has to fit inside that or not exist.

**Assumed, not confirmed:** curation stays with one or two people; the set grows toward roughly the
sixty named Japanese cultivars rather than toward the global thousands; nobody needs to model
backcrosses or polyploid crosses.

## Decision

| Concern | Choice |
| --- | --- |
| Shape | A directed acyclic graph. `CultivarParent` is an edge **table**, not a `parent_id` column |
| Landraces | Rows in `Cultivar` with `is_population = true` — one table, not two |
| Edge kind | `relation` — `cross` \| `selection` |
| Which parent | `role` — `seed` \| `pollen` \| `unassigned` |
| How well attested | `evidence` — `recorded` \| `ssr-confirmed` \| `ssr-resolved` \| `disputed` |
| Unknown parent | A row with `parent_id = NULL` and `role = unassigned`. Recorded, never omitted |
| Provenance | `source_id` on the edge, so a contested claim can cite what contests it |
| Acyclicity | Enforced in `clean()`; there is no Postgres constraint that expresses it |
| Layout | Layered (Sugiyama), computed in the browser — rank, order, place |
| Library | d3 v7 for curves, zoom and transitions. **Not** `d3.tree`, and no `d3-dag` |
| Encoding | Stroke pattern for evidence, node fill for kind. **No new colour** |
| Fallback | The same model rendered as a nested list, always present |
| Detail page | `/cultivars/<slug>` — facts, prose, its own line of descent, powders that list it |

### Lineage is a DAG — put the meaning on the edge

The adjacency-list reflex is a `parent_id` column, and it fails on constraint 1 at the first cross.
The second reflex is `mother_id` and `father_id`, which survives a cross and then fails on
everything else: it cannot express a landrace selection (one parent, and not really a parent), it
has nowhere to record that the father was identified sixty years later by a marker study, and it
turns "unknown" into a null that is indistinguishable from "not entered yet".

Every one of those is a property of the *relationship*. So the relationship is the row:

```
Cultivar        id, slug, name, name_ja, is_population,
                registered_year, registration, breeder, region_id, budding, description

CultivarParent  id, child_id, parent_id (nullable), relation, role, evidence, note, source_id

Source          id, title, url, kind, retrieved_on
```

Constraints worth writing down at creation rather than discovering:

- `UNIQUE (child_id, parent_id, role)` — Yutakamidori legitimately points at Asatsuyu twice, once
  as seed and once as pollen. It is the *role* that makes the second row distinct, not an accident.
- `CHECK (child_id <> parent_id)` — a recorded selfing is two rows naming the same parent, never a
  row naming its own child.
- `CHECK (relation <> 'selection' OR role = 'seed')` — a selection has one parent by definition.
- `CHECK (parent_id IS NOT NULL OR role = 'unassigned')` — a nameless parent is an unassigned one.
- **Acyclicity is checked in `Model.clean()`, walking ancestors before save.** Postgres has no
  constraint for it, a trigger would be worse than the check, and at this size the walk is free. A
  cycle here would hang the layout, so it is worth being loud about.

Ancestor and descendant queries are recursive CTEs. At sixty nodes there is no argument for a
closure table or a materialised path, and both would need maintaining against an admin that lets a
curator repoint an edge.

### Selection is not a cross, and a landrace is not a plant

`zairai` (在来) means seed-grown: every bush in the field is its own genotype, so a landrace is a
gene pool rather than a variety. The Uji cultivars came out of one, and Yabukita out of the Shizuoka
equivalent. Drawing that as a parentage would claim these plants have a mother, which they do not.

They are `Cultivar` rows with `is_population = true` rather than a separate `Landrace` table, and
the deciding argument is not tidiness — **zairai is sold as tea.** A powder can legitimately be
tagged with it. A separate table would force the powder-to-cultivar relation to carry two nullable
foreign keys and a check constraint, to buy a distinction one boolean already makes.

Note what is *not* stored: whether a cultivar is a selection or a cross. That is derivable from the
shape of its incoming edges, and the repo's existing habit is to derive rather than duplicate — two
fields for one fact can disagree, and this one is a `some()`. `is_population` is stored because it
is a botanical fact about the plant, not a property of the graph.

### Evidence belongs to the edge, and the drawing says which kind

| `evidence` | Means | Drawn as |
| --- | --- | --- |
| `recorded` | As registered, or as the breeder wrote it down | Solid hairline |
| `ssr-confirmed` | Recorded, and independently confirmed by marker analysis | Solid, heavier |
| `ssr-resolved` | The record named nobody here; markers supplied a name | Dashed |
| `disputed` | The record says one thing and the markers another | Dotted, and flagged |
| *(`relation = selection`)* | Not a cross — picked out of a population | Loose dashes, to a recessed node |

Weight rises with how well the claim is attested; a broken line means the record is incomplete or
wrong. A curator who cannot tell which of these applies has to pick `recorded` and cite a source,
which is the right default because it is the weakest claim, not the strongest.

This is also where the feature earns its keep as *reference* rather than trivia. Rokurou is a
cultivar selected from a landrace nobody located, absent from every published pedigree, and turns
out to be the pollen parent of three cultivars in two prefectures. That is only visible if the model
can say "the paperwork did not know this and the genetics did."

### An unknown parent is a row, not a gap

A cross with one unnamed parent gets a real edge with `parent_id = NULL`, and the diagram draws it
as a short stub ending in an open circle. It costs a row and it is the difference between a page
that says *we do not know* and a page that silently implies *there was nothing there*. Constraint 4
makes this the common case rather than an edge case.

### Drawing it — layered layout, and why not `d3.tree()`

`d3.tree()` and `d3.cluster()` lay out a `d3.hierarchy`, which permits exactly one parent per node.
Feeding a pedigree to it forces one of two lies: duplicate Yabukita once per child — at which point
the diamond that makes Seimei worth looking at has been erased — or drop an edge and claim a cross
had one parent. Neither is a styling problem, and no amount of d3 fixes it.

So `lineage.js` does the layering itself, in three steps and about sixty lines:

1. **Rank** — each node sits one column right of its *furthest* parent. Longest path from a root,
   not shortest: with shortest, an edge that skips a generation points backwards.
2. **Order** — within a column, sort by the mean position of the nodes each connects to, sweeping
   forwards and backwards. This is the barycentre heuristic, and it is what removes crossings. A
   node with nothing to average on a given sweep is *held in place* rather than given its own index
   as a stand-in barycentre — mixing those two scales drags childless nodes to the bottom of a
   column and away from their siblings, which is a bug this went through on the way here.
3. **Place** — give each node the mean height of its parents, then push apart what now overlaps and
   shift the column back to undo the drift that packing top-to-bottom always introduces.

Deterministic, so the map is the same picture every load and a screenshot in a review still matches.

**d3 still earns its place**, on everything that is not the layout: `d3.linkHorizontal` for the edge
curves, `d3.zoom` for pan and zoom, the selection join for redraws when the filter changes. Taking
`d3-dag` — which does Sugiyama properly and better — would be right at ten times the size and is not
right at this one, where the whole layout is smaller than the adapter would be.

**Generations are the axis, not years.** Placing nodes on a time axis is tempting and wrong here:
Yutakamidori was chosen in 1949 and never registered, Asahi and Samidori are 1954 selections, and
Houshun is 2006 with a 1954 parent. A time axis and a generation axis disagree, and generation is
the one the edges actually describe. Year is a label on the node.

### The cultivar record

`/cultivars/<slug>` carries the facts in mono and the prose in Inter, which is the existing rule —
a registration number is data, a description is somebody's sentence. An unrecorded fact prints
*not recorded* rather than collapsing to a blank, because a blank reads as *none*.

Two joins make it a page rather than a card:

- **Its own slice of the graph** — itself, everything upstream, everything downstream — rendered by
  the same layout over a filtered node set rather than by a second, mirrored layout.
- **Powders that list it**, which is just the reverse of the tag that already exists on every powder
  record. This is the payoff for constraint 5: the direction is only answerable because both sides
  point at one shared row instead of holding two strings that happen to match.

Taste notes on a cultivar are drawn from the same vocabulary reviews use, and the record says
plainly that they are an editorial reading — a cultivar is a tendency, and shading, harvest and the
maker's hand move a cup further than the plant does. This is the one place the feature could quietly
turn into the ranking that constraint 7 forbids, so it is labelled rather than trusted.

### Two renderings, one model

The nested list under *read it as a list* is not a courtesy copy. It is what a screen reader gets,
what prints, and what is on the page when d3 fails to load from its CDN — and it is generated from
the same array the SVG is, so the two cannot describe different pedigrees. A hand-written prose
version of the lineage would be wrong within two edits.

### No new colour

Evidence is carried by stroke pattern and node kind by fill, both drawn entirely from the existing
palette. A second hue for "disputed" would buy a `DESIGN.md` entry to say what a dash pattern
already says, and `DESIGN.md`'s own instruction when a rule does not cover a case is to resolve
toward less. **Nothing in this feature adds a colour**, which is why this ADR does not require a
`DESIGN.md` change.

The one nuance worth recording: the tint that means *cultivar* on a powder card means *matcha
cultivar* on the lineage map. It is the same idea applied one level down — on a page where
everything is a cultivar, the tint has to carry the finer distinction — and both readings are "this
is the thing the diary is about."

## Consequences

**Good.**

- Two parents, landrace selections, contested records and unknown parents are all expressible, and
  each is visible in the drawing rather than buried in a note.
- The graph is honest about what is not known, which on this subject is a lot.
- Cultivars stop being loose strings, so "which powders use Asahi" becomes a query rather than a
  substring search — the payoff ADR 001 promised for tag rows.
- No layout dependency, and a layout that fits in one screen of code.
- Sixty lines of plain JavaScript compute the model, so the same model renders as a list with no
  second implementation.
- Nothing added to the palette, and one accent still means state or data.
- Recursive CTEs mean no denormalised ancestry to keep in step with an admin that can repoint edges.

**Costs, accepted knowingly.**

- **The layout is ours, and so are its bugs.** The childless-node ordering fault above is the kind
  of thing that will recur. `d3-dag` would have been correct out of the box.
- Curation is more work per record. An edge now has a relation, a role, an evidence class and a
  source, and every one of those is a judgement somebody has to make.
- **Evidence quality is a claim about the literature and it will age.** A `disputed` edge is
  disputed as of a citation; new marker work reclassifies it, and nothing in the schema notices.
  The `Source.retrieved_on` field is the only defence and it is a weak one.
- Four inline admin rows per cultivar is a worse editing experience than two fields would be. Django
  admin inlines are adequate, not good, at graph editing.
- Acyclicity is application-enforced, so a raw SQL insert or a fixture load can create a cycle the
  ORM would have refused. The layout guards against hanging; the data would still be wrong.
- The SVG is interactive and the list is static, so the two experiences are not equivalent — only
  the information is.
- d3 is a real CDN dependency on a prototype that otherwise works offline. Pinned, and it degrades
  loudly, but it is there.

**Do these before writing feature code.**

1. Create `Cultivar`, `CultivarParent` and `Source` in one migration, with all four check
   constraints and the acyclicity check in `clean()`. Retrofitting a constraint onto rows a curator
   has already entered means fixing data, not just schema.
2. Decide the `evidence` vocabulary is closed before the first row. Adding a fifth class later means
   a fifth stroke pattern, and the drawing runs out of legible ones at about five.
3. Migrate the existing loose cultivar tags on `Powder` onto the new rows, slug-matched, and fix the
   `uji hikari` / `ujihikari` split by hand in the same change.
4. Write the seed fixture from `cultivar-data.js` — twenty-two nodes, with sources — so the admin
   opens onto real data rather than an empty table.
5. Port `lineage.js` as a React component against the same model. It has no d3-selection-specific
   state worth preserving; the layout functions are pure and move as they are.

## Alternatives considered

| Alternative | Why not |
| --- | --- |
| **`parent_id` column** (adjacency list) | Models a tree. Fails at the first cross, which is constraint 1. |
| **`mother_id` / `father_id` columns** | Survives a cross and nothing else: no landrace selection, no per-parent evidence, and "unknown" becomes a null indistinguishable from "not entered". |
| **A separate `Landrace` table** | Cleaner taxonomy, and it was the first draft. Rejected because zairai is *sold as tea*, so a powder can be tagged with it — which would force two nullable foreign keys on the powder relation as well as on the edge, to buy what one boolean says. |
| **Storing `kind`** (landrace / selection / cross) | Derivable from the incoming edges, and two fields for one fact can disagree. Stored only where it is not derivable: `is_population`. |
| **Closure table or materialised path** | Fast ancestor queries, which at sixty nodes are already free. Both need maintaining against an admin that can repoint an edge. |
| **`d3.tree()` with duplicated nodes** | The conventional workaround, and it destroys the point: Yabukita appears four times and Seimei's two paths to it become two unrelated subtrees. |
| **`d3-dag`** | Does Sugiyama properly and would have avoided our ordering bug. Rejected on size — the adapter would be bigger than the layout it replaces. The most likely thing on this page to be reversed. |
| **`d3-force`** | Non-deterministic, so the map is a different picture every load, and it dissolves the generation reading that is most of what the diagram is for. |
| **Cytoscape.js, vis.js, Graphviz via WASM** | All fine general graph tools. All several hundred kilobytes to lay out twenty-two nodes in four columns, and all with their own styling model to fight the design system with. |
| **A time axis for the horizontal** | Intuitive and wrong: Houshun is 2006 with a 1954 parent, Yutakamidori has no registration year at all. Year is a label, not a coordinate. |
| **Lineage as prose on the cultivar record** | What every tea vendor's blog does, and unqueryable, unfilterable and unable to answer "what else came out of this". |
| **Sourcing from Wikidata or an external ontology** | Would supply structure and provenance for free. Rejected for now: coverage of Japanese tea cultivars is thin, the interesting claims are in one 2021 breeding-science paper rather than in any ontology, and a curated table of sixty rows is not a data-integration problem. |
| **Colour-coding evidence** | The obvious encoding, and it needs a second hue plus a `DESIGN.md` entry. Stroke pattern already carries five classes legibly on a hairline system. |

## What would reopen this

- **The set passing roughly three hundred nodes.** SVG stops being the right renderer and the
  barycentre ordering stops being good enough. `d3-dag` and a canvas layer at the same time.
- **A curator wanting to edit the graph visually.** Admin inlines are the floor, not a design; a
  real editor is a different project.
- **Wanting to model something other than parentage** — backcross generations, clonal selections
  within a cultivar, rootstock. The DAG holds all of it; the layout does not.
- **Marker data landing for the whole set.** If `evidence` becomes almost entirely one value, the
  five stroke patterns are four more than the page needs and the encoding should collapse.
- **Anyone asking for a cultivar ranking or a score.** That is constraint 7 and `DESIGN.md`, not an
  open question — but it is the pressure this page will attract, so it is written down here.

## Sources

- Yamashita, H. et al. *Parentage analysis of tea cultivars in Japan based on simple sequence repeat
  markers.* Breeding Science 71(5), 2021 — confirmed, resolved and contested pedigrees; Rokurou;
  Houshun and Tenmyo.
- Kyoto Prefectural Tea Research Institute material on the Uji varieties, via
  [MATCHA DIRECT](https://matchadirect.kyoto/blogs/matcha-101/cultivars-of-tea-for-tencha-matcha-production-in-the-uji-area)
  and [Tealife](https://japanesetea.sg/japanese-tea-pedia/cultivars/asahi/).
- [Japanese Tea Cultivars](https://www.teanursery.com/tag/cultivar/) — per-cultivar registration data.
- [UNEARTHED gallery](https://unearthed-gallery.com/blogs/founders-blog/matcha-cultivars) and
  [Slow Social Club](https://slowsocialclub.com/blogs/journal/matcha-cultivars-understanding-their-role-in-taste-and-texture)
  — the flavour framing this feature was asked for.
