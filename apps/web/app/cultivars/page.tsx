import type { Metadata } from "next";
import Link from "next/link";

import { CultivarIndex } from "@/components/cultivars/cultivar-index";
import { allCultivars } from "@/lib/cultivar-data";
import { toCardData } from "@/lib/cultivars";

export const metadata: Metadata = {
  title: "Cultivars — Matcha Diary",
  description:
    "Sixty-nine Japanese tea cultivars: lineage, registration, budding time and what each one is grown for.",
};

/**
 * The cultivar index — the second grid in the app, and a different kind of
 * reference from the first.
 *
 * The powder database holds tins you might buy; this holds the plants those tins
 * are made from, transcribed from primary sources. So it takes the same
 * `max-w-content` and the same three columns, because it is the same task —
 * scanning across records that differ on four or five facts each — but the cards
 * carry no photography, because a cultivar is not a product and there is nothing
 * to photograph that would distinguish one from another.
 *
 * Statically rendered: the records are files in `content/cultivars/`, read at
 * build time, so this page and all 69 detail pages behind it are HTML before
 * anyone asks for them.
 */
export default function CultivarsPage() {
  const cultivars = allCultivars();
  const cards = cultivars.map((cultivar) => toCardData(cultivar, cultivars));

  return (
    <main className="mx-auto w-full max-w-content px-4 sm:px-6">
      <header className="flex flex-col gap-2 py-6">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-headline-lg">Japanese tea cultivars</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          {cultivars.length} cultivars, each with its lineage, registration
          history and growing characteristics, transcribed from primary sources
          and annotated where those sources disagree. Search by name, reading,
          prefecture, breeder or parent — or read the collection as{" "}
          <Link
            href="/cultivars/lineage"
            className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
          >
            one set of pedigrees
          </Link>
          .
        </p>
      </header>

      <CultivarIndex cultivars={cards} />
    </main>
  );
}
