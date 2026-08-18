import type { ReactNode } from "react";
import Link from "next/link";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";

import { LineageFocus } from "@/components/cultivars/lineage-focus";
import { BADGE_GLYPH, BADGE_RADIUS } from "@/lib/lineage-geometry";
import {
  lineagePath,
  type LineageModel,
  type LineageNode,
} from "@/lib/lineage";

const SEED_GLYPH = "lineage-seed-glyph";
const POLLEN_GLYPH = "lineage-pollen-glyph";

/**
 * A pedigree, drawn.
 *
 * Server-rendered inline SVG: the layout ran during `next build`, so what ships
 * is finished geometry rather than a drawing program. That is the whole reason
 * there is no zoom or pan here — the prototype got those from d3, and a static
 * page trades them for a scroll frame and a diagram that costs nothing.
 *
 * One behaviour is worth client code, and it is wrapped rather than woven in:
 * LineageFocus fades everything off the hovered plant's line of descent. It
 * takes the SVG as children and only ever sets an inline opacity, so this stays
 * a server component and the markup below is never re-rendered in the browser.
 *
 * Generations run left to right, siblings stacked. That way round because the
 * collection is four generations deep and up to forty-nine plants wide, so
 * depth takes the short side and fits the page, and the siblings run down the
 * side the page already scrolls.
 *
 * The node is the same stamped mono label used across the app, given a second
 * line for its year, so a pedigree reads as a field of chips you already know,
 * wired together.
 *
 * Colour is doing exactly one job. Matcha and tencha cultivars are tinted
 * because they are what this diary is about — a matcha cultivar in a field of
 * tea cultivars, the same distinction a powder card draws with the same green.
 * Everything else is carried by stroke and fill weight, because the system has
 * one accent and it is already spoken for.
 */
export function LineageGraph({
  model,
  caption,
  maxHeight,
}: {
  model: LineageModel;
  /** Rendered in a hairline-separated footer inside the frame. */
  caption?: ReactNode;
  /**
   * Cap the frame and scroll the diagram inside it. Used where the pedigree is
   * one thing on a page among others — the whole collection is over 3000px
   * tall, which is a fine page of its own and a poor way to open a different
   * one. Left unset the frame grows to the drawing.
   */
  maxHeight?: number;
}) {
  return (
    <figure className="rounded-md border border-line bg-surface shadow-raised">
      {/* The one client-side behaviour: hovering a box fades everything off its
          line of descent. LineageFocus only sets opacity — the SVG below is
          still rendered on the server and never re-rendered. */}
      <LineageFocus
        edges={model.edges.map((edge) => [edge.parent, edge.child, edge.role])}
      >
        {/* The diagram scrolls rather than scaling down. Shrinking a pedigree to
          the column width makes the labels unreadable, which costs more than a
          scrollbar does. */}
        <div className="overflow-auto p-4" style={{ maxHeight }}>
          <svg
            viewBox={`0 0 ${model.width} ${model.height}`}
            width={model.width}
            height={model.height}
            role="img"
            aria-label={describeModel(model)}
            className="block h-auto max-w-none font-mono"
          >
            {/* Edges first, so a node always covers the line arriving at it. */}
            <g>
              {model.edges.map((edge) => (
                <path
                  key={edge.key}
                  data-parent={edge.parent}
                  data-child={edge.child}
                  d={lineagePath(edge)}
                  fill="none"
                  stroke="var(--line-strong)"
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  className="transition-opacity duration-150"
                />
              ))}
            </g>

            {/* The ♀/♂ badge is the diagram's one piece of real information that
              geometry cannot carry: which parent supplied the seed and which
              the pollen. It sits on a filled disc so the edge does not run
              through the glyph.

              Bold rather than the Light weight the nav uses, and inked rather
              than clay. The rest of the app draws Phosphor at Light because it
              sits beside 1px hairlines at 16-20px; this is a 13px glyph inside
              a 9px disc, where Light thins to nothing and clay's 3.5:1 is not
              enough to read it against. `ink-2` measures 7.9:1 on the disc. */}
            {/* Each glyph is a path of about a kilobyte, and the collection has 88
              parentages — inlined per edge that is most of the page. Defined
              once and referenced instead. Fixed ids are safe here: two diagrams
              on one page would define the same two glyphs, so a collision
              resolves to an identical symbol. */}
            <defs>
              <g id={SEED_GLYPH}>
                <PiGenderFemaleBold size={BADGE_GLYPH} aria-hidden="true" />
              </g>
              <g id={POLLEN_GLYPH}>
                <PiGenderMaleBold size={BADGE_GLYPH} aria-hidden="true" />
              </g>
            </defs>

            {/* The glyphs are `fill="currentColor"`, so the colour is set once
              here rather than on each of them. */}
            <g style={{ color: "var(--ink-2)" }}>
              {model.edges.map((edge) => (
                <g
                  key={`${edge.key}-role`}
                  data-parent={edge.parent}
                  data-child={edge.child}
                  className="transition-opacity duration-150"
                >
                  <circle
                    cx={edge.badge.x}
                    cy={edge.badge.y}
                    r={BADGE_RADIUS}
                    fill="var(--surface)"
                    stroke="var(--clay)"
                    strokeWidth={1}
                  />
                  <use
                    href={`#${edge.role === "seed" ? SEED_GLYPH : POLLEN_GLYPH}`}
                    x={edge.badge.x - BADGE_GLYPH / 2}
                    y={edge.badge.y - BADGE_GLYPH / 2}
                  />
                </g>
              ))}
            </g>

            <g>
              {model.nodes.map((node) => (
                <Node key={node.id} node={node} model={model} />
              ))}
            </g>
          </svg>
        </div>
      </LineageFocus>

      {caption !== undefined && (
        <figcaption className="data-sm border-t border-line px-4 py-3 text-clay">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Node({ node, model }: { node: LineageNode; model: LineageModel }) {
  const box = (
    <g
      data-node={node.id}
      transform={`translate(${node.x},${node.y})`}
      className="transition-opacity duration-150"
    >
      <rect
        width={model.nodeWidth}
        height={model.nodeHeight}
        rx={3}
        fill={fillFor(node)}
        stroke={strokeFor(node)}
        strokeWidth={node.isFocus ? 2 : 1}
        // A parent the records name but never profile is drawn with a broken
        // edge: an unfinished record, shown as one rather than quietly closed.
        strokeDasharray={node.kind === "external" ? "3 3" : undefined}
      />
      {/* With no year to show, the name takes the whole box rather than sitting
          high over an empty half of it. */}
      <text
        x={11}
        y={node.sub === null ? 24 : 17}
        fontSize={11}
        letterSpacing="0.04em"
        fill={nameFillFor(node)}
      >
        {truncate(node.name)}
      </text>
      {node.sub !== null && (
        <text
          x={11}
          y={30}
          fontSize={9}
          letterSpacing="0.08em"
          fill={subFillFor(node)}
        >
          {node.sub}
        </text>
      )}
    </g>
  );

  if (node.href === null) {
    return box;
  }

  return (
    <Link
      href={node.href}
      aria-label={node.sub === null ? node.name : `${node.name}, ${node.sub}`}
    >
      {box}
    </Link>
  );
}

/**
 * The focus node is filled with `matcha-deep` rather than `matcha`, and the
 * reason is measured rather than aesthetic. It is the one box carrying reversed
 * type, and on plain `matcha` the pair comes out at 4.86:1 for the name and
 * 4.17:1 for the year — the year failing AA outright at 9px. A step down the
 * ramp costs nothing visually and buys 6.87:1 and 5.89:1.
 */
function fillFor(node: LineageNode): string {
  if (node.isFocus) return "var(--matcha-deep)";
  if (node.kind === "external") return "var(--paper-sunk)";
  if (node.isMatcha) return "var(--matcha-soft)";
  return "var(--surface)";
}

function strokeFor(node: LineageNode): string {
  if (node.isFocus) return "var(--matcha-deep)";
  if (node.isMatcha) return "var(--matcha-line)";
  return "var(--line-strong)";
}

function nameFillFor(node: LineageNode): string {
  // `on-scrim` is the token for exactly this — type over a filled area.
  if (node.isFocus) return "var(--on-scrim)";
  if (node.isMatcha) return "var(--matcha-deep)";
  if (node.kind === "external") return "var(--clay)";
  return "var(--ink-2)";
}

/**
 * The year line, one step quieter than the name.
 *
 * On the focus node clay would sit at 1.33:1 against the fill — invisible, not
 * merely quiet — so the reversed pair steps down the green ramp instead, which
 * keeps the same "name louder than year" relationship the other boxes have.
 */
function subFillFor(node: LineageNode): string {
  return node.isFocus ? "var(--matcha-soft)" : "var(--clay)";
}

/** 168px at 11px mono holds about this much before it collides with the edge. */
function truncate(text: string, max = 22): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * The diagram's alternative text.
 *
 * An SVG of boxes and curves is nothing to a screen reader, and every node is
 * also a link with its own accessible name — so this describes the shape, and
 * the links carry the content.
 */
function describeModel(model: LineageModel): string {
  const generations = new Set(model.nodes.map((node) => node.x)).size;
  return `Pedigree diagram: ${model.nodes.length} cultivars across ${generations} generations, joined by ${model.edges.length} recorded parentages. Generations run left to right; each cultivar is a link to its record.`;
}
