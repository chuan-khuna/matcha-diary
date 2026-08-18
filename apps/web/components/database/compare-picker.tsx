"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { compareHref, MAX_COMPARE, type PowderPick } from "@/lib/powders";

/**
 * How a powder gets into the comparison.
 *
 * The one piece of client state on the page, and it is only the search box —
 * everything the box produces is a `<Link>` to another URL of this same page,
 * so adding a column is a navigation rather than a mutation. That is what keeps
 * the comparison shareable: there is no state here that the address does not
 * already hold, and no way to reach a table that a link cannot reproduce.
 *
 * Rendered from the whole collection rather than a filtered slice, because the
 * question this answers is "which tin do I want next", and the grid's own
 * taste-note filter is a different question that the compare page does not
 * inherit. It takes `PowderPick` rather than `Powder` so that holding all
 * forty-nine costs four fields each instead of every field including the
 * description — see `toPickData`.
 *
 * Results are capped at eight. A list of forty-nine under a search box is a
 * scroll, not a choice, and by the time a query has narrowed to the record
 * someone means it has usually narrowed to two or three.
 */
export function ComparePicker({
  picks,
  selected,
}: {
  picks: PowderPick[];
  /** Ids already in the comparison, in slot order. */
  selected: string[];
}) {
  const [query, setQuery] = useState("");
  const isFull = selected.length >= MAX_COMPARE;

  const keyword = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (keyword === "") return [];

    return picks
      .filter(
        (pick) => !selected.includes(pick.id) && pick.haystack.includes(keyword),
      )
      .slice(0, 8);
  }, [picks, selected, keyword]);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="label-caps text-clay">
          Add a powder{isFull ? "" : ` — ${selected.length} of ${MAX_COMPARE}`}
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isFull}
          placeholder="Search name, brand, cultivar, note…"
          className="w-full rounded-sm border border-line-strong bg-surface px-3.5 py-2.75 text-body-md placeholder:text-placeholder focus:border-matcha focus:ring-3 focus:ring-matcha-soft focus:outline-hidden disabled:bg-paper-sunk disabled:text-clay sm:w-85"
        />
      </label>

      {isFull ? (
        <p className="text-body-md text-ink-2">
          Five is the most this table compares at once. Remove a column to add
          another.
        </p>
      ) : (
        keyword !== "" &&
        (matches.length === 0 ? (
          <p className="text-body-md text-ink-2">
            No powder matches that — or it is already in the comparison.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {matches.map((pick) => (
              <li key={pick.id}>
                {/* Appending, so the new column lands on the right, which is
                    where the eye expects the thing it just added. */}
                <Link
                  href={compareHref([...selected, pick.id])}
                  className="flex flex-wrap items-baseline gap-x-3 rounded-sm px-2.5 py-2 transition-colors hover:bg-paper-sunk"
                >
                  <span className="text-body-md text-ink">{pick.name}</span>
                  <span className="data-sm uppercase text-clay">
                    {pick.brand}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))
      )}
    </div>
  );
}
