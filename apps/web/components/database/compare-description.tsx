"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * One record's description in a comparison column: the whole body, clipped to a
 * readable height, with a disclosure under it.
 *
 * The comparison's other rows are one line each and are read across five
 * columns on an eye line. This one is not — it is the record talking, read down
 * a single column — and left at full height it is the row that decides how tall
 * the table is: five bodies of eight paragraphs each, and the rows above are a
 * screenful of nothing while the reader scrolls past the column they are not
 * reading. Clipping puts every column back on the same footing and leaves the
 * rest of the description one click away rather than one page away.
 *
 * ## Why a height and not a line clamp
 *
 * `line-clamp` is `-webkit-box` with a line count, and it truncates the *block*
 * it is set on. A description is several blocks — paragraphs, and in some
 * records a list — so clamping the wrapper does nothing and clamping the first
 * paragraph would cut at a boundary the record did not choose. A `max-height`
 * with `overflow-hidden` cuts across the flow instead, which is the shape of
 * the thing being cut.
 *
 * The cut is mid-line by construction, so it is marked as one: a short wash to
 * `paper` at the bottom edge, which is the same "there is more this way" the
 * table's own sideways scroll relies on. Purely decorative and hidden from the
 * accessibility tree — nothing is hidden from a screen reader here, because
 * `overflow-hidden` clips the picture and not the text, and the full body is in
 * the tree whichever state the button is in.
 *
 * ## What the button is not
 *
 * Not a link, and not part of the URL. Every other control on this page is a
 * link to another address of it — because which powders are being compared is
 * the page's state, and a comparison someone can send is the point. Whether one
 * column is currently open is not that: it is a reading position, it belongs to
 * the person and not to the comparison, and putting it in the query string
 * would mean two links to the same table that disagree about nothing.
 *
 * The cost is that this is the one control here that needs JavaScript. It is
 * paid deliberately and it is bounded — the record's own page at
 * `/database/<brand>/<slug>` is a link away in the column header and carries the
 * same body at full reading width, so the description is reachable without the
 * button rather than gated behind it.
 */
export function CompareDescription({
  name,
  children,
}: {
  /** The blend, for the button's accessible name. Five "show more"s in a row
      are five identical buttons to anyone navigating by control. */
  name: string;
  /** The record's compiled MDX body, rendered on the server and handed down. */
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  // Whether there is anything behind the cut. Starts true because these bodies
  // run to several paragraphs and the short one is the exception — an
  // optimistic default flashes on the record that does not need a button
  // rather than on every record that does.
  const [clipped, setClipped] = useState(true);

  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyId = useId();

  useEffect(() => {
    const body = bodyRef.current;
    // Nothing to learn while it is open: with the height lifted, the content
    // always fits and measuring would report "fits" and take the button that
    // closes it away.
    if (body === null || expanded) return;

    const measure = () => setClipped(body.scrollHeight - body.clientHeight > 1);
    measure();

    // The column is not a fixed width — the table scrolls sideways inside a
    // page that reflows — so a body that fits at one width overflows at
    // another. Observing is cheaper and more accurate than a resize listener
    // guessing when that happened.
    const observer = new ResizeObserver(measure);
    observer.observe(body);

    return () => observer.disconnect();
  }, [expanded]);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        {/* `prose` is the floor the record page and the dialog put under the
            same body; `prose-column` is what a 15rem measure changes about it.
            See the note in `styles/globals.css`.

            The opening block loses its top margin. The MDX map gives every
            paragraph `mt-4` and the plugin's own `:first-child` reset ties with
            it and loses, which is right where prose follows a photograph and
            wrong here: inside a box clipped to eight lines, 16px above the
            first one is most of a line spent on nothing, and the cell already
            has its own padding. */}
        <div
          ref={bodyRef}
          id={bodyId}
          className={`prose prose-column [&>:first-child]:mt-0 ${expanded ? "" : "max-h-48 overflow-hidden"}`}
        >
          {children}
        </div>

        {!expanded && clipped && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-paper to-transparent"
          />
        )}
      </div>

      {clipped && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className="data-sm -ml-1.5 cursor-pointer self-start rounded-xs px-1.5 py-1 uppercase text-ink-2 transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          {expanded ? "show less" : "show more"}
          {/* Visible text first, so the accessible name still opens with the
              words on the button — WCAG's label-in-name, which voice control
              depends on. */}
          <span className="sr-only"> of the {name} description</span>
        </button>
      )}
    </div>
  );
}
