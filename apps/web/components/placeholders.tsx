import type { ReactNode } from "react";

import { GradientPattern } from "@/components/gradient-pattern";

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
  children,
}: {
  seed: number;
  className?: string;
  /** Overlay labels. Rendered above the pattern and clipped by the corners. */
  children?: ReactNode;
}) {
  return (
    // surface-sunk is the well a photograph that has not loaded sits in. The
    // pattern covers it today; it stays because a real <img> will not.
    <GradientPattern seed={seed} className={`bg-paper-sunk ${className}`}>
      {children}
    </GradientPattern>
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
