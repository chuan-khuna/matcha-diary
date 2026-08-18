import { OverlayLabel } from "@/components/shared/overlay-label";
import { AvatarStandIn, PhotoStandIn } from "@/components/shared/placeholders";
import type { FeedEntry as FeedEntryData } from "@/lib/feed-data";
import { tasteNoteChipClasses } from "@/lib/taste-notes";

/**
 * Chip overflow is cut, not scrolled, and not counted with a "+2" affordance.
 * Together with the clamped title and first paragraph this is what keeps every
 * post in the timeline on the same height rhythm.
 */
const MAX_NOTES = 4;

/**
 * One entry in the timeline. Every entry is drawn identically — nothing is
 * promoted, featured, or visually ranked, and there is no summary score. Taste
 * ratings deliberately do not appear here; they belong to the detail view.
 *
 * The whole post is one target, but the accessible control is the title button
 * stretched over the card by a pseudo-element. That keeps the keyboard path to
 * a single stop with the title as its name, rather than a card-sized button
 * that announces the entire post.
 */
export function FeedEntry({
  entry,
  onOpen,
}: {
  entry: FeedEntryData;
  onOpen: () => void;
}) {
  const [cover, ...rest] = entry.photos;

  return (
    <article
      // The hover wash bleeds 16px past the row via a ring, so the whole post
      // reads as one target rather than as a boxed card.
      className="relative flex gap-3 border-b border-line py-6 transition-colors hover:bg-paper-sunk/45 hover:ring-16 hover:ring-paper-sunk/45"
    >
      <AvatarStandIn seed={entry.author.avatar} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          {/* Inter for the name a person chose, mono for the facts beside it. */}
          <span className="text-body-md font-medium">{entry.author.name}</span>
          <span className="data-md text-clay">
            @{entry.author.handle} · {entry.postedAt}
          </span>
        </div>

        {/* An entry with no photograph simply has none — no empty well, no
            icon, no "no image" label. surface-sunk is reserved for a photo that
            has not *loaded*, so borrowing it here would read as breakage.
            Where a rule does not cover a case, DESIGN.md resolves toward less. */}
        {cover !== undefined && (
          <PhotoStandIn
            seed={cover}
            className="aspect-[4/3] rounded-md border border-line"
          >
            {rest.length > 0 && (
              <OverlayLabel className="absolute right-2 bottom-2">
                {rest.length} more {rest.length === 1 ? "image" : "images"}
              </OverlayLabel>
            )}
          </PhotoStandIn>
        )}

        <h2 className="text-headline-md">
          <button
            type="button"
            onClick={onOpen}
            className="line-clamp-2 cursor-pointer text-left after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha"
          >
            {entry.title}
          </button>
        </h2>

        {entry.notes.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {entry.notes.slice(0, MAX_NOTES).map((note) => (
              <li key={note} className={tasteNoteChipClasses()}>
                {note}
              </li>
            ))}
          </ul>
        )}

        <p className="line-clamp-4 text-body-excerpt text-ink-2">{entry.body[0]}</p>

        <span className="data-sm uppercase text-clay">
          {entry.place}
        </span>
      </div>
    </article>
  );
}
