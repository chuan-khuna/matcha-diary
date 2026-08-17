import Link from "next/link";
import { PiGenderFemaleLight, PiGenderMaleLight } from "react-icons/pi";

import { lineagePath, type LineageModel, type LineageNode } from "@/lib/lineage";

/**
 * A pedigree, drawn.
 *
 * Server-rendered inline SVG with no client JavaScript at all: the layout ran
 * during `next build`, so what ships is finished geometry. That is the whole
 * reason there is no zoom or pan here — the prototype got those from d3, and a
 * static page trades them for a scroll frame and a diagram that costs nothing.
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
}: {
  model: LineageModel;
  caption?: string;
}) {
  return (
    <figure className="rounded-md border border-line bg-surface shadow-raised">
      {/* Wide families scroll rather than scale down. Shrinking a pedigree to
          the column width makes the labels unreadable, which costs more than
          a horizontal scrollbar does. */}
      <div className="overflow-x-auto p-4">
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
                d={lineagePath(edge)}
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* The ♀/♂ badge is the diagram's one piece of real information that
              geometry cannot carry: which parent supplied the seed and which
              the pollen. It sits on a filled disc so the edge does not run
              through the glyph. */}
          <g className="text-clay">
            {model.edges.map((edge) => {
              const Icon =
                edge.role === "seed" ? PiGenderFemaleLight : PiGenderMaleLight;

              return (
                <g key={`${edge.key}-role`}>
                  <circle
                    cx={edge.badge.x}
                    cy={edge.badge.y}
                    r={9}
                    fill="var(--surface)"
                    stroke="var(--line-strong)"
                    strokeWidth={1}
                  />
                  <Icon
                    x={edge.badge.x - 6}
                    y={edge.badge.y - 6}
                    size={12}
                    aria-hidden="true"
                  />
                </g>
              );
            })}
          </g>

          <g>
            {model.nodes.map((node) => (
              <Node key={node.id} node={node} model={model} />
            ))}
          </g>
        </svg>
      </div>

      {caption !== undefined && (
        <figcaption className="border-t border-line px-4 py-3 font-mono text-data-sm text-clay">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Node({ node, model }: { node: LineageNode; model: LineageModel }) {
  const box = (
    <g transform={`translate(${node.x},${node.y})`}>
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
      <text
        x={11}
        y={17}
        fontSize={11}
        letterSpacing="0.04em"
        fill={nameFillFor(node)}
      >
        {truncate(node.name)}
      </text>
      <text x={11} y={30} fontSize={9} letterSpacing="0.08em" fill="var(--clay)">
        {node.sub}
      </text>
    </g>
  );

  if (node.href === null) {
    return box;
  }

  return (
    <Link href={node.href} aria-label={`${node.name}, ${node.sub}`}>
      {box}
    </Link>
  );
}

function fillFor(node: LineageNode): string {
  if (node.isFocus) return "var(--matcha)";
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
  // The focus node is the one box drawn in solid matcha, so its label has to
  // invert. `on-scrim` is the token for exactly this — type over a filled area.
  if (node.isFocus) return "var(--on-scrim)";
  if (node.isMatcha) return "var(--matcha-deep)";
  if (node.kind === "external") return "var(--clay)";
  return "var(--ink-2)";
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
