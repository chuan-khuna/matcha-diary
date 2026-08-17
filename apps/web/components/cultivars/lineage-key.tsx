import type { ReactNode } from "react";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";

/**
 * The pedigree legend.
 *
 * Every mark is drawn with the same values the renderer uses rather than
 * described in words — a legend that paraphrases its diagram is a legend that
 * can drift out of step with it. Shared by both pages that draw a pedigree, so
 * there is one definition of what a dashed edge or a tinted box means.
 */
export function LineageKey() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      <Swatch fill="var(--surface)" stroke="var(--line-strong)">
        cultivar
      </Swatch>
      <Swatch fill="var(--matcha-soft)" stroke="var(--matcha-line)">
        grown for matcha or tencha
      </Swatch>
      <Swatch fill="var(--paper-sunk)" stroke="var(--line-strong)" dashed>
        named as a parent, no record here
      </Swatch>
      <Badge Icon={PiGenderFemaleBold}>seed parent</Badge>
      <Badge Icon={PiGenderMaleBold}>pollen parent</Badge>
    </ul>
  );
}

function Swatch({
  fill,
  stroke,
  dashed = false,
  children,
}: {
  fill: string;
  stroke: string;
  dashed?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <svg width={28} height={16} aria-hidden="true" className="shrink-0">
        <rect
          x={1}
          y={2}
          width={26}
          height={12}
          rx={3}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray={dashed ? "3 3" : undefined}
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

/** Drawn exactly as the diagram draws it — same disc, same glyph, same ink. */
function Badge({
  Icon,
  children,
}: {
  Icon: typeof PiGenderFemaleBold;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <svg
        width={21}
        height={21}
        aria-hidden="true"
        className="shrink-0"
        style={{ color: "var(--ink-2)" }}
      >
        <circle
          cx={10.5}
          cy={10.5}
          r={9.5}
          fill="var(--surface)"
          stroke="var(--clay)"
          strokeWidth={1}
        />
        <Icon x={4} y={4} size={13} />
      </svg>
      <span>{children}</span>
    </li>
  );
}
