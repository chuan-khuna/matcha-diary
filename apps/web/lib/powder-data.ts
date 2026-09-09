import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Photo } from "@/lib/photos";
import type { Powder, PowderSize } from "@/lib/powders";

/**
 * The loader: every powder record in `content/database/`, read off disk at
 * build time.
 *
 * SERVER ONLY, on the same terms as `lib/cultivar-data`. `node:fs` is imported
 * at module scope, so importing anything from this file into a client component
 * fails the build. The model, the money formatting and every derived view live
 * in `lib/powders`, which is pure and safe to import from anywhere — a component
 * that needs one type or one formatter wants that module.
 *
 * The records are placeholders. The brands are real; everything written about
 * them here — prices included — is invented, and none of it should be read as a
 * claim about an actual tin of tea. They came over from the UI prototype at
 * `docs/artifacts/ui-prototype/database.html` as a TypeScript array and are
 * files now for the same reason the cultivar records are: the eventual source is
 * a Django admin and a Postgres row, so the shape a page reads should already be
 * "a record fetched from somewhere else" rather than "a constant imported from
 * the bundle".
 *
 * Each record is markdown with a YAML head, and the two halves are read by two
 * different mechanisms:
 *
 *   - The **body** is the powder's description, compiled by `@next/mdx` and
 *     pulled in by the database page's dynamic import.
 *   - The **head** is read here, because the grid needs the facts of every
 *     record at once to filter and sort them, and a compiled MDX module cannot
 *     answer that.
 *
 * ## Why the brand is a directory
 *
 * `content/database/<brand-slug>/<slug>.mdx`. The brand is the one field every
 * record has exactly one of and which groups the collection, so it is the
 * directory rather than a field repeated across ten files — which is also what
 * makes a slug unique only *within* a brand, and why `id` is the path. The
 * display name still lives in the frontmatter: "Rocky's Matcha" cannot be
 * derived from `rockys-matcha`, and guessing at it would be a second, worse
 * source of truth for a name a maker prints on a tin.
 */

const CONTENT_DIR = path.join(process.cwd(), "content/database");

/**
 * One frontmatter value, flattened to a string. `unknown` because YAML gives
 * back whatever the transcriber typed — see `lib/cultivar-data` for the same
 * helper and the timestamp trap that shapes it.
 */
function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return null;
}

/** A frontmatter list of strings. `null`, absent and `[]` all mean "none". */
function list(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => text(item))
    .filter((item): item is string => item !== null);
}

/**
 * The record's photographs, resolved.
 *
 * A frontmatter entry is one of two things, and the YAML says which by its
 * shape. A bare number is a gradient seed — anything that is not a finite
 * number is dropped rather than coerced, because a seed that arrived as the
 * string "two hundred" is a broken record and `NaN` propagating into a gradient
 * is a far quieter failure than a missing photograph. A mapping with a `file`
 * is a real image, and `alt` is required of it: an undescribed photograph is a
 * record that is not finished.
 *
 * `file` is a path from the record's own directory — `images/x.jpg` beside
 * `x.mdx` — so it reads the way a path in a document should. Write it WITHOUT a
 * leading `./`, which is the one thing this cannot take: the bundler keys its
 * context module on the literal string this template builds, so `honcha/./
 * images/x.jpg` misses a map whose key is `honcha/images/x.jpg`, and the build
 * fails with a module it cannot find. Nothing normalises the path on the way
 * through, because normalising here would suggest the specifier is resolved and
 * it is not — it is concatenated.
 *
 * ## Why the file lives beside the record and not in `public/`
 *
 * `public/` is the obvious home — it is what the server serves — but it means a
 * record's own scans sit in a directory that knows nothing about records, where
 * moving `content/database/honcha/` leaves ten orphaned files behind and
 * nothing catches it. The brand is a directory precisely so that a house is one
 * place on disk; its photographs belong in it.
 *
 * What makes that work is the dynamic `import()` below, which is the pattern
 * Next documents for exactly this ("Images without static imports"). The
 * bundler resolves the specifier at build time — every file matching the
 * template becomes part of the build, hashed and served — and hands back a
 * `StaticImageData` carrying the intrinsic width, height and blur placeholder.
 * A path in `public/` gives none of those: a record names a file and never a
 * width, so a frame there has to guess its own box.
 *
 * The specifier is a relative path rather than the `@/` alias every other
 * import in this app uses. It has to be: the bundler reads this template
 * literally to decide which files to include, and it resolves that glob itself
 * without consulting `tsconfig.json` — the same reason a stylesheet's `@import`
 * is the other exception. See the app's CLAUDE.md.
 */
async function photos(value: unknown, brandSlug: string): Promise<Photo[]> {
  if (!Array.isArray(value)) return [];

  return Promise.all(
    value.map(async (entry): Promise<Photo | null> => {
      if (typeof entry === "number") {
        return Number.isFinite(entry) ? { kind: "stand-in", seed: entry } : null;
      }

      const photo = (entry ?? {}) as Record<string, unknown>;
      const file = text(photo.file);
      const alt = text(photo.alt);

      if (file === null || alt === null) return null;

      const { default: src } = await import(
        `../content/database/${brandSlug}/${file}`
      );

      return { kind: "image", src, alt };
    }),
  ).then((list) => list.filter((photo): photo is Photo => photo !== null));
}

/**
 * The tins a powder is sold in, in the order the record lists them — smallest
 * first by convention, and never re-sorted here. See `PowderSize`.
 *
 * `grams` and `price` are required and a row missing either is dropped: a size
 * with no price is not a size. `packaging` is optional and absent means `null`,
 * because most makers here sell one weight one way and never name the
 * container — see the field's own note on why that is not defaulted to a
 * string.
 */
function sizes(value: unknown): PowderSize[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry): PowderSize | null => {
      const size = (entry ?? {}) as Record<string, unknown>;
      const grams = size.grams;
      const price = size.price;

      if (typeof grams !== "number" || !Number.isFinite(grams)) return null;
      if (typeof price !== "number" || !Number.isFinite(price)) return null;

      return { grams, packaging: text(size.packaging), price };
    })
    .filter((size): size is PowderSize => size !== null);
}

/**
 * The first paragraph of the body, as plain text.
 *
 * Every record opens with its own name as an `h1` — which is how a file reads on
 * disk, and which the page then drops because it has already printed the name —
 * so the heading lines are skipped and the first prose block is taken. Soft
 * wraps inside that block are collapsed: they are a convention of the source
 * file, not of the sentence.
 *
 * This is deliberately not a markdown render. The card clamps it to three lines
 * of plain text, and the day a description opens with a link or an emphasis is
 * the day this loses a pair of asterisks — an acceptable trade against pulling a
 * parser in to serve one clamped paragraph.
 */
function excerpt(body: string): string {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block !== "" && !block.startsWith("#"));

  return paragraph?.replace(/\s+/g, " ") ?? "";
}

async function parse(
  brandSlug: string,
  file: string,
  raw: string,
): Promise<Powder> {
  const { data, content } = matter(raw);
  const fallbackSlug = file.replace(/\.mdx?$/, "");
  const slug = text(data.slug) ?? fallbackSlug;

  return {
    id: `${brandSlug}/${slug}`,
    slug,
    brand: text(data.brand) ?? brandSlug,
    brandSlug,
    name: text(data.name) ?? fallbackSlug,
    origin: text(data.origin) ?? "—",
    cultivars: list(data.cultivars),
    excerpt: excerpt(content),
    notes: list(data.notes),
    sizes: sizes(data.sizes),
    photos: await photos(data.photos, brandSlug),
  };
}

/**
 * Read once per process, not once per page — the same cache, for the same
 * reason, as the cultivar loader's.
 *
 * The promise is what is cached, not the records. Resolving a record's images
 * is asynchronous, so two pages rendering at once would otherwise both find an
 * empty cache and both do the whole read; handing the second one the first
 * one's promise is what makes "once per process" true rather than approximate.
 */
let cache: Promise<Powder[]> | null = null;

export function allPowders(): Promise<Powder[]> {
  if (cache !== null) return cache;

  cache = Promise.all(
    fs
      .readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((brand) =>
        fs
          .readdirSync(path.join(CONTENT_DIR, brand.name))
          // `images/` sits alongside the records; only the records are records.
          .filter((file) => /\.mdx?$/.test(file))
          .map((file) =>
            parse(
              brand.name,
              file,
              fs.readFileSync(path.join(CONTENT_DIR, brand.name, file), "utf8"),
            ),
          ),
      ),
  ).then((powders) =>
    powders
    // By brand, then by blend within it — the order the directories already
    // imply, made explicit so it does not depend on what `readdirSync` happens
    // to return on a given filesystem. Nothing here is promoted or featured: the
    // grid is a reference, and a house with three powders gets three cards next
    // to each other rather than three positions.
      .sort(
        (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name),
      ),
  );

  return cache;
}

export async function powderById(id: string): Promise<Powder | undefined> {
  return (await allPowders()).find((powder) => powder.id === id);
}
