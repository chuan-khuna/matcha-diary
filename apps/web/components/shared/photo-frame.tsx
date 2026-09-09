import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

import { PhotoStandIn } from "@/components/shared/placeholders";
import type { Photo } from "@/lib/photos";

/**
 * One photograph in a frame the caller shapes — the real file where a record
 * has one, the gradient stand-in where it does not.
 *
 * The branch lives here rather than at the five call sites that draw a
 * photograph, so that the day the last stand-in is replaced this is the one
 * file that loses a case. Shape, size and radius stay the caller's, exactly as
 * they are for `GradientPattern`: a card cover is 4:3, a gallery cover is 3:2,
 * a thumbnail is a square. All this owns is what goes inside.
 *
 * `fill` rather than the intrinsic dimensions the resolved image carries,
 * because the frame's shape belongs to the page and not to the file: a 3:4 scan
 * and a 3:2 photograph both have to sit in the same card without ragging the
 * row they are in. The dimensions are not wasted — they are what `placeholder`
 * needs, and they are why there is a blur to show at all.
 *
 * `sizes` is required of the caller for the same reason: under `fill`, Next has
 * nothing else to work out which resolution to serve, and a wrong `sizes` is a
 * full-width image downloaded for a 64px thumbnail.
 *
 * `bg-paper-sunk` under the image is the same well `PhotoStandIn` sits in: it
 * is what shows while the file loads, and it is what fills the margins when the
 * fit is `contain`.
 */
export function PhotoFrame({
  photo,
  className = "",
  style,
  sizes,
  fit = "cover",
  priority = false,
  children,
}: {
  photo: Photo;
  className?: string;
  /**
   * For a shape that is a number rather than a name — the gallery sizes its
   * frame from the photograph's own dimensions, which no utility class can
   * spell. Anything expressible in classes belongs in `className`.
   */
  style?: CSSProperties;
  /** The rendered width of this frame, per breakpoint. See `next/image`. */
  sizes: string;
  /**
   * `cover` fills the frame and crops — right wherever the picture is being
   * recognised rather than read, which is every card and every thumbnail.
   *
   * `contain` fits the whole picture inside it. Honcha's records are label and
   * price-card scans: cropping one loses the taste bars or a row of prices,
   * which is the entire content. Anywhere someone is actually reading the
   * photograph, nothing may be cropped away.
   */
  fit?: "cover" | "contain";
  /** Set on a cover that is above the fold, and nowhere else. */
  priority?: boolean;
  /** Overlay labels. Drawn above the picture and clipped by the corners. */
  children?: ReactNode;
}) {
  if (photo.kind === "stand-in") {
    return (
      <PhotoStandIn seed={photo.seed} className={className} style={style}>
        {children}
      </PhotoStandIn>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-paper-sunk ${className}`}
      style={style}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        // Available because the record's images are resolved by the bundler
        // rather than named as URLs — see `lib/powder-data`. The scans are
        // dark-ground labels, so the alternative is a pale well flashing to
        // near-black.
        placeholder="blur"
        className={fit === "cover" ? "object-cover" : "object-contain"}
      />
      {children}
    </div>
  );
}
