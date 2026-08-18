import Link from "next/link";

import { chipClasses } from "@/lib/chip";
import { TEA_TYPE_LABELS, type CultivarCardData } from "@/lib/cultivars";

/**
 * One cultivar in the index grid.
 *
 * Reads identity, prose, facts, styles — the name and its kana first, then the
 * summary someone wrote, then the three fields a reader actually compares across
 * cards, then the tea types as stamps. Inter carries the name and the summary;
 * everything factual is mono, so the authored and the recorded separate before
 * either is read. Same rule the powder card follows, and the reason both pages
 * feel like one app despite holding unrelated content.
 *
 * The whole card is the target, via a pseudo-element stretched from the name
 * link. One keyboard stop, named by the cultivar rather than by "read more".
 *
 * `h-full` plus `mt-auto` on the chip row keeps a grid row agreeing: summaries
 * clamp to four lines but the parents line wraps to one or two, so without it
 * the stamps in a row of three would sit at three different heights.
 */
export function CultivarCard({ cultivar }: { cultivar: CultivarCardData }) {
  return (
    <article className="relative flex h-full flex-col rounded-md border border-line bg-surface p-5 shadow-raised transition-colors hover:border-line-strong hover:bg-paper-sunk/45">
      <div className="flex items-baseline justify-between gap-3">
        {/* A cultivar name is a name, not a datum, so it stays in Inter while
            the reading beside it — a transcription — takes the mono face. */}
        <h2 className="text-headline-md">
          <Link
            href={`/cultivars/${cultivar.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha"
          >
            {cultivar.name}
          </Link>
        </h2>
        {cultivar.reading !== null && (
          <span className="data-sm shrink-0 text-clay">
            {cultivar.reading}
          </span>
        )}
      </div>

      <p className="mt-2.5 line-clamp-4 text-body-excerpt text-ink-2">
        {cultivar.summary}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        <Fact label="Registered" value={cultivar.registered} />
        <Fact label="Prefecture" value={cultivar.prefecture} />
        <Fact label="Parents" value={cultivar.parents} span />
      </dl>

      {cultivar.teaTypes.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {cultivar.teaTypes.map((type) => (
            <li key={type} className={chipClasses()}>
              {TEA_TYPE_LABELS[type] ?? type}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Fact({
  label,
  value,
  span = false,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : undefined}>
      <dt className="label-caps text-clay">{label}</dt>
      <dd className="data-md mt-1 text-ink">{value}</dd>
    </div>
  );
}
