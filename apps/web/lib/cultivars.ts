/**
 * The cultivar model: what a record is, and every view derived from one.
 *
 * Pure and isomorphic on purpose. The loader that reads these records off disk
 * lives next door in `lib/cultivar-data`, and it imports `node:fs` at module
 * scope — so anything a client component touches has to be here instead. The
 * index page filters in the browser and needs `TEA_TYPE_LABELS` and
 * `buddingBucket`; if those lived beside the loader, importing one label would
 * drag `fs` into the client bundle and fail the build.
 *
 * The split is therefore not organisational tidiness. It is the boundary.
 *
 * Every field is nullable in practice. These are transcriptions from primary
 * sources, and a source that never recorded a cultivar's yield leaves a hole
 * that no schema can fill — so the shape below normalises holes to `null` or
 * `[]` rather than pretending they cannot happen.
 */

export type CultivarSource = {
  title: string;
  url: string | null;
  publisher: string | null;
};

export type Cultivar = {
  slug: string;
  name: string;
  romaji: string | null;
  kana: string | null;
  kanji: string | null;
  nameMeaning: string | null;

  registered: number | null;
  registrationNumber: string | null;
  registry: string | null;
  plantVarietyRegistration: string | null;
  applicationFiled: string | null;
  applicationPublished: string | null;

  crossedYear: string | null;
  selectedYear: string | null;
  selectedFrom: string | null;
  bredAt: string | null;
  prefecture: string | null;
  strainNames: string[];

  /**
   * Bare cultivar names, and nothing else. Readings, breeding-line glosses and
   * provenance live in `parentNotes` under the same key — see `parentName`.
   */
  parents: { female: string | null; male: string | null };
  parentNotes: { female: string | null; male: string | null };
  notableDescendants: string[];
  siblingCultivars: string[];
  lineageNote: string | null;

  teaTypes: string[];
  buddingTime: string | null;
  recommendedRegions: string[];
  yield: string | null;
  cultivationShare: string | null;
  diseaseResistance: string[];
  rarity: string | null;

  documentation: string | null;
  conflicts: string | null;
  summary: string;
  sources: CultivarSource[];
};

/* -------------------------------------------------------------------------- */
/* Derived views                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Tea-type strings, normalised to filter tokens.
 *
 * The records name styles as a grower would — "fukamushi sencha" is a sencha,
 * "oolong-style tea" is its own thing — and a filter chip per free-text variant
 * would give a row of near-duplicates. Matching on substrings collapses them,
 * and a record tagged both `sencha` and `fukamushi sencha` yields one token.
 */
export function teaTypeTokens(cultivar: Cultivar): string[] {
  const tokens = new Set<string>();

  for (const raw of cultivar.teaTypes) {
    const type = raw.toLowerCase();
    if (type.includes("sencha")) tokens.add("sencha");
    if (type.includes("gyokuro")) tokens.add("gyokuro");
    if (type.includes("tencha")) tokens.add("tencha");
    if (type.includes("matcha")) tokens.add("matcha");
    if (type.includes("kabuse")) tokens.add("kabusecha");
    if (type.includes("kamairicha")) tokens.add("kamairicha");
    if (type.includes("tamaryokucha")) tokens.add("tamaryokucha");
    if (type.includes("hojicha")) tokens.add("hojicha");
    if (type.includes("black")) tokens.add("black");
    if (type.includes("oolong")) tokens.add("oolong");
  }

  return [...tokens];
}

export const TEA_TYPE_LABELS: Record<string, string> = {
  sencha: "Sencha",
  gyokuro: "Gyokuro",
  tencha: "Tencha",
  matcha: "Matcha",
  kabusecha: "Kabusecha",
  kamairicha: "Kamairicha",
  tamaryokucha: "Tamaryokucha",
  hojicha: "Hojicha",
  black: "Black tea",
  oolong: "Oolong-style",
};

export type BuddingBucket = "early" | "medium" | "late" | "unknown";

/**
 * Budding time is written as prose — "medium (中生) — level with Yabukita" — so
 * the bucket is read off the opening phrase, which is the part that is
 * consistently a classification rather than a day count.
 *
 * Order matters. "medium-early" and "medium-late" both open with "medium", so
 * the compound forms are tested before the bare one, and each is filed under the
 * direction it actually leans. A record that says only "not found in any source"
 * is `unknown`, which is a real answer here and not a parse failure.
 */
const BUDDING_PREFIXES: ReadonlyArray<readonly [string, BuddingBucket]> = [
  ["not found", "unknown"],
  ["extremely early", "early"],
  ["extra-early", "early"],
  ["very early", "early"],
  ["moderately early", "early"],
  ["slightly early", "early"],
  ["medium-early", "early"],
  ["early", "early"],
  ["extremely late", "late"],
  ["medium-late", "late"],
  ["medium to medium-late", "late"],
  ["medium to slightly late", "late"],
  ["late", "late"],
  ["medium", "medium"],
  ["mid", "medium"],
];

export function buddingBucket(cultivar: Cultivar): BuddingBucket {
  const time = cultivar.buddingTime?.toLowerCase().trim();
  if (!time) return "unknown";

  for (const [prefix, bucket] of BUDDING_PREFIXES) {
    if (time.startsWith(prefix)) return bucket;
  }
  return "unknown";
}

export const BUDDING_LABELS: Record<BuddingBucket, string> = {
  early: "Early",
  medium: "Medium",
  late: "Late",
  unknown: "Unrecorded",
};

/** What the "Registered" row should say. A year, or that there is not one. */
export function registeredLabel(cultivar: Cultivar): string {
  return cultivar.registered === null ? "Unregistered" : String(cultivar.registered);
}

/**
 * A parent reference, as a name.
 *
 * `parents.female` and `parents.male` hold a bare cultivar name and nothing
 * else, so this is only a guard against the ways "no parent" gets written down.
 * It used to do real work — the field once carried the reading and the
 * provenance inline, as `Yabukita (やぶきた) — itself a selection from
 * Shizuoka-type Zairai`, and every consumer had to cut it back to a key before
 * it could resolve. Splitting that into `parents` and `parentNotes` moved the
 * problem to where it belongs: the data. Two consequences worth knowing —
 * landrace variants that used to draw as separate nodes (`Uji zairai seedling`,
 * `Uji-strain`, `Kyoto/Uji indigenous tea tree`) now collapse onto one, and a
 * name is short enough that the diagram no longer truncates any of them.
 */
export function parentName(raw: string | null): string | null {
  const name = raw?.trim();
  if (!name || /^(unknown|null)$/i.test(name)) return null;
  return name;
}

export type ParentLink = {
  /** ♀ seed parent or ♂ pollen parent. */
  role: "♀" | "♂";
  name: string;
  /** Set when the parent is itself one of the records in the collection. */
  slug: string | null;
  /** Reading, breeding-line gloss or provenance, where the record has one. */
  note: string | null;
};

export function parentsOf(cultivar: Cultivar, all: Cultivar[]): ParentLink[] {
  const slugByName = new Map(all.map((entry) => [entry.name, entry.slug]));

  return (
    [
      ["♀", cultivar.parents.female, cultivar.parentNotes.female],
      ["♂", cultivar.parents.male, cultivar.parentNotes.male],
    ] as const
  )
    .map(([role, raw, note]) => ({ role, name: parentName(raw), note }))
    .filter(
      (parent): parent is { role: "♀" | "♂"; name: string; note: string | null } =>
        parent.name !== null,
    )
    .map((parent) => ({ ...parent, slug: slugByName.get(parent.name) ?? null }));
}

/**
 * Records naming this one as a parent.
 *
 * Derived from the children's own `parents` rather than read from this record's
 * `notableDescendants`, so the two directions cannot disagree and a new record
 * joins its parent's page by existing. `notableDescendants` still has a job —
 * it names offspring that are outside this collection — so the detail page
 * shows both, labelled differently.
 */
export function offspringOf(cultivar: Cultivar, all: Cultivar[]): Cultivar[] {
  return all.filter((entry) =>
    [entry.parents.female, entry.parents.male].some(
      (parent) => parentName(parent) === cultivar.name,
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Client projection                                                          */
/* -------------------------------------------------------------------------- */

/**
 * What a card needs, and nothing else.
 *
 * The index filters in the browser, so this crosses the server/client boundary
 * once per record. Full records would carry `conflicts` and `lineageNote` —
 * often several hundred words each, and never rendered on a card — into the RSC
 * payload for no reason. `haystack` is precomputed for the same reason: it is
 * the same string on every keystroke, so building it once at build time is
 * strictly better than rebuilding it per filter pass.
 */
export type CultivarCardData = {
  slug: string;
  name: string;
  reading: string | null;
  summary: string;
  registered: string;
  prefecture: string;
  parents: string;
  teaTypes: string[];
  budding: BuddingBucket;
  isRegistered: boolean;
  haystack: string;
};

export function toCardData(cultivar: Cultivar, all: Cultivar[]): CultivarCardData {
  const parents = parentsOf(cultivar, all);
  const parentNames = [...new Set(parents.map((parent) => parent.name))];

  return {
    slug: cultivar.slug,
    name: cultivar.name,
    reading: cultivar.kana ?? cultivar.kanji,
    summary: cultivar.summary,
    registered: registeredLabel(cultivar),
    // A landrace selection has no cross to report, which is itself the fact
    // worth printing — an em dash would read as missing data instead.
    parents: parentNames.length > 0 ? parentNames.join(" × ") : "Landrace selection",
    prefecture: cultivar.prefecture ?? "—",
    teaTypes: teaTypeTokens(cultivar),
    budding: buddingBucket(cultivar),
    isRegistered: cultivar.registered !== null,
    haystack: [
      cultivar.name,
      cultivar.romaji,
      cultivar.kana,
      cultivar.kanji,
      cultivar.prefecture,
      cultivar.bredAt,
      ...parentNames,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}
