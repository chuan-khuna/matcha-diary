"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Hovering a plant lights its line of descent and fades everything else.
 *
 * On a pedigree of a hundred boxes the question a reader actually has is "what
 * does *this* one come from, and what came out of it" — and the answer is a
 * path through a thicket of ninety curves that all look alike. Dimming the rest
 * answers it without moving anything.
 *
 * This is an enhancer, not a renderer. The diagram stays a server component and
 * ships as finished SVG; what crosses to the client is this file and the edge
 * list — ninety pairs of ids, a couple of kilobytes — and all it ever does is
 * set an inline opacity. Rendering the SVG on the client instead would send the
 * whole laid-out model and the drawing code after it, to produce the same
 * pixels.
 *
 * Reachability is recomputed per hover rather than precomputed per node. It is a
 * breadth-first walk over ninety edges, which is nothing, and shipping the
 * closure of every node instead would be far larger than the edge list itself.
 *
 * Keyboard users get the same thing through focusin/focusout, since every
 * documented box is a link and already takes focus.
 */

/** Matches the prototype's dimmed state, and stays legible enough to read. */
const DIM = "0.16";

export function LineageFocus({
  edges,
  children,
}: {
  /** `[parentNodeId, childNodeId]`, one per drawn parentage. */
  edges: Array<[string, string]>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (root === null) return;

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

    const nodes = [...root.querySelectorAll<SVGGElement>("[data-node]")];
    const links = [...root.querySelectorAll<SVGGElement>("[data-parent]")];

    const clear = () => {
      for (const element of [...nodes, ...links]) element.style.opacity = "";
    };

    const focus = (id: string) => {
      const lit = new Set([id, ...reach(id, up), ...reach(id, down)]);

      for (const element of nodes) {
        element.style.opacity = lit.has(element.dataset.node ?? "") ? "" : DIM;
      }
      // An edge is on the line of descent only if both its ends are — otherwise
      // hovering Yabukita would light every edge leaving every one of its
      // descendants, including the ones going off to unrelated families.
      for (const element of links) {
        const on =
          lit.has(element.dataset.parent ?? "") &&
          lit.has(element.dataset.child ?? "");
        element.style.opacity = on ? "" : DIM;
      }
    };

    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      const node = target?.closest<SVGGElement>("[data-node]");
      if (node?.dataset.node === undefined) clear();
      else focus(node.dataset.node);
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
    };
  }, [edges]);

  return <div ref={ref}>{children}</div>;
}
