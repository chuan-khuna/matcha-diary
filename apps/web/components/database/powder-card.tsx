import { OverlayLabel } from "@/components/shared/overlay-label";
import { PhotoPlaceholder, PhotoStandIn } from "@/components/shared/placeholders";
import { PriceList } from "@/components/database/price-list";
import type { Powder } from "@/lib/powders";
import { tasteNoteChipClasses } from "@/lib/taste-notes";

/**
 * One powder in the database grid.
 *
 * Reads top to bottom as picture, identity, facts, prose: the cover, then brand
 * and blend name saying which tin this is, then the cultivar and price lines
 * you compare across cards, then the part someone wrote. Inter carries only the
 * name and the description; everything factual is mono, so the two kinds of
 * content separate before a word of either is read.
 *
 * The card is one target, but the accessible control is the name button
 * stretched over it by a pseudo-element — the same arrangement as a feed entry,
 * and for the same reason: one keyboard stop, named by the blend rather than by
 * the whole record.
 *
 * `h-full` plus `mt-auto` on the notes is what keeps a row of cards agreeing.
 * Descriptions clamp to three lines, but cultivar lines wrap at one or two, so
 * without it the chip rows in a row of three would sit at three heights.
 */
export function PowderCard({
  powder,
  onOpen,
}: {
  powder: Powder;
  onOpen: () => void;
}) {
  const [cover] = powder.photos;

  return (
    <article
      // Level 1 resting material: white, hairline, and the faintest shadow.
      // Hover is a tone change rather than a lift — DESIGN.md keeps visible
      // shadows for photography and real overlays, and surface-sunk is
      // literally the hover wash. `overflow-hidden` is what lets the cover run
      // to the card's edges and take its 5px corners.
      className="relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface shadow-raised transition-colors hover:border-line-strong hover:bg-paper-sunk/45"
    >
      {/* Every card opens with a frame, photograph or not. In a grid the cards
          are read across rather than down, and one card starting at its brand
          while the two beside it start at a picture puts three different things
          on the same eye line. */}
      {cover === undefined ? (
        <PhotoPlaceholder className="aspect-[4/3] border-b border-line" />
      ) : (
        <PhotoStandIn
          seed={cover}
          className="aspect-[4/3] border-b border-line"
        >
          {powder.photos.length > 1 && (
            <OverlayLabel className="absolute right-2 bottom-2">
              {powder.photos.length} photos
            </OverlayLabel>
          )}
        </PhotoStandIn>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Maker on the left, growing region on the right — the two halves of
            where a tin came from, on one line because they answer one
            question. The brand is the identifier and carries the darker ink;
            the origin qualifies it. */}
        <div className="flex items-baseline justify-between gap-2 font-mono text-data-sm uppercase">
          <span className="text-ink-2">{powder.brand}</span>
          <span className="text-right text-clay">{powder.origin}</span>
        </div>

        <h2 className="text-headline-md">
          <button
            type="button"
            onClick={onOpen}
            className="cursor-pointer text-left after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha"
          >
            {powder.name}
          </button>
        </h2>

        <p className="font-mono text-data-sm uppercase text-clay">
          {powder.cultivars.join(" · ")}
        </p>

        <PriceList sizes={powder.sizes} />

        {/* The record's opening paragraph, clamped — not a second summary
            written for the card. See `Powder.excerpt`. */}
        <p className="line-clamp-3 text-body-excerpt text-ink-2">
          {powder.excerpt}
        </p>

        <ul className="mt-auto flex flex-wrap gap-2 pt-1">
          {powder.notes.map((note) => (
            <li key={note} className={tasteNoteChipClasses()}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
