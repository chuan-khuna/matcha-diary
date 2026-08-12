import type { Powder } from "@/lib/powder-data";

/**
 * The taste-note chip, in one place because four components draw it: the feed
 * entry, the open review, a powder card, and the database's filter row. Same
 * reasoning as `navLinkClasses` — a stamped label that four files each spell
 * out is four chances for one of them to drift.
 *
 * Zero radius is the fixed point of the system and is not a parameter: a taste
 * note is a stamped label, not a bubble.
 *
 * The selected variant is the accent as *state* — a pressed filter — which is
 * why nothing else on the database page is green. Cultivars are facts about a
 * powder and stay in mono grey rather than taking the tint the prototype gave
 * them; two green chips on one card, one meaning "this is data" and the other
 * "this is switched on", is exactly the ambiguity DESIGN.md avoids by rationing
 * the colour.
 */
const CHIP_BASE =
  "rounded-none border px-2.25 py-1 font-mono text-data-sm whitespace-nowrap";

export function tasteNoteChipClasses(isSelected = false) {
  return isSelected
    ? `${CHIP_BASE} border-matcha-line bg-matcha-soft text-matcha-deep`
    : `${CHIP_BASE} border-line-strong bg-surface text-ink-2`;
}

/**
 * Every note in use, sorted and deduplicated — what the filter row offers.
 *
 * Derived from the records rather than kept as a second list beside them. A
 * hand-maintained vocabulary drifts the first time a record gains a note, and
 * offers a filter matching nothing the moment one loses its last. Sorted
 * because the order tags happen to appear in is not an order anyone looks for.
 *
 * Becomes a query against the shared Note table once the API is real; the
 * signature does not change.
 */
export function tasteNoteVocabulary(powders: Powder[]): string[] {
  return [...new Set(powders.flatMap((powder) => powder.notes))].sort();
}
