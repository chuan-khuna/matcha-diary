/**
 * The powder model: what a database record is, and the money formatting every
 * view of one shares.
 *
 * Pure and isomorphic on purpose, exactly as `lib/cultivars` is. The loader that
 * reads these records off disk lives next door in `lib/powder-data` and imports
 * `node:fs` at module scope — so anything a client component touches has to be
 * here instead. The database grid filters in the browser and the price list is
 * drawn inside a client dialog; if `formatPrice` lived beside the loader,
 * importing it would drag `fs` into the client bundle and fail the build.
 *
 * Shapes follow the data model in the stack ADR: a Powder hangs off a Brand row
 * rather than carrying a brand string, and origin, cultivars and taste notes are
 * all rows in shared, extensible vocabularies rather than free text on the
 * record. Every one is flattened to a string here because there is no API yet
 * and a fake join buys nothing — `brand` becomes `brand.name`, `origin` becomes
 * `region.name`, and the two tag lists become arrays of slugs when it lands.
 *
 * There is no rating and no score on a powder. Ratings belong to a review, are
 * sparse and per-note, and the system has no single number by design — so a
 * powder record is described by its cultivars, its notes, its price and its
 * prose.
 */

import type { Photo } from "@/lib/photos";

/**
 * One tin, at one weight, in one packaging, for one price.
 *
 * A powder is sold in several sizes and they do not scale linearly — the 100g
 * tin is cheaper per gram than the 20g one, near enough always. That gap is the
 * thing worth showing, and it only exists if the sizes are rows rather than a
 * single price with a note beside it.
 *
 * The same holds at one weight across two containers, which is why `packaging`
 * is here: a tin costs more than a bag of the same tea and a reader comparing
 * per-gram figures needs to see which they are looking at.
 */
export type PowderSize = {
  /** Weight of the tin. */
  grams: number;
  /**
   * How that weight is packed — "Aluminium bag", "Aluminium tin" — or `null`
   * where the maker sells one weight one way and never says which.
   *
   * Here because weight alone stopped identifying a row. Honcha sells 30 g
   * twice, as a bag and as a tin, at a 140-baht difference, and without this a
   * record either drops one of the two real prices or lists the same weight at
   * two prices with nothing to say why. It is also what the lists key on: two
   * rows that agree on `grams` need something else to tell them apart.
   *
   * Free text rather than an enum, on the same reasoning as `origin`. Packaging
   * is a maker's word and the collection has seen bags, tins and caddies
   * already; a closed list here would have to grow every time a house invents a
   * container, and would be a second vocabulary to keep in step for no gain
   * that a reader of the price list can see.
   *
   * `null` rather than a default string, because most records genuinely do not
   * say. "Aluminium bag" on a tin nobody described is an invented fact, and the
   * price list is built to draw a bare weight when there is nothing to add.
   */
  packaging: string | null;
  /**
   * Retail price in baht, written the way it is written on the shelf — `1050`
   * for a whole-baht price, `1000.50` when there are satang.
   *
   * A plain number rather than an integer count of satang, because a record is
   * transcribed by hand and `105000` is a price nobody can check at a glance.
   * The cost is the usual one: these are floats, so they are exact to read and
   * to divide but must not be accumulated. Nothing here does — the only
   * arithmetic is the per-gram division, which is displayed and never stored —
   * and a real till system with totals to sum would keep minor units instead.
   */
  price: number;
};

export type Powder = {
  /**
   * `<brand-slug>/<slug>` — where the record sits under `content/database`, and
   * its identity while there is no database to issue one.
   *
   * The path rather than the bare slug, because a slug is only unique inside its
   * brand: two houses may both sell a Wako and both are correct. Becomes a
   * UUIDv7 primary key when the API is real; nothing outside the loader reads
   * the shape of it, only its uniqueness.
   */
  id: string;
  /** The file's basename — unique within the brand, not across the collection. */
  slug: string;
  /** One row in the Brand table — "Ippodo" is one brand, not two strings. */
  brand: string;
  /** The directory the record sits in, which is what groups the collection. */
  brandSlug: string;
  /** The blend name, as the maker prints it. */
  name: string;
  /**
   * Where the leaf was grown, as "town, prefecture".
   *
   * A fact about the tea rather than about the company, which is why it is not
   * folded into the brand: Aiya is an Aichi house and Ippodo a Kyoto one, but a
   * Kyoto house can and does sell a Kagoshima single cultivar, and the growing
   * region is the half that shows up in the cup.
   *
   * Becomes a Region row on the same terms as Brand and Cultivar — one row for
   * Uji rather than seven strings, so it can be counted, filtered and spelled
   * one way.
   */
  origin: string;
  /**
   * Tags, not shares: a blend lists what is in it and never in what ratio,
   * because no maker publishes that and inventing a percentage would read as a
   * fact. A single-cultivar powder is a list of one.
   */
  cultivars: string[];
  /**
   * The record's opening paragraph, as plain text, for the card's three-line
   * clamp.
   *
   * Derived from the body at build time rather than stored beside it. The long
   * form is the file's markdown and the card cannot draw markdown inside a line
   * clamp, but a hand-written second copy of the same sentence is a field that
   * can fall out of step with the paragraph it summarises — the same objection
   * that keeps price-per-gram a division rather than a column.
   */
  excerpt: string;
  /**
   * Taste notes, from the same shared vocabulary the reviews draw on. This is
   * what the search field and the filter chips both read: notes repeat across
   * records on purpose, so filtering by one returns a set rather than a row.
   */
  notes: string[];
  /**
   * The tins this powder is sold in, smallest first. Ordered in the record
   * rather than sorted at render, because the order is a property of the range a
   * maker offers and not of the page that draws it.
   */
  sizes: PowderSize[];
  /**
   * The record's photographs, cover first.
   *
   * One field rather than a cover plus a count, on the same reasoning as the
   * feed's: two fields can disagree and this one cannot. Empty is a record with
   * no photograph, length 1 is a bare cover, and the overlay counter reports
   * the length.
   *
   * A `Photo` is either a real file or a gradient stand-in — see `lib/photos`
   * for why that is one type rather than two fields. Records transcribed from a
   * maker's own scans carry files; the rest still carry seeds, and their seeds
   * sit in their own band, well clear of the feed's 0–7 and the avatars' 100+.
   * Seeds are a global namespace over one generator, so an overlap would put
   * the same picture on a powder tin and on someone's cup — which reads as a
   * bug rather than as a coincidence.
   */
  photos: Photo[];
};

/* -------------------------------------------------------------------------- */
/* Money                                                                      */
/* -------------------------------------------------------------------------- */

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

export const formatPrice = (size: PowderSize): string =>
  priceFormat.format(size.price);

/**
 * A React key for one row of a price list, unique within the powder that owns
 * it.
 *
 * Weight alone was the key until a record listed 30 g twice — a bag and a tin —
 * and two rows with the same key is a rendering bug React reports at runtime
 * rather than a build failure. Weight and packaging together is what a maker
 * actually varies, and a house selling the same weight in the same container at
 * two prices is a record that is wrong rather than a key that is too narrow.
 *
 * Here rather than in either list, because both draw the same rows and a key
 * spelled twice is two chances to fix only one of them.
 */
export const sizeKey = (size: PowderSize): string =>
  `${size.grams}-${size.packaging ?? ""}`;

/**
 * Derived at the edge rather than stored beside the price. Two fields for one
 * fact can disagree — a corrected price with a stale rate beneath it is a
 * plausible bug and an invisible one — and this one is a division.
 */
export const formatPricePerGram = (size: PowderSize): string =>
  `${perGramFormat.format(size.price / size.grams)}/g`;

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Everything one keystroke is matched against, as a single lowercased string:
 * blend name, brand, cultivars, taste notes.
 *
 * One string rather than four `some` passes per record, and built once per
 * collection rather than once per keystroke — the same reasoning as the cultivar
 * index's `haystack`. The text does not change while someone types; only the
 * query does.
 *
 * The four fields are the four a person has a word for before they open the
 * page: a tin they half remember, a house they trust, a cultivar they are
 * chasing, a flavour they are in the mood for. Origin is deliberately not in
 * here — adding it is one line, but "kyoto" would then return two thirds of the
 * collection, which is a filter that has stopped narrowing.
 *
 * Prose is not in here either, and should not be: matching the description would
 * make a record hit on a word its author used in passing, and the reader cannot
 * see why the row came back.
 */
export function powderHaystack(powder: Powder): string {
  return [powder.name, powder.brand, ...powder.cultivars, ...powder.notes]
    .join(" ")
    .toLowerCase();
}

/* -------------------------------------------------------------------------- */
/* Comparison                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * How many powders the comparison holds.
 *
 * Five is a reading limit rather than a technical one. The table gives each
 * column 15rem before it scrolls, so five is already wider than a laptop and is
 * read by scrolling sideways — past that the first column has left the screen
 * before the last arrives, and a comparison you cannot see at once has stopped
 * being one.
 */
export const MAX_COMPARE = 5;

/**
 * The comparison's URL: `?p1=<id>&p2=<id>…`, one numbered slot per powder.
 *
 * Numbered rather than a repeated `?p=` or one comma-joined value, because the
 * slot number is what makes a column's position part of the address — reorder
 * the comparison and the URL says so, and a link someone sends opens with the
 * columns where they left them.
 *
 * The value is `Powder.id`, which is already `<brand-slug>/<slug>` and already
 * what `/database/<brand>/<slug>` is built from — so the same identity spells
 * the record's page and its column here. The slash is left unencoded: it is
 * legal in a query value, and `?p1=mtch/zairai` can be read at a glance in a
 * way that `%2F` cannot.
 *
 * Renumbering is deliberate and happens on every build of this href. Dropping
 * the middle of `p1,p2,p3` yields `p1,p2` rather than `p1,p3` — a gap would
 * make two different URLs mean the same comparison, and the parser would then
 * have to decide whether `p3` alone is the third column or the first.
 */
export function compareHref(ids: string[]): string {
  const slots = ids
    .slice(0, MAX_COMPARE)
    .map((id, index) => `p${index + 1}=${id}`);

  return slots.length === 0
    ? "/database/compare"
    : `/database/compare?${slots.join("&")}`;
}

/**
 * What the compare page's picker needs, and nothing else.
 *
 * The picker is a client component holding the whole collection so it can
 * search it, which means every field on every record crosses into the RSC
 * payload. A full `Powder` carries an `excerpt` — a paragraph — plus sizes,
 * photo seeds and an origin, and the picker draws none of them: it lists a name
 * and a brand, and matches against text. Forty-nine paragraphs in the payload
 * to render forty-nine two-word rows is the same waste `toCardData` exists to
 * avoid on the cultivar index.
 *
 * `haystack` is precomputed here for the same reason it is there: the text a
 * query is matched against does not change while someone types, only the query
 * does.
 */
export type PowderPick = {
  id: string;
  name: string;
  brand: string;
  haystack: string;
};

export function toPickData(powder: Powder): PowderPick {
  return {
    id: powder.id,
    name: powder.name,
    brand: powder.brand,
    haystack: powderHaystack(powder),
  };
}

/**
 * The ids a comparison URL names, in slot order.
 *
 * Reads `p1` through `p5` and nothing else: an unknown key is ignored rather
 * than guessed at, and a slot that repeats an id already taken is dropped, so a
 * hand-edited URL cannot put one powder in two columns and make the table look
 * like it is comparing a tin against itself.
 *
 * Whether an id names a real record is not decided here — that needs the
 * collection, which the loader has and this module deliberately does not.
 */
export function comparedIds(
  params: Record<string, string | string[] | undefined>,
): string[] {
  const ids: string[] = [];

  for (let slot = 1; slot <= MAX_COMPARE; slot += 1) {
    const raw = params[`p${slot}`];
    // A repeated key arrives as an array. Take the first: two values for one
    // slot is a malformed URL, and picking one is friendlier than dropping the
    // column entirely.
    const id = (Array.isArray(raw) ? raw[0] : raw)?.trim();

    if (id !== undefined && id !== "" && !ids.includes(id)) ids.push(id);
  }

  return ids;
}
