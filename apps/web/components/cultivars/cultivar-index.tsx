"use client";

import { useId, useMemo, useState } from "react";

import { CultivarCard } from "@/components/cultivars/cultivar-card";
import { chipClasses } from "@/lib/chip";
import {
  BUDDING_LABELS,
  TEA_TYPE_LABELS,
  type BuddingBucket,
  type CultivarCardData,
} from "@/lib/cultivars";

/**
 * The cultivar index: search, three filters, and the grid they narrow.
 *
 * The client boundary starts here rather than at the page, for the same reason
 * as the powder database — the page above has nothing stateful in it, and a
 * server component that renders 69 cards is cheaper than a client one that does.
 *
 * Filtering is done in the browser over all 69 records. That is the right call
 * at this size and would not be at ten times it: the whole collection is a
 * couple of pages of JSON, and a keystroke that re-filters locally is instant in
 * a way a round trip is not. `toCardData` is what keeps that honest — the client
 * gets the fields a card draws, not the several hundred words of `conflicts`
 * prose it never shows.
 *
 * Filter semantics, which are not symmetric and shouldn't be:
 *
 *   - **Tea type** is multi-select and ORs. A cultivar grown for both tencha and
 *     gyokuro should appear under either, and ANDing them would answer "grown
 *     for both", which is a question nobody arrives with.
 *   - **Budding** is single-select. The buckets partition the collection, so
 *     picking two is just a wider single pick, and ANDing them empties the grid
 *     every time.
 *   - **Unregistered** is a toggle rather than a third value in a group, because
 *     it crosses the others: it is a fact about the paperwork, not the plant.
 *
 * Across groups they AND, which is what stacking filters is expected to do.
 */
export function CultivarIndex({ cultivars }: { cultivars: CultivarCardData[] }) {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [budding, setBudding] = useState<BuddingBucket | null>(null);
  const [unregisteredOnly, setUnregisteredOnly] = useState(false);

  const typeLabelId = useId();
  const buddingLabelId = useId();

  // Counts come off the collection rather than a hand-kept list, so a record
  // added to `content/cultivars/` joins the filter row by existing. Sorted by
  // frequency: the chips a reader is most likely to want come first.
  const typeFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cultivar of cultivars) {
      for (const type of cultivar.teaTypes) {
        counts.set(type, (counts.get(type) ?? 0) + 1);
      }
    }
    return [...counts].sort(
      ([aType, aCount], [bType, bCount]) =>
        bCount - aCount || aType.localeCompare(bType),
    );
  }, [cultivars]);

  const buddingFacets = useMemo(() => {
    const counts = new Map<BuddingBucket, number>();
    for (const cultivar of cultivars) {
      counts.set(cultivar.budding, (counts.get(cultivar.budding) ?? 0) + 1);
    }
    return (["early", "medium", "late", "unknown"] as const).filter((bucket) =>
      counts.has(bucket),
    );
  }, [cultivars]);

  const keyword = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      cultivars.filter(
        (cultivar) =>
          (keyword === "" || cultivar.haystack.includes(keyword)) &&
          (types.length === 0 ||
            types.some((type) => cultivar.teaTypes.includes(type))) &&
          (budding === null || cultivar.budding === budding) &&
          (!unregisteredOnly || !cultivar.isRegistered),
      ),
    [cultivars, keyword, types, budding, unregisteredOnly],
  );

  const isFiltered =
    keyword !== "" || types.length > 0 || budding !== null || unregisteredOnly;

  function toggleType(type: string) {
    setTypes((current) =>
      current.includes(type)
        ? current.filter((candidate) => candidate !== type)
        : [...current, type],
    );
  }

  function reset() {
    setQuery("");
    setTypes([]);
    setBudding(null);
    setUnregisteredOnly(false);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-y border-line py-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search — try “Yabukita”, “Kagoshima”, “あさつゆ”…"
          // The placeholder sits at 2.2:1 and is a hint, never the label.
          aria-label="Search cultivars by name, reading, prefecture, breeder or parent"
          className="w-full rounded-sm border border-line-strong bg-surface px-3.5 py-2.75 text-body-md placeholder:text-placeholder focus:border-matcha focus:ring-3 focus:ring-matcha-soft focus:outline-hidden sm:w-95"
        />

        {/* Announced on change: this number and the grid are the only feedback
            that a keyword or a chip narrowed anything. */}
        <p
          aria-live="polite"
          className="font-mono text-data-md tabular-nums text-clay sm:ml-auto"
        >
          {visible.length === cultivars.length
            ? `${cultivars.length} cultivars`
            : `${visible.length} of ${cultivars.length}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4">
        <span id={typeLabelId} className="label-caps w-20 shrink-0 text-clay">
          Tea type
        </span>

        <div
          role="group"
          aria-labelledby={typeLabelId}
          className="flex flex-wrap gap-2"
        >
          {typeFacets.map(([type, count]) => {
            const isSelected = types.includes(type);

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleType(type)}
                className={`${chipClasses(isSelected)} inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
              >
                {TEA_TYPE_LABELS[type] ?? type}
                <span
                  className={`tabular-nums ${isSelected ? "text-matcha" : "text-clay"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-4">
        <span id={buddingLabelId} className="label-caps w-20 shrink-0 text-clay">
          Budding
        </span>

        <div
          role="group"
          aria-labelledby={buddingLabelId}
          className="flex flex-wrap gap-2"
        >
          {buddingFacets.map((bucket) => {
            const isSelected = budding === bucket;

            return (
              <button
                key={bucket}
                type="button"
                aria-pressed={isSelected}
                // Pressing the pressed one clears it, so the group needs no
                // "all" chip and a single tap always undoes a single tap.
                onClick={() => setBudding(isSelected ? null : bucket)}
                className={`${chipClasses(isSelected)} cursor-pointer transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
              >
                {BUDDING_LABELS[bucket]}
              </button>
            );
          })}

          <button
            type="button"
            aria-pressed={unregisteredOnly}
            onClick={() => setUnregisteredOnly((current) => !current)}
            className={`${chipClasses(unregisteredOnly)} cursor-pointer transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
          >
            Unregistered only
          </button>
        </div>

        {/* Only offered once there is something to undo — a permanently visible
            Reset on an unfiltered page is a control that does nothing. */}
        {isFiltered && (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-xs px-2.5 py-1.5 font-mono text-data-md text-clay transition-colors hover:bg-paper-sunk hover:text-ink sm:ml-auto"
          >
            Reset
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <section
          aria-label="Cultivars"
          className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((cultivar) => (
            <CultivarCard key={cultivar.slug} cultivar={cultivar} />
          ))}
        </section>
      ) : (
        <p className="py-12 text-body-md text-ink-2">
          No cultivar matches those filters. Try a broader tea type, or reset.
        </p>
      )}
    </>
  );
}
