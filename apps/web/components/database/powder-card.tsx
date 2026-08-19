import { PiCheckLight, PiPlusLight } from "react-icons/pi";

import { OverlayLabel } from "@/components/shared/overlay-label";
import { PhotoPlaceholder, PhotoStandIn } from "@/components/shared/placeholders";
import { PriceList } from "@/components/database/price-list";
import type { Powder } from "@/lib/powders";
import { chipClasses } from "@/lib/chip";
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
 *
 * With the notes now above the description, the `mt-auto` moves onto a wrapper
 * holding both, so the pair is anchored to the foot of the card whether or not
 * a record has taste notes — several own-label ranges publish none.
 *
 * The compare toggle is the card's second control and the only other one. It
 * carries the record to `/database/compare` rather than doing anything here,
 * so a person can pick several while scrolling and cross over once — which is
 * the thing the compare page could not previously be reached by.
 */
export function PowderCard({
  powder,
  onOpen,
  isCompared,
  canCompare,
  onToggleCompare,
}: {
  powder: Powder;
  onOpen: () => void;
  /** Already carried into the comparison. */
  isCompared: boolean;
  /** False once the comparison is full, which disables adding but never removing. */
  canCompare: boolean;
  onToggleCompare: () => void;
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
      {/* `z-10` and a stacking context of its own, because the name button
          below stretches a pseudo-element across the whole card to make it one
          target — without this the toggle would sit under it and every click
          would open the dialog instead. Matcha here is state, which is one of
          the colour's sanctioned uses: it marks what is carried over. */}
      <button
        type="button"
        onClick={onToggleCompare}
        aria-pressed={isCompared}
        aria-label={
          isCompared
            ? `Remove ${powder.name} from the comparison`
            : `Add ${powder.name} to the comparison`
        }
        disabled={!isCompared && !canCompare}
        className={`${chipClasses(isCompared)} absolute top-2 right-2 z-10 cursor-pointer shadow-raised transition-colors hover:border-matcha-line hover:bg-matcha-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line-strong disabled:hover:bg-surface`}
      >
        {isCompared ? (
          <PiCheckLight aria-hidden="true" size={15} />
        ) : (
          <PiPlusLight aria-hidden="true" size={15} />
        )}
      </button>

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
        <div className="data-sm flex items-baseline justify-between gap-2 uppercase">
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

        <p className="data-sm uppercase text-clay">
          {powder.cultivars.join(" · ")}
        </p>

        <PriceList sizes={powder.sizes} />

        {/* Notes above the prose, because they are what the card is scanned
            for. A row of stamps is read in one glance where a paragraph has to
            be started, and putting the paragraph first makes the reader step
            over the answer to reach it.
            The two travel together in one `mt-auto` block rather than the chip
            row carrying it alone — a record with no notes at all, which
            several own-label ranges have, would otherwise leave its
            description floating wherever the facts above it ended. */}
        <div className="mt-auto flex flex-col gap-3 pt-1">
          {powder.notes.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {powder.notes.map((note) => (
                <li key={note} className={tasteNoteChipClasses()}>
                  {note}
                </li>
              ))}
            </ul>
          )}

          {/* The record's opening paragraph, clamped — not a second summary
              written for the card. See `Powder.excerpt`. */}
          <p className="line-clamp-3 text-body-md text-ink-2">
            {powder.excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}
