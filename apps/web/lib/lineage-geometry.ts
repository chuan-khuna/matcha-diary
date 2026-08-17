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
 * Seed parent arrives above centre, pollen parent below it. Without the offset
 * the two edges into a cross land on the same point and the diagram stops being
 * able to say which parent was which — which is what the badges record.
 *
 * Wide enough that the two badges into a cross clear each other. At 9 the
 * separation was 18px against a 19px disc, so every plant with two recorded
 * parents drew its ♀ and ♂ overlapping. 12 gives 24px and a 5px gap, and 20±12
 * still lands inside a 40px box.
 */
export const ROLE_OFFSET = 12;

/** The ♀/♂ badge: a filled disc with the glyph centred on it. */
export const BADGE_RADIUS = 9.5;
export const BADGE_GLYPH = 13;

/**
 * Every edge finishes with a flat run straight into the child, and the badge
 * sits on it.
 *
 * This exists to make badge positions predictable. Placing the badge at a fixed
 * x on the curve does not work, because edges reach a child from different
 * distances — a parent one generation back has a 76px final span, one three
 * generations back has 160px — so the same x is a different fraction along each
 * curve, and the two have flattened onto their arrivals by different amounts.
 * That is why Kanayamidori's badges landed on the same point: one edge had
 * settled, the other was still being pulled toward a parent 200px higher up.
 *
 * With a uniform approach the badge y is exactly the arrival y. Two badges into
 * one cross are then a full `2 x ROLE_OFFSET` apart, and badges belonging to
 * different children are a row pitch apart. Both collisions go by construction
 * rather than by tuning.
 */
export const BADGE_INSET = 19;
const APPROACH = 34;

/** A column of boxes, as the top-y of each. Keyed by the column's x. */
export type ColumnMap = Map<number, number[]>;

export type LineageRole = "seed" | "pollen";

export type Point = { x: number; y: number };

/**
 * A clear y in one column, as close to `want` as the boxes there allow.
 *
 * Ranking is by longest path, so a plant sits one column right of its
 * *furthest* parent and a nearer parent's edge has to cross the columns
 * between. Drawn straight, that edge passes behind whatever box is in the way —
 * and since boxes are painted over edges it vanishes and re-emerges, which
 * reads as though it started at the box it disappeared behind. Twenty-one of
 * the collection's edges did exactly that.
 *
 * So a crossing edge is threaded through a gap instead. Rows are 54 apart and
 * boxes 40 tall, giving 14px lanes between them — ample for a 1.2px line, and
 * the weave is what a layered graph is supposed to look like.
 */
function laneY(occupied: number[], want: number): number {
  if (occupied.length === 0) return want;

  const rows = [...occupied].sort((a, b) => a - b);
  const lanes = [rows[0] - (ROW_PITCH - NODE_H) / 2];

  for (let i = 1; i < rows.length; i++) {
    const above = rows[i - 1] + NODE_H;
    const below = rows[i];
    if (below - above >= 6) lanes.push((above + below) / 2);
  }
  lanes.push(rows[rows.length - 1] + NODE_H + (ROW_PITCH - NODE_H) / 2);

  return lanes.reduce(
    (best, lane) =>
      Math.abs(lane - want) < Math.abs(best - want) ? lane : best,
    lanes[0],
  );
}

/**
 * Where an edge leaves, arrives, what it threads through on the way, and where
 * it carries its ♀/♂ badge. `parent` and `child` are node top-left corners.
 *
 * `columns` is what the layout knows about occupied space; without it the edge
 * is drawn straight, which is correct whenever it spans a single generation.
 *
 * The badge anchors to the gap immediately before the child rather than to the
 * curve's midpoint, so it always lands in clear space rather than on top of a
 * box in a column the edge is only passing through.
 */
export function edgeGeometry(
  parent: Point,
  child: Point,
  role: LineageRole,
  columns?: ColumnMap,
) {
  const offset = role === "seed" ? -ROLE_OFFSET : ROLE_OFFSET;
  const from = { x: parent.x + NODE_W, y: parent.y + NODE_H / 2 };
  const to = { x: child.x, y: child.y + NODE_H / 2 + offset };

  const waypoints: Point[] = [];
  if (columns !== undefined) {
    for (let x = parent.x + COL_PITCH; x < child.x; x += COL_PITCH) {
      const at = { x: x + NODE_W / 2, y: 0 };
      // Where a straight line would have crossed this column, then the nearest
      // lane to it, so the detour is the smallest one that clears the boxes.
      const along = (at.x - from.x) / (to.x - from.x);
      at.y = Math.round(
        laneY(columns.get(x) ?? [], from.y + along * (to.y - from.y)),
      );
      waypoints.push(at);
    }
  }

  const approach = { x: to.x - APPROACH, y: to.y };

  return {
    from,
    to,
    points: [from, ...waypoints, approach, to],
    badge: { x: to.x - BADGE_INSET, y: to.y },
  };
}

/**
 * One path through every point, each segment carrying the same flat departure
 * and arrival as a single-span edge. Identical output to `edgePath` when there
 * is nothing to thread through.
 */
export function edgePathThrough(points: Point[]): string {
  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const mid = (a.x + b.x) / 2;
    d += `C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`;
  }

  return d;
}
