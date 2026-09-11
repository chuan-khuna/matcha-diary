/**
 * The matcha taster's flavour wheel — its vocabulary, its colours and its
 * geometry, in one place because the drawing and the index beneath it both
 * read all three.
 *
 * Transcribed from MTCH's "Matcha Taster's Flavor Wheel", a printed poster,
 * from a photograph taken through its laminate sleeve. Most labels read
 * cleanly. Six were lost to glare and are inferred from their neighbours;
 * each carries an `inferred` comment, and none should be treated as the
 * poster's own words until someone has checked it against the print. The
 * poster's "Cheery blossom" is its typo, corrected here.
 *
 * Three rings, read from the centre out: a family, a group within it, and the
 * note itself. Every note takes the same angle, so a family's width is how many
 * notes it holds — which is what the poster's own proportions say, and why the
 * green family takes almost a third of the wheel.
 *
 * Pure and small on purpose: the wheel is a client component, so this module
 * ships to the browser and is computed there a second time on hydration.
 */

/** `[L, C, H]` — formatted by `css` at the precision CLAUDE.md fixes. */
type Tone = readonly [lightness: number, chroma: number, hue: number];

type GroupSource = {
  name: string;
  /** The group's band on the middle ring. */
  band: Tone;
  /** Every note in the group, on the outer ring: the same hue, lighter. */
  note: Tone;
  notes: string[];
};

type FamilySource = {
  name: string;
  /** How the name breaks across its band, when one line does not fit. */
  lines?: string[];
  band: Tone;
  groups: GroupSource[];
};

/**
 * The wheel, clockwise from twelve o'clock, in the poster's order.
 *
 * Every tone is a row of DESIGN.md's flavour-wheel table — that table is the
 * source, and a change here without a change there is a bug. The rule the
 * table records: a family band sits at L 0.68, a group at 0.79, and a group's
 * notes at 0.885 with 0.7 of the group's chroma, so a group and its notes never
 * disagree on H.
 */
const WHEEL: FamilySource[] = [
  {
    name: "Green flavor",
    band: [0.68, 0.085, 150],
    groups: [
      {
        name: "Umami", // inferred — the label is under glare
        band: [0.79, 0.07, 95],
        note: [0.885, 0.049, 95],
        notes: ["Kombu", "Bonito flake", "Shiitake" /* inferred */, "Egg", "Tomato"],
      },
      {
        name: "Vegetative",
        band: [0.79, 0.08, 138],
        note: [0.885, 0.056, 138],
        notes: [
          "Melon rind",
          "Peapod",
          "Edamame",
          "Dark green",
          "Asparagus",
          "Cucumber",
          "Zucchini",
        ],
      },
      {
        name: "Green",
        band: [0.79, 0.075, 158],
        note: [0.885, 0.0525, 158],
        notes: ["Grassy", "Green leaf"],
      },
      {
        name: "Herb/hay",
        band: [0.79, 0.075, 118],
        note: [0.885, 0.0525, 118],
        notes: ["Herb-like", "Hay-like"],
      },
    ],
  },
  {
    name: "Floral & fruity", // inferred — the inner band's label is washed out
    lines: ["Floral &", "fruity"],
    band: [0.68, 0.075, 350],
    groups: [
      {
        name: "Floral",
        band: [0.79, 0.07, 330],
        note: [0.885, 0.049, 330],
        notes: ["Tea flower", "Lily", "Jasmine", "Cherry blossom"],
      },
      {
        name: "Fruity",
        band: [0.79, 0.075, 25],
        note: [0.885, 0.0525, 25],
        notes: ["Tropical fruit", "Citrus fruit", "Dried fruit", "Other fruit"],
      },
    ],
  },
  {
    name: "Brown/roast flavor",
    lines: ["Brown/roast", "flavor"],
    band: [0.68, 0.06, 65],
    groups: [
      {
        name: "Cereal",
        band: [0.79, 0.075, 88],
        note: [0.885, 0.0525, 88],
        notes: ["Toasted mochi", "Kinako" /* inferred */, "Sweet malt", "Sweet corn"],
      },
      {
        name: "Nutty",
        band: [0.79, 0.035, 30],
        note: [0.885, 0.0245, 30],
        notes: [
          "Red bean",
          "Pistachio",
          "Almond",
          "Peanuts",
          "Hazelnut",
          "Roasted nut skin",
        ],
      },
      {
        name: "Cocoa",
        band: [0.79, 0.05, 50],
        note: [0.885, 0.035, 50],
        notes: ["White chocolate", "Chocolate", "Dark chocolate"],
      },
    ],
  },
  {
    name: "Sweet",
    band: [0.68, 0.085, 45],
    groups: [
      {
        name: "Brown sugar",
        band: [0.79, 0.085, 70],
        note: [0.885, 0.0595, 70],
        notes: ["Brown sugar", "Molasses", "Caramelized", "Honey"],
      },
      {
        name: "Aromatic", // inferred — the label is under glare
        band: [0.79, 0.065, 5],
        note: [0.885, 0.0455, 5],
        notes: ["Vanilla", "Overall sweet", "Sweet aromatic"],
      },
    ],
  },
  {
    name: "Other",
    band: [0.68, 0.025, 250],
    groups: [
      {
        name: "Defective",
        band: [0.79, 0.02, 250],
        note: [0.885, 0.014, 250],
        notes: [
          "Phenolic",
          "Musty/earthy",
          "Musty/dusty",
          "Woody",
          "Plastic" /* inferred — only "…tic" survives */,
          "Dried straw",
          "Stale",
        ],
      },
    ],
  },
];

export type Ring = "family" | "group" | "note";

export type WheelSegment = {
  /** A slug path from the family down — `green-flavor/vegetative/edamame`. */
  id: string;
  parentId: string | null;
  ring: Ring;
  name: string;
  /** The name as it breaks across the band. One line everywhere but two families. */
  lines: string[];
  /** Names from the family down to this one, for a breadcrumb. */
  trail: string[];
  /** Degrees clockwise from twelve o'clock. */
  start: number;
  end: number;
  fill: string;
  childIds: string[];
};

/** The drawing's coordinate space. The SVG scales it to its column. */
export const WHEEL_SIZE = 820;
const CENTRE = WHEEL_SIZE / 2;

export const HOLE_RADIUS = 60;

/**
 * Inner and outer radius of each ring. The outer ring is the widest because it
 * carries the longest labels — "Roasted nut skin" is 16 characters of mono,
 * about 118 units at the size the wheel sets it, against 139 of clear band.
 */
const RING_RADII: Record<Ring, readonly [inner: number, outer: number]> = {
  family: [HOLE_RADIUS, 150],
  group: [150, 245],
  note: [245, 400],
};

/** A note's label starts this far out from its band's inner edge. */
const LABEL_INSET = 8;

/** Between the two lines of a family name that breaks. */
const FAMILY_LINE_GAP = 18;

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** `oklch(L C H)` at the precision CLAUDE.md fixes: L and C to 4, H to 2. */
function css([lightness, chroma, hue]: Tone): string {
  return `oklch(${lightness.toFixed(4)} ${chroma.toFixed(4)} ${hue.toFixed(2)})`;
}

function build(): WheelSegment[] {
  const noteCount = WHEEL.flatMap((family) =>
    family.groups.flatMap((group) => group.notes),
  ).length;
  const step = 360 / noteCount;

  const segments: WheelSegment[] = [];
  let cursor = 0;

  for (const family of WHEEL) {
    const familyId = slug(family.name);
    const familySegment: WheelSegment = {
      id: familyId,
      parentId: null,
      ring: "family",
      name: family.name,
      lines: family.lines ?? [family.name],
      trail: [family.name],
      start: cursor,
      end: cursor,
      fill: css(family.band),
      childIds: [],
    };
    segments.push(familySegment);

    for (const group of family.groups) {
      const groupId = `${familyId}/${slug(group.name)}`;
      const groupSegment: WheelSegment = {
        id: groupId,
        parentId: familyId,
        ring: "group",
        name: group.name,
        lines: [group.name],
        trail: [family.name, group.name],
        start: cursor,
        end: cursor,
        fill: css(group.band),
        childIds: [],
      };
      segments.push(groupSegment);
      familySegment.childIds.push(groupId);

      for (const note of group.notes) {
        const noteId = `${groupId}/${slug(note)}`;
        segments.push({
          id: noteId,
          parentId: groupId,
          ring: "note",
          name: note,
          lines: [note],
          trail: [family.name, group.name, note],
          start: cursor,
          end: cursor + step,
          fill: css(group.note),
          childIds: [],
        });
        groupSegment.childIds.push(noteId);
        cursor += step;
      }

      groupSegment.end = cursor;
    }

    familySegment.end = cursor;
  }

  return segments;
}

/** Every band on the wheel, families first within each family's run. */
export const SEGMENTS: readonly WheelSegment[] = build();

const BY_ID = new Map(SEGMENTS.map((segment) => [segment.id, segment]));

export function segmentById(id: string): WheelSegment | undefined {
  return BY_ID.get(id);
}

export function childrenOf(id: string): WheelSegment[] {
  return (BY_ID.get(id)?.childIds ?? []).flatMap((childId) => {
    const child = BY_ID.get(childId);
    return child ? [child] : [];
  });
}

export const FAMILIES = SEGMENTS.filter((segment) => segment.ring === "family");

export const WHEEL_COUNTS = {
  families: FAMILIES.length,
  groups: SEGMENTS.filter((segment) => segment.ring === "group").length,
  notes: SEGMENTS.filter((segment) => segment.ring === "note").length,
};

export const WHEEL_DESCRIPTION = `Flavour wheel of ${WHEEL_COUNTS.notes} notes in ${WHEEL_COUNTS.groups} groups and ${WHEEL_COUNTS.families} families: ${FAMILIES.map((family) => family.name).join(", ")}. Every note is listed below the wheel.`;

/**
 * Whether a band stays lit while `activeId` is being followed: the band itself,
 * everything inside it, and everything it sits inside. Following "Vegetative"
 * keeps its seven notes and the green family, and fades the rest of the wheel.
 */
export function isLit(id: string, activeId: string | null): boolean {
  return (
    activeId === null ||
    id === activeId ||
    id.startsWith(`${activeId}/`) ||
    activeId.startsWith(`${id}/`)
  );
}

/**
 * Two decimals in every coordinate. Enough for an 820-unit drawing, and it is
 * what keeps the server's markup and the browser's re-render byte-identical —
 * `Math.sin` is not required to agree to the last digit across engines.
 */
function fixed(value: number): string {
  return value.toFixed(2);
}

function polar(radius: number, degrees: number): [string, string] {
  const radians = (degrees * Math.PI) / 180;
  return [
    fixed(CENTRE + radius * Math.sin(radians)),
    fixed(CENTRE - radius * Math.cos(radians)),
  ];
}

/** The band as a closed annular sector. */
export function sectorPath({ ring, start, end }: WheelSegment): string {
  const [inner, outer] = RING_RADII[ring];
  const large = end - start > 180 ? 1 : 0;
  const [ax, ay] = polar(outer, start);
  const [bx, by] = polar(outer, end);
  const [cx, cy] = polar(inner, end);
  const [dx, dy] = polar(inner, start);
  return `M${ax} ${ay}A${outer} ${outer} 0 ${large} 1 ${bx} ${by}L${cx} ${cy}A${inner} ${inner} 0 ${large} 0 ${dx} ${dy}Z`;
}

function arc(radius: number, from: number, to: number, sweep: 0 | 1): string {
  const [x0, y0] = polar(radius, from);
  const [x1, y1] = polar(radius, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M${x0} ${y0}A${radius} ${radius} 0 ${large} ${sweep} ${x1} ${y1}`;
}

function isLowerHalf({ start, end }: WheelSegment): boolean {
  const middle = (start + end) / 2;
  return middle > 90 && middle < 270;
}

/**
 * One arc per line of a family's name, for the text to run along.
 *
 * Families are the only bands wide enough to label *around* the ring, and the
 * poster does it that way. In the lower half the arc runs anticlockwise, or the
 * name would sit upside down — and there the glyphs' tops face the centre, so
 * the first line goes nearest it rather than furthest out.
 */
export function familyLabelArcs(segment: WheelSegment): string[] {
  const [inner, outer] = RING_RADII.family;
  const middle = (inner + outer) / 2;
  const lower = isLowerHalf(segment);
  const count = segment.lines.length;

  return segment.lines.map((_, index) => {
    const offset = ((count - 1) / 2 - index) * FAMILY_LINE_GAP;
    return lower
      ? arc(middle - offset, segment.end, segment.start, 0)
      : arc(middle + offset, segment.start, segment.end, 1);
  });
}

/**
 * A label set along the radius — groups centred in their band, notes starting
 * just outside the group ring, as the poster sets them.
 *
 * On the left half the text is turned the other way so it never reads upside
 * down, which means it runs *inward* there and anchors at its end.
 */
export function radialLabel(segment: WheelSegment) {
  const [inner, outer] = RING_RADII[segment.ring];
  const middle = (segment.start + segment.end) / 2;
  const onRight = middle < 180;
  const centred = segment.ring === "group";
  const distance = centred ? (inner + outer) / 2 : inner + LABEL_INSET;

  return {
    transform: `rotate(${fixed(onRight ? middle - 90 : middle + 90)} ${CENTRE} ${CENTRE})`,
    x: fixed(CENTRE + (onRight ? distance : -distance)),
    y: CENTRE,
    textAnchor: centred ? "middle" : onRight ? "start" : "end",
  } as const;
}
