import type { StaticImageData } from "next/image";

/**
 * What a photograph is, anywhere in the app, once a record has been loaded.
 *
 * Two kinds, because the collection is halfway through a migration and saying
 * so in the type is cheaper than pretending otherwise. Most records still carry
 * a *stand-in*: a seed for the gradient generator, standing where an upload
 * will go. Some carry a real *image*, scanned from the maker's own material and
 * living beside the record that cites it. `placeholders.tsx` has always said
 * the stand-ins become `next/image` eventually; this is what "eventually" looks
 * like arriving one brand at a time.
 *
 * A union rather than two fields on the record. Two fields — `photos` and
 * `images`, say — is a shape where both can be filled in and every call site
 * has to decide which wins, which is the ambiguity `PowderSize` avoids by
 * making a size a row and `Powder` avoids by deriving its excerpt. A photograph
 * is one thing; what differs is whether we have it yet.
 *
 * Pure and isomorphic: the loaders build these on the server and the gallery is
 * a client component, so nothing here may reach for `fs`. `StaticImageData` is
 * a plain object — `src`, `width`, `height`, `blurDataURL` — and crosses into
 * the client in the RSC payload like any other data.
 */
export type Photo =
  /**
   * A real file, already resolved by the bundler.
   *
   * `StaticImageData` rather than a URL string, because it carries the
   * intrinsic dimensions with it. That is what lets a frame reserve the right
   * box before the file arrives, and what makes the blur-up placeholder
   * possible — neither of which a bare `/database/honcha/x.jpg` can offer,
   * since a record names a file and never a width.
   */
  | { kind: "image"; src: StaticImageData; alt: string }
  /**
   * A seed for the gradient generator — see `lib/gradient-pattern`. Any
   * integer, the same one giving the same picture on both sides of the wire.
   */
  | { kind: "stand-in"; seed: number };

/**
 * The feed's records still hold bare seeds, and the reviews they belong to are
 * mock data rather than files on disk. This is the adapter at that edge: it
 * exists so `PhotoGallery` can take one type instead of two, and it goes away
 * with the mock.
 */
export const standIn = (seed: number): Photo => ({ kind: "stand-in", seed });

/**
 * A React key for one photograph in a list.
 *
 * Identity *and* position, because neither alone is enough: a record may list
 * the same seed twice, and the gallery draws the same array in two places at
 * once — a large image and a row of thumbnails — where the position is what
 * tells two otherwise identical entries apart.
 */
export const photoKey = (photo: Photo, index: number): string =>
  `${index}-${photo.kind === "image" ? photo.src.src : photo.seed}`;
