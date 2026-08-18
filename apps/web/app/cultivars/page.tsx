import type { Metadata } from "next";
import Link from "next/link";

import { CultivarIndex } from "@/components/cultivars/cultivar-index";
import { LineageGraph } from "@/components/cultivars/lineage-graph";
import { LineageKey } from "@/components/cultivars/lineage-key";
import { allCultivars } from "@/lib/cultivar-data";
import { toCardData } from "@/lib/cultivars";
import { lineageAll } from "@/lib/lineage";

export const metadata: Metadata = {
  title: "Cultivars — Matcha Diary",
  description:
    "Japanese tea cultivars: pedigree, registration, budding time and what each one is grown for.",
};

/**
 * The cultivar index — the pedigree, then every record beneath it.
 *
 * Two views of one collection, in the order they answer questions. The diagram
 * says what the collection *is*: a handful of landraces, the selections drawn
 * out of them in the 1950s, and the modern crosses descending from several of
 * those at once. The grid below is for when you already know which plant you
 * want. Neither replaces the other, which is why both are here rather than the
 * graph living only on a page of its own.
 *
 * The diagram is capped and scrolls inside its frame. At full height it is over
 * 3000px — a fine page by itself, and a poor way to open a different one, since
 * it would push the search field and every card off the bottom.
 *
 * Statically rendered: the records are files in `content/cultivars/`, read at
 * build time, so this page and every behind it are HTML before anyone asks.
 */
export default function CultivarsPage() {
  const cultivars = allCultivars();
  const cards = cultivars.map((cultivar) => toCardData(cultivar, cultivars));
  const lineage = lineageAll(cultivars);

  return (
    <main className="mx-auto w-full max-w-content px-4 sm:px-6">
      <header className="flex flex-col gap-2 py-6">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-headline-lg">Japanese tea cultivars</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          {cultivars.length} cultivars, each with its lineage, registration
          history and growing characteristics, transcribed from primary sources
          and annotated where those sources disagree. Search by name, reading,
          prefecture, breeder or parent.
        </p>
      </header>

      <section aria-labelledby="pedigree-heading">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="pedigree-heading" className="text-headline-md">
            Pedigree
          </h2>
          <p className="data-sm text-clay">
            {lineage.nodes.length} plants · {lineage.edges.length} parentages ·{" "}
            <Link
              href="/cultivars/lineage"
              className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
            >
              open full height
            </Link>
          </p>
        </div>

        <LineageGraph model={lineage} maxHeight={560} caption={<LineageKey />} />
      </section>

      <h2 className="label-caps pt-10 pb-3 text-clay">Every record</h2>

      <CultivarIndex cultivars={cards} />
    </main>
  );
}
