import type { Metadata } from "next";
import Link from "next/link";

import { LineageGraph } from "@/components/cultivars/lineage-graph";
import { LineageKey } from "@/components/cultivars/lineage-key";
import { allCultivars } from "@/lib/cultivar-data";
import { lineageAll } from "@/lib/lineage";

export const metadata: Metadata = {
  title: "Cultivar lineage — Matcha Diary",
  description:
    "Every recorded parentage in the collection on one canvas: seed parent, pollen parent, and the landraces everything descends from.",
};

/**
 * The whole pedigree, on one canvas.
 *
 * A powder is a blend somebody assembled and can change next season. A cultivar
 * is a plant with a parentage, and that parentage is most of the answer to why
 * two powders made the same way taste unalike.
 *
 * One drawing rather than one per family, because a single coordinate system is
 * what makes the shape of the collection legible: the wall of landraces down the
 * left, the 1950s selections drawn straight out of them, and on the right the
 * few modern crosses that descend from several of those at once. Split into
 * separate diagrams every family looks equally central, which is the one thing
 * the collection is not.
 *
 * The legend sits inside the frame rather than above it, so the marks and their
 * meanings are one object that stays together however far the page is scrolled.
 */
export default function LineagePage() {
  const cultivars = allCultivars();
  const model = lineageAll(cultivars);

  const generations = new Set(model.nodes.map((node) => node.x)).size;

  // Counted rather than written down: a record with no recorded parent and no
  // recorded offspring cannot be placed in a pedigree, and how many there are
  // changes every time the collection grows.
  const drawn = model.nodes.filter((node) => node.kind === "documented").length;
  const undrawn = cultivars.length - drawn;

  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <div className="py-6">
        <Link
          href="/cultivars"
          className="data-md -ml-2.5 inline-block rounded-xs px-2.5 py-1.5 text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          ← All cultivars
        </Link>
      </div>

      <header className="flex flex-col gap-2 pb-8">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-display">Cultivar lineage</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          Every parentage the records attest: {model.nodes.length} plants joined
          by {model.edges.length} crosses and selections across {generations}{" "}
          generations. Generations run left to right, siblings stacked, and every
          box opens its record. The {undrawn} cultivars with neither a parent nor
          an offspring on file are not drawn — the{" "}
          <Link
            href="/cultivars"
            className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
          >
            index
          </Link>{" "}
          lists all {cultivars.length}.
        </p>
      </header>

      <LineageGraph model={model} caption={<LineageKey />} />
    </main>
  );
}
