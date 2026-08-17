"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

import { PowderCard } from "@/components/database/powder-card";
import { PowderDialog } from "@/components/database/powder-dialog";
import { powderHaystack, type Powder } from "@/lib/powders";
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
          className="font-mono text-data-md tabular-nums text-clay sm:ml-auto"
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
    </>
  );
}
