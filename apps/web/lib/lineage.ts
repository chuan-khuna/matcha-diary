import { normaliseParent, type Cultivar } from "@/lib/cultivars";

/**
 * Cultivar pedigrees, laid out at build time.
 *
 * A pedigree is a directed acyclic graph, not a tree — a cross has two parents,
 * and one plant parents several. Any tree layout (`d3.hierarchy` and everything
 * built on it) takes one parent per node, so feeding this to one means either
 * duplicating Yabukita a dozen times or dropping an edge. Both destroy the thing
 * the diagram exists to show, which is that two cultivars meet further up.
 *
 * So this is the layered (Sugiyama) kind, in three steps, transposed to run top
 * to bottom:
 *
 *   1. RANK  — each node sits one row below its *furthest* parent, so no edge
 *              ever points upward. Longest path, not shortest.
 *   2. ORDER — within a row, sort by the mean position of the nodes each one
 *              connects to, sweeping down then up. The barycentre heuristic;
 *              it is what removes crossings.
 *   3. PLACE — give each node the mean x of its relatives, then push apart
 *              whatever now overlaps.
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
const COL_GAP = 24;
/** Generous, because the ♀/♂ badge sits in the middle of every edge. */
const ROW_GAP = 60;
const COL_PITCH = NODE_W + COL_GAP;
const ROW_PITCH = NODE_H + ROW_GAP;
const PAD = 14;

/**
 * Seed parent enters left of centre, pollen parent right of it.
 *
 * Without the offset the two edges into a cross land on the same point and the
 * diagram stops being able to say which parent was which — which is exactly
 * what the ♀/♂ badges are there to record.
 */
const ROLE_OFFSET = 10;

export type LineageRole = "seed" | "pollen";

export type LineageNode = {
  id: string;
  name: string;
  /** Second line: a year, or why there is no year. */
  sub: string;
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
      const parent = normaliseParent(raw);
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
     merely the nearest one. `open` guards against a cycle the data should not
     contain but which a transcription error could introduce. */
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
  const rows: string[][] = Array.from({ length: depth }, () => []);
  // Seeded alphabetically so the barycentre sweep starts from a stable order
  // and the same collection always lays out the same way.
  for (const name of [...names].sort((a, b) => a.localeCompare(b))) {
    rows[rank.get(name) ?? 0].push(name);
  }

  /* 2. Order — sweep down then up, each pass sorting a row by the mean index of
     the row it was just compared against. A node with nothing to average (a
     childless node on an upward sweep) is held in place rather than given its
     own index as a stand-in: mixing the two scales is what drags childless
     nodes away from their siblings. */
  const slot = new Map<string, number>();
  const reindex = () =>
    rows.forEach((row) => row.forEach((name, i) => slot.set(name, i)));
  reindex();

  const barycentre = (names_: string[]) =>
    names_.length > 0
      ? names_.reduce((sum, name) => sum + (slot.get(name) ?? 0), 0) / names_.length
      : null;

  for (let sweep = 0; sweep < 8; sweep++) {
    const downward = sweep % 2 === 0;
    const order = downward ? rows.slice(1) : rows.slice(0, -1).reverse();

    for (const row of order) {
      const key = new Map<string, number>();
      const movable: Array<{ name: string; at: number }> = [];

      row.forEach((name, i) => {
        const value = barycentre(downward ? parentsOf(name) : childrenOf(name));
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
          row[seats[i]] = entry.name;
        });
      reindex();
    }
  }

  /* 3. Place — each node wants the mean x of what it connects to; the row is
     then packed left to right so nothing overlaps, and shifted back to undo the
     rightward drift that packing in one direction always introduces. */
  const x = new Map<string, number>();
  rows.forEach((row) => row.forEach((name, i) => x.set(name, i * COL_PITCH)));

  const pack = (row: string[], want: Map<string, number>) => {
    let edge = -Infinity;
    let drift = 0;
    let wanted = 0;

    for (const name of row) {
      const target = want.get(name) ?? x.get(name) ?? 0;
      const placed = Math.max(target, edge + COL_PITCH);
      x.set(name, placed);
      edge = placed;

      if (want.has(name)) {
        drift += placed - target;
        wanted++;
      }
    }

    if (wanted > 0) {
      const shift = drift / wanted;
      for (const name of row) x.set(name, (x.get(name) ?? 0) - shift);
    }
  };

  for (let pass = 0; pass < 4; pass++) {
    const downward = pass % 2 === 0;
    const sequence = downward ? rows.slice(1) : rows.slice(0, -1).reverse();

    for (const row of sequence) {
      const want = new Map<string, number>();
      for (const name of row) {
        const related = downward ? parentsOf(name) : childrenOf(name);
        if (related.length === 0) continue;
        want.set(
          name,
          related.reduce((sum, other) => sum + (x.get(other) ?? 0), 0) /
            related.length,
        );
      }
      pack(row, want);
    }
  }

  const left = Math.min(...names.map((name) => x.get(name) ?? 0));

  // Rounded here and nowhere else. Barycentre placement produces fractions, and
  // every coordinate downstream is derived from a node's — so rounding once, at
  // the source, keeps the whole drawing on whole pixels and off the RSC payload
  // as things like `5503.094473698129`.
  const nodes: LineageNode[] = names.map((name) => ({
    ...describe(name),
    x: Math.round(PAD + (x.get(name) ?? 0) - left),
    y: PAD + (rank.get(name) ?? 0) * ROW_PITCH,
  }));

  const placed = new Map(nodes.map((node) => [node.name, node]));

  const laidOutEdges: LineageEdge[] = live.flatMap((edge, i) => {
    const parent = placed.get(edge.parent);
    const child = placed.get(edge.child);
    if (parent === undefined || child === undefined) return [];

    const offset = edge.role === "seed" ? -ROLE_OFFSET : ROLE_OFFSET;
    const from = { x: parent.x + NODE_W / 2, y: parent.y + NODE_H };
    const to = { x: child.x + NODE_W / 2 + offset, y: child.y };

    return [
      {
        key: `${edge.parent}~${edge.child}~${i}`,
        role: edge.role,
        from,
        to,
        // The midpoint of the cubic below, which by symmetry of its control
        // points is simply the average of its ends.
        badge: {
          x: Math.round((from.x + to.x) / 2),
          y: Math.round((from.y + to.y) / 2),
        },
      },
    ];
  });

  return {
    nodes,
    edges: laidOutEdges,
    width: PAD * 2 + Math.max(...nodes.map((node) => node.x)) - PAD + NODE_W,
    height: PAD * 2 + (depth - 1) * ROW_PITCH + NODE_H,
    nodeWidth: NODE_W,
    nodeHeight: NODE_H,
  };
}

/**
 * The cubic path for one edge, top to bottom.
 *
 * Control points sit at the vertical midpoint, which is what gives the flat
 * departure and arrival that make a generation read as a generation — the same
 * curve `d3.linkVertical` produces, without the dependency.
 */
export function lineagePath(edge: LineageEdge): string {
  const mid = (edge.from.y + edge.to.y) / 2;
  return `M${edge.from.x},${edge.from.y}C${edge.from.x},${mid} ${edge.to.x},${mid} ${edge.to.x},${edge.to.y}`;
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
        // Named as a parent, but with no record behind it. Saying so is the
        // point: it marks a real gap rather than implying the line stops here.
        sub: "not in collection",
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

export type LineageFamily = {
  /** The family's best-known member, used as its heading. */
  title: string;
  model: LineageModel;
};

/**
 * Every family in the collection, largest first.
 *
 * Deliberately not one canvas. The pedigree is only four generations deep but
 * forty-nine nodes wide at its widest, so a single top-to-bottom drawing is
 * roughly twelve thousand pixels across — a diagram nobody can read and a
 * scrollbar nobody can aim. Split into connected components it is one large
 * family and twenty-one small ones, each of which fits on a screen.
 *
 * Records with neither a parent nor an offspring on file form no family and are
 * left out; the index page already lists all 69.
 */
export function lineageFamilies(all: Cultivar[]): LineageFamily[] {
  const { edges } = buildGraph(all);

  // Undirected adjacency — a family is a connected component, and which way an
  // edge points has nothing to do with whether two plants are related.
  const neighbours = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!neighbours.has(a)) neighbours.set(a, new Set());
    neighbours.get(a)?.add(b);
  };
  for (const edge of edges) {
    link(edge.parent, edge.child);
    link(edge.child, edge.parent);
  }

  const describe = describeFor(all, null);
  const seen = new Set<string>();
  const families: LineageFamily[] = [];

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

    const model = layout(component, edges, describe);

    // The heading names the family after its most-connected member, which is
    // the plant someone would actually recognise it by.
    const title = [...component].sort(
      (a, b) =>
        (neighbours.get(b)?.size ?? 0) - (neighbours.get(a)?.size ?? 0) ||
        a.localeCompare(b),
    )[0];

    families.push({ title, model });
  }

  return families.sort(
    (a, b) =>
      b.model.nodes.length - a.model.nodes.length ||
      a.title.localeCompare(b.title),
  );
}
