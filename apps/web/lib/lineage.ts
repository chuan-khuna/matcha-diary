import { parentName, type Cultivar } from "@/lib/cultivars";

/**
 * Cultivar pedigrees, laid out at build time.
 *
 * A pedigree is a directed acyclic graph, not a tree — a cross has two parents,
 * and one plant parents several. Any tree layout (`d3.hierarchy` and everything
 * built on it) takes one parent per node, so feeding this to one means either
 * duplicating Yabukita a dozen times or dropping an edge. Both destroy the thing
 * the diagram exists to show, which is that two cultivars meet further up.
 *
 * So this is the layered (Sugiyama) kind, in three steps, running left to right:
 *
 *   1. RANK  — each node sits one column right of its *furthest* parent, so no
 *              edge ever points backwards. Longest path, not shortest.
 *   2. ORDER — within a column, sort by the mean position of the nodes each one
 *              connects to, sweeping forwards then backwards. The barycentre
 *              heuristic; it is what removes crossings.
 *   3. PLACE — give each node the mean y of its relatives, then push apart
 *              whatever now overlaps.
 *
 * Left to right suits this collection specifically. It is only four generations
 * deep but forty-nine plants wide at its widest, and generation is the axis with
 * the small number — so depth becomes the short side, which fits the page, and
 * the crowd of siblings runs down the long side, which the page already
 * scrolls.
 *
 * About seventy lines, which is the argument for not taking a graph-layout
 * dependency at this size — and the layout runs during `next build`, so the
 * browser receives finished SVG and no layout code at all.
 *
 * Pure: no `fs`, no React. The collection is passed in.
 */

/* ---- Geometry ------------------------------------------------------------
   A node is the stamped mono label used everywhere else in this app, given a
   second line for its year, so a pedigree reads as a field of familiar chips
   wired together rather than as a new vocabulary. */
const NODE_W = 168;
const NODE_H = 40;
/** Generous, because the ♀/♂ badge sits in the middle of every edge. */
const COL_GAP = 76;
const ROW_GAP = 14;
const COL_PITCH = NODE_W + COL_GAP;
const ROW_PITCH = NODE_H + ROW_GAP;
const PAD = 14;

/**
 * Seed parent arrives above centre, pollen parent below it.
 *
 * Without the offset the two edges into a cross land on the same point and the
 * diagram stops being able to say which parent was which — which is exactly
 * what the ♀/♂ badges are there to record.
 */
const ROLE_OFFSET = 9;

export type LineageRole = "seed" | "pollen";

export type LineageNode = {
  id: string;
  name: string;
  /** Second line: the year. `null` on nodes that have no year to give. */
  sub: string | null;
  /** `external` is a parent the records name but do not profile. */
  kind: "documented" | "external";
  href: string | null;
  /** Grown for matcha or tencha — what this diary is actually about. */
  isMatcha: boolean;
  /** The record whose page this diagram is on, if any. */
  isFocus: boolean;
  x: number;
  y: number;
};

export type LineageEdge = {
  key: string;
  role: LineageRole;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Where the ♀/♂ badge sits — the curve's midpoint. */
  badge: { x: number; y: number };
};

export type LineageModel = {
  nodes: LineageNode[];
  edges: LineageEdge[];
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
};

export const LINEAGE_GEOMETRY = { NODE_W, NODE_H } as const;

/* -------------------------------------------------------------------------- */
/* Graph construction                                                         */
/* -------------------------------------------------------------------------- */

type RawEdge = { parent: string; child: string; role: LineageRole };

/** External parents share the documented namespace, so they need a prefix. */
const externalId = (name: string) => `ext:${name}`;

/**
 * The whole collection as one graph, keyed by cultivar *name* — which is what
 * `parents.female` and `parents.male` actually reference.
 */
function buildGraph(all: Cultivar[]) {
  const byName = new Map(all.map((cultivar) => [cultivar.name, cultivar]));
  const edges: RawEdge[] = [];
  const externals = new Set<string>();

  for (const cultivar of all) {
    const seen = new Set<string>();

    for (const [role, raw] of [
      ["seed", cultivar.parents.female],
      ["pollen", cultivar.parents.male],
    ] as const) {
      const parent = parentName(raw);
      if (parent === null) continue;
      // A self-pollination names the same plant twice. One edge, not two.
      if (seen.has(parent)) continue;
      seen.add(parent);

      edges.push({ parent, child: cultivar.name, role });
      if (!byName.has(parent)) externals.add(parent);
    }
  }

  return { byName, edges, externals };
}

/**
 * Everything reachable from one name, following `step` in one direction.
 * Used for both the ancestor walk and the descendant walk.
 */
function reachable(start: string, step: Map<string, string[]>): Set<string> {
  const seen = new Set<string>();
  const queue = [...(step.get(start) ?? [])];

  while (queue.length > 0) {
    const next = queue.pop();
    if (next === undefined || seen.has(next)) continue;
    seen.add(next);
    for (const onward of step.get(next) ?? []) queue.push(onward);
  }

  return seen;
}

/**
 * Which family each node belongs to, numbered largest family first.
 *
 * A family is a connected component of the *undirected* graph — which way an
 * edge points has nothing to do with whether two plants are related. The number
 * is only an ordering key for layout; it is not shown anywhere.
 */
function familyIndex(edges: RawEdge[]): Map<string, number> {
  const neighbours = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!neighbours.has(a)) neighbours.set(a, new Set());
    neighbours.get(a)?.add(b);
  };
  for (const edge of edges) {
    link(edge.parent, edge.child);
    link(edge.child, edge.parent);
  }

  const seen = new Set<string>();
  const components: string[][] = [];

  for (const start of [...neighbours.keys()].sort((a, b) => a.localeCompare(b))) {
    if (seen.has(start)) continue;

    const component: string[] = [];
    const queue = [start];
    seen.add(start);

    while (queue.length > 0) {
      const name = queue.pop();
      if (name === undefined) continue;
      component.push(name);
      for (const other of neighbours.get(name) ?? []) {
        if (seen.has(other)) continue;
        seen.add(other);
        queue.push(other);
      }
    }

    components.push(component);
  }

  // Largest first, so the collection's one big family leads and the long tail
  // of two- and three-plant families follows it.
  components.sort(
    (a, b) => b.length - a.length || (a[0] ?? "").localeCompare(b[0] ?? ""),
  );

  const index = new Map<string, number>();
  components.forEach((component, i) => {
    for (const name of component) index.set(name, i);
  });
  return index;
}

function adjacency(edges: RawEdge[]) {
  const up = new Map<string, string[]>();
  const down = new Map<string, string[]>();

  for (const edge of edges) {
    up.set(edge.child, [...(up.get(edge.child) ?? []), edge.parent]);
    down.set(edge.parent, [...(down.get(edge.parent) ?? []), edge.child]);
  }

  return { up, down };
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

function layout(
  names: string[],
  edges: RawEdge[],
  describe: (name: string) => Omit<LineageNode, "x" | "y">,
): LineageModel {
  const present = new Set(names);
  const live = edges.filter(
    (edge) => present.has(edge.parent) && present.has(edge.child),
  );
  const { up, down } = adjacency(live);

  const parentsOf = (name: string) => up.get(name) ?? [];
  const childrenOf = (name: string) => down.get(name) ?? [];

  /* 1. Rank — longest path from a root, so a node clears every parent and not
     merely the nearest one. This is the column index. `open` guards against a
     cycle the data should not contain but which a transcription error could
     introduce. */
  const rank = new Map<string, number>();
  const open = new Set<string>();

  const rankOf = (name: string): number => {
    const known = rank.get(name);
    if (known !== undefined) return known;
    if (open.has(name)) return 0;

    open.add(name);
    const parents = parentsOf(name);
    const value =
      parents.length > 0 ? 1 + Math.max(...parents.map(rankOf)) : 0;
    open.delete(name);

    rank.set(name, value);
    return value;
  };
  for (const name of names) rankOf(name);

  const depth = Math.max(...names.map((name) => rank.get(name) ?? 0)) + 1;
  const columns: string[][] = Array.from({ length: depth }, () => []);

  /* Seeded by family, then alphabetically inside it.
     Families share no edges, so the barycentre pass below has no opinion about
     where one sits relative to another — it can only order nodes against their
     own relatives. Seeded alphabetically across the whole collection that
     leaves families interleaved down a column, with each one scattered among
     plants it is unrelated to. Seeded by family they start as contiguous
     blocks, and because a family's barycentres are computed only from its own
     members they stay in that band. Alphabetical within the family, and
     families ordered by size, so the layout is stable across builds. */
  const family = familyIndex(live);
  for (const name of [...names].sort(
    (a, b) =>
      (family.get(a) ?? 0) - (family.get(b) ?? 0) || a.localeCompare(b),
  )) {
    columns[rank.get(name) ?? 0].push(name);
  }

  /* 2. Order — sweep forwards then backwards, each pass sorting a column by the
     mean index of the column it was just compared against. A node with nothing
     to average (a childless node on a backward sweep) is held in place rather
     than given its own index as a stand-in: mixing the two scales is what drags
     childless nodes away from their siblings. */
  const slot = new Map<string, number>();
  const reindex = () =>
    columns.forEach((column) => column.forEach((name, i) => slot.set(name, i)));
  reindex();

  const barycentre = (names_: string[]) =>
    names_.length > 0
      ? names_.reduce((sum, name) => sum + (slot.get(name) ?? 0), 0) / names_.length
      : null;

  for (let sweep = 0; sweep < 8; sweep++) {
    const forward = sweep % 2 === 0;
    const order = forward ? columns.slice(1) : columns.slice(0, -1).reverse();

    for (const column of order) {
      const key = new Map<string, number>();
      const movable: Array<{ name: string; at: number }> = [];

      column.forEach((name, i) => {
        const value = barycentre(forward ? parentsOf(name) : childrenOf(name));
        if (value === null) return;
        key.set(name, value);
        movable.push({ name, at: i });
      });
      if (movable.length < 2) continue;

      const seats = movable.map((entry) => entry.at);
      [...movable]
        .sort(
          (a, b) => (key.get(a.name) ?? 0) - (key.get(b.name) ?? 0) || a.at - b.at,
        )
        .forEach((entry, i) => {
          column[seats[i]] = entry.name;
        });
      reindex();
    }
  }

  /* 3. Place — each node wants the mean y of what it connects to; the column is
     then packed top to bottom so nothing overlaps, and shifted back to undo the
     downward drift that packing in one direction always introduces. */
  const y = new Map<string, number>();
  columns.forEach((column) =>
    column.forEach((name, i) => y.set(name, i * ROW_PITCH)),
  );

  const pack = (column: string[], want: Map<string, number>) => {
    let floor = -Infinity;
    let drift = 0;
    let wanted = 0;

    for (const name of column) {
      const target = want.get(name) ?? y.get(name) ?? 0;
      const placed = Math.max(target, floor + ROW_PITCH);
      y.set(name, placed);
      floor = placed;

      if (want.has(name)) {
        drift += placed - target;
        wanted++;
      }
    }

    if (wanted > 0) {
      const shift = drift / wanted;
      for (const name of column) y.set(name, (y.get(name) ?? 0) - shift);
    }
  };

  for (let pass = 0; pass < 4; pass++) {
    const forward = pass % 2 === 0;
    const sequence = forward ? columns.slice(1) : columns.slice(0, -1).reverse();

    for (const column of sequence) {
      const want = new Map<string, number>();
      for (const name of column) {
        const related = forward ? parentsOf(name) : childrenOf(name);
        if (related.length === 0) continue;
        want.set(
          name,
          related.reduce((sum, other) => sum + (y.get(other) ?? 0), 0) /
            related.length,
        );
      }
      pack(column, want);
    }
  }

  const top = Math.min(...names.map((name) => y.get(name) ?? 0));

  // Rounded here and nowhere else. Barycentre placement produces fractions, and
  // every coordinate downstream is derived from a node's — so rounding once, at
  // the source, keeps the whole drawing on whole pixels and off the RSC payload
  // as things like `1174.0944736981`.
  const nodes: LineageNode[] = names.map((name) => ({
    ...describe(name),
    x: PAD + (rank.get(name) ?? 0) * COL_PITCH,
    y: Math.round(PAD + (y.get(name) ?? 0) - top),
  }));

  const placed = new Map(nodes.map((node) => [node.name, node]));

  const laidOutEdges: LineageEdge[] = live.flatMap((edge, i) => {
    const parent = placed.get(edge.parent);
    const child = placed.get(edge.child);
    if (parent === undefined || child === undefined) return [];

    const offset = edge.role === "seed" ? -ROLE_OFFSET : ROLE_OFFSET;
    // Leaves the parent's right edge, arrives at the child's left edge —
    // seed parent above the midline, pollen parent below it.
    const from = { x: parent.x + NODE_W, y: parent.y + NODE_H / 2 };
    const to = { x: child.x, y: child.y + NODE_H / 2 + offset };

    // Ranking is by longest path, so an edge can skip a generation: a plant may
    // sit two columns right of one of its parents. Putting the badge at the
    // curve's midpoint drops it in the middle of the intervening column, on top
    // of whatever node is there. Anchoring it to the gap immediately before the
    // child keeps every badge in clear space, and for the ordinary
    // one-column edge it lands exactly where the midpoint would have.
    const badge = pointAtX(from, to, to.x - COL_GAP / 2);

    return [
      {
        key: `${edge.parent}~${edge.child}~${i}`,
        role: edge.role,
        from,
        to,
        badge: { x: Math.round(badge.x), y: Math.round(badge.y) },
      },
    ];
  });

  return {
    nodes,
    edges: laidOutEdges,
    width: PAD * 2 + (depth - 1) * COL_PITCH + NODE_W,
    height: PAD * 2 + Math.max(...nodes.map((node) => node.y)) - PAD + NODE_H,
    nodeWidth: NODE_W,
    nodeHeight: NODE_H,
  };
}

type Point = { x: number; y: number };

/**
 * The point on an edge's curve at a given x.
 *
 * The curve is the cubic `lineagePath` draws, so a badge placed with this sits
 * exactly on the line rather than near it. `x(t)` is monotonic — both control
 * points share the ends' midpoint — so bisection converges, and twenty steps
 * resolves it well past the half-pixel the result is rounded to. It runs at
 * build time, once per edge.
 */
function pointAtX(from: Point, to: Point, targetX: number): Point {
  const mid = (from.x + to.x) / 2;
  const xAt = (t: number) => {
    const u = 1 - t;
    return u * u * u * from.x + 3 * u * t * mid + t * t * t * to.x;
  };

  let low = 0;
  let high = 1;
  for (let step = 0; step < 20; step++) {
    const t = (low + high) / 2;
    if (xAt(t) < targetX) low = t;
    else high = t;
  }

  const t = (low + high) / 2;
  const u = 1 - t;
  return {
    x: xAt(t),
    y: from.y * (u * u * u + 3 * u * u * t) + to.y * (3 * u * t * t + t * t * t),
  };
}

/**
 * The cubic path for one edge, left to right.
 *
 * Control points sit at the horizontal midpoint, which is what gives the flat
 * departure and arrival that make a generation read as a generation — the same
 * curve `d3.linkHorizontal` produces, without the dependency.
 */
export function lineagePath(edge: LineageEdge): string {
  const mid = (edge.from.x + edge.to.x) / 2;
  return `M${edge.from.x},${edge.from.y}C${mid},${edge.from.y} ${mid},${edge.to.y} ${edge.to.x},${edge.to.y}`;
}

/* -------------------------------------------------------------------------- */
/* Entry points                                                               */
/* -------------------------------------------------------------------------- */

const MATCHA_TYPES = ["matcha", "tencha"];

function describeFor(all: Cultivar[], focus: string | null) {
  const { byName } = buildGraph(all);

  return (name: string): Omit<LineageNode, "x" | "y"> => {
    const cultivar = byName.get(name);

    if (cultivar === undefined) {
      return {
        id: externalId(name),
        name,
        // No second line. These are landraces and breeding lines with no record
        // and usually no date, so the slot has nothing to put in it — and the
        // recessed fill and broken border already say the box is a reference
        // rather than a record, with the legend carrying the words once for the
        // whole diagram instead of on all thirty-three of them.
        sub: null,
        kind: "external",
        href: null,
        isMatcha: false,
        isFocus: false,
      };
    }

    return {
      id: cultivar.slug,
      name: cultivar.name,
      sub:
        cultivar.registered === null
          ? "unregistered"
          : String(cultivar.registered),
      kind: "documented",
      href: `/cultivars/${cultivar.slug}`,
      isMatcha: cultivar.teaTypes.some((type) =>
        MATCHA_TYPES.some((wanted) => type.toLowerCase().includes(wanted)),
      ),
      isFocus: cultivar.name === focus,
    };
  };
}

/**
 * One cultivar's own slice: itself, everything above it, everything below.
 *
 * Returns `null` when the slice would be a single unconnected node — a record
 * with no recorded parent and no recorded offspring has no pedigree to draw,
 * and a lone box captioned "lineage" says less than the prose already does.
 */
export function lineageFor(cultivar: Cultivar, all: Cultivar[]): LineageModel | null {
  const { edges } = buildGraph(all);
  const { up, down } = adjacency(edges);

  const ancestors = reachable(cultivar.name, up);
  const descendants = reachable(cultivar.name, down);
  if (ancestors.size === 0 && descendants.size === 0) return null;

  const names = [cultivar.name, ...ancestors, ...descendants];
  return layout(names, edges, describeFor(all, cultivar.name));
}

/**
 * The whole collection as one pedigree.
 *
 * One canvas rather than a diagram per family. Laid out left to right the
 * drawing is only as wide as the collection is deep — four generations — so it
 * fits the page without a horizontal scrollbar, and every plant sits in the
 * same coordinate system, which is what makes the shape of the collection
 * legible: a wall of landraces on the left, the 1950s selections beside them,
 * and the handful of modern crosses that descend from several of them at once
 * out on the right.
 *
 * Families stay in contiguous bands because `layout` seeds each column by
 * family before the barycentre pass — see the note there.
 *
 * Records with neither a parent nor an offspring on file have no pedigree to
 * place and are left out; the index lists the whole collection either way.
 */
export function lineageAll(all: Cultivar[]): LineageModel {
  const { edges } = buildGraph(all);

  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.parent);
    connected.add(edge.child);
  }

  return layout([...connected], edges, describeFor(all, null));
}
