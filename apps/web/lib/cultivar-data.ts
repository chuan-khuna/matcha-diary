import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Cultivar, CultivarSource } from "@/lib/cultivars";

/**
 * The loader: 69 research records in `content/cultivars/`, read off disk at
 * build time.
 *
 * SERVER ONLY. `node:fs` is imported at module scope, so importing anything
 * from this file into a client component fails the build. That is deliberate
 * and load-bearing — the model, the labels and every derived view live in
 * `lib/cultivars`, which is pure and safe to import from anywhere. If a
 * component needs one constant from this collection, it wants that module.
 *
 * Each record is markdown with a YAML head, and the two halves are read by two
 * different mechanisms:
 *
 *   - The **body** is compiled by `@next/mdx`, pulled in by the detail page's
 *     dynamic import.
 *   - The **head** is read here, because the index page needs the metadata of
 *     all 69 records at once and the lineage cross-links need to look records up
 *     by name. Neither can be answered by importing one compiled module, and the
 *     Next.js MDX guide names exactly this split.
 */

const CONTENT_DIR = path.join(process.cwd(), "content/cultivars");

/**
 * One frontmatter value, flattened to a string.
 *
 * The `unknown` is honest rather than lazy: YAML gives back whatever the
 * transcriber typed. A bare `1954` arrives as a number, a quoted `"1933-1935"`
 * as a string, and — the one that bites — an unquoted `2013-12-20` is parsed by
 * the YAML spec as a *timestamp*, so it arrives as a Date. It is formatted back
 * from the UTC parts because that is how the YAML parser read it; going through
 * local time would shift some records by a day.
 */
function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    const [iso] = value.toISOString().split("T");
    return iso ?? null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return null;
}

/** A frontmatter list, flattened. `null`, absent and `[]` all mean "none". */
function list(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter((item): item is string => item !== null);
}

/**
 * The registration year, dug out of a field that is usually a year and
 * sometimes a sentence about one. `null` means the cultivar was never
 * registered — which is true of seven of them, and is a fact rather than a gap.
 */
function year(value: unknown): number | null {
  const asText = text(value);
  if (asText === null) return null;
  const match = asText.match(/\b(1[89]\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function parse(file: string, raw: string): Cultivar {
  const { data } = matter(raw);
  const fallbackSlug = file.replace(/\.md$/, "");

  const parents = (data.parents ?? {}) as Record<string, unknown>;

  const sources = (Array.isArray(data.sources) ? data.sources : [])
    .map((entry): CultivarSource | null => {
      const source = (entry ?? {}) as Record<string, unknown>;
      const title = text(source.title);
      if (title === null) return null;
      return {
        title,
        url: text(source.url),
        publisher: text(source.publisher),
      };
    })
    .filter((entry): entry is CultivarSource => entry !== null);

  return {
    slug: text(data.slug) ?? fallbackSlug,
    name: text(data.name) ?? fallbackSlug,
    romaji: text(data.romaji),
    kana: text(data.kana),
    kanji: text(data.kanji),
    nameMeaning: text(data.nameMeaning),

    registered: year(data.registered),
    registrationNumber: text(data.registrationNumber),
    registry: text(data.registry),
    plantVarietyRegistration: text(data.plantVarietyRegistration),
    applicationFiled: text(data.applicationFiled),
    applicationPublished: text(data.applicationPublished),

    crossedYear: text(data.crossedYear),
    selectedYear: text(data.selectedYear),
    selectedFrom: text(data.selectedFrom),
    bredAt: text(data.bredAt),
    prefecture: text(data.prefecture),
    strainNames: list(data.strainNames),

    parents: { female: text(parents.female), male: text(parents.male) },
    notableDescendants: list(data.notableDescendants),
    siblingCultivars: list(data.siblingCultivars),
    lineageNote: text(data.lineageNote),

    teaTypes: list(data.teaTypes),
    buddingTime: text(data.buddingTime),
    recommendedRegions: list(data.recommendedRegions),
    yield: text(data.yield),
    cultivationShare: text(data.cultivationShare),
    diseaseResistance: list(data.diseaseResistance),
    rarity: text(data.rarity),

    documentation: text(data.documentation),
    conflicts: text(data.conflicts),
    summary: text(data.summary) ?? "",
    sources,
  };
}

/**
 * Read once per process, not once per page.
 *
 * `next build` renders 69 detail pages plus the index off this module. Without
 * the cache that is 70 passes over the same 69 files; with it, one.
 */
let cache: Cultivar[] | null = null;

export function allCultivars(): Cultivar[] {
  if (cache !== null) return cache;

  cache = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parse(file, fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")))
    // Alphabetical by name. The collection has no meaningful intrinsic order —
    // it is a reference, not a ranking — so the order is the one a reader can
    // predict and scan against.
    .sort((a, b) => a.name.localeCompare(b.name));

  return cache;
}

export function cultivarBySlug(slug: string): Cultivar | undefined {
  return allCultivars().find((cultivar) => cultivar.slug === slug);
}
