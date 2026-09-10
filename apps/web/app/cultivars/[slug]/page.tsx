import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LineageGraph } from "@/components/cultivars/lineage-graph";
import { FactCard } from "@/components/shared/fact-card";
import { chipClasses } from "@/lib/chip";
import { allCultivars, cultivarBySlug } from "@/lib/cultivar-data";
import { lineageFor } from "@/lib/lineage";
import {
  offspringOf,
  parentsOf,
  registeredLabel,
  teaTypeTokens,
  TEA_TYPE_LABELS,
  type Cultivar,
} from "@/lib/cultivars";

/**
 * One cultivar record, in full.
 *
 * Two halves from one file. The prose — lineage, history, characteristics — is
 * the record's markdown body, compiled by `@next/mdx` and pulled in below by
 * dynamic import. The facts around it are the same file's YAML head, read off
 * disk by `lib/cultivar-data`. See that module for why the split exists.
 *
 * The layout follows the reading: prose at `max-w-reading` in the main column,
 * because that is where paragraphs are, and the facts in a sticky rail beside
 * it, because they are looked *up* rather than read through. Below 1024px the
 * rail drops underneath — a 288px column of key/value pairs beside a 320px
 * column of prose is neither.
 *
 * The two long editorial fields, `lineageNote` and `conflicts`, sit at the foot
 * of the prose column rather than in the rail. They are paragraphs, not values,
 * and several run past a hundred words — in an 18rem rail that is a wall.
 * `conflicts` is a list of them: one entry per disagreement between sources.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return allCultivars().map((cultivar) => ({ slug: cultivar.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cultivars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cultivar = cultivarBySlug(slug);
  if (cultivar === undefined) return {};

  return {
    title: `${cultivar.name} — Matcha Diary`,
    description: cultivar.summary,
  };
}

export default async function CultivarPage({
  params,
}: PageProps<"/cultivars/[slug]">) {
  const { slug } = await params;

  const cultivars = allCultivars();
  const index = cultivars.findIndex((entry) => entry.slug === slug);
  const cultivar = cultivars[index];

  // `dynamicParams = false` already makes an unknown slug a 404, so this is a
  // belt-and-braces guard that also narrows the type for everything below.
  if (cultivar === undefined) notFound();

  // The record's own prose. Static enough for Turbopack to resolve the whole
  // directory at build time, which is what lets every page share one import.
  const { default: Prose } = await import(`@/content/cultivars/${slug}.md`);

  const parents = parentsOf(cultivar, cultivars);
  const offspring = offspringOf(cultivar, cultivars);
  const teaTypes = teaTypeTokens(cultivar);
  const ancestry = lineageFor(cultivar, cultivars);
  const withOffspring = lineageFor(cultivar, cultivars, { includeOffspring: true });

  // Only worth a disclosure when opening it would actually add boxes.
  const offspringToShow =
    ancestry !== null &&
    withOffspring !== null &&
    withOffspring.nodes.length > ancestry.nodes.length
      ? withOffspring
      : null;

  const previous = cultivars[index - 1];
  const next = cultivars[index + 1];

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

      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {/* The name is a name — Inter. The reading beside it is a
              transcription of a record, so it takes the mono face. */}
          <h1 className="text-display">{cultivar.name}</h1>
          {(cultivar.kana ?? cultivar.kanji) !== null && (
            <p className="data-md text-clay">
              {[cultivar.kana, cultivar.kanji !== cultivar.kana ? cultivar.kanji : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        {cultivar.nameMeaning !== null && (
          <dl className="mt-4 flex flex-wrap gap-x-3">
            <dt className="label-caps w-16 shrink-0 pt-0.5 text-clay">Name</dt>
            <dd className="max-w-reading flex-1 text-body-md text-ink-2">
              {cultivar.nameMeaning}
            </dd>
          </dl>
        )}

        <p className="mt-6 max-w-reading text-body-lg text-ink-2">
          {cultivar.summary}
        </p>

        {teaTypes.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {teaTypes.map((type) => (
              <li key={type} className={chipClasses()}>
                {TEA_TYPE_LABELS[type] ?? type}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="max-w-reading">
          {/* Above the prose, because it is the shape of what the prose then
              explains — and `null` when the record has neither a parent nor an
              offspring on file, which is a lone box saying nothing. */}
          {ancestry !== null && (
            <section className="mb-10">
              <h2 className="label-caps mb-3 text-clay">Lineage</h2>
              <LineageGraph
                model={ancestry}
                caption={`What ${cultivar.name} descends from — ♀ seed parent, ♂ pollen parent. Generations run left to right.`}
              />

              {/* Offspring are the other direction and a different question, so
                  they open rather than crowd the default view. A plain
                  <details> keeps this working without client JavaScript, which
                  the diagram itself has stayed free of. */}
              {offspringToShow !== null && (
                <details className="group mt-3">
                  <summary className="data-md inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xs px-2.5 py-1.5 text-clay transition-colors hover:bg-paper-sunk hover:text-ink [&::-webkit-details-marker]:hidden">
                    <span
                      aria-hidden="true"
                      className="transition-transform group-open:rotate-90"
                    >
                      ›
                    </span>
                    Show what came out of it
                  </summary>

                  <div className="mt-3">
                    <LineageGraph
                      model={offspringToShow}
                      caption={`${cultivar.name} with its offspring — the same pedigree carried forward.`}
                    />
                  </div>
                </details>
              )}
            </section>
          )}

          {/* `prose` is the floor under the MDX map, not a replacement for it:
              the map still dresses every element these records contain, and
              the plugin only reaches an element the map has no rule for. See
              the block at the foot of `styles/globals.css`. The column width
              stays `max-w-reading` above — the plugin's own 65ch cap is
              lifted there. */}
          <article className="prose">
            {/* The record opens with its own name as an `h1`. The page header
                above has already said it, and two `h1`s is one too many, so the
                heading is dropped here rather than globally in the MDX map. */}
            <Prose components={{ h1: () => null }} />
          </article>

          <NoteBlock title="Lineage note" body={cultivar.lineageNote} />
          <NoteBlock title="Conflicts in the sources" body={cultivar.conflicts} />
        </div>

        {/* `top-15` clears the 60px sticky header the layout already puts above
            everything, so the rail parks below it rather than under it. */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-19">
          <FactCard
            title="Record"
            facts={[
              ["Registered", registeredLabel(cultivar)],
              ["Registration no.", cultivar.registrationNumber],
              ["Registry", cultivar.registry],
              ["PVP registration", cultivar.plantVarietyRegistration],
              ["Application filed", cultivar.applicationFiled],
              ["Application published", cultivar.applicationPublished],
              ["Crossed", cultivar.crossedYear],
              ["Selected", cultivar.selectedYear],
              ["Selected from", cultivar.selectedFrom],
              ["Bred at", cultivar.bredAt],
              ["Prefecture", cultivar.prefecture],
              ["Strain names", cultivar.strainNames.join(" · ")],
            ]}
          />

          <FactCard
            title="In the field"
            facts={[
              ["Budding", cultivar.buddingTime],
              ["Yield", cultivar.yield],
              ["Cultivation share", cultivar.cultivationShare],
              ["Rarity", cultivar.rarity],
              ["Documentation", cultivar.documentation],
            ]}
          />

          {(parents.length > 0 ||
            offspring.length > 0 ||
            cultivar.notableDescendants.length > 0 ||
            cultivar.siblingCultivars.length > 0) && (
            <section className="rounded-md border border-line bg-surface p-5 shadow-raised">
              <h2 className="label-caps text-clay">Family</h2>

              {parents.length > 0 && (
                <>
                  <h3 className="data-sm mt-4 text-clay">Parents</h3>
                  <ul className="mt-2 space-y-1.5">
                    {parents.map((parent) => (
                      <li
                        key={`${parent.role}-${parent.name}`}
                        className="flex gap-2"
                      >
                        <span
                          className="data-md text-clay"
                          aria-hidden="true"
                        >
                          {parent.role}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="data-md">
                            {parent.slug === null ? (
                              // Not in the collection. Named, but with no record
                              // behind it — a gap, shown as one.
                              <span className="text-ink-2">{parent.name}</span>
                            ) : (
                              <RecordLink href={`/cultivars/${parent.slug}`}>
                                {parent.name}
                              </RecordLink>
                            )}
                          </p>
                          {/* The reading and provenance that used to be crammed
                              into the name itself. Kept, just no longer in the
                              way of resolving the reference. */}
                          {parent.note !== null && (
                            <p className="mt-1 text-body-md text-ink-2">
                              {parent.note}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {offspring.length > 0 && (
                <>
                  {/* Derived from the children's own `parents`, so this list and
                      the parent lists above can never disagree. */}
                  <h3 className="data-sm mt-5 text-clay">
                    Offspring in this collection
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {offspring.map((child) => (
                      <li key={child.slug} className="data-md">
                        <RecordLink href={`/cultivars/${child.slug}`}>
                          {child.name}
                        </RecordLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <NameList
                title="Also recorded as descendants"
                names={cultivar.notableDescendants}
              />
              <NameList title="Siblings" names={cultivar.siblingCultivars} />
            </section>
          )}

          <ListCard title="Resistance" items={cultivar.diseaseResistance} />
          <ListCard
            title="Recommended regions"
            items={cultivar.recommendedRegions}
          />

          {cultivar.sources.length > 0 && (
            <section className="rounded-md border border-line bg-surface p-5 shadow-raised">
              <h2 className="label-caps text-clay">Sources</h2>
              <ul className="mt-4 space-y-3">
                {cultivar.sources.map((source) => (
                  <li key={`${source.title}-${source.url ?? ""}`}>
                    {source.url === null ? (
                      <span className="data-md text-ink-2">{source.title}</span>
                    ) : (
                      <a
                        href={source.url}
                        rel="noreferrer"
                        className="data-md text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
                      >
                        {source.title}
                      </a>
                    )}
                    {source.publisher !== null && (
                      <p className="data-sm mt-1 text-clay">
                        {source.publisher}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      <nav
        aria-label="Neighbouring cultivars"
        className="mt-16 flex justify-between gap-4 border-t border-line pt-6"
      >
        {previous === undefined ? (
          <span />
        ) : (
          <NeighbourLink cultivar={previous}>← {previous.name}</NeighbourLink>
        )}
        {next !== undefined && (
          <NeighbourLink cultivar={next} alignEnd>
            {next.name} →
          </NeighbourLink>
        )}
      </nav>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function ListCard({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-md border border-line bg-surface p-5 shadow-raised">
      <h2 className="label-caps text-clay">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="data-md text-ink-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NameList({ title, names }: { title: string; names: string[] }) {
  if (names.length === 0) return null;

  return (
    <>
      <h3 className="data-sm mt-5 text-clay">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {names.map((name) => (
          <li key={name} className="data-md text-ink-2">
            {name}
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * An editorial aside at the foot of the prose.
 *
 * Sunk rather than outlined. A conflict between sources is a caveat, not a
 * failure — and DESIGN.md defines no warning colour and says not to invent one —
 * so it is marked out by being the one recessed panel on the page.
 */
function NoteBlock({ title, body }: { title: string; body: string | string[] | null }) {
  if (body === null || body.length === 0) return null;

  return (
    <section className="mt-10 rounded-md border border-line-strong bg-paper-sunk p-5">
      <h2 className="label-caps text-clay">{title}</h2>
      {/* `lineageNote` is one paragraph; `conflicts` is one entry per
          disagreement, and each entry names the field it is about, the sources
          on both sides and which one the record follows. A record with a single
          conflict still renders as a list — the marker is what says the field
          holds however many the sources produced. */}
      {Array.isArray(body) ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-body-md text-ink-2 marker:text-matcha-line">
          {body.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-body-md text-ink-2">{body}</p>
      )}
    </section>
  );
}

function RecordLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
    >
      {children}
    </Link>
  );
}

function NeighbourLink({
  cultivar,
  alignEnd = false,
  children,
}: {
  cultivar: Cultivar;
  alignEnd?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/cultivars/${cultivar.slug}`}
      className={`rounded-sm border border-line-strong bg-surface px-4 py-2.25 text-label-lg text-ink-2 transition-colors hover:bg-paper-sunk ${alignEnd ? "ml-auto" : ""}`}
    >
      {children}
    </Link>
  );
}
