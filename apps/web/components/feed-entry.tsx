import Link from "next/link";

import { OverlayLabel } from "@/components/overlay-label";
import { AvatarStandIn, PhotoStandIn } from "@/components/placeholders";
import type { FeedEntry as FeedEntryData } from "@/lib/feed-data";

/**
 * Chip overflow is cut, not scrolled, and not counted with a "+2" affordance.
 * Together with the clamped title and excerpt this is what keeps every post in
 * the timeline on the same height rhythm.
 */
const MAX_NOTES = 4;

/**
 * One entry in the timeline. Every entry is drawn identically — nothing is
 * promoted, featured, or visually ranked, and there is no summary score. Taste
 * ratings deliberately do not appear here; they live on the review page only.
 */
export function FeedEntry({ entry }: { entry: FeedEntryData }) {
  const [cover, ...rest] = entry.photos;
  const hasCover = cover !== undefined;

  return (
    <Link
      href="#"
      // The hover wash bleeds 16px past the row via a ring, so the whole post
      // reads as one target rather than as a boxed card.
      className="flex gap-3 border-b border-line py-6 transition-colors hover:bg-paper-sunk/45 hover:ring-16 hover:ring-paper-sunk/45"
    >
      <AvatarStandIn seed={entry.author.avatar} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          {/* Inter for the name a person chose, mono for the facts beside it. */}
          <span className="text-body-md font-medium">{entry.author.name}</span>
          <span className="font-mono text-data-md text-clay">
            @{entry.author.handle} · {entry.postedAt}
          </span>
        </div>

        {/* An entry with no photograph simply has none — no empty well, no
            icon, no "no image" label. surface-sunk is reserved for a photo that
            has not *loaded*, so borrowing it here would read as breakage.
            Where a rule does not cover a case, DESIGN.md resolves toward less. */}
        {hasCover && (
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

        <h2 className="line-clamp-2 text-headline-md">{entry.title}</h2>

        {entry.notes.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {entry.notes.slice(0, MAX_NOTES).map((note) => (
              <li
                key={note}
                // Zero radius is the fixed point of the system: a taste note is
                // a stamped label, not a bubble.
                className="rounded-none border border-line-strong bg-surface px-2.25 py-1 font-mono text-data-sm whitespace-nowrap text-ink-2"
              >
                {note}
              </li>
            ))}
          </ul>
        )}

        <p className="line-clamp-4 text-body-excerpt text-ink-2">{entry.excerpt}</p>

        <span className="font-mono text-data-sm uppercase text-clay">{entry.place}</span>
      </div>
    </Link>
  );
}
