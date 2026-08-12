import type { Metadata } from "next";

import { PowderDatabase } from "@/components/powder-database";
import { PLACEHOLDER_POWDERS } from "@/lib/powder-data";

export const metadata: Metadata = {
  title: "Powder database — Matcha Diary",
  description:
    "A reference of matcha powders: brand, cultivars, price, taste notes.",
};

/**
 * The powder database — the one place in the app that is a grid.
 *
 * The feed is single-column by intent because a timeline is a sequence you read
 * down. This is the opposite task: a reference you scan across, comparing tins
 * that differ on four or five facts each. So it takes `content-max` (1080px)
 * rather than the timeline's 620px, and three columns rather than one. Nothing
 * in the grid is promoted or featured — the cards are identical and the order
 * is the query's, which is the timeline's rule holding in a different shape.
 *
 * Columns are content-driven, like every other breakpoint here: below 640px one
 * card is as much as fits beside a chip row, 640–1024px takes two, and the full
 * 1080px holds three at roughly 330px each — near the width the prototype's
 * `minmax(300px, 1fr)` settled on.
 *
 * The records are curated rather than user-generated (see the stack ADR), so
 * this page never grows a compose affordance. "+ Add powder" belongs to the
 * Django admin, not here.
 */
export default function DatabasePage() {
  return (
    <main className="mx-auto w-full max-w-content px-4 sm:px-6">
      <header className="flex flex-col gap-2 py-6">
        <p className="label-caps text-clay">Database</p>
        <h1 className="text-headline-lg">Matcha powders</h1>
        <p className="text-body-lg text-ink-2">
          One card per powder — brand, blend name, cultivars, price, photographs,
          description and taste notes. Placeholder records: the brands are real,
          everything written about them here is not.
        </p>
      </header>

      <PowderDatabase powders={PLACEHOLDER_POWDERS} />
    </main>
  );
}
