import Link from "next/link";
import { PiXLight } from "react-icons/pi";

import { PhotoPlaceholder, PhotoStandIn } from "@/components/shared/placeholders";
import { formatPrice, formatPricePerGram, type Powder } from "@/lib/powders";
import { tasteNoteChipClasses } from "@/lib/taste-notes";

/**
 * Powders side by side, one column each.
 *
 * A table rather than a row of cards, and that is the whole point of the page
 * existing separately from the grid. The grid draws each record whole, so
 * comparing two means reading two cards top to bottom and holding one in your
 * head; here every column is cut along the same rows, so a difference in origin
 * or price sits on one eye line and is read across rather than remembered.
 *
 * Rows are the facts a person actually chooses between — where it grew, what is
 * in it, what it costs per gram, what it tastes of. The description comes last
 * and is the record's own opening paragraph, not a second summary: it is there
 * to give the numbers a voice, not to be scanned across.
 *
 * Nothing is highlighted as a winner. The cheapest per gram is visible by
 * reading the row, and painting it green would spend the accent on a judgement
 * the page has no business making — DESIGN.md keeps that colour for state and
 * data, and "this is the one you want" is neither.
 *
 * Removal is a plain link back to this same page with one id dropped, so the
 * whole control surface works without JavaScript and every state of the
 * comparison is a URL someone can send.
 */
export function CompareTable({
  powders,
  hrefWithout,
}: {
  powders: Powder[];
  /** This page's URL with one powder taken out of it. */
  hrefWithout: (id: string) => string;
}) {
  return (
    // Wide content scrolls inside its own container rather than pushing the
    // page sideways — three columns of tins do not fit a phone and should not
    // try to.
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {powders.map((powder) => powder.name).join(", ")} compared by origin,
          cultivars, price and taste notes
        </caption>

        <thead>
          <tr>
            {/* The corner. Empty, because the column of row labels beneath it
                is the table's stub rather than a heading of its own. */}
            <th scope="col" className="w-32 sm:w-40" />

            {powders.map((powder) => (
              <th
                key={powder.id}
                scope="col"
                className="min-w-60 border-b border-line p-3 align-bottom font-normal"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="data-sm uppercase text-clay">
                      {powder.brand}
                    </span>
                    <Link
                      href={hrefWithout(powder.id)}
                      aria-label={`Remove ${powder.name} from the comparison`}
                      className="-m-1 shrink-0 rounded-xs p-1 text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
                    >
                      <PiXLight aria-hidden="true" size={16} />
                    </Link>
                  </div>

                  {powder.photos[0] === undefined ? (
                    <PhotoPlaceholder
                      className="aspect-[4/3] rounded-md border border-line"
                      iconSize={28}
                    />
                  ) : (
                    <PhotoStandIn
                      seed={powder.photos[0]}
                      className="aspect-[4/3] rounded-md border border-line"
                    />
                  )}

                  <Link
                    href={`/database/${powder.brandSlug}/${powder.slug}`}
                    className="text-headline-md text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
                  >
                    {powder.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <Row label="Origin" powders={powders}>
            {(powder) => (
              <span className="data-md uppercase">{powder.origin}</span>
            )}
          </Row>

          <Row label="Cultivars" powders={powders}>
            {(powder) =>
              powder.cultivars.length === 0 ? null : (
                <span className="data-md uppercase">
                  {powder.cultivars.join(" · ")}
                </span>
              )
            }
          </Row>

          {/* Not `PriceList`: that draws a two-column grid, and inside a table
              cell it would be a grid inside a column that is already one. The
              per-gram figure stays the point — it is the only number here that
              compares across tins of different sizes. */}
          <Row label="Price" powders={powders}>
            {(powder) =>
              powder.sizes.length === 0 ? null : (
                <ul className="data-md flex flex-col gap-1">
                  {powder.sizes.map((size) => (
                    <li key={size.grams}>
                      <span className="text-clay">{size.grams} g</span>{" "}
                      {formatPrice(size)}{" "}
                      <span className="text-clay">
                        ({formatPricePerGram(size)})
                      </span>
                    </li>
                  ))}
                </ul>
              )
            }
          </Row>

          <Row label="Taste notes" powders={powders}>
            {(powder) =>
              powder.notes.length === 0 ? null : (
                <ul className="flex flex-wrap gap-1.5">
                  {powder.notes.map((note) => (
                    <li key={note} className={tasteNoteChipClasses()}>
                      {note}
                    </li>
                  ))}
                </ul>
              )
            }
          </Row>

          <Row label="Description" powders={powders}>
            {(powder) => (
              <p className="text-body-excerpt text-ink-2">{powder.excerpt}</p>
            )}
          </Row>
        </tbody>
      </table>
    </div>
  );
}

/**
 * One row of the comparison.
 *
 * The label is a `th` with `scope="row"`, so a screen reader announces which
 * fact a cell belongs to as it moves across — without that a table read
 * linearly is a list of unlabelled values.
 *
 * A cell whose record has nothing to say prints an em dash rather than staying
 * blank. This is the opposite call from `FactCard`, which drops empty rows
 * entirely, and the difference is that a comparison *is* the absence: a powder
 * with no published cultivars sitting beside one with three is a fact about the
 * two, and a blank cell reads as a rendering fault instead.
 */
function Row({
  label,
  powders,
  children,
}: {
  label: string;
  powders: Powder[];
  children: (powder: Powder) => React.ReactNode;
}) {
  return (
    <tr className="align-top">
      <th
        scope="row"
        className="label-caps border-b border-line py-4 pr-3 text-clay"
      >
        {label}
      </th>
      {powders.map((powder) => {
        const content = children(powder);

        return (
          <td key={powder.id} className="border-b border-line p-3">
            {content ?? <span className="data-md text-clay">—</span>}
          </td>
        );
      })}
    </tr>
  );
}
