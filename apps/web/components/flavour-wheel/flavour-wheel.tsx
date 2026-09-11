"use client";

import { useEffect, useState } from "react";

import {
  FlavourIndex,
  FlavourSwatch,
} from "@/components/flavour-wheel/flavour-index";
import { chipClasses } from "@/lib/chip";
import {
  childrenOf,
  familyLabelArcs,
  HOLE_RADIUS,
  isLit,
  radialLabel,
  sectorPath,
  SEGMENTS,
  segmentById,
  WHEEL_COUNTS,
  WHEEL_DESCRIPTION,
  WHEEL_SIZE,
  type Ring,
  type WheelSegment,
} from "@/lib/flavour-wheel";

/** Off the followed path, but still legible enough to find your way back. */
const DIM = 0.24;

const RING_LABEL: Record<Ring, string> = {
  family: "Family",
  group: "Group",
  note: "Note",
};

/**
 * The flavour wheel, with a readout beside it and every note listed beneath.
 *
 * Two layers of selection, borrowed from the pedigree. **Hover follows** — the
 * pointed-at band, what it sits in and what it holds stay lit, the rest fades.
 * **Click holds** — the band keeps its matcha outline, and the readout keeps
 * describing it, until it is clicked again, the centre is clicked, or Escape
 * is pressed. Hover is mouse-only: on a touchscreen a tap would register as
 * both and leave a hover nothing ever clears.
 *
 * The drawing scales to its column rather than scrolling. A wheel is only
 * legible whole — half of one in a scroll frame reads as nothing — so on a
 * phone it becomes an overview you tap, and the readout and the index below do
 * the reading.
 *
 * A client component outright, unlike the pedigree's server SVG with a client
 * enhancer: seventy bands re-rendering on hover is trivial, and the geometry is
 * a few hundred bytes of arithmetic rather than a build-time layout.
 */
export function FlavourWheel() {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId ?? pinnedId;
  const active = activeId ? segmentById(activeId) : undefined;
  const pinned = pinnedId ? segmentById(pinnedId) : undefined;

  useEffect(() => {
    if (pinnedId === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPinnedId(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pinnedId]);

  function toggle(id: string) {
    setPinnedId((current) => (current === id ? null : id));
  }

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <figure className="rounded-md border border-line bg-surface p-3 shadow-raised sm:p-6">
          <svg
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            role="img"
            aria-label={WHEEL_DESCRIPTION}
            className="mx-auto block h-auto w-full max-w-190 font-mono select-none"
            // Uppercased here rather than in the data, as label-caps does it:
            // the names stay readable in the source and in the index below.
            style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
            onPointerLeave={() => setHoveredId(null)}
          >
            {SEGMENTS.map((segment) => (
              <g
                key={segment.id}
                className="cursor-pointer transition-opacity duration-150"
                style={{ opacity: isLit(segment.id, activeId) ? 1 : DIM }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setHoveredId(segment.id);
                }}
                onClick={() => toggle(segment.id)}
              >
                {/* The surface-coloured stroke is the gap between bands. It
                    separates them without drawing an edge of its own. */}
                <path
                  d={sectorPath(segment)}
                  fill={segment.fill}
                  stroke="var(--surface)"
                  strokeWidth={1.5}
                />
                <SegmentLabel segment={segment} />
              </g>
            ))}

            {/* Drawn last so neither neighbour paints over it. Matcha because a
                held band is state, which is what the accent is for. */}
            {pinned && (
              <path
                d={sectorPath(pinned)}
                fill="none"
                stroke="var(--matcha)"
                strokeWidth={2.5}
                pointerEvents="none"
              />
            )}

            <circle
              cx={WHEEL_SIZE / 2}
              cy={WHEEL_SIZE / 2}
              r={HOLE_RADIUS - 1}
              fill="var(--paper)"
              className={pinnedId ? "cursor-pointer" : undefined}
              onPointerEnter={() => setHoveredId(null)}
              onClick={() => setPinnedId(null)}
            />
            <text
              x={WHEEL_SIZE / 2}
              y={WHEEL_SIZE / 2}
              dy="0.35em"
              textAnchor="middle"
              fontSize={12}
              fill="var(--ink-2)"
              pointerEvents="none"
            >
              Matcha
            </text>
          </svg>

          <figcaption className="data-sm mt-4 border-t border-line pt-3 text-ink-2">
            After the Matcha Taster’s Flavor Wheel by MTCH · hover to follow a
            band, click to hold it, Esc to let go
          </figcaption>
        </figure>

        <Readout
          segment={active}
          pinnedId={pinnedId}
          onSelect={toggle}
          onClear={() => setPinnedId(null)}
        />
      </div>

      <FlavourIndex pinnedId={pinnedId} onSelect={toggle} />
    </>
  );
}

function SegmentLabel({ segment }: { segment: WheelSegment }) {
  if (segment.ring === "family") {
    return (
      <>
        {familyLabelArcs(segment).map((d, index) => {
          // Fixed ids, as the pedigree's glyphs use: there is one wheel per
          // page, and a second would define identical arcs anyway.
          const id = `flavour-arc-${segment.id}-${index}`;
          return (
            <g key={id}>
              <path id={id} d={d} fill="none" />
              <text dy="0.35em" fontSize={12.5} fill="var(--ink)">
                <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
                  {segment.lines[index]}
                </textPath>
              </text>
            </g>
          );
        })}
      </>
    );
  }

  const { transform, x, y, textAnchor } = radialLabel(segment);
  return (
    <text
      transform={transform}
      x={x}
      y={y}
      dy="0.35em"
      textAnchor={textAnchor}
      fontSize={11.5}
      fill="var(--ink)"
    >
      {segment.name}
    </text>
  );
}

/**
 * What the followed band is and where it sits. Sticky beside the wheel on a
 * wide screen, so pressing a note in the index far below still shows it.
 */
function Readout({
  segment,
  pinnedId,
  onSelect,
  onClear,
}: {
  segment: WheelSegment | undefined;
  pinnedId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  if (!segment) {
    return (
      <aside className="rounded-md border border-line bg-surface p-5 shadow-raised lg:sticky lg:top-19">
        <p className="label-caps text-clay">How to read it</p>
        <p className="mt-2 text-body-md text-ink-2">
          Start at the centre with the broad family, step out to the group, and
          land on the note. Naming the family first is usually what brings the
          note — green before grassy, roast before hazelnut.
        </p>
        <p className="data-sm mt-4 text-ink-2">
          {WHEEL_COUNTS.families} families · {WHEEL_COUNTS.groups} groups ·{" "}
          {WHEEL_COUNTS.notes} notes
        </p>
      </aside>
    );
  }

  // A family or group lists what it holds; a note lists the notes beside it,
  // since "what else is in this group" is the next question a taster asks.
  const related =
    segment.ring === "note" && segment.parentId
      ? childrenOf(segment.parentId)
      : childrenOf(segment.id);
  const relatedHeading =
    segment.ring === "family"
      ? "Groups"
      : segment.ring === "group"
        ? "Notes"
        : `Also in ${segment.trail[1]}`;

  return (
    <aside className="rounded-md border border-line bg-surface p-5 shadow-raised lg:sticky lg:top-19">
      <p className="label-caps flex items-center gap-2 text-clay">
        <FlavourSwatch fill={segment.fill} />
        {RING_LABEL[segment.ring]}
      </p>
      <h2 className="mt-2 text-headline-md">{segment.name}</h2>
      {segment.trail.length > 1 && (
        <p className="data-sm mt-1 text-ink-2">
          {segment.trail.slice(0, -1).join(" › ")}
        </p>
      )}

      {related.length > 0 && (
        <>
          <p className="label-caps mt-5 text-clay">{relatedHeading}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {related.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={item.id === pinnedId}
                  onClick={() => onSelect(item.id)}
                  className={`${chipClasses(item.id === segment.id)} cursor-pointer transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {pinnedId && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 -ml-2 cursor-pointer rounded-sm px-2 py-1.5 text-label-lg text-clay transition-colors hover:bg-paper-sunk hover:text-ink"
        >
          Clear
        </button>
      )}
    </aside>
  );
}
