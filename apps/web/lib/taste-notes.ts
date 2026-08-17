import { chipClasses } from "@/lib/chip";
import type { Powder } from "@/lib/powders";

/**
 * The taste-note chip, in one place because four components draw it: the feed
 * entry, the open review, a powder card, and the database's filter row. Same
 * reasoning as `navLinkClasses` — a stamped label that four files each spell
 * out is four chances for one of them to drift.
 *
 * The geometry itself now lives in `lib/chip`, because the cultivar index
 * stamps tea types with the same object. This stays as the taste-note-shaped
 * door onto it: the call sites read as what they are drawing, and if taste notes
 * ever earn a treatment of their own it changes here rather than in five files.
 *
 * Cultivars are facts about a powder and stay in mono grey rather than taking
 * the tint the prototype gave them; two green chips on one card, one meaning
 * "this is data" and the other "this is switched on", is exactly the ambiguity
 * DESIGN.md avoids by rationing the colour.
 */
export function tasteNoteChipClasses(isSelected = false) {
  return chipClasses(isSelected);
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
