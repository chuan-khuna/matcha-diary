import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PriceList } from "@/components/database/price-list";
import { FactCard } from "@/components/shared/fact-card";
import { PhotoGallery } from "@/components/shared/photo-gallery";
import { PhotoPlaceholder } from "@/components/shared/placeholders";
import { allPowders } from "@/lib/powder-data";
import { tasteNoteChipClasses } from "@/lib/taste-notes";
import type { Powder } from "@/lib/powders";

/**
 * One powder record, in full, at a URL of its own.
 *
 * The database grid opens a record in a dialog, which is the right shape for
 * "show me this one without losing my place in the grid" and the wrong shape
 * for everything else: a dialog cannot be linked to, cannot be reloaded, and
 * cannot be shared. This is the record that can. `PowderDialog` now links here
 * rather than being replaced by it — the two answer different questions, and
 * the dialog's own note has always said the route is what it is waiting for.
 *
 * ## Why the brand is a path segment
 *
 * `content/database/<brand-slug>/<slug>.mdx` is where the record lives, so
 * `/database/<brand>/<slug>` is where it is read — the URL is the path, and
 * `Powder.id` is already that pair joined. This is not decoration: a slug is
 * unique only *within* a brand, because two houses can both sell a Wako and
 * both are right. A flat `/database/<slug>` would have to invent a
 * disambiguator the collection does not have.
 *
 * The layout follows the cultivar record's, deliberately, because both are the
 * same kind of page and a reader should not have to relearn one after the
 * other: prose at `max-w-reading` in the main column, facts in a sticky rail
 * beside it, the rail dropping underneath below 1024px.
 *
 * Taste notes sit in the header rather than under the description. They are the
 * fastest read on the page and the thing a person came for, and burying them
 * beneath several paragraphs makes the reader scroll past the answer to reach
 * it.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return allPowders().map((powder) => ({
    brand: powder.brandSlug,
    slug: powder.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/database/[brand]/[slug]">): Promise<Metadata> {
  const { brand, slug } = await params;
  const powder = allPowders().find((entry) => entry.id === `${brand}/${slug}`);
  if (powder === undefined) return {};

  return {
    // Brand before blend, because a blend name is only meaningful under its
    // house — there is more than one Wako, and a bare tab title saying "Wako"
    // does not say whose.
    title: `${powder.name} — ${powder.brand} — Matcha Diary`,
    description: powder.excerpt,
  };
}

export default async function PowderPage({
  params,
}: PageProps<"/database/[brand]/[slug]">) {
  const { brand, slug } = await params;

  const powders = allPowders();
  const index = powders.findIndex((entry) => entry.id === `${brand}/${slug}`);
  const powder = powders[index];

  // `dynamicParams = false` already makes an unknown pair a 404; this is the
  // belt-and-braces guard that also narrows the type for everything below.
  if (powder === undefined) notFound();

  // The record's own description. Two variables rather than `powder.id` so it
  // reads as the directory layout it is — either way Turbopack compiles it to
  // one recursive context over `content/database`, which is what lets every
  // page in this route share a single import.
  const { default: Prose } = await import(
    `@/content/database/${brand}/${slug}.mdx`
  );

  // Neighbours in the collection's own order — brand, then blend within it. So
  // walking with these keys stays inside a house until it runs out, which is
  // how someone comparing a maker's range wants to move.
  const previous = powders[index - 1];
  const next = powders[index + 1];

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

      <header className="border-b border-line pb-8">
        <p className="data-sm uppercase text-ink-2">{powder.brand}</p>

        {/* The blend name is a name a maker chose — Inter. Everything around
            it is a recorded fact, so it is all mono. */}
        <h1 className="mt-1 text-display">{powder.name}</h1>

        {powder.notes.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {powder.notes.map((note) => (
              <li key={note} className={tasteNoteChipClasses()}>
                {note}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="max-w-reading">
          {powder.photos.length > 0 ? (
            <PhotoGallery photos={powder.photos} />
          ) : (
            // 3:2 at `lg` to match the cover the gallery would have drawn here,
            // but no shadow: DESIGN.md allows a visible one because a
            // photograph is a physical object, and this is the absence of one.
            <PhotoPlaceholder
              className="aspect-[3/2] rounded-lg"
              iconSize={48}
            />
          )}

          {/* `prose` is the floor under the MDX map rather than a replacement
              for it — the map still dresses every element these records
              contain, and the plugin only reaches one it has no rule for. The
              record opens with its own name as an `h1`, which the header above
              has already said, so that heading is dropped here. */}
          <article className="prose mt-10">
            <Prose components={{ h1: () => null }} />
          </article>
        </div>

        {/* `top-19` clears the 60px sticky header the layout puts above
            everything, so the rail parks below it rather than under it. */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-19">
          <FactCard
            title="Record"
            facts={[
              ["Brand", powder.brand],
              ["Origin", powder.origin],
              // Tags, and the record says nothing about their shares: no maker
              // publishes the ratio, and an invented percentage reads as a fact.
              ["Cultivars", powder.cultivars.join(" · ")],
            ]}
          />

          {/* Its own section rather than a FactCard row: the per-gram figure is
              a second column, and the point of listing every tin is that you
              can read down it. */}
          {powder.sizes.length > 0 && (
            <section className="rounded-md border border-line bg-surface p-5 shadow-raised">
              <h2 className="label-caps text-clay">Price</h2>
              <div className="mt-4">
                <PriceList sizes={powder.sizes} />
              </div>
            </section>
          )}
        </aside>
      </div>

      <nav
        aria-label="Neighbouring powders"
        className="mt-16 flex justify-between gap-4 border-t border-line pt-6"
      >
        {previous === undefined ? (
          <span />
        ) : (
          <NeighbourLink powder={previous}>← {previous.name}</NeighbourLink>
        )}
        {next !== undefined && (
          <NeighbourLink powder={next} alignEnd>
            {next.name} →
          </NeighbourLink>
        )}
      </nav>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A step to the record either side of this one.
 *
 * Labelled with the blend alone rather than "brand — blend": the pair runs long
 * enough to wrap a 3-word button into three lines on a phone, and the brand is
 * usually the same one anyway, since the collection is ordered by house.
 */
function NeighbourLink({
  powder,
  alignEnd = false,
  children,
}: {
  powder: Powder;
  alignEnd?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/database/${powder.brandSlug}/${powder.slug}`}
      className={`rounded-sm border border-line-strong bg-surface px-4 py-2.25 text-label-lg text-ink-2 transition-colors hover:bg-paper-sunk ${alignEnd ? "ml-auto" : ""}`}
    >
      {children}
    </Link>
  );
}
