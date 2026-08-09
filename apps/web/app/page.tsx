import { ComposePrompt } from "@/components/compose-prompt";
import { FeedEntry } from "@/components/feed-entry";
import { FeedTabs } from "@/components/feed-tabs";
import { PLACEHOLDER_FEED } from "@/lib/feed-data";

/**
 * The feed — a single column of identical posts.
 *
 * Layout is single-column by intent: no grid, no masonry, nothing promoted.
 * The column caps at `timeline-max` (620px) and the gutter drops to 16px rather
 * than the usual 24px, so photographs get that width back on a phone.
 */
export default function FeedPage() {
  return (
    <main className="mx-auto w-full max-w-timeline px-4">
      <FeedTabs />

      <ComposePrompt />

      <section className="flex flex-col pb-16" aria-label="Timeline">
        {PLACEHOLDER_FEED.map((entry) => (
          <FeedEntry key={entry.id} entry={entry} />
        ))}
      </section>

      <button
        type="button"
        className="mb-12 block w-full cursor-pointer py-6 font-mono text-data-md text-matcha-deep hover:bg-paper-sunk"
      >
        load older entries ↓
      </button>
    </main>
  );
}
