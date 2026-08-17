import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PowderDatabase } from "@/components/database/powder-database";
import { allPowders } from "@/lib/powder-data";

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
 *
 * Statically rendered, on the same footing as the cultivar index: the records
 * are files under `content/database/<brand>/`, read at build time, so the page
 * is HTML before anyone asks for it.
 */
export default async function DatabasePage() {
  const powders = allPowders();

  // Every description, compiled. The grid is a client component and the record
  // it opens is chosen at runtime, so the bodies cannot be imported down there —
  // they are rendered here and passed as nodes. Ten records is the whole
  // collection; when it is a query rather than a directory this becomes one
  // fetch per opened record, which is what the /powders/[id] route is for.
  //
  // The path is built from two variables rather than `powder.id` so it reads as
  // the directory layout it is. Either way the bundler compiles it to the same
  // recursive context over `content/database`.
  const prose: Record<string, ReactNode> = Object.fromEntries(
    await Promise.all(
      powders.map(async (powder) => {
        const { default: Prose } = await import(
          `@/content/database/${powder.brandSlug}/${powder.slug}.mdx`
        );

        // Each record opens with its own name as an `h1`, which is how the file
        // reads on disk. The dialog has already printed the name in its header,
        // so the heading is dropped here — the same call the cultivar detail
        // page makes, and for the same reason.
        return [powder.id, <Prose key={powder.id} components={{ h1: () => null }} />] as const;
      }),
    ),
  );

  return (
    <main className="mx-auto w-full max-w-content px-4 sm:px-6">
      <header className="flex flex-col gap-2 py-6">
        <p className="label-caps text-clay">Database</p>
        <h1 className="text-headline-lg">Matcha powders</h1>
        <p className="text-body-lg text-ink-2">
          One card per powder — brand, blend name, origin, cultivars, price,
          photographs, description and taste notes. Placeholder records: the
          brands are real, everything written about them here is not.
        </p>
      </header>

      <PowderDatabase powders={powders} prose={prose} />
    </main>
  );
}
