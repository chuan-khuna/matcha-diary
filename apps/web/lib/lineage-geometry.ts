/**
 * The pedigree's measurements and curve maths, in one place because two sides
 * now need them.
 *
 * The layout in `lib/lineage` runs at build time and draws the diagram. The
 * isolate control in `components/cultivars/lineage-focus` re-stacks a subset of
 * that diagram in the browser, and every node it moves drags its edges and
 * badges with it. If the two computed an edge even slightly differently the
 * curves would jump the moment isolate was switched on, so `edgeGeometry` is
 * the shared definition and neither side has its own copy.
 *
 * Pure and tiny on purpose — this is the only part of the layout that crosses
 * to the client, and the barycentre passes stay on the server where they run.
 */

/* A node is the stamped mono label used everywhere else in this app, given a
   second line for its year, so a pedigree reads as a field of familiar chips
   wired together rather than as a new vocabulary. */
export const NODE_W = 168;
export const NODE_H = 40;
/** Generous, because the ♀/♂ badge sits in the middle of every edge. */
export const COL_GAP = 76;
export const ROW_GAP = 14;
export const COL_PITCH = NODE_W + COL_GAP;
export const ROW_PITCH = NODE_H + ROW_GAP;
export const PAD = 14;

/**
 * Seed parent arrives above centre, pollen parent below it.
 *
 * Without the offset the two edges into a cross land on the same point and the
 * diagram stops being able to say which parent was which — which is exactly
 * what the ♀/♂ badges are there to record.
 */
export const ROLE_OFFSET = 9;

/** The ♀/♂ badge: a filled disc with the glyph centred on it. */
export const BADGE_RADIUS = 9.5;
export const BADGE_GLYPH = 13;

export type LineageRole = "seed" | "pollen";

export type Point = { x: number; y: number };

/**
 * The cubic path for one edge, left to right.
 *
 * Control points sit at the horizontal midpoint, which is what gives the flat
 * departure and arrival that make a generation read as a generation — the same
 * curve `d3.linkHorizontal` produces, without the dependency.
 */
export function edgePath(from: Point, to: Point): string {
  const mid = (from.x + to.x) / 2;
  return `M${from.x},${from.y}C${mid},${from.y} ${mid},${to.y} ${to.x},${to.y}`;
}

/**
 * The point on that curve at a given x.
 *
 * `x(t)` is monotonic — both control points share the ends' midpoint — so
 * bisection converges, and twenty steps resolves it well past the half-pixel
 * the result is rounded to.
 */
export function pointAtX(from: Point, to: Point, targetX: number): Point {
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
    y:
      from.y * (u * u * u + 3 * u * u * t) + to.y * (3 * u * t * t + t * t * t),
  };
}

/**
 * Where an edge leaves, arrives, and carries its ♀/♂ badge, given the two boxes
 * it joins. `parent` and `child` are node top-left corners.
 *
 * The badge anchors to the gap immediately before the child rather than to the
 * curve's midpoint, because ranking is by longest path and an edge can skip a
 * generation — a midpoint badge would land on top of whatever sits in the
 * column between. For an ordinary one-column edge the two are the same point.
 */
export function edgeGeometry(parent: Point, child: Point, role: LineageRole) {
  const offset = role === "seed" ? -ROLE_OFFSET : ROLE_OFFSET;
  const from = { x: parent.x + NODE_W, y: parent.y + NODE_H / 2 };
  const to = { x: child.x, y: child.y + NODE_H / 2 + offset };
  const badge = pointAtX(from, to, to.x - COL_GAP / 2);

  return {
    from,
    to,
    badge: { x: Math.round(badge.x), y: Math.round(badge.y) },
  };
}
