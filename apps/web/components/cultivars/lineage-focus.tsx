"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

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
 * Interaction for a pedigree, in two layers.
 *
 * **Hover fades.** Everything off the pointed-at plant's line of descent drops
 * to a whisper. Nothing moves, so it costs nothing and is always on.
 *
 * **Click isolates.** The unrelated boxes are removed outright, the empty rows
 * and columns they leave are squeezed out, and the canvas refits to what
 * survives — Seimei's line goes from a 2902px canvas to 230px. It sticks until
 * released, so the isolated view can be read rather than merely glimpsed.
 *
 * Isolating on *hover* is what this used to do, and it flickered, for a reason
 * worth writing down: compaction moves the hovered box out from under the
 * cursor, `pointerover` then fires for whatever is underneath instead, that
 * clears the isolation, the box springs back under the cursor, and the whole
 * thing oscillates. Any "re-layout on hover" has this bug. Pinning the hovered
 * box in place would break the loop but defeat the feature — if it stays put at
 * y=2400 the canvas still has to span 2400, and fitting the line on screen was
 * the entire point. A click has no such loop, because the pointer's position
 * stops being the input.
 *
 * Double-click opens the record, and a single click is therefore deferred by
 * `DOUBLE_CLICK_MS` so it can be cancelled — isolating immediately would move
 * the box away before the second click of a double-click could land on it,
 * which is the same bug in a different coat.
 *
 * Small diagrams skip all of this. A record page's own pedigree is a handful of
 * boxes that already fit, so there is nothing to isolate and a plain link click
 * should just open the record.
 *
 * Still an enhancer, not a renderer: the SVG arrives finished from the server
 * and this only sets opacity and display and rewrites `transform` and `d` on
 * elements that already exist. Every position it computes comes from
 * `lib/lineage-geometry`, the module the build-time layout uses, so an isolated
 * edge lands exactly where the server would have drawn it.
 */

/** Dimmed but still legible — the prototype's value. */
const DIM = "0.16";

/** Long enough to catch a double-click, short enough not to feel laggy. */
const DOUBLE_CLICK_MS = 220;

/** Below this, the diagram already fits and clicking should just navigate. */
const ISOLATE_FROM = 12;

type EdgeSpec = [parent: string, child: string, role: LineageRole];

export function LineageFocus({
  edges,
  children,
}: {
  /** One per drawn parentage, as node ids. */
  edges: EdgeSpec[];
  children: ReactNode;
}) {
  const [focused, setFocused] = useState<string | null>(null);
  const [canIsolate, setCanIsolate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

    const isolatable = nodeEls.length >= ISOLATE_FROM;
    setCanIsolate(isolatable);

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
    const homeBadge = new Map(
      badgeEls.map((el) => [
        el,
        {
          cx: el.querySelector("circle")?.getAttribute("cx"),
          cy: el.querySelector("circle")?.getAttribute("cy"),
        },
      ]),
    );
    const homeBox = {
      viewBox: svg.getAttribute("viewBox"),
      width: svg.getAttribute("width"),
      height: svg.getAttribute("height"),
    };

    const placeBadge = (el: SVGGElement, x: number, y: number) => {
      const disc = el.querySelector("circle");
      const glyph = el.querySelector("use");
      disc?.setAttribute("cx", String(x));
      disc?.setAttribute("cy", String(y));
      glyph?.setAttribute("x", String(x - BADGE_GLYPH / 2));
      glyph?.setAttribute("y", String(y - BADGE_GLYPH / 2));
    };

    const onLine = (el: Element, lit: Set<string>) =>
      lit.has(el.getAttribute("data-parent") ?? "") &&
      lit.has(el.getAttribute("data-child") ?? "");

    /* ---- the states --------------------------------------------------- */

    const restore = () => {
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
        if (at?.cx != null && at.cy != null)
          placeBadge(el, Number(at.cx), Number(at.cy));
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
      // Both ends must be lit, or hovering Yabukita would light every edge
      // leaving each of its descendants, off to families it has no part in.
      for (const el of [...pathEls, ...badgeEls]) {
        el.style.opacity = onLine(el, lit) ? "" : DIM;
      }
    };

    const unfade = () => {
      for (const el of drawn) el.style.opacity = "";
    };

    const isolate = (id: string) => {
      const lit = lineOf(id);

      for (const el of nodeEls) {
        el.style.display = lit.has(el.dataset.node ?? "") ? "" : "none";
        el.style.opacity = "";
      }
      for (const el of [...pathEls, ...badgeEls]) {
        el.style.display = onLine(el, lit) ? "" : "none";
        el.style.opacity = "";
      }

      // Squeeze out the empty columns and rows the hidden boxes left behind,
      // keeping every survivor in its own generation and in its original order.
      // Deliberately not a re-layout: re-running the barycentre passes here
      // would reorder boxes under the reader mid-interaction.
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

    /* ---- apply the current state -------------------------------------- */

    if (focused !== null) isolate(focused);

    /* ---- wiring -------------------------------------------------------- */

    const nodeUnder = (event: Event) =>
      (event.target as Element | null)?.closest<SVGGElement>("[data-node]") ??
      null;

    // Hover only speaks while nothing is pinned. Once a line is isolated the
    // unrelated boxes are gone, so there is nothing left for fading to say.
    const onOver = (event: Event) => {
      if (focused !== null) return;
      const id = nodeUnder(event)?.dataset.node;
      if (id === undefined) unfade();
      else fade(id);
    };

    const onLeave = () => {
      if (focused === null) unfade();
    };

    let pending: number | undefined;

    const onClick = (event: MouseEvent) => {
      const node = nodeUnder(event);
      const id = node?.dataset.node;

      if (id === undefined) {
        // A click on empty canvas releases, which is the gesture people try.
        if (focused !== null) setFocused(null);
        return;
      }
      // `detail === 0` is a keyboard Enter on the link. Leave it alone so the
      // record still opens without a mouse.
      if (!isolatable || event.detail === 0) return;

      event.preventDefault();

      if (event.detail === 1) {
        window.clearTimeout(pending);
        pending = window.setTimeout(() => {
          setFocused((current) => (current === id ? null : id));
        }, DOUBLE_CLICK_MS);
        return;
      }

      // Second click of a double-click: cancel the pending isolate and go.
      window.clearTimeout(pending);
      const href = node?.closest("a")?.getAttribute("href");
      if (href != null) router.push(href);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && focused !== null) setFocused(null);
    };

    root.addEventListener("pointerover", onOver);
    root.addEventListener("focusin", onOver);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusout", onLeave);
    root.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(pending);
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("focusin", onOver);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusout", onLeave);
      root.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      restore();
    };
  }, [edges, focused, router]);

  return (
    <div ref={ref} className="relative">
      {/* Floats over the top-right of the frame. `pointer-events-none` on the
          strip keeps it from stealing hovers from the boxes underneath; the
          controls inside take them back. */}
      {canIsolate && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-end p-3">
          {focused === null ? (
            <p className="rounded-xs border border-line bg-surface/90 px-2.25 py-1 font-mono text-data-sm text-clay">
              click a plant to hide the rest · double-click opens it
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setFocused(null)}
              className={`${chipClasses(true)} pointer-events-auto cursor-pointer shadow-raised transition-colors hover:border-matcha hover:bg-matcha-soft`}
            >
              show all
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
