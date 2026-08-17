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

/**
 * One tin, at one weight, for one price.
 *
 * A powder is sold in several sizes and they do not scale linearly — the 100g
 * tin is cheaper per gram than the 20g one, near enough always. That gap is the
 * thing worth showing, and it only exists if the sizes are rows rather than a
 * single price with a note beside it.
 */
export type PowderSize = {
  /** Weight of the tin. */
  grams: number;
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
 * Derived at the edge rather than stored beside the price. Two fields for one
 * fact can disagree — a corrected price with a stale rate beneath it is a
 * plausible bug and an invisible one — and this one is a division.
 */
export const formatPricePerGram = (size: PowderSize): string =>
  `${perGramFormat.format(size.price / size.grams)}/g`;
