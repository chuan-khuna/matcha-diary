import type { Rating } from "@/lib/feed-data";

/** Five cells for a 0–5 rating, filled left to right. */
const CELLS = 5;

/**
 * A taste rating, read-only.
 *
 * Deliberately not a progress bar and not a star count: the cells are square
 * (`rounded.none`, the fixed point of the system) because a rating here is
 * measurement rather than chrome. Filled cells are matcha — green as data, the
 * one sanctioned use — and a half step splits a cell with a hard-edged 50%
 * gradient rather than a soft one.
 *
 * Axis names sit in a fixed 84px column and values in a 34px right-aligned
 * column with tabular figures, so a stack of these aligns on both edges.
 *
 * This is the read-only half of the component. The editable mode — the bar you
 * read is the bar you click, 22px cells, arrow-key nudges, `role="slider"` — is
 * ported from the prototype's ratings.js when the composer is built. There is
 * no second rating control; do not add a slider or a numeric field.
 */
export function RatingBar({ axis, halfSteps }: Rating) {
  return (
    <div className="grid grid-cols-[84px_1fr_34px] items-center gap-3">
      <span className="label-axis text-ink-2">{axis}</span>

      {/* The axis name and the value beside it are already readable text, so
          the bar itself carries no separate semantics. */}
      <span aria-hidden="true" className="flex gap-[3px]">
        {Array.from({ length: CELLS }, (_, cell) => {
          // 0 empty, 1 half, 2 full.
          const fill = Math.min(Math.max(halfSteps - cell * 2, 0), 2);

          return (
            <span
              key={cell}
              className={`h-2.5 flex-1 rounded-none ${
                fill === 2 ? "bg-matcha" : "bg-paper-sunk"
              }`}
              style={
                fill === 1
                  ? {
                      backgroundImage:
                        "linear-gradient(90deg, var(--matcha) 50%, var(--paper-sunk) 50%)",
                    }
                  : undefined
              }
            />
          );
        })}
      </span>

      <span className="text-right font-mono text-data-md tabular-nums text-ink">
        {(halfSteps / 2).toFixed(1)}
      </span>
    </div>
  );
}
