"use client";

import { useState } from "react";

/**
 * Sticks directly beneath the top bar, at exactly its 60px height, so the two
 * pieces of chrome read as one surface. Same translucency-plus-blur treatment.
 *
 * Client-side because the selection is local UI state with no route behind it
 * yet. When these become real filters they should move into the URL — the state
 * is worth linking to and going back to.
 */
const TABS = ["for you", "following", "nearby", "my diary"] as const;

export function FeedTabs() {
  const [active, setActive] = useState<string>(TABS[0]);

  return (
    <div
      role="tablist"
      aria-label="Timeline filter"
      className="sticky top-15 z-10 flex gap-4 border-b border-line bg-paper-translucent backdrop-blur-md sm:gap-6"
    >
      {TABS.map((tab) => {
        const isActive = tab === active;

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActive(tab)}
            // -mb-px pulls the underline onto the container's hairline so the
            // active marker replaces it rather than sitting above it.
            className={`data-md -mb-px cursor-pointer border-b-2 py-4 transition-colors ${
              isActive
                ? "border-matcha text-ink"
                : "border-transparent text-clay hover:text-ink"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
