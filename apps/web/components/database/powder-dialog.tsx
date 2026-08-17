"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { PhotoGallery } from "@/components/shared/photo-gallery";
import { PhotoPlaceholder } from "@/components/shared/placeholders";
import { PriceList } from "@/components/database/price-list";
import type { Powder } from "@/lib/powders";
import { tasteNoteChipClasses } from "@/lib/taste-notes";

/**
 * The full powder record, as a modal — the prototype's "record sheet".
 *
 * Built on the native <dialog> with showModal(), for the same reasons the entry
 * dialog is: focus trapping, Escape to dismiss, top-layer stacking and inert
 * background content are browser behaviour rather than things to hand-roll.
 * What is left is syncing React state with the imperative API, dismissing on a
 * backdrop click, and locking the page behind it from scrolling.
 *
 * This exists because the card cannot show a description. Clamping long-form
 * prose to three lines and never offering the rest would make the field
 * decorative, so the card is the summary and this is the record.
 *
 * `prose` is the record's compiled markdown body, rendered on the server and
 * handed down as a node. A client component cannot import an MDX module for a
 * record chosen at runtime, and it should not want to: the description is static
 * content that belongs in the payload rather than a compiler that belongs in the
 * bundle. The page above compiles all ten and passes the open one through.
 *
 * Deliberately NOT a route yet, on the same terms as the entry dialog: when
 * /powders/[id] exists this should become an intercepting route so the record
 * earns a URL, a back button, and a page that survives a refresh — and the
 * dynamic import would move there, one record at a time.
 */
export function PowderDialog({
  powder,
  prose,
  onClose,
}: {
  powder: Powder | null;
  prose: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isOpen = powder !== null;

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
      aria-labelledby={powder ? titleId : undefined}
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
      {powder && (
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

          <article className="flex flex-col gap-6 p-4 sm:p-6">
            {/* Keyed by record: the dialog element itself survives between
                openings, but the gallery inside it must not, or it would open
                the next powder already scrolled to whichever photograph you
                left selected — and would index past the end of a shorter set. */}
            {powder.photos.length > 0 ? (
              <PhotoGallery key={powder.id} photos={powder.photos} />
            ) : (
              // 3:2 at `lg` to match the cover the gallery would have drawn
              // here, but no shadow: DESIGN.md allows a visible one because a
              // photograph is a physical object, and this is the absence of
              // one.
              <PhotoPlaceholder
                className="aspect-[3/2] rounded-lg"
                iconSize={48}
              />
            )}

            <header className="flex flex-col gap-1">
              <span className="font-mono text-data-sm uppercase text-ink-2">
                {powder.brand}
              </span>
              <h2 id={titleId} className="text-headline-lg">
                {powder.name}
              </h2>
            </header>

            <section className="flex flex-col gap-3">
              <h3 className="label-caps text-clay">Origin</h3>
              <p className="font-mono text-data-md uppercase">
                {powder.origin}
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="label-caps text-clay">Cultivars</h3>
              {/* Tags, and the record says nothing about their shares —
                  no maker publishes the ratio and a made-up percentage
                  would read as a fact. */}
              <p className="font-mono text-data-md uppercase">
                {powder.cultivars.join(" · ")}
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="label-caps text-clay">Price</h3>
              <PriceList sizes={powder.sizes} />
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="label-caps text-clay">Description</h3>
              {/* The MDX map in `components/cultivars/mdx-components` dresses
                  every element markdown can produce, body-prose paragraphs
                  included, so the prose needs no styling here. Only the leading
                  paragraph's top margin is cancelled: the section's own gap has
                  already set the distance from the heading. */}
              <div className="[&>p:first-child]:mt-0">{prose}</div>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="label-caps text-clay">Taste notes</h3>
              <ul className="flex flex-wrap gap-2">
                {powder.notes.map((note) => (
                  <li key={note} className={tasteNoteChipClasses()}>
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </>
      )}
    </dialog>
  );
}
