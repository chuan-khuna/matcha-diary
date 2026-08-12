import { PhotoGallery } from "@/components/photo-gallery";
import { AvatarStandIn } from "@/components/placeholders";
import { RatingBar } from "@/components/rating-bar";
import type { FeedEntry } from "@/lib/feed-data";
import { tasteNoteChipClasses } from "@/lib/taste-notes";

/**
 * The full review. This is the one place taste ratings are allowed to appear —
 * DESIGN.md keeps them off the timeline so the feed stays a diary rather than a
 * leaderboard. There is still no overall score, no average and no star count:
 * a cup is described by the shape of its individual axes and by what its author
 * wrote, and nothing here collapses that to a number.
 *
 * Presentational and server-renderable. The dialog around it owns dismissal;
 * the photo gallery below owns which photograph is large. Nothing else here
 * holds state.
 */
export function EntryDetail({
  entry,
  titleId,
}: {
  entry: FeedEntry;
  titleId: string;
}) {
  return (
    <article className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <AvatarStandIn seed={entry.author.avatar} />
        <div className="flex flex-col">
          <span className="text-body-md font-medium">{entry.author.name}</span>
          <span className="font-mono text-data-sm text-clay">
            @{entry.author.handle} · {entry.postedAt}
          </span>
        </div>
      </div>

      {entry.photos.length > 0 && <PhotoGallery photos={entry.photos} />}

      <h2 id={titleId} className="text-headline-lg">
        {entry.title}
      </h2>

      {/* body-prose: 18/1.75, the loosest leading in the system, because this
          is the one place people read paragraphs. */}
      <div className="flex flex-col gap-4">
        {entry.body.map((paragraph, index) => (
          <p key={index} className="text-body-prose">
            {paragraph}
          </p>
        ))}
      </div>

      {entry.notes.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="label-caps text-clay">Taste notes</h3>
          {/* Every note, not the feed's four: the cut is a timeline rule. */}
          <ul className="flex flex-wrap gap-2">
            {entry.notes.map((note) => (
              <li key={note} className={tasteNoteChipClasses()}>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}

      {entry.ratings.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="label-caps text-clay">Taste ratings</h3>
          <div className="flex flex-col gap-3">
            {entry.ratings.map((rating) => (
              <RatingBar key={rating.axis} {...rating} />
            ))}
          </div>
        </section>
      )}

      <span className="font-mono text-data-sm uppercase text-clay">
        {entry.place}
      </span>
    </article>
  );
}
