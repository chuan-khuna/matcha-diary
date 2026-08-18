"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";

import { PowderCard } from "@/components/database/powder-card";
import { PowderDialog } from "@/components/database/powder-dialog";
import {
  compareHref,
  MAX_COMPARE,
  powderHaystack,
  type Powder,
} from "@/lib/powders";
import { tasteNoteChipClasses, tasteNoteVocabulary } from "@/lib/taste-notes";

/**
 * The database's one stateful piece: what is being searched, which note is
 * filtered on, and which record is open. The page above stays a server
 * component, so the client boundary starts here — at the first thing that
 * genuinely needs state.
 *
 * Search and filter are two doors onto one collection rather than a duplicated
 * control. Typing narrows by a word you already have in mind — a blend, a house,
 * a cultivar, a flavour; the chips show a taste vocabulary you do not yet know,
 * which is most of the point of a reference database. They compose: a chip and a
 * query both apply.
 *
 * The field reads name, brand, cultivar and taste note together, which is the
 * full-text search the ADR expects, run here as a substring scan because the
 * collection is small enough that one is indistinguishable from the other. What
 * changes when the API lands is where the scan happens, not what it covers — see
 * `powderHaystack` for what is in it and what is deliberately left out.
 *
 * The filter is single-select. Two notes ANDed together would empty the grid
 * almost every time — records carry three or four notes each — and ORing them
 * makes "add a filter" widen the result set, which is the opposite of what
 * pressing a second chip looks like it should do.
 *
 * `prose` arrives beside the records rather than on them: the descriptions are
 * compiled MDX bodies, so they are React nodes the server rendered, and a node
 * has no business inside a data type that also has to survive a JSON round trip
 * when the API is real. Keyed by `Powder.id`, and only the open record's is ever
 * read.
 */
export function PowderDatabase({
  powders,
  prose,
}: {
  powders: Powder[];
  prose: Record<string, ReactNode>;
}) {
  const [query, setQuery] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // Ids picked for the comparison, in the order they were picked — which is the
  // order they become columns. Kept here rather than in the URL because a
  // half-assembled selection is not worth a navigation per card; it becomes a
  // URL exactly once, when the bar below is followed.
  const [compared, setCompared] = useState<string[]>([]);
  const filterLabelId = useId();

  const vocabulary = useMemo(() => tasteNoteVocabulary(powders), [powders]);

  // Built per collection, not per keystroke: the text a query is matched
  // against is the same string every time someone presses a key.
  const haystacks = useMemo(
    () => new Map(powders.map((powder) => [powder.id, powderHaystack(powder)])),
    [powders],
  );

  const keyword = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      powders.filter(
        (powder) =>
          (note === null || powder.notes.includes(note)) &&
          (keyword === "" || (haystacks.get(powder.id) ?? "").includes(keyword)),
      ),
    [powders, note, keyword, haystacks],
  );

  // Looked up in the full list rather than the visible one: an open record
  // should not vanish because the search behind it stopped matching.
  const openPowder = powders.find((powder) => powder.id === openId) ?? null;

  // Same reasoning: a picked record stays picked when a filter stops matching
  // it, or narrowing the grid would silently empty the comparison behind you.
  const isFull = compared.length >= MAX_COMPARE;

  const toggleCompared = (id: string) =>
    setCompared((current) => {
      if (current.includes(id)) return current.filter((kept) => kept !== id);
      return current.length >= MAX_COMPARE ? current : [...current, id];
    });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-y border-line py-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, brand, cultivar, note…"
          // The placeholder sits at 2.2:1 and is a hint, never the label.
          aria-label="Search powders by name, brand, cultivar or taste note"
          className="w-full rounded-sm border border-line-strong bg-surface px-3.5 py-2.75 text-body-md placeholder:text-placeholder focus:border-matcha focus:ring-3 focus:ring-matcha-soft focus:outline-hidden sm:w-85"
        />

        {/* Announced on change, because the only feedback that a keyword
            narrowed anything is this number and the grid below it. */}
        <p
          aria-live="polite"
          className="data-md text-clay sm:ml-auto"
        >
          {visible.length === powders.length
            ? `${powders.length} powders`
            : `${visible.length} of ${powders.length}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-4">
        <span id={filterLabelId} className="label-caps text-clay">
          Taste note
        </span>

        <div
          role="group"
          aria-labelledby={filterLabelId}
          className="flex flex-wrap gap-2"
        >
          {/* `null` is the reset, so the row always has a pressed chip and
              "no filter" is a state you can see rather than infer. */}
          {[null, ...vocabulary].map((candidate) => {
            const isSelected = candidate === note;

            return (
              <button
                key={candidate ?? "all"}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setNote(candidate)}
                className={`${tasteNoteChipClasses(isSelected)} cursor-pointer transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
              >
                {candidate ?? "all"}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length > 0 ? (
        <section
          aria-label="Powders"
          className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((powder) => (
            <PowderCard
              key={powder.id}
              powder={powder}
              onOpen={() => setOpenId(powder.id)}
              isCompared={compared.includes(powder.id)}
              canCompare={!isFull}
              onToggleCompare={() => toggleCompared(powder.id)}
            />
          ))}
        </section>
      ) : (
        <p className="py-12 text-body-md text-ink-2">
          No powder matches that. Try another taste note, or clear the filter.
        </p>
      )}

      <PowderDialog
        powder={openPowder}
        prose={openPowder === null ? null : prose[openPowder.id]}
        onClose={() => setOpenId(null)}
      />

      {/* The tray, and the only reason the selection above is worth holding.
          It appears when there is something to carry and clears the fixed
          bottom nav below 640px, where that bar is 60px plus the home
          indicator's safe area — the same offset `app/layout.tsx` reserves on
          the body. Above 640px the nav is gone and so is the offset. */}
      {compared.length > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] z-20 border-t border-line bg-paper-translucent backdrop-blur-md sm:bottom-0">
          <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <p aria-live="polite" className="data-md text-clay">
              {compared.length} of {MAX_COMPARE} picked
              {isFull ? " — the most this compares at once" : ""}
            </p>

            <button
              type="button"
              onClick={() => setCompared([])}
              className="data-md cursor-pointer rounded-xs px-2.5 py-1.5 text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
            >
              clear
            </button>

            {/* A link rather than a button: the comparison is a URL, so
                crossing over is a navigation and behaves like one — openable
                in a new tab, and back returns to the grid. */}
            <Link
              href={compareHref(compared)}
              className="ml-auto rounded-sm border border-line-strong bg-surface px-4 py-2.25 text-label-lg text-ink-2 transition-colors hover:bg-paper-sunk"
            >
              Compare →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
