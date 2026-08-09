"use client";

import { useEffect, useId, useRef } from "react";

import { EntryDetail } from "@/components/entry-detail";
import type { FeedEntry } from "@/lib/feed-data";

/**
 * The full entry, as a modal.
 *
 * Built on the native <dialog> with showModal(), which is why there is so
 * little code here: focus trapping, Escape to dismiss, top-layer stacking above
 * every z-index on the page, and inert background content are all browser
 * behaviour rather than things to hand-roll. The only pieces left are syncing
 * React state with the element's imperative API, dismissing on a backdrop
 * click, and locking the page behind it from scrolling.
 *
 * Deliberately NOT a route yet. When /reviews/[id] exists this should become an
 * intercepting route (app/@modal/(.)reviews/[id]) so the modal earns a URL, a
 * working back button and a shareable page for a direct visit — the ADR is
 * explicit that record IDs live in review URLs. Until that page exists there is
 * nothing to intercept, and a URL that renders nothing on refresh is worse than
 * no URL at all.
 */
export function EntryDialog({
  entry,
  onClose,
}: {
  entry: FeedEntry | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isOpen = entry !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // showModal() makes the background inert but does not stop it scrolling.
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={entry ? titleId : undefined}
      // Fires for Escape as well as close(), so state stays in step however the
      // dialog was dismissed.
      onClose={onClose}
      // A click that lands on the dialog element itself is a click on the
      // backdrop: the content sits in a child that covers the whole box.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-reading overflow-y-auto rounded-md border border-line bg-surface p-0 text-ink shadow-overlay backdrop:bg-scrim"
    >
      {entry && (
        <>
          <div className="sticky top-0 z-10 flex justify-end border-b border-line bg-paper-translucent px-4 py-2 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-sm px-2.5 py-1.5 font-mono text-data-md text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
            >
              close
            </button>
          </div>

          <EntryDetail entry={entry} titleId={titleId} />
        </>
      )}
    </dialog>
  );
}
