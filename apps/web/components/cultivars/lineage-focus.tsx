"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { chipClasses } from "@/lib/chip";
import {
  BADGE_GLYPH,
  COL_PITCH,
  edgeGeometry,
  edgePath,
  NODE_H,
  NODE_W,
  PAD,
  ROW_PITCH,
  type LineageRole,
} from "@/lib/lineage-geometry";

/**
 * Hover behaviour for a pedigree, in two strengths.
 *
 * **Fade** (default) dims everything off the hovered plant's line of descent.
 * It answers "what is this one related to" without moving anything, which is
 * the right default because the diagram stays where you learned it.
 *
 * **Hide unrelated** is the button. Fading leaves the unrelated boxes taking up
 * their space, so on the whole-collection canvas — 112 plants over nearly three
 * thousand pixels — a plant's own line can still be strung out across a screen
 * and a half with nothing but whitespace between its parents. Switched on,
 * hovering removes the unrelated boxes outright, closes the gaps they leave,
 * and refits the canvas to what remains: a cultivar's parents and children come
 * back as a handful of boxes you can see at once.
 *
 * The re-stack is deliberately not a re-layout. Nodes keep their generation
 * (the column they were placed in) and their order within it; only the empty
 * rows and columns are squeezed out. Running the barycentre passes again in the
 * browser would reorder boxes as you moved the mouse, which would make the
 * diagram feel like it was rearranging itself rather than zooming in.
 *
 * This is still an enhancer, not a renderer. The SVG arrives finished from the
 * server and is handed here as children; what this file does is set opacity,
 * set display, and rewrite `transform` and `d` on elements that already exist.
 * Positions it computes come from `lib/lineage-geometry`, the same module the
 * build-time layout uses, so an isolated edge lands exactly where the server
 * would have drawn it.
 */

/** Matches the prototype's dimmed state, and stays legible enough to read. */
const DIM = "0.16";

type EdgeSpec = [parent: string, child: string, role: LineageRole];

export function LineageFocus({
  edges,
  children,
}: {
  /** One per drawn parentage, as node ids. */
  edges: EdgeSpec[];
  children: ReactNode;
}) {
  const [hideUnrelated, setHideUnrelated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const svg = root?.querySelector("svg");
    if (root === null || svg === null || svg === undefined) return;

    /* ---- what is related to what ------------------------------------- */

    const up = new Map<string, string[]>();
    const down = new Map<string, string[]>();
    for (const [parent, child] of edges) {
      up.set(child, [...(up.get(child) ?? []), parent]);
      down.set(parent, [...(down.get(parent) ?? []), child]);
    }

    const reach = (start: string, step: Map<string, string[]>) => {
      const seen = new Set<string>();
      const queue = [...(step.get(start) ?? [])];
      while (queue.length > 0) {
        const next = queue.pop();
        if (next === undefined || seen.has(next)) continue;
        seen.add(next);
        for (const onward of step.get(next) ?? []) queue.push(onward);
      }
      return seen;
    };

    const lineOf = (id: string) =>
      new Set([id, ...reach(id, up), ...reach(id, down)]);

    /* ---- the elements, and where they started ------------------------ */

    const nodeEls = [...root.querySelectorAll<SVGGElement>("[data-node]")];
    const pathEls = [
      ...root.querySelectorAll<SVGPathElement>("path[data-parent]"),
    ];
    const badgeEls = [...root.querySelectorAll<SVGGElement>("g[data-parent]")];
    const drawn = [...nodeEls, ...pathEls, ...badgeEls];

    // A (parent, child) pair is unique — a self-pollination is deduplicated to
    // one edge at build time — so it is a safe key for both lookups.
    const key = (el: Element) =>
      `${el.getAttribute("data-parent")}|${el.getAttribute("data-child")}`;
    const pathFor = new Map(pathEls.map((el) => [key(el), el]));
    const badgeFor = new Map(badgeEls.map((el) => [key(el), el]));

    const home = new Map<SVGGElement, { x: number; y: number }>();
    for (const el of nodeEls) {
      const found = /translate\(([-\d.]+),([-\d.]+)\)/.exec(
        el.getAttribute("transform") ?? "",
      );
      home.set(el, { x: Number(found?.[1] ?? 0), y: Number(found?.[2] ?? 0) });
    }
    const homePath = new Map(pathEls.map((el) => [el, el.getAttribute("d")]));
    const homeBox = {
      viewBox: svg.getAttribute("viewBox"),
      width: svg.getAttribute("width"),
      height: svg.getAttribute("height"),
    };
    const homeBadge = new Map(
      badgeEls.map((el) => [
        el,
        {
          cx: el.querySelector("circle")?.getAttribute("cx"),
          cy: el.querySelector("circle")?.getAttribute("cy"),
        },
      ]),
    );

    const placeBadge = (el: SVGGElement, x: number, y: number) => {
      const disc = el.querySelector("circle");
      const glyph = el.querySelector("use");
      disc?.setAttribute("cx", String(x));
      disc?.setAttribute("cy", String(y));
      glyph?.setAttribute("x", String(x - BADGE_GLYPH / 2));
      glyph?.setAttribute("y", String(y - BADGE_GLYPH / 2));
    };

    /* ---- the three states -------------------------------------------- */

    const clear = () => {
      for (const el of drawn) {
        el.style.opacity = "";
        el.style.display = "";
      }
      for (const el of nodeEls) {
        const at = home.get(el);
        if (at !== undefined)
          el.setAttribute("transform", `translate(${at.x},${at.y})`);
      }
      for (const el of pathEls) {
        const d = homePath.get(el);
        if (d !== null && d !== undefined) el.setAttribute("d", d);
      }
      for (const el of badgeEls) {
        const at = homeBadge.get(el);
        if (at?.cx != null && at.cy != null) {
          placeBadge(el, Number(at.cx), Number(at.cy));
        }
      }
      if (homeBox.viewBox !== null)
        svg.setAttribute("viewBox", homeBox.viewBox);
      if (homeBox.width !== null) svg.setAttribute("width", homeBox.width);
      if (homeBox.height !== null) svg.setAttribute("height", homeBox.height);
    };

    const fade = (id: string) => {
      const lit = lineOf(id);
      for (const el of nodeEls) {
        el.style.opacity = lit.has(el.dataset.node ?? "") ? "" : DIM;
      }
      // An edge is on the line only if both its ends are — otherwise hovering
      // Yabukita would light every edge leaving each of its descendants.
      for (const el of [...pathEls, ...badgeEls]) {
        const on =
          lit.has(el.getAttribute("data-parent") ?? "") &&
          lit.has(el.getAttribute("data-child") ?? "");
        el.style.opacity = on ? "" : DIM;
      }
    };

    const isolate = (id: string) => {
      const lit = lineOf(id);

      for (const el of nodeEls) {
        el.style.display = lit.has(el.dataset.node ?? "") ? "" : "none";
      }
      for (const el of [...pathEls, ...badgeEls]) {
        const on =
          lit.has(el.getAttribute("data-parent") ?? "") &&
          lit.has(el.getAttribute("data-child") ?? "");
        el.style.display = on ? "" : "none";
      }

      // Squeeze out the empty columns and rows the hidden boxes left behind,
      // keeping every survivor in its own generation and in its original order.
      const columns = new Map<number, SVGGElement[]>();
      for (const el of nodeEls) {
        if (!lit.has(el.dataset.node ?? "")) continue;
        const at = home.get(el);
        if (at === undefined) continue;
        columns.set(at.x, [...(columns.get(at.x) ?? []), el]);
      }

      const order = [...columns.keys()].sort((a, b) => a - b);
      const moved = new Map<string, { x: number; y: number }>();
      let deepest = 0;

      order.forEach((column, index) => {
        const stack = (columns.get(column) ?? []).sort(
          (a, b) => (home.get(a)?.y ?? 0) - (home.get(b)?.y ?? 0),
        );
        deepest = Math.max(deepest, stack.length);

        stack.forEach((el, row) => {
          const at = { x: PAD + index * COL_PITCH, y: PAD + row * ROW_PITCH };
          el.setAttribute("transform", `translate(${at.x},${at.y})`);
          moved.set(el.dataset.node ?? "", at);
        });
      });

      for (const [parent, child, role] of edges) {
        const from = moved.get(parent);
        const to = moved.get(child);
        if (from === undefined || to === undefined) continue;

        const geometry = edgeGeometry(from, to, role);
        pathFor
          .get(`${parent}|${child}`)
          ?.setAttribute("d", edgePath(geometry.from, geometry.to));

        const badge = badgeFor.get(`${parent}|${child}`);
        if (badge !== undefined)
          placeBadge(badge, geometry.badge.x, geometry.badge.y);
      }

      const width = PAD * 2 + (order.length - 1) * COL_PITCH + NODE_W;
      const height = PAD * 2 + (deepest - 1) * ROW_PITCH + NODE_H;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
    };

    /* ---- wiring ------------------------------------------------------- */

    const onOver = (event: Event) => {
      const node = (event.target as Element | null)?.closest<SVGGElement>(
        "[data-node]",
      );
      const id = node?.dataset.node;
      if (id === undefined) clear();
      else if (hideUnrelated) isolate(id);
      else fade(id);
    };

    root.addEventListener("pointerover", onOver);
    root.addEventListener("focusin", onOver);
    root.addEventListener("pointerleave", clear);
    root.addEventListener("focusout", clear);

    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("focusin", onOver);
      root.removeEventListener("pointerleave", clear);
      root.removeEventListener("focusout", clear);
      // Switching the button re-runs this effect; put the diagram back first so
      // the new mode starts from the drawing the server sent.
      clear();
    };
  }, [edges, hideUnrelated]);

  return (
    <div ref={ref} className="relative">
      {/* Floats over the top-right of the frame. `pointer-events-none` on the
          strip keeps it from stealing hovers from the boxes underneath; the
          button itself takes them back. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end p-3">
        <button
          type="button"
          aria-pressed={hideUnrelated}
          onClick={() => setHideUnrelated((on) => !on)}
          title="On hover, drop everything off the plant's line and refit the diagram"
          className={`${chipClasses(hideUnrelated)} pointer-events-auto cursor-pointer shadow-raised transition-colors hover:border-matcha-line hover:bg-matcha-soft`}
        >
          hide unrelated
        </button>
      </div>

      {children}
    </div>
  );
}
