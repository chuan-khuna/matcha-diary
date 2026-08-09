import type { ReactNode } from "react";

/**
 * Upload stand-ins — photographs and avatars.
 *
 * These gradients are NOT palette members. DESIGN.md is explicit: do not derive
 * tokens from them and do not use them as decorative fills. They exist only so
 * the feed has something photograph-shaped in it before R2 uploads land, at
 * which point every one of these becomes a `next/image` with a custom loader.
 *
 * The values are lifted verbatim from the prototype's `.ph-1`–`.ph-8`, which is
 * also why no new colour enters the repo here: the avatars reuse the same
 * green-to-beige set rather than introducing the prototype's separate a1/a2/a3
 * ramps, two of which carry hues (amber, blue) that appear nowhere in DESIGN.md.
 */

const PHOTO_STANDINS = [
  "linear-gradient(150deg, oklch(0.7971 0.0721 136.25) 0%, oklch(0.6496 0.0995 139.83) 45%, oklch(0.4719 0.0769 140.34) 100%)",
  "linear-gradient(160deg, oklch(0.9297 0.0242 85.79) 0%, oklch(0.8397 0.0528 114.65) 50%, oklch(0.6360 0.0734 129.10) 100%)",
  "linear-gradient(140deg, oklch(0.8695 0.0250 83.41) 0%, oklch(0.7272 0.0640 128.19) 55%, oklch(0.4950 0.0672 137.69) 100%)",
  "linear-gradient(200deg, oklch(0.9390 0.0229 84.59) 0%, oklch(0.8116 0.0580 127.38) 60%, oklch(0.5597 0.0764 136.95) 100%)",
  "linear-gradient(170deg, oklch(0.8084 0.0342 83.70) 0%, oklch(0.6907 0.0664 128.76) 48%, oklch(0.4048 0.0626 137.73) 100%)",
  "linear-gradient(130deg, oklch(0.9074 0.0293 89.58) 0%, oklch(0.7731 0.0697 127.16) 52%, oklch(0.5963 0.0820 133.79) 100%)",
  "linear-gradient(210deg, oklch(0.8504 0.0276 85.67) 0%, oklch(0.7059 0.0678 129.19) 50%, oklch(0.4609 0.0680 135.71) 100%)",
  "linear-gradient(120deg, oklch(0.9399 0.0206 91.59) 0%, oklch(0.8204 0.0554 124.72) 55%, oklch(0.6182 0.0811 131.42) 100%)",
];

/** The soft top-left sheen every prototype photo carries. */
const SHEEN =
  "radial-gradient(120% 90% at 30% 15%, oklch(1 0 0 / 0.30), transparent 60%)";

export function PhotoStandIn({
  seed,
  className = "",
  children,
}: {
  seed: number;
  className?: string;
  /** Overlay labels. Rendered above the sheen and clipped by the corners. */
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-paper-sunk ${className}`}
      style={{ backgroundImage: PHOTO_STANDINS[seed % PHOTO_STANDINS.length] }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: SHEEN }}
      />
      {children}
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
    <span
      aria-hidden="true"
      className="size-8.5 shrink-0 rounded-full"
      style={{ backgroundImage: PHOTO_STANDINS[seed % PHOTO_STANDINS.length] }}
    />
  );
}
