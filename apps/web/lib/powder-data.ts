/**
 * Placeholder records for the powder database, carried over from the UI
 * prototype at docs/artifacts/ui-prototype/database.html.
 *
 * The brands are real. Everything written about them here is invented — prices
 * included — and none of it should be read as a claim about an actual tin of
 * tea.
 *
 * Shapes follow the data model in the stack ADR: a Powder hangs off a Brand row
 * rather than carrying a brand string, and cultivars and taste notes are both
 * rows in shared, extensible tag vocabularies rather than free text on the
 * record. Both are flattened to strings here because there is no API yet and a
 * fake join buys nothing — `brand` becomes `brand.name` and the two tag lists
 * become arrays of slugs when it lands.
 *
 * There is no rating and no score on a powder. Ratings belong to a review, are
 * sparse and per-note, and the system has no single number by design — so a
 * powder record is described by its cultivars, its notes, its price and its
 * prose.
 *
 * Photographs are stand-ins drawn from a seed, exactly as the feed's are, and
 * they are nullable: a record with no photograph is a legitimate record. The
 * ADR hangs Photo rows off a Powder with `position` and `is_cover` rather than
 * putting a column on it, so nothing in the schema requires a cover and the
 * grid has to handle its absence — which is why two records here have none.
 * Those two draw `PhotoPlaceholder`, so a row of cards keeps one eye line.
 */

export type Powder = {
  /** UUIDv7 once the API is real. */
  id: string;
  /** One row in the Brand table — "Ippodo" is one brand, not two strings. */
  brand: string;
  /** The blend name, as the maker prints it. */
  name: string;
  /**
   * Tags, not shares: a blend lists what is in it and never in what ratio,
   * because no maker publishes that and inventing a percentage would read as a
   * fact. A single-cultivar powder is a list of one.
   */
  cultivars: string[];
  /**
   * Long form, one string per paragraph. The card clamps the first paragraph to
   * three lines rather than storing a separate excerpt — two fields would be two
   * things to keep in agreement.
   */
  description: string[];
  /**
   * Taste notes, from the same shared vocabulary the reviews draw on. This is
   * what the search field and the filter chips both read: notes repeat across
   * records on purpose, so filtering by one returns a set rather than a row.
   */
  notes: string[];
  /**
   * Retail price in **minor units** — 105000 is ฿1,050.00, since one baht is a
   * hundred satang. An integer because money in a float is a rounding bug
   * waiting for a currency with three decimal places, and because a price that
   * has to be summed or compared should never have been approximate.
   */
  priceMinor: number;
  /** Weight of the tin that price buys. */
  grams: number;
  /**
   * Seeds for the photo stand-ins, cover first. Becomes an ordered list of
   * storage keys.
   *
   * One field rather than a cover plus a count, on the same reasoning as the
   * feed's: two fields can disagree and this one cannot. Empty is a record with
   * no photograph, length 1 is a bare cover, and the overlay counter reports
   * the length.
   *
   * The seeds sit in their own band, well clear of the feed's 0–7 and the
   * avatars' 100+. Seeds are a global namespace over one generator, so an
   * overlap would put the same picture on a powder tin and on someone's cup —
   * which reads as a bug rather than as a coincidence.
   */
  photos: number[];
};

/**
 * One currency across every record, and not only because the mock is easier
 * that way: price per gram is the number this page exists to let you compare,
 * and a column mixing ฿ and $ compares nothing. A real catalogue either prices
 * in one currency or converts before it renders.
 */
const CURRENCY = "THB";

/**
 * Fixed locale rather than the visitor's. `Intl` formatting runs once on the
 * server and again when React hydrates, so a machine-dependent locale would
 * paint one string and hydrate to another — the same determinism the gradient
 * stand-ins need, for the same reason.
 *
 * English formatting with a baht amount is the deliberate pairing: the rest of
 * the interface is in English, and `narrowSymbol` is what gets ฿ rather than
 * the "THB 1,050.00" that this locale defaults to for a foreign currency.
 */
const LOCALE = "en-US";

/**
 * No trailing satang on a shelf price. Every tin here is priced in whole baht,
 * which is how they are actually written, and `maximumFractionDigits` leaves
 * room for one that is not without forcing ".00" onto the nine that are.
 */
const priceFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Per gram is the opposite case: the numbers are small, the differences between
 * them are the whole point, and a fixed two places is what lets the column be
 * read downward.
 */
const perGramFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (powder: Powder): string =>
  priceFormat.format(powder.priceMinor / 100);

/**
 * Derived at the edge rather than stored beside the price. Two fields for one
 * fact can disagree — a corrected price with a stale rate beneath it is a
 * plausible bug and an invisible one — and this one is a division.
 */
export const formatPricePerGram = (powder: Powder): string =>
  `${perGramFormat.format(powder.priceMinor / 100 / powder.grams)}/g`;

export const PLACEHOLDER_POWDERS: Powder[] = [
  {
    id: "01924f8b-0001-7000-8000-000000000001",
    brand: "Aiya",
    name: "Nishio Ceremonial",
    cultivars: ["yabukita", "okumidori"],
    description: [
      "Nishio rather than Uji, and it tastes like it: softer, nuttier, less of the marine depth and more of a toasted sweetness sitting where the umami would otherwise be.",
      "Very forgiving. This is the one to hand someone who has only ever had matcha as a latte and wants to try a bowl without deciding they hate it.",
    ],
    notes: ["nutty", "toasted", "sweet finish", "light body"],
    priceMinor: 105000,
    grams: 30,
    photos: [201, 202, 203],
  },
  {
    id: "01924f8b-0002-7000-8000-000000000002",
    brand: "Horii Shichimeien",
    name: "Uji Hikari, single cultivar",
    cultivars: ["uji hikari"],
    description: [
      "A single cultivar bottled as an argument. Uji Hikari gives a sharper, more mineral umami than Samidori does — less sweet, more structured, with a stony finish that some drinkers read as a flaw and others as the whole point.",
      "It punishes bad water. Filtered and at 70° it is precise and long; straight from the tap it collapses into something metallic.",
    ],
    notes: ["mineral", "umami", "astringent", "long finish"],
    priceMinor: 185000,
    grams: 20,
    photos: [204, 205, 206, 207],
  },
  {
    // No photograph, so the card and the record sheet both draw the empty
    // frame instead of a cover.
    id: "01924f8b-0003-7000-8000-000000000003",
    brand: "Ippodo",
    name: "Sayaka-no-mukashi",
    cultivars: ["okumidori", "samidori"],
    description: [
      "The everyday one. Lighter body, brighter attack, less to think about — a powder to drink two bowls of on a Tuesday rather than one bowl of on a Sunday.",
      "Cheaper water and a careless 75° pour will not ruin it. The finish is short and clean, and a faint pea-shoot sweetness shows up more on the second bowl than the first.",
    ],
    notes: ["grassy", "light body", "citrus", "sweet finish"],
    priceMinor: 120000,
    grams: 40,
    photos: [],
  },
  {
    id: "01924f8b-0004-7000-8000-000000000004",
    brand: "Ippodo",
    name: "Ummon-no-mukashi",
    cultivars: ["samidori", "asahi", "gokou"],
    description: [
      "Dense in a way that is hard to describe without sounding like marketing. It reads marine before it reads vegetal — a nori edge under the umami — and the bitterness is present but structural, holding the shape of everything around it.",
      "The maker does not publish the blend; the cultivars tagged here are what the cup suggests rather than what the tin says. What is clear is that it was built for koicha and is grudging about anything else.",
    ],
    notes: ["marine", "umami", "thick body", "bitter"],
    priceMinor: 205000,
    grams: 40,
    photos: [208, 209, 210, 211, 212],
  },
  {
    id: "01924f8b-0005-7000-8000-000000000005",
    brand: "Marukyu Koyamaen",
    name: "Aoarashi",
    cultivars: ["okumidori", "yabukita"],
    description: [
      "The blend the cafés buy by the kilo. Loud, green, and built to survive dairy: pull it thin into oat milk and it still reads as matcha rather than as a colour.",
      "Bare, it shows its hand — a coarse grassiness and a bitterness that arrives early and then does not develop. Less a flaw than a design brief.",
    ],
    notes: ["grassy", "bitter", "astringent"],
    priceMinor: 160000,
    grams: 100,
    photos: [213, 214, 215],
  },
  {
    id: "01924f8b-0006-7000-8000-000000000006",
    brand: "Marukyu Koyamaen",
    name: "Kinrin",
    cultivars: ["samidori", "asahi"],
    description: [
      "A koicha powder that behaves badly as usucha. Ground fine enough to go to paste with very little water, and the Asahi in the blend brings a dark, nearly cocoa-like weight that Samidori on its own never reaches.",
      "Held against the tongue it thickens rather than thins. The sweetness arrives late — a good thirty seconds after the swallow — and stays longer than anything else in this list.",
    ],
    notes: ["cocoa", "thick body", "sweet finish", "long finish"],
    priceMinor: 155000,
    grams: 20,
    photos: [216, 217, 218, 219],
  },
  {
    id: "01924f8b-0007-7000-8000-000000000007",
    brand: "Marukyu Koyamaen",
    name: "Wako",
    cultivars: ["samidori"],
    description: [
      "The powder most people meet first, and the reason Samidori has the reputation it does. Sweet, round, almost edgeless — it forgives water that is too hot and a whisk that is too slow.",
      "Thin, it foams into a pale jade with a chestnut sweetness that sits at the front and never turns bitter. Thick, it flattens out; this is not a koicha powder pretending otherwise.",
    ],
    notes: ["umami", "nutty", "creamy", "sweet finish"],
    priceMinor: 135000,
    grams: 40,
    photos: [220, 221, 222],
  },
  {
    // The second record with no photograph.
    id: "01924f8b-0008-7000-8000-000000000008",
    brand: "Nakamura Tokichi",
    name: "Ogura Yama",
    cultivars: ["okumidori", "samidori", "yabukita"],
    description: [
      "Middle of everything, deliberately. The Okumidori carries the sweetness, the Samidori rounds it off, and the Yabukita keeps a little green bite so the whole thing does not turn into syrup.",
      "The most useful powder here for learning what the others are doing — nothing sticks out far enough to distract from the rest.",
    ],
    notes: ["grassy", "sweet finish", "umami"],
    priceMinor: 114000,
    grams: 30,
    photos: [],
  },
  {
    id: "01924f8b-0009-7000-8000-000000000009",
    brand: "Rocky's Matcha",
    name: "Kagoshima Saemidori",
    cultivars: ["saemidori"],
    description: [
      "Kyushu rather than Kyoto. Saemidori runs bright and citrus-adjacent, and this is ground fine enough that the astringency stays light even when the whisk is lazy.",
      "The shortest finish on this list, and that is the point — it is clean, it resets the mouth, and it does not coat anything on the way out.",
    ],
    notes: ["citrus", "astringent", "light body"],
    priceMinor: 148000,
    grams: 40,
    photos: [223, 224, 225, 226],
  },
  {
    // A bare cover: one photograph, so the card carries no counter and the
    // record sheet shows no thumbnail row.
    id: "01924f8b-0010-7000-8000-000000000010",
    brand: "Yamamasa Koyamaen",
    name: "Hatsu Mukashi",
    cultivars: ["gokou", "samidori"],
    description: [
      "Gokou is the aroma cultivar and it dominates here — the bowl smells floral before it smells like tea — while the Samidori underneath keeps the body from going thin.",
      "Silky rather than thick. Best drunk in a quiet room, because most of what is good about it happens above the liquid rather than in it.",
    ],
    notes: ["floral", "creamy", "light body"],
    priceMinor: 142500,
    grams: 30,
    photos: [227],
  },
];
