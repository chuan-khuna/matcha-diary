"use client";

import { useState } from "react";

import { OverlayLabel } from "@/components/shared/overlay-label";
import { PhotoFrame } from "@/components/shared/photo-frame";
import { photoKey, type Photo } from "@/lib/photos";

/**
 * A review's photographs: one shown large, with the whole set beneath it as
 * thumbnails that choose which one that is.
 *
 * The row holds every photograph including the one on show, not just the
 * others. A tray where the large image is missing makes the counter lie — with
 * three photographs you would see `1 / 3` above two thumbnails — and it moves
 * the row's contents every time you pick one. Marking the current one instead
 * keeps the set still under the pointer.
 *
 * This is the only client state in the review body, which is why it is its own
 * component rather than state lifted into `EntryDetail`: everything else there
 * is presentational and can stay on the server.
 */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  const total = photos.length;
  const shown = photos[active];

  // A stand-in has no shape of its own, so it takes the review cover's 3:2. A
  // real photograph has one, and it is used: Honcha's records are portrait
  // scans of a label and a price card, and fitting a 3:4 picture inside a 3:2
  // frame leaves half the width empty on the sunk ground. Reserving the box the
  // picture will actually occupy is also what keeps the page from jumping when
  // the file arrives — the reason the loader resolves dimensions at all.
  const ratio =
    shown.kind === "image"
      ? `${shown.src.width} / ${shown.src.height}`
      : "3 / 2";

  return (
    <div className="flex flex-col gap-2">
      {/* 3:2 at `lg` — the review cover is the only element in the system
          allowed an 8px corner, and the only place a shadow is meant to be
          visible, because a photograph is a physical object here. */}
      <PhotoFrame
        photo={shown}
        className="rounded-lg shadow-photo"
        style={{ aspectRatio: ratio }}
        sizes="(min-width: 768px) 42rem, 100vw"
        // The one place in the app a photograph is read rather than glanced
        // at, so nothing is cropped out of it. The frame already matches a real
        // photograph's shape; `contain` is what keeps a rounding difference
        // from shaving an edge off the label.
        fit="contain"
      >
        {total > 1 && (
          <OverlayLabel className="absolute right-3 bottom-3">
            {active + 1} / {total}
          </OverlayLabel>
        )}
      </PhotoFrame>

      {total > 1 && (
        <ul className="flex flex-wrap gap-2">
          {photos.map((photo, index) => {
            const isActive = index === active;

            return (
              <li key={photoKey(photo, index)}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  // The button has no text, so the photograph's position is
                  // its whole name; `aria-current` carries which one is up.
                  aria-label={`Show photo ${index + 1} of ${total}`}
                  aria-current={isActive}
                  // Selection is an outline offset 2px, never a border —
                  // DESIGN.md, so that choosing a photograph never shifts it.
                  // Focus is the same ring pushed out to the 4px offset the
                  // rest of the app focuses at, so tabbing onto the selected
                  // thumbnail still changes something visible.
                  className={`block cursor-pointer rounded-sm outline-matcha outline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    isActive ? "outline-2" : ""
                  }`}
                >
                  <PhotoFrame
                    photo={photo}
                    className="size-16 rounded-sm border border-line"
                    sizes="4rem"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
