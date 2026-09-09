import type { CSSProperties, ReactNode } from "react";
import { PiLeafLight } from "react-icons/pi";

import { GradientPattern } from "@/components/shared/gradient-pattern";

/**
 * Upload stand-ins — photographs and avatars.
 *
 * These gradients are NOT palette members. DESIGN.md is explicit: do not derive
 * tokens from them and do not use them as decorative fills. They exist only so
 * the feed has something photograph-shaped in it before R2 uploads land, at
 * which point every one of these becomes a `next/image` with a custom loader.
 *
 * The picture itself is generated from the seed rather than picked out of the
 * prototype's eight fixed `.ph-1`–`.ph-8` gradients, so a review with three
 * photographs shows three visibly different ones. Colour stays in the same
 * green-to-beige range those eight occupied — no new colour enters the repo
 * here, and in particular none of the prototype's separate a1/a2/a3 avatar
 * ramps, two of which carry hues (amber, blue) that appear nowhere in
 * DESIGN.md.
 */

/**
 * Avatar seeds and photo seeds are separate counters over the same generator,
 * so without an offset the third avatar and the third photograph would be the
 * same picture — which reads as a bug rather than as a coincidence.
 */
const AVATAR_SEED_OFFSET = 100;

export function PhotoStandIn({
  seed,
  className = "",
  style,
  children,
}: {
  seed: number;
  className?: string;
  /** Passed through to the pattern — see `GradientPattern`. */
  style?: CSSProperties;
  /** Overlay labels. Rendered above the pattern and clipped by the corners. */
  children?: ReactNode;
}) {
  return (
    // surface-sunk is the well a photograph that has not loaded sits in. The
    // pattern covers it today; it stays because a real <img> will not.
    <GradientPattern
      seed={seed}
      className={`bg-paper-sunk ${className}`}
      style={style}
    >
      {children}
    </GradientPattern>
  );
}

/**
 * The empty frame a record with no photograph gets — a sunk well with a leaf
 * centred in it.
 *
 * The glyph is what separates *absent* from *broken*. A bare `paper-sunk` box
 * is the well a photograph sits in while it loads, so on its own it reads as a
 * picture that failed to arrive; a mark inside it says the slot is empty on
 * purpose. It is a glyph rather than a line of text because "no photo" is a
 * sentence about the interface, and the leaf is the Phosphor Light one the
 * database nav already uses, so no new weight or icon set enters the repo.
 *
 * `placeholder` is the right token and its 2.2:1 is not a problem here: it is
 * the one colour DESIGN.md marks as never load-bearing, and nothing about a
 * record depends on seeing this.
 *
 * Note that the feed does the opposite — an entry with no photograph is simply
 * shorter. A timeline is a column of posts of whatever length, where a row of
 * empty frames would be an invented rhythm; a grid is a set of cards compared
 * side by side, where a missing frame ragged-edges the row it sits in.
 */
export function PhotoPlaceholder({
  className = "",
  iconSize = 32,
}: {
  className?: string;
  /** Scaled to the frame — a 32px leaf is lost in a full-width cover. */
  iconSize?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-paper-sunk ${className}`}
    >
      <PiLeafLight size={iconSize} className="text-placeholder" />
    </div>
  );
}

/**
 * 34px, circular. Circles are rationed to two things in this system — the brand
 * mark and avatars — so roundness always means "this is a person or this is the
 * product". The name sits beside it in text, so the shape itself is decorative.
 */
export function AvatarStandIn({ seed }: { seed: number }) {
  return (
    <GradientPattern
      seed={seed + AVATAR_SEED_OFFSET}
      decorative
      className="size-8.5 shrink-0 rounded-full"
    />
  );
}
