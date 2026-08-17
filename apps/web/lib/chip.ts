/**
 * The chip — a stamped label carrying one recorded fact.
 *
 * Taste notes drew it first; tea types and budding buckets on the cultivar index
 * are the same object doing the same job, so the geometry lives here rather than
 * being spelled out a second time and drifting.
 *
 * Zero radius is the fixed point and is not a parameter: DESIGN.md makes a chip
 * a stamp, not a bubble. Mono because the content is a fact rather than
 * something a person wrote.
 *
 * `isSelected` is the accent used as *state* — a pressed filter — which is the
 * only sanctioned green on these rows. A chip that is merely displaying data
 * stays grey, so that one page never shows two greens meaning different things.
 */
export const CHIP_BASE =
  "rounded-none border px-2.25 py-1 font-mono text-data-sm whitespace-nowrap";

export function chipClasses(isSelected = false) {
  return isSelected
    ? `${CHIP_BASE} border-matcha-line bg-matcha-soft text-matcha-deep`
    : `${CHIP_BASE} border-line-strong bg-surface text-ink-2`;
}
