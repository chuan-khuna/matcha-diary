import Link from "next/link";
import type { ReactNode } from "react";
import { PiXLight } from "react-icons/pi";

import { CompareDescription } from "@/components/database/compare-description";
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
 * and is the record's own words in full, not a second summary: it is there to
 * give the numbers a voice, not to be scanned across.
 *
 * Which is why it is the whole body and not the opening paragraph the cards
 * clamp. Every row above this one is a fact read across five columns on an eye
 * line; this one is read down a single column, and a description cut off after
 * its first sentence is a column that stops mid-argument — the reader has to
 * open the record to finish it, which is the trip the comparison exists to save.
 * It is set smaller than the record page sets it and clipped to a few lines
 * with the rest behind a disclosure, so the whole body is here without the row
 * deciding how tall the table is; `CompareDescription` carries both calls.
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
  descriptions,
  hrefWithout,
}: {
  powders: Powder[];
  /**
   * Each powder's compiled description, by `Powder.id`.
   *
   * A node rather than a string, and passed in rather than imported: the bodies
   * are MDX modules, so only a server component can compile one, and the page
   * above is where the columns are known. A record with nothing under this key
   * draws the same em dash as any other empty cell.
   */
  descriptions: Record<string, ReactNode>;
  /** This page's URL with one powder taken out of it. */
  hrefWithout: (id: string) => string;
}) {
  return (
    // Wide content scrolls inside its own container rather than pushing the
    // page sideways — three columns of tins do not fit a phone and should not
    // try to.
    <div className="overflow-x-auto">
      {/* `border-separate` with no spacing rather than `border-collapse`,
          because a collapsed border belongs to the table rather than to a cell
          and does not travel with a sticky one — the label column would scroll
          out from under its own hairlines. Each cell draws its own bottom edge
          instead. */}
      <table className="w-full border-separate border-spacing-0 text-left">
        <caption className="sr-only">
          {powders.map((powder) => powder.name).join(", ")} compared by origin,
          cultivars, price and taste notes
        </caption>

        <thead>
          <tr>
            {/* The corner. Empty, because the column of row labels beneath it
                is the table's stub rather than a heading of its own — and
                sticky with the rest of that column, or it would slide out and
                let the first powder's photograph run under nothing. */}
            <th
              scope="col"
              className="sticky left-0 z-10 w-28 border-b border-line bg-paper sm:w-36"
            />

            {powders.map((powder) => (
              <th
                key={powder.id}
                scope="col"
                className="min-w-52 border-b border-line p-3 align-bottom font-normal sm:min-w-60"
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
              <span className="data-md-caps">{powder.origin}</span>
            )}
          </Row>

          <Row label="Cultivars" powders={powders}>
            {(powder) =>
              powder.cultivars.length === 0 ? null : (
                <span className="data-md-caps">
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

          {/* Clipped to a readable height with the rest behind a disclosure —
              see `CompareDescription` for why the cut is a height rather than a
              line clamp, and why this one control is not a link like the rest
              of the page's are. */}
          <Row label="Description" powders={powders}>
            {(powder) =>
              descriptions[powder.id] === undefined ? null : (
                <CompareDescription name={powder.name}>
                  {descriptions[powder.id]}
                </CompareDescription>
              )
            }
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
  children: (powder: Powder) => ReactNode;
}) {
  return (
    <tr className="align-top">
      {/* Sticky, and this is the point of the layout. Scrolled sideways to
          reach a fourth column, a table whose stub has left the screen is a
          grid of values with nothing saying which fact each one is — the
          reader has to scroll back to find out what they are looking at. The
          opaque `bg-paper` is load-bearing: rows have no background of their
          own, so without it the cells would scroll visibly underneath. */}
      <th
        scope="row"
        className="label-caps sticky left-0 z-10 border-b border-line bg-paper py-4 pr-3 text-clay"
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
