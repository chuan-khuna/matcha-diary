import { chipClasses } from "@/lib/chip";
import { childrenOf, FAMILIES, type WheelSegment } from "@/lib/flavour-wheel";

/**
 * Every note on the wheel, as text.
 *
 * Three jobs, which is why it is not a nicety. It is the keyboard path — the
 * wheel's bands are pointer targets only, because seventy tab stops arranged in
 * a circle are no way to move through anything. It is the reading on a phone,
 * where the wheel's labels scale down past legibility. And it is what a screen
 * reader gets, where the drawing is one image with a one-line description.
 *
 * Shares the wheel's selection, so pressing a note here holds it there.
 */
export function FlavourIndex({
  pinnedId,
  onSelect,
}: {
  pinnedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="flavour-index-heading" className="pt-10">
      <h2 id="flavour-index-heading" className="label-caps pb-4 text-clay">
        Every note
      </h2>

      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {FAMILIES.map((family) => (
          <section key={family.id} aria-label={family.name}>
            <h3 className="text-headline-md">
              <NameButton
                segment={family}
                isPinned={family.id === pinnedId}
                onSelect={onSelect}
              />
            </h3>

            <ul className="mt-2 flex flex-col gap-4">
              {childrenOf(family.id).map((group) => (
                <li key={group.id}>
                  <NameButton
                    segment={group}
                    isPinned={group.id === pinnedId}
                    onSelect={onSelect}
                    className="data-md text-ink-2"
                  />

                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {childrenOf(group.id).map((note) => (
                      <li key={note.id}>
                        <button
                          type="button"
                          aria-pressed={note.id === pinnedId}
                          onClick={() => onSelect(note.id)}
                          className={`${chipClasses(note.id === pinnedId)} cursor-pointer transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
                        >
                          {note.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

/** A family or group name that selects its band, keyed by its band's colour. */
function NameButton({
  segment,
  isPinned,
  onSelect,
  className = "",
}: {
  segment: WheelSegment;
  isPinned: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={isPinned}
      onClick={() => onSelect(segment.id)}
      className={`-ml-2 inline-flex cursor-pointer items-center gap-2 rounded-xs px-2 py-1 transition-colors ${
        isPinned
          ? "bg-matcha-soft text-matcha-deep"
          : "hover:bg-paper-sunk hover:text-ink"
      } ${className}`}
    >
      <FlavourSwatch fill={segment.fill} />
      {segment.name}
    </button>
  );
}

/**
 * The band's colour as a small stamp — square, like every other recorded mark
 * here. The hairline is there because a note's tone sits at barely 1.3:1
 * against white and would otherwise float with no edge.
 */
export function FlavourSwatch({ fill }: { fill: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-2.5 shrink-0 border border-line-strong"
      style={{ backgroundColor: fill }}
    />
  );
}
