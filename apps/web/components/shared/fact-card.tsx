/**
 * A key/value card, with the empty rows already gone.
 *
 * Filtering happens here rather than at each call site because almost every
 * field in these collections is absent from some record — the sources simply
 * never recorded it — and a rail of "—" would present thirty holes as thirty
 * facts. A card with nothing left to say removes itself.
 *
 * Drawn by both record types: a cultivar's rail stacks three of these, and a
 * powder's holds one. It moved here when the second call site appeared, on the
 * same reasoning as `lib/chip` — a card that two files each spell out is two
 * chances for one of them to drift, and the cultivar and powder rails are
 * meant to read as the same object.
 *
 * Values are strings, so a caller with a component to place — a price list, a
 * row of chips — wants its own `<section>` rather than a row in here. That is
 * the boundary: this draws facts that are text.
 */
export function FactCard({
  title,
  facts,
}: {
  title: string;
  facts: ReadonlyArray<readonly [string, string | null]>;
}) {
  const shown = facts.filter(
    (fact): fact is readonly [string, string] =>
      fact[1] !== null && fact[1] !== "",
  );
  if (shown.length === 0) return null;

  return (
    <section className="rounded-md border border-line bg-surface p-5 shadow-raised">
      <h2 className="label-caps text-clay">{title}</h2>
      <dl className="mt-4 space-y-3">
        {shown.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-line pb-3 last:border-0 last:pb-0"
          >
            <dt className="data-sm text-clay">{label}</dt>
            <dd className="data-md mt-1 text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
