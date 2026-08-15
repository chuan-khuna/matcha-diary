/* ==========================================================================
   Matcha Diary — cultivar records and their lineage
   ==========================================================================

   Unlike the powder records in `database.html`, **this data is real**. The
   parentages, years, breeders and registration numbers below are sourced (see
   README.md); only the taste-note chips are an editorial reading rather than a
   measurement, and they are marked as such on the page.

   That difference is the point of the feature. A powder is somebody's blend and
   changes when the maker feels like it; a cultivar is a plant with a pedigree,
   and the pedigree is the thing that explains why two powders taste unalike.

   ---- Shape ---------------------------------------------------------------

   A cultivar carries a list of `parents`, and each entry is an *edge* rather
   than an id, because every interesting thing about a parentage is a property
   of the relationship and not of either plant:

     of         id of the parent, or null when the record does not name one
     relation   'cross'     — a deliberate pollination between two plants
                'selection' — one plant picked out of a seed-grown population
     role       'seed' | 'pollen' | 'unassigned'
     evidence   'recorded'      — as registered or as the breeder wrote it down
                'ssr-confirmed' — recorded, and confirmed by SSR marker work
                'ssr-resolved'  — the record had no name here; SSR supplied one
                'disputed'      — the record says one thing, the markers another
     note       why this edge is not simply 'recorded', when it is not

   Three consequences fall out of that, and all three are the reason this is a
   graph rather than a tree:

   1. **A node has two parents.** Yabukita is a parent of four cultivars here,
      and Saemidori is both a child of Yabukita and a parent of Seimei — so
      Seimei descends from Yabukita by one path and from Asatsuyu by two.
      Diamonds are the normal case.

   2. **Half of these were never bred.** The Uji cultivars were *selected* out
      of a landrace in the 1950s: someone walked a field of seed-grown plants
      and marked one. Its parent is a population, not a plant, which is why the
      landraces below are nodes with `population: true` and why the edge that
      reaches them is a `selection` rather than a `cross`.

   3. **Parentage is evidence, not fact.** Yutakamidori is recorded as a selfing
      of Asatsuyu and reads as an outcrossing; Houshun and Tenmyo had no father
      in the record until marker work named one. A field that stores a single
      parent id cannot hold any of that.

   ---- Not here -----------------------------------------------------------

   No score, no ranking, and no "best for koicha" ordering. A cultivar is
   described, exactly as a cup and a powder are (DESIGN.md). Where a cultivar is
   hard to grow or gives a low yield that is recorded as a fact about farming it,
   never as a mark against it.
   ========================================================================== */

/**
 * Landrace populations. `zairai` (在来) means seed-grown: every plant is a
 * distinct genotype, so a landrace is a gene pool rather than a variety. They
 * are drawn as nodes because the selections genuinely came out of them, and
 * drawn differently because a population is not a plant.
 *
 * Zairai is also still sold as tea, which is the argument against giving
 * landraces their own table: they are things a powder can be made from.
 */
const CULTIVARS = [
  {
    id: "uji-zairai",
    name: "Uji zairai",
    ja: "宇治在来",
    population: true,
    matcha: true,
    region: "Uji, Kyoto",
    summary: [
      "The seed-grown tea of Uji, planted from seed for centuries and therefore never one variety. Every bush in a zairai field is its own genotype, which is what made it worth searching: a grower walking those fields in the 1950s was reading a population, not a catalogue.",
      "Six of the cultivars on this page came out of this pool inside about five years. None of them was bred.",
    ],
    notes: ["umami", "vegetal", "balance"],
    parents: [],
  },
  {
    id: "shizuoka-zairai",
    name: "Shizuoka zairai",
    ja: "静岡在来",
    population: true,
    matcha: false,
    region: "Shizuoka",
    summary: [
      "The equivalent pool in Shizuoka, and the one that produced Yabukita — which now covers something close to seventy per cent of Japanese tea, all of it cuttings of a single bush somebody chose in 1908.",
    ],
    notes: ["vegetal", "astringency"],
    parents: [],
  },
  {
    id: "zairai-unknown",
    name: "Zairai, origin unknown",
    ja: "在来",
    population: true,
    matcha: false,
    region: null,
    summary: [
      "A placeholder for a landrace whose location the record does not give. Rokurou was selected from one and nobody wrote down which.",
      "It is a node rather than an absence because \"selected from a landrace we cannot name\" and \"parentage unknown\" are different claims, and collapsing them would lose the first.",
    ],
    notes: [],
    parents: [],
  },

  /* ---- Selected from a landrace ---------------------------------------- */

  {
    id: "yabukita",
    name: "Yabukita",
    ja: "やぶきた",
    population: false,
    matcha: true,
    year: 1953,
    norin: "Tea Norin No. 6",
    breeder: "Sugiyama Hikosaburō",
    region: "Shizuoka",
    budding: "The reference date — every other cultivar is early or late relative to this one",
    summary: [
      "One bush, picked out of a seedling field north of a bamboo grove in 1908 — yabu-kita, \"north of the thicket\" — and propagated by cutting ever since. Registered in 1953, and now roughly seventy per cent of all Japanese tea.",
      "It is the reference flavour rather than the best one: balanced, bright, clean, with a crisp astringency and nothing that sticks out. In matcha it is the base a blend is built on, and it is about sixty per cent of what is planted in Uji despite not being an Uji cultivar at all.",
    ],
    notes: ["balance", "vegetal", "astringency", "freshness"],
    parents: [{ of: "shizuoka-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "asatsuyu",
    name: "Asatsuyu",
    ja: "あさつゆ",
    population: false,
    matcha: false,
    year: 1953,
    norin: null,
    breeder: "National tea experiment station — tested at Kanaya from 1940 as U14.2",
    region: "Selected in Uji, Kyoto · grown mainly in Kagoshima",
    budding: "Early",
    summary: [
      "Selected out of Uji seedlings, then spent thirteen years in trials before registration. Called \"natural gyokuro\" for its theanine: sweet and thick with very little astringency even unshaded.",
      "It is barely grown as itself — it is frost-tender and awkward — but it is the sweetness in Saemidori and the whole of Yutakamidori, which makes it one of the two most consequential plants on this page.",
    ],
    notes: ["sweetness", "umami", "creaminess"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "asahi",
    name: "Asahi",
    ja: "朝日",
    population: false,
    matcha: true,
    year: 1954,
    norin: null,
    breeder: "Hirano Jinnojō, taken into testing by the Kyoto Prefectural Tea Research Institute",
    region: "Uji, Kyoto — almost nowhere else",
    budding: "Early, and the window is short",
    summary: [
      "The competition cultivar. Shaded and picked as first-flush tencha it gives a dense, sweet umami with essentially no bitterness, which is why it turns up in koicha and in the tea people enter into judging.",
      "It is also the hardest thing here to farm. The picking window is narrow enough that missing it visibly costs quality, the buds are thin and large and bruise, the roots want active drainage, and the yield is medium at best. Seventy years on it has never been registered nationally and has never left Uji.",
    ],
    notes: ["umami", "sweetness", "thick body", "aroma"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "samidori",
    name: "Samidori",
    ja: "さみどり",
    population: false,
    matcha: true,
    year: 1954,
    norin: null,
    breeder: "Koyama Masajirō",
    region: "Uji, Kyoto",
    budding: "Mid, over a long window",
    summary: [
      "The Uji cultivar that is actually planted. Vivid colour, a showy aroma and a strong, round umami, with a long picking period and a high yield — the combination that made it the base of most Uji tencha rather than a speciality.",
      "It is a parent as well as a crop: both of the Kyoto crosses below descend from it, and in both cases the father was unknown until marker work supplied one.",
    ],
    notes: ["umami", "sweetness", "aroma", "creaminess"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "gokou",
    name: "Gokou",
    ja: "ごこう",
    population: false,
    matcha: true,
    year: 1954,
    norin: null,
    breeder: "Kyoto Prefectural Tea Research Institute",
    region: "Uji, Kyoto",
    budding: "Late",
    summary: [
      "The aroma one. Shaded Gokou smells floral and almost sweet before the bowl reaches the mouth, and most of what is good about it happens above the liquid rather than in it.",
      "Thin-bodied on its own, so it is usually a component rather than a solo powder — a blend uses it for the top note and something rounder underneath for the body.",
    ],
    notes: ["floral", "aroma", "sweetness", "light body"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "ujihikari",
    name: "Ujihikari",
    ja: "宇治光",
    population: false,
    matcha: true,
    year: 1954,
    norin: null,
    breeder: "Kyoto Prefectural Tea Research Institute",
    region: "Uji, Kyoto",
    budding: "Mid",
    summary: [
      "Pale in the bowl and precise in the mouth: a refined, structured umami with the bitterness almost absent, and a mineral edge where Samidori would be sweet.",
      "The yield is low, which is the whole reason it is rarer and dearer than its quality alone would explain. With Asahi and Samidori it is one of the three the prefecture names as its main tencha cultivars.",
    ],
    notes: ["umami", "mineral", "long finish"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "ujimidori",
    name: "Ujimidori",
    ja: "うじみどり",
    population: false,
    matcha: true,
    year: null,
    norin: null,
    breeder: "Kyoto",
    region: "Uji, Kyoto",
    summary: [
      "Another of the Kyoto landrace selections, and one of the quieter ones — grown for tencha in small quantity, rarely named on a tin.",
    ],
    notes: ["umami", "vegetal"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "komakage",
    name: "Komakage",
    ja: "駒影",
    population: false,
    matcha: true,
    year: null,
    norin: null,
    breeder: "Kyoto",
    region: "Uji, Kyoto",
    summary: [
      "A Kyoto selection from the same era and the same pool, kept in cultivation for tencha on a small scale.",
    ],
    notes: ["umami", "balance"],
    parents: [{ of: "uji-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "rokurou",
    name: "Rokurou",
    ja: "六郎",
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: null,
    region: null,
    summary: [
      "A cultivar nobody would have put on a poster, and one of the more quietly important plants here. It was selected from a landrace of unknown origin, and until SSR markers were run across the Japanese cultivar set it appeared in nobody's pedigree.",
      "It turns out to be the pollen parent of three cultivars below, in two different prefectures. Every edge leaving it is dashed for that reason: it is on this page because of the genetics, not because of the paperwork.",
    ],
    notes: [],
    parents: [{ of: "zairai-unknown", relation: "selection", role: "seed", evidence: "recorded" }],
  },
  {
    id: "shizuoka-zairai-16",
    name: "Shizuoka Zairai No. 16",
    ja: null,
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: "National tea research station, Kanaya",
    region: "Shizuoka",
    summary: [
      "A numbered landrace selection held as breeding stock rather than released as a cultivar. It exists on this page only as the recorded pollen parent of Okumidori — and that record is the one the marker work disagrees with.",
    ],
    notes: [],
    parents: [{ of: "shizuoka-zairai", relation: "selection", role: "seed", evidence: "recorded" }],
  },

  /* ---- Crosses --------------------------------------------------------- */

  {
    id: "okumidori",
    name: "Okumidori",
    ja: "おくみどり",
    population: false,
    matcha: true,
    year: 1974,
    norin: "Tea Norin No. 32",
    breeder: "National tea research station, Kanaya",
    region: "Widely planted — Kyoto, Shizuoka, Kagoshima",
    budding: "Late — around eleven days after Yabukita, which is what oku means",
    summary: [
      "Deep green, full-bodied and frankly astringent, and it holds its colour better than almost anything else after grinding — which is why it is in so many blends and so many lattes.",
      "It buds about eleven days after Yabukita. That is an agricultural fact before it is a flavour one: it spreads the harvest, so a grower can pick Yabukita and Okumidori off the same labour rather than at once.",
      "Its recorded father is a numbered Shizuoka landrace selection, and DNA work has reported that the paternity does not match. The cross is not in doubt; the name on the pollen side is.",
    ],
    notes: ["umami", "sweetness", "astringency", "thick body"],
    parents: [
      { of: "yabukita", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "shizuoka-zairai-16",
        relation: "cross",
        role: "pollen",
        evidence: "disputed",
        note: "Registered as the pollen parent; marker work has reported a paternity mismatch, so the true father is effectively unassigned.",
      },
    ],
  },
  {
    id: "saemidori",
    name: "Saemidori",
    ja: "さえみどり",
    population: false,
    matcha: true,
    year: 1990,
    norin: "Tea Norin No. 40",
    breeder: "Makurazaki research station, Kagoshima — crossed 1969",
    region: "Kagoshima and Kyushu generally",
    budding: "Early",
    summary: [
      "Yabukita's structure with Asatsuyu's sweetness, which is exactly what it was crossed for and unusually close to what it delivers. The name means \"clear green\", and the colour is the first thing anyone notices.",
      "Low astringency, bright and citrus-adjacent, with a short clean finish. Twenty-one years between the cross and the registration, and its pedigree is one of the few here that markers have confirmed outright.",
    ],
    notes: ["sweetness", "citrus", "freshness", "light body"],
    parents: [
      { of: "yabukita", relation: "cross", role: "seed", evidence: "ssr-confirmed" },
      { of: "asatsuyu", relation: "cross", role: "pollen", evidence: "ssr-confirmed" },
    ],
  },
  {
    id: "yutakamidori",
    name: "Yutakamidori",
    ja: "ゆたかみどり",
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: "National tea research station, Kanaya — chosen 1949, designated U14-1 in 1950",
    region: "Kagoshima — around 95% of it, and roughly a third of the prefecture's tea",
    budding: "Very early",
    summary: [
      "Never registered, and second only to Yabukita by planted area. Unshaded and lightly processed it brews reddish and grips; deep-steamed, fired hot and shaded it turns rich, green and mildly sweet with a nutty edge. Almost none of its reputation is inherent — it is a cultivar defined by how it is handled.",
      "The record says it is a selfing of Asatsuyu. Marker work reads it as an outcrossing, which would mean the second parent is somebody else and nobody knows who. Both edges are drawn, and the second is marked as contested rather than quietly deleted.",
    ],
    notes: ["nutty", "astringency", "thick body"],
    parents: [
      { of: "asatsuyu", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "asatsuyu",
        relation: "cross",
        role: "pollen",
        evidence: "disputed",
        note: "Recorded as a selfing, so Asatsuyu appears on both sides. SSR analysis reads it as an outcrossing instead, which would leave the pollen parent unidentified.",
      },
    ],
  },
  {
    id: "surugawase",
    name: "Surugawase",
    ja: "するがわせ",
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: "Shizuoka",
    region: "Shizuoka",
    budding: "Early",
    summary: [
      "A sencha cultivar, on this page for what it demonstrates rather than for what it tastes like. The register lists it as a child of Yabukita and stops there; markers named Rokurou as the father.",
    ],
    notes: ["freshness", "vegetal"],
    parents: [
      { of: "yabukita", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "rokurou",
        relation: "cross",
        role: "pollen",
        evidence: "ssr-resolved",
        note: "The record named only Yabukita. SSR analysis identified Rokurou as the pollen parent.",
      },
    ],
  },
  {
    id: "yamanoibuki",
    name: "Yamanoibuki",
    ja: "やまのいぶき",
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: "Shizuoka",
    region: "Shizuoka",
    summary: [
      "The same story as Surugawase and the same two parents — which is the point. Two cultivars registered decades apart as \"offspring of Yabukita\" turn out to be full siblings.",
    ],
    notes: ["vegetal", "balance"],
    parents: [
      { of: "yabukita", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "rokurou",
        relation: "cross",
        role: "pollen",
        evidence: "ssr-resolved",
        note: "The record named only Yabukita. SSR analysis identified Rokurou as the pollen parent.",
      },
    ],
  },
  {
    id: "houshun",
    name: "Houshun",
    ja: "鳳春",
    population: false,
    matcha: true,
    year: 2006,
    norin: null,
    breeder: "Kyoto Prefectural Tea Research Institute",
    region: "Uji, Kyoto — small area",
    summary: [
      "Kyoto's modern one, and still barely planted. It is used for both gyokuro and tencha, and the prefecture rates it alongside Samidori and Ujihikari rather than below them.",
      "It was raised from open-pollinated Samidori seed, meaning the mother was known and the father was whatever the wind brought. Markers later named Rokurou — a plant from a landrace nobody located, turning up in a Kyoto pedigree.",
    ],
    notes: ["umami", "sweetness", "aroma"],
    parents: [
      { of: "samidori", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "rokurou",
        relation: "cross",
        role: "pollen",
        evidence: "ssr-resolved",
        note: "Raised from naturally pollinated Samidori seed, so the father was unrecorded. SSR analysis identified Rokurou.",
      },
    ],
  },
  {
    id: "tenmyo",
    name: "Tenmyo",
    ja: null,
    population: false,
    matcha: true,
    year: null,
    norin: null,
    breeder: "Kyoto",
    region: "Uji, Kyoto — small area",
    summary: [
      "Also raised from open-pollinated Samidori seed, and also unattributed on the father's side until markers were run. The answer here was Asahi — so Kyoto's two most demanding tencha cultivars had quietly crossed in a field.",
    ],
    notes: ["umami", "aroma"],
    parents: [
      { of: "samidori", relation: "cross", role: "seed", evidence: "recorded" },
      {
        of: "asahi",
        relation: "cross",
        role: "pollen",
        evidence: "ssr-resolved",
        note: "Raised from naturally pollinated Samidori seed, so the father was unrecorded. SSR analysis identified Asahi.",
      },
    ],
  },
  {
    id: "fushun",
    name: "Fushun",
    ja: "ふうしゅん",
    population: false,
    matcha: false,
    year: null,
    norin: null,
    breeder: "Makurazaki research station, Kagoshima",
    region: "Kagoshima",
    /* Its own parentage is not in this dataset, so it carries an explicit
       unassigned edge rather than an empty list — otherwise the layout would
       rank it as a landrace root, which it is not. */
    rankHint: 2,
    summary: [
      "Here as the mother of Seimei. Its own parentage is not recorded in this dataset, which is a gap in the data rather than a claim about the plant — so it is drawn with an unassigned parent stub rather than as a root.",
    ],
    notes: [],
    parents: [{ of: null, relation: "cross", role: "unassigned", evidence: "recorded", note: "Not recorded in this dataset." }],
  },
  {
    id: "seimei",
    name: "Seimei",
    ja: "せいめい",
    population: false,
    matcha: true,
    year: 2020,
    norin: null,
    breeder: "Makurazaki research station, Kagoshima — crossed 1992",
    region: "Kagoshima",
    budding: "Early",
    summary: [
      "The youngest cultivar here and the one furthest from a landrace: a grandchild of Yabukita and of Asatsuyu on both sides of its own pedigree, by way of Saemidori.",
      "Vivid colour and a high amino-acid umami like Saemidori, but with the yield and the frost tolerance that keep Saemidori a speciality rather than a crop. Sources disagree on the registration date — a plant variety registration in 2017 and a cultivar registration in 2020 are both cited.",
    ],
    notes: ["umami", "sweetness", "freshness"],
    parents: [
      { of: "fushun", relation: "cross", role: "seed", evidence: "recorded" },
      { of: "saemidori", relation: "cross", role: "pollen", evidence: "recorded" },
    ],
  },
];

/**
 * The powder side of the join, trimmed to what a cultivar record needs to show:
 * "powders in this database that list me". Copied from `database.html`, where
 * the brands are real and everything written about them is invented.
 *
 * The `cultivars` arrays here reference cultivar ids. In the prototype they are
 * loose strings on both sides and agree only because one person typed both — in
 * the app they become the same shared row, which is the point of the tag
 * vocabulary in the stack ADR.
 */
const POWDERS = [
  { brand: "Aiya", name: "Nishio Ceremonial", cultivars: ["yabukita", "okumidori"] },
  { brand: "Horii Shichimeien", name: "Uji Hikari, single cultivar", cultivars: ["ujihikari"] },
  { brand: "Ippodo", name: "Sayaka-no-mukashi", cultivars: ["okumidori", "samidori"] },
  { brand: "Ippodo", name: "Ummon-no-mukashi", cultivars: ["samidori", "asahi", "gokou"] },
  { brand: "Marukyu Koyamaen", name: "Aoarashi", cultivars: ["okumidori", "yabukita"] },
  { brand: "Marukyu Koyamaen", name: "Kinrin", cultivars: ["samidori", "asahi"] },
  { brand: "Marukyu Koyamaen", name: "Wako", cultivars: ["samidori"] },
  { brand: "Nakamura Tokichi", name: "Ogura Yama", cultivars: ["okumidori", "samidori", "yabukita"] },
  { brand: "Rocky's Matcha", name: "Kagoshima Saemidori", cultivars: ["saemidori"] },
  { brand: "Yamamasa Koyamaen", name: "Hatsu Mukashi", cultivars: ["gokou", "samidori"] },
];

/**
 * How each edge is drawn, and the sentence the legend and the tooltips both
 * read from. One definition per evidence class so the key on the map and the
 * prose on a record can never drift apart.
 *
 * Evidence is carried by stroke pattern rather than by colour, deliberately.
 * The design system has one accent and it means state or data — a second hue
 * for "disputed" would be a new palette entry bought to say something a dash
 * pattern already says.
 */
const EVIDENCE = {
  recorded: {
    label: "recorded",
    blurb: "As registered, or as the breeder wrote it down.",
  },
  "ssr-confirmed": {
    label: "confirmed",
    blurb: "Recorded, and independently confirmed by SSR marker analysis.",
  },
  "ssr-resolved": {
    label: "resolved by markers",
    blurb: "The record named no parent here. SSR marker analysis supplied one.",
  },
  disputed: {
    label: "contested",
    blurb: "The record says one thing and the markers another. Drawn, and flagged.",
  },
  selection: {
    label: "selected from",
    blurb: "Not a cross — one plant picked out of a seed-grown population.",
  },
};
