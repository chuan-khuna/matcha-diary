import type { Metadata } from "next";
import Link from "next/link";

import { LineageGraph } from "@/components/cultivars/lineage-graph";
import { allCultivars } from "@/lib/cultivar-data";
import { lineageFamilies } from "@/lib/lineage";

export const metadata: Metadata = {
  title: "Cultivar lineage — Matcha Diary",
  description:
    "Every recorded parentage in the collection, drawn as pedigrees: seed parent, pollen parent, and the gaps where a parent was never recorded.",
};

/**
 * The whole pedigree, one family at a time.
 *
 * A powder is a blend somebody assembled and can change next season. A cultivar
 * is a plant with a parentage, and that parentage is most of the answer to why
 * two powders made the same way taste unalike.
 *
 * Split into families rather than drawn as one canvas, and that is a data
 * decision rather than a stylistic one: the collection is only four generations
 * deep but forty-nine nodes wide at its widest, so a single top-to-bottom
 * drawing runs to roughly twelve thousand pixels across. As connected
 * components it is one large family — everything that reaches Yabukita — and
 * twenty-one small ones, nearly all of which fit on a screen without scrolling.
 *
 * Records with no recorded parent and no recorded offspring belong to no family
 * and do not appear. That is not an omission to fix: it is what the sources say,
 * and the index lists all 69 either way.
 */
export default function LineagePage() {
  const cultivars = allCultivars();
  const families = lineageFamilies(cultivars);

  const drawn = families.reduce(
    (total, family) => total + family.model.nodes.length,
    0,
  );
  const parentages = families.reduce(
    (total, family) => total + family.model.edges.length,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <div className="py-6">
        <Link
          href="/cultivars"
          className="-ml-2.5 inline-block rounded-xs px-2.5 py-1.5 font-mono text-data-md text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          ← All cultivars
        </Link>
      </div>

      <header className="flex flex-col gap-2 border-b border-line pb-8">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-display">Cultivar lineage</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          Every parentage the records attest, drawn as {families.length}{" "}
          families: {drawn} plants joined by {parentages} recorded crosses and
          selections. Generations run left to right, siblings stacked, and every
          box opens its record.
        </p>
      </header>

      <Key />

      <div className="mt-10 flex flex-col gap-10">
        {families.map((family) => (
          <section key={family.title}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-headline-md">{family.title}</h2>
              <p className="font-mono text-data-sm tabular-nums text-clay">
                {family.model.nodes.length} plants ·{" "}
                {family.model.edges.length} parentages
              </p>
            </div>
            <LineageGraph model={family.model} />
          </section>
        ))}
      </div>
    </main>
  );
}

/**
 * The legend.
 *
 * Every mark in the diagram is defined here and nowhere else, drawn with the
 * same values the renderer uses rather than described in words — a legend that
 * paraphrases its diagram is a legend that can drift out of step with it.
 */
function Key() {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6 font-mono text-data-sm text-clay">
      <KeyItem fill="var(--surface)" stroke="var(--line-strong)">
        cultivar
      </KeyItem>
      <KeyItem fill="var(--matcha-soft)" stroke="var(--matcha-line)">
        grown for matcha or tencha
      </KeyItem>
      <KeyItem fill="var(--paper-sunk)" stroke="var(--line-strong)" dashed>
        named as a parent, no record here
      </KeyItem>
      <li className="flex items-center gap-2">
        <svg width={20} height={20} aria-hidden="true">
          <circle
            cx={10}
            cy={10}
            r={9}
            fill="var(--surface)"
            stroke="var(--line-strong)"
            strokeWidth={1}
          />
          <text
            x={10}
            y={14}
            textAnchor="middle"
            fontSize={11}
            fill="var(--clay)"
          >
            ♀
          </text>
        </svg>
        <span>seed parent · ♂ pollen parent</span>
      </li>
    </ul>
  );
}

function KeyItem({
  fill,
  stroke,
  dashed = false,
  children,
}: {
  fill: string;
  stroke: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <svg width={28} height={16} aria-hidden="true">
        <rect
          x={1}
          y={2}
          width={26}
          height={12}
          rx={3}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray={dashed ? "3 3" : undefined}
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}
