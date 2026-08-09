"use client";

import { useState } from "react";

import { EntryDialog } from "@/components/entry-dialog";
import { FeedEntry } from "@/components/feed-entry";
import type { FeedEntry as FeedEntryData } from "@/lib/feed-data";

/**
 * Holds which entry is open, so the page above it stays a server component and
 * the data keeps coming from the server. The client boundary starts here, at
 * the first thing that genuinely needs state.
 */
export function FeedList({ entries }: { entries: FeedEntryData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openEntry = entries.find((entry) => entry.id === openId) ?? null;

  return (
    <>
      <section className="flex flex-col pb-16" aria-label="Timeline">
        {entries.map((entry) => (
          <FeedEntry
            key={entry.id}
            entry={entry}
            onOpen={() => setOpenId(entry.id)}
          />
        ))}
      </section>

      <EntryDialog entry={openEntry} onClose={() => setOpenId(null)} />
    </>
  );
}
