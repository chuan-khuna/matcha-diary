import type { CSSProperties, ReactNode } from "react";

import { gradientPattern } from "@/lib/gradient-pattern";

/**
 * A box filled with the gradient pattern its seed generates — the primitive
 * every upload stand-in in the app is drawn with.
 *
 * Shape, size and radius are the caller's, because those belong to the thing
 * being stood in for: a review cover is 3:2 at `lg`, a thumbnail is 1:1 at
 * `sm`, an avatar is a circle. All this owns is the picture.
 *
 * No client boundary. The pattern is a pure function of the seed, so it
 * renders on the server and hydrates to the identical string — see
 * `lib/gradient-pattern.ts` for why that determinism is not optional.
 */
export function GradientPattern({
  seed,
  className = "",
  style,
  decorative = false,
  children,
}: {
  /** Any integer. Same seed, same picture, on both sides of the wire. */
  seed: number;
  className?: string;
  /** Merged over the pattern fill, for a shape no utility class can spell. */
  style?: CSSProperties;
  /** An avatar stand-in carries no information; a photograph well does. */
  decorative?: boolean;
  /** Overlay labels. Drawn above the pattern and clipped by the corners. */
  children?: ReactNode;
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: gradientPattern(seed), ...style }}
    >
      {children}
    </div>
  );
}
