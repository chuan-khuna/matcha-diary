/* ==========================================================================
   Matcha Diary — lineage layout and renderer
   ==========================================================================

   A cultivar pedigree is a directed acyclic graph, not a tree: a cross has two
   parents, and one plant is the parent of several. `d3.hierarchy` — and so
   `d3.tree` and `d3.cluster` — takes exactly one parent per node, so feeding
   this to it means either duplicating Yabukita four times or dropping an edge.
   Both destroy the thing the diagram exists to show, which is that Seimei
   reaches Yabukita by two different paths.

   So the layout here is the layered kind (Sugiyama), in three steps:

     1. RANK    — each node sits one column right of its *furthest* parent, so
                  no edge ever points backwards. Longest path, not shortest.
     2. ORDER   — within a column, sort by the average position of the nodes a
                  node connects to, sweeping forwards and backwards. This is
                  the barycentre heuristic and it is what removes crossings.
     3. PLACE   — give each node the average y of its parents, then push apart
                  anything that now overlaps.

   About sixty lines, which is the argument for not taking a graph-layout
   dependency at this size. d3 earns its place on everything around the layout:
   curve generation, zoom and pan, transitions, selections.

   Depends on `cultivar-data.js` for the data and, optionally, on d3 — see
   `draw()`, which is the only function in here that needs it. Everything above
   it is plain JavaScript, which is what makes the no-script list view a
   rendering of the same model rather than a separate hand-written copy.
   ========================================================================== */

const Lineage = (() => {
  /* Geometry. A node is the same stamped mono label the powder database uses
     for a cultivar tag, given a second line for its year — so the map reads as
     a field of the chips you already know, wired together. */
  const NODE_W = 184;
  const NODE_H = 36;
  const COL_GAP = 64;
  const ROW_GAP = 12;
  const COL_W = NODE_W + COL_GAP;
  const ROW_H = NODE_H + ROW_GAP;
  const PAD = 16;

  /* An unassigned parent gets a stub reaching left into nothing. It is drawn
     rather than omitted because "no parent" and "a parent nobody recorded" are
     different claims, and an absent edge would state the first. */
  const STUB = 30;

  /* Mother above, father below, at every cross. Also separates the two edges
     Yutakamidori draws to Asatsuyu, which would otherwise land on each other. */
  const roleOffset = (edge) =>
    edge.relation === "selection" ? 0 : edge.role === "seed" ? -7 : 7;

  const parentIdsOf = (node, has) =>
    (node.parents || []).map((p) => p.of).filter((id) => id && has(id));

  /* ---- 1–3. Layout ------------------------------------------------------ */

  function layout(list) {
    const byId = new Map(list.map((n) => [n.id, n]));
    const has = (id) => byId.has(id);
    const parentsOf = (id) => parentIdsOf(byId.get(id), has);

    /* 1. Rank. Longest path from a root: a node must sit to the right of every
       parent, not just of the nearest one, or an edge points the wrong way. */
    const rank = new Map();
    const open = new Set();
    const rankOf = (id) => {
      if (rank.has(id)) return rank.get(id);
      if (open.has(id)) return 0; // guard; the data is acyclic
      open.add(id);
      const ps = parentsOf(id);
      let r = ps.length ? 1 + Math.max(...ps.map(rankOf)) : 0;
      const hint = byId.get(id).rankHint;
      if (hint != null) r = Math.max(r, hint);
      open.delete(id);
      rank.set(id, r);
      return r;
    };
    list.forEach((n) => rankOf(n.id));

    const depth = Math.max(...rank.values()) + 1;
    const cols = Array.from({ length: depth }, () => []);
    list.forEach((n) => cols[rank.get(n.id)].push(n.id));

    const kids = new Map(list.map((n) => [n.id, []]));
    list.forEach((n) => parentsOf(n.id).forEach((p) => kids.get(p).push(n.id)));

    /* 2. Order. Sweep forwards then backwards, each time sorting a column by
       the mean index of the column it was just compared against. Ties keep the
       previous order, so the result is stable and the same every load.

       A node with nothing to average — Komakage has no children, so it has no
       opinion on a backward sweep — is *held in place* rather than given its
       own index as a stand-in barycentre. Mixing the two scales is what drags
       childless nodes to the bottom of a column and away from their siblings. */
    const slot = new Map();
    const reindex = () => cols.forEach((c) => c.forEach((id, i) => slot.set(id, i)));
    reindex();

    const barycentre = (ids) =>
      ids.length ? ids.reduce((sum, id) => sum + slot.get(id), 0) / ids.length : null;

    for (let sweep = 0; sweep < 8; sweep++) {
      const forward = sweep % 2 === 0;
      const order = forward
        ? cols.slice(1)
        : cols.slice(0, -1).reverse();
      for (const col of order) {
        const key = new Map();
        const movable = [];
        col.forEach((id, i) => {
          const b = barycentre(forward ? parentsOf(id) : kids.get(id));
          if (b === null) return;
          key.set(id, b);
          movable.push({ id, at: i });
        });
        if (movable.length < 2) continue;

        const seats = movable.map((m) => m.at);
        movable
          .slice()
          .sort((a, b) => key.get(a.id) - key.get(b.id) || a.at - b.at)
          .forEach((m, k) => { col[seats[k]] = m.id; });
        reindex();
      }
    }

    /* 3. Place. Each node wants the mean y of what it connects to; the column
       then gets packed so nothing overlaps, and shifted back to undo the
       downward drift that packing top-to-bottom always introduces. */
    const y = new Map();
    cols.forEach((col) => col.forEach((id, i) => y.set(id, i * ROW_H)));

    const pack = (col, want) => {
      let floor = -Infinity;
      let drift = 0;
      let wanted = 0;
      col.forEach((id) => {
        const target = want.has(id) ? want.get(id) : y.get(id);
        const placed = Math.max(target, floor + ROW_H);
        y.set(id, placed);
        floor = placed;
        if (want.has(id)) {
          drift += placed - target;
          wanted++;
        }
      });
      if (wanted) {
        const shift = drift / wanted;
        col.forEach((id) => y.set(id, y.get(id) - shift));
      }
    };

    for (let pass = 0; pass < 4; pass++) {
      const forward = pass % 2 === 0;
      const seq = forward ? cols.slice(1) : cols.slice(0, -1).reverse();
      for (const col of seq) {
        const want = new Map();
        col.forEach((id) => {
          const rel = forward ? parentsOf(id) : kids.get(id);
          if (rel.length) {
            want.set(id, rel.reduce((sum, r) => sum + y.get(r), 0) / rel.length);
          }
        });
        pack(col, want);
      }
    }

    const top = Math.min(...y.values());
    const nodes = list.map((n) => ({
      ...n,
      rank: rank.get(n.id),
      x: PAD + rank.get(n.id) * COL_W,
      y: PAD + y.get(n.id) - top,
    }));
    const place = new Map(nodes.map((n) => [n.id, n]));

    const edges = [];
    list.forEach((n) =>
      (n.parents || []).forEach((p, i) => {
        const child = place.get(n.id);
        const parent = p.of ? place.get(p.of) : null;
        if (p.of && !parent) return; // parent filtered out of this subgraph
        const off = roleOffset(p);
        edges.push({
          key: `${p.of || "unassigned"}~${n.id}~${i}`,
          parent: p.of || null,
          child: n.id,
          relation: p.relation,
          role: p.role,
          evidence: p.relation === "selection" ? "selection" : p.evidence,
          note: p.note || null,
          stub: !parent,
          source: parent
            ? { x: parent.x + NODE_W, y: parent.y + NODE_H / 2 }
            : { x: child.x - STUB, y: child.y + NODE_H / 2 + off },
          target: { x: child.x, y: child.y + NODE_H / 2 + off },
        });
      }),
    );

    return {
      nodes,
      edges,
      width: PAD * 2 + (depth - 1) * COL_W + NODE_W,
      height: PAD * 2 + (Math.max(...nodes.map((n) => n.y)) - PAD) + NODE_H,
      node: NODE_W,
      row: NODE_H,
    };
  }

  /* ---- Reachability ----------------------------------------------------- */

  /** Everything upstream and everything downstream of one node. */
  function relatives(list, id) {
    const byId = new Map(list.map((n) => [n.id, n]));
    const has = (i) => byId.has(i);
    const up = new Map(list.map((n) => [n.id, parentIdsOf(n, has)]));
    const down = new Map(list.map((n) => [n.id, []]));
    up.forEach((ps, child) => ps.forEach((p) => down.get(p).push(child)));

    const walk = (from, edges) => {
      const seen = new Set();
      const queue = [...(edges.get(from) || [])];
      while (queue.length) {
        const next = queue.pop();
        if (seen.has(next)) continue;
        seen.add(next);
        (edges.get(next) || []).forEach((n) => queue.push(n));
      }
      return seen;
    };

    return { ancestors: walk(id, up), descendants: walk(id, down) };
  }

  /** One cultivar's own slice of the graph: itself, its line up, its line down. */
  function subgraph(list, id) {
    const { ancestors, descendants } = relatives(list, id);
    const keep = new Set([id, ...ancestors, ...descendants]);
    return list.filter((n) => keep.has(n.id));
  }

  /* ---- Rendering -------------------------------------------------------- */

  const truncate = (text, max = 24) =>
    text.length > max ? `${text.slice(0, max - 1)}…` : text;

  const secondLine = (n) =>
    n.population ? "landrace" : n.year ? String(n.year) : "year unrecorded";

  const nodeLabel = (n) => {
    const kind = n.population ? "landrace" : "cultivar";
    const when = n.year ? `, ${n.year}` : "";
    return `${n.name}${n.ja ? ` (${n.ja})` : ""} — ${kind}${when}`;
  };

  /**
   * Draw a laid-out model into an <svg>. The only function here that needs d3;
   * if d3 did not load, the caller falls back to `list()` below.
   *
   * Returns a small API so a page can drive the diagram without reaching into
   * the selection: `.focus(id)` highlights a line of descent, `.fit()` re-fits.
   */
  function draw(svg, model, opts = {}) {
    if (!window.d3) return null;
    const { onSelect = null, focus = null, interactive = true } = opts;

    const root = d3.select(svg);
    root.selectAll("*").remove();
    root.attr("viewBox", `0 0 ${model.width} ${model.height}`);

    const view = root.append("g").attr("class", "lin-view");
    const edgeLayer = view.append("g").attr("class", "lin-edges");
    const nodeLayer = view.append("g").attr("class", "lin-nodes");

    const curve = d3
      .linkHorizontal()
      .source((d) => d.source)
      .target((d) => d.target)
      .x((p) => p.x)
      .y((p) => p.y);

    const edge = edgeLayer
      .selectAll("g.lin-edge")
      .data(model.edges, (d) => d.key)
      .join("g")
      .attr("class", (d) => `lin-edge ev-${d.evidence}${d.stub ? " is-stub" : ""}`);

    edge
      .append("path")
      .attr("d", (d) => curve(d))
      .append("title")
      .text((d) => {
        const ev = EVIDENCE[d.evidence];
        return d.stub
          ? `Parent unassigned — ${d.note || "not recorded"}`
          : `${ev.label}${d.note ? ` — ${d.note}` : ` — ${ev.blurb}`}`;
      });

    /* The open circle at the end of a stub is the whole point of drawing one:
       it terminates in nothing, visibly. */
    edge
      .filter((d) => d.stub)
      .append("circle")
      .attr("cx", (d) => d.source.x)
      .attr("cy", (d) => d.source.y)
      .attr("r", 3.5);

    const node = nodeLayer
      .selectAll("g.lin-node")
      .data(model.nodes, (d) => d.id)
      .join("g")
      .attr("class", (d) =>
        [
          "lin-node",
          d.population ? "is-population" : "is-cultivar",
          d.matcha ? "is-matcha" : "",
        ]
          .filter(Boolean)
          .join(" "),
      )
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node
      .append("rect")
      .attr("width", model.node)
      .attr("height", model.row)
      .attr("rx", 3);

    node
      .append("text")
      .attr("class", "lin-name")
      .attr("x", 11)
      .attr("y", 15)
      .text((d) => truncate(d.name));

    node
      .append("text")
      .attr("class", "lin-meta")
      .attr("x", 11)
      .attr("y", 27)
      .text(secondLine);

    node.append("title").text(nodeLabel);

    if (interactive) {
      node
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", nodeLabel)
        .on("mouseenter focus", (_, d) => api.focus(d.id))
        .on("mouseleave blur", () => api.focus(api.pinned))
        .on("click", (_, d) => onSelect && onSelect(d.id))
        .on("keydown", (event, d) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          if (onSelect) onSelect(d.id);
        });
    }

    /* Zoom is d3's, and it is the reason the whole drawing sits inside one <g>
       rather than being positioned directly. */
    let zoom = null;
    if (interactive) {
      zoom = d3
        .zoom()
        .scaleExtent([0.4, 2.5])
        .on("zoom", (event) => view.attr("transform", event.transform));
      root.call(zoom).on("dblclick.zoom", null);
    }

    const api = {
      pinned: focus,

      /** Dim everything that is not on this node's line of descent. */
      focus(id) {
        if (!id) {
          node.classed("is-dim", false).classed("is-lit", false);
          edge.classed("is-dim", false).classed("is-lit", false);
          return;
        }
        const { ancestors, descendants } = relatives(model.nodes, id);
        const lit = new Set([id, ...ancestors, ...descendants]);
        node.classed("is-lit", (d) => d.id === id);
        node.classed("is-dim", (d) => !lit.has(d.id));
        edge.classed("is-lit", (d) => lit.has(d.child) && (!d.parent || lit.has(d.parent)));
        edge.classed("is-dim", (d) => !(lit.has(d.child) && (!d.parent || lit.has(d.parent))));
      },

      pin(id) {
        api.pinned = id;
        api.focus(id);
      },

      fit() {
        if (!zoom) return;
        root.call(zoom.transform, d3.zoomIdentity);
      },
    };

    if (focus) api.focus(focus);
    return api;
  }

  /* ---- The same model, as text ------------------------------------------
     Not a courtesy copy: this is what a screen reader gets, what prints, and
     what is on the page when d3 does not load. It reads the same array the
     diagram does, so the two cannot describe different pedigrees. */

  /** Nested <ul> of everything upstream of `id`, deepest ancestor outermost. */
  function ancestryList(list, id) {
    const byId = new Map(list.map((n) => [n.id, n]));

    const build = (nodeId, seen) => {
      const node = byId.get(nodeId);
      if (!node) return null;
      const li = document.createElement("li");

      const name = document.createElement("span");
      name.className = "lin-list-name" + (node.population ? " is-population" : "");
      name.textContent = node.name;
      li.append(name);

      const edges = (node.parents || []).filter((p) => !p.of || byId.has(p.of));
      if (!edges.length) return li;

      const ul = document.createElement("ul");
      edges.forEach((p) => {
        const ev = EVIDENCE[p.relation === "selection" ? "selection" : p.evidence];
        if (!p.of) {
          const li2 = document.createElement("li");
          li2.innerHTML =
            '<span class="lin-list-name is-unknown">parent unassigned</span>' +
            `<span class="lin-list-ev">${p.note || "not recorded"}</span>`;
          ul.append(li2);
          return;
        }
        if (seen.has(p.of)) {
          const li2 = document.createElement("li");
          li2.innerHTML = `<span class="lin-list-name">${byId.get(p.of).name}</span> <span class="lin-list-ev">${ev.label}, as above</span>`;
          ul.append(li2);
          return;
        }
        const child = build(p.of, new Set([...seen, p.of]));
        if (!child) return;
        const tag = document.createElement("span");
        tag.className = "lin-list-ev";
        tag.textContent = p.role === "seed" || p.role === "pollen"
          ? `${p.role} parent · ${ev.label}`
          : ev.label;
        child.insertBefore(tag, child.firstChild.nextSibling);
        ul.append(child);
      });
      li.append(ul);
      return li;
    };

    const ul = document.createElement("ul");
    ul.className = "lin-list";
    const root = build(id, new Set([id]));
    if (root) ul.append(root);
    return ul;
  }

  return { layout, relatives, subgraph, draw, ancestryList, NODE_W, NODE_H };
})();
