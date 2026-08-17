import type { Metadata } from "next";
import Link from "next/link";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";

import { LineageGraph } from "@/components/cultivars/lineage-graph";
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

      <header className="flex flex-col gap-2 pb-8">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-display">Cultivar lineage</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          Every parentage the records attest: {model.nodes.length} plants joined
          by {model.edges.length} crosses and selections across {generations}{" "}
          generations. Generations run left to right, siblings stacked, and every
          box opens its record. The six cultivars with neither a parent nor an
          offspring on file are not drawn — the{" "}
          <Link
            href="/cultivars"
            className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
          >
            index
          </Link>{" "}
          lists all 69.
        </p>
      </header>

      <LineageGraph model={model} caption={<Key />} />
    </main>
  );
}

/**
 * The legend.
 *
 * Every mark is drawn with the same values the renderer uses rather than
 * described in words — a legend that paraphrases its diagram is a legend that
 * can drift out of step with it.
 */
function Key() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      <Swatch fill="var(--surface)" stroke="var(--line-strong)">
        cultivar
      </Swatch>
      <Swatch fill="var(--matcha-soft)" stroke="var(--matcha-line)">
        grown for matcha or tencha
      </Swatch>
      <Swatch fill="var(--paper-sunk)" stroke="var(--line-strong)" dashed>
        named as a parent, no record here
      </Swatch>
      <Badge Icon={PiGenderFemaleBold}>seed parent</Badge>
      <Badge Icon={PiGenderMaleBold}>pollen parent</Badge>
    </ul>
  );
}

function Swatch({
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
      <svg width={28} height={16} aria-hidden="true" className="shrink-0">
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

/** Drawn exactly as the diagram draws it — same disc, same glyph, same ink. */
function Badge({
  Icon,
  children,
}: {
  Icon: typeof PiGenderFemaleBold;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <svg
        width={21}
        height={21}
        aria-hidden="true"
        className="shrink-0"
        style={{ color: "var(--ink-2)" }}
      >
        <circle
          cx={10.5}
          cy={10.5}
          r={9.5}
          fill="var(--surface)"
          stroke="var(--clay)"
          strokeWidth={1}
        />
        <Icon x={4} y={4} size={13} />
      </svg>
      <span>{children}</span>
    </li>
  );
}
