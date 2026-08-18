import type { Metadata } from "next";
import Link from "next/link";

import { ComparePicker } from "@/components/database/compare-picker";
import { CompareTable } from "@/components/database/compare-table";
import { allPowders } from "@/lib/powder-data";
import {
  compareHref,
  comparedIds,
  MAX_COMPARE,
  toPickData,
} from "@/lib/powders";

/**
 * Powders side by side.
 *
 * The database grid answers "what is there"; this answers "which of these two".
 * They are different enough to be different pages: a grid draws each record
 * whole so you can read one, and this cuts every record along the same rows so
 * you can read across. Trying to be both is what produces a grid with a compare
 * mode bolted onto it.
 *
 * ## The comparison is the URL
 *
 * `?p1=<brand>/<slug>&p2=…`, up to five, and there is no other state. Adding,
 * removing and reordering are all links to another address of this same page,
 * which means every comparison anyone can reach is one they can send — the
 * thing a dialog cannot do, and the reason the record pages exist too.
 *
 * See `compareHref` and `comparedIds` in `lib/powders` for the contract: why
 * the slots are numbered rather than repeated, why the id keeps its slash, and
 * why removing a middle column renumbers the rest.
 *
 * Dynamic rather than static, and unavoidably so — the page is a function of
 * its query string, and there are 49 records, so prerendering every ordered
 * subset of five is a number with eight digits in it. Nothing here reads a
 * database: the records are already in memory from the build-time loader, so a
 * request is a lookup and a render.
 */

export const metadata: Metadata = {
  title: "Compare powders — Matcha Diary",
  description:
    "Put up to five matcha powders side by side: origin, cultivars, price per gram and taste notes.",
};

export default async function ComparePage({
  searchParams,
}: PageProps<"/database/compare">) {
  const params = await searchParams;
  const powders = allPowders();

  const byId = new Map(powders.map((powder) => [powder.id, powder]));

  // An id naming no record is dropped rather than drawn as an empty column. A
  // stale link — a record renamed, a brand directory moved — should open the
  // comparison it can still show, not a table with a hole and no explanation.
  const requested = comparedIds(params);
  const selected = requested.filter((id) => byId.has(id));
  const chosen = selected.map((id) => byId.get(id)!);

  const dropped = requested.length - selected.length;

  // Four fields per record rather than every field, because the picker is a
  // client component and holds the whole collection to search it.
  const picks = powders.map(toPickData);

  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <div className="py-6">
        <Link
          href="/database"
          className="data-md -ml-2.5 inline-block rounded-xs px-2.5 py-1.5 text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          ← Powder database
        </Link>
      </div>

      <header className="flex flex-col gap-2 border-b border-line pb-6">
        <p className="label-caps text-clay">Database</p>
        <h1 className="text-headline-lg">Compare powders</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          Up to {MAX_COMPARE} tins on one set of rows — where the leaf grew,
          what is in it, what it costs per gram, and what it is said to taste
          of. The comparison lives in the address, so any table here is a link
          you can send.
        </p>
      </header>

      {dropped > 0 && (
        <p className="mt-6 border-l-2 border-matcha-line py-1 pl-4 text-body-md text-ink-2">
          {dropped === 1
            ? "One powder in that link is no longer in the database, so it is not shown."
            : `${dropped} powders in that link are no longer in the database, so they are not shown.`}
        </p>
      )}

      {/* The picker sits above the table rather than under it. Adding is the
          only thing to do on an empty comparison and the most likely thing to
          do on a full one, so it goes where the database's own search field is
          — in a bordered strip directly under the header, in the same place on
          both pages. */}
      <div className="border-b border-line py-4">
        <ComparePicker picks={picks} selected={selected} />
      </div>

      {chosen.length === 0 ? (
        <p className="mt-10 max-w-reading text-body-md text-ink-2">
          Nothing to compare yet. Search above to put the first column up, or
          pick several from the database and bring them over together.
        </p>
      ) : (
        <>
          <section aria-label="Comparison" className="mt-8">
            <CompareTable
              powders={chosen}
              hrefWithout={(id) =>
                compareHref(selected.filter((kept) => kept !== id))
              }
            />
          </section>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="data-md text-clay">
              {chosen.length} of {MAX_COMPARE}
            </p>
            <Link
              href="/database/compare"
              className="data-md rounded-xs px-2.5 py-1.5 text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
            >
              clear the comparison
            </Link>
          </div>
        </>
      )}

    </main>
  );
}
