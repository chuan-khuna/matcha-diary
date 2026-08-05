/* ==========================================================================
   Matcha Diary — taste rating bars
   One component, two modes:
     read   <span class="bar-track" data-value="4.5"></span>
     rate   <div class="axis" data-axis="umami" data-init="4.5"></div>
   Add data-removable to a rate host to give it a × control.
   There is no slider. The bar you read is the bar you click.
   ========================================================================== */
(function () {
  var CELLS = 5;   // ratings run 0-5; one cell per point, half-cell for the .5

  function esc(s) {
    return String(s).replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
  }

  function fill(track, v, preview) {
    Array.prototype.forEach.call(track.children, function (cell, i) {
      cell.className = 'bar-cell' +
        (v >= i + 1 ? ' on' : v > i ? ' half' : '') +
        (preview ? ' preview' : '');
    });
  }

  function cells(track) {
    for (var i = 0; i < CELLS; i++) track.appendChild(document.createElement('i'));
  }

  /* ---- Read-only ------------------------------------------------------ */
  function mountStatic(track) {
    cells(track);
    fill(track, parseFloat(track.dataset.value) || 0, false);
  }

  /* ---- Editable ------------------------------------------------------- */
  function mountInput(host) {
    var name = host.dataset.axis;
    var value = parseFloat(host.dataset.init) || 0;
    var removable = host.hasAttribute('data-removable');

    host.innerHTML =
      '<div class="axis-head">' +
        '<span class="bar-name">' + esc(name) + '</span>' +
        '<span class="axis-right">' +
          '<span class="axis-val"></span>' +
          (removable ? '<button class="axis-x" type="button" aria-label="Remove ' + esc(name) + '">×</button>' : '') +
        '</span>' +
      '</div>' +
      '<div class="bar-track bar-input" role="slider" tabindex="0" aria-label="' + esc(name) +
      '" aria-valuemin="0" aria-valuemax="' + CELLS + '"></div>';

    var track = host.querySelector('.bar-track');
    var out = host.querySelector('.axis-val');
    cells(track);

    if (removable) {
      host.querySelector('.axis-x').addEventListener('click', function () { host.remove(); });
    }

    function set(v) {
      value = Math.min(CELLS, Math.max(0, Math.round(v * 2) / 2));
      fill(track, value, false);
      out.textContent = value.toFixed(1);
      track.setAttribute('aria-valuenow', value);
      track.setAttribute('aria-valuetext', value.toFixed(1) + ' out of ' + CELLS);
    }

    // Which rating does this pointer position mean?
    // Left half of a cell is the .5, right half is the whole.
    function valueAt(e) {
      var cell = e.target.closest('.bar-cell');
      if (!cell) return null;
      var i = Array.prototype.indexOf.call(track.children, cell);
      var half = (e.clientX - cell.getBoundingClientRect().left) < cell.offsetWidth / 2;
      return i + (half ? 0.5 : 1);
    }

    track.addEventListener('mousemove', function (e) {
      var v = valueAt(e);
      if (v !== null) fill(track, v, true);
    });
    track.addEventListener('mouseleave', function () { fill(track, value, false); });

    track.addEventListener('click', function (e) {
      var v = valueAt(e);
      if (v !== null) set(v === value ? 0 : v);   // click the current value to clear it
    });

    track.addEventListener('keydown', function (e) {
      var step = { ArrowLeft: -0.5, ArrowDown: -0.5, ArrowRight: 0.5, ArrowUp: 0.5,
                   PageDown: -1, PageUp: 1 }[e.key];
      if (step) { e.preventDefault(); set(value + step); }
      else if (e.key === 'Home') { e.preventDefault(); set(0); }
      else if (e.key === 'End') { e.preventDefault(); set(CELLS); }
    });

    set(value);
    return host;
  }

  /* ---- Public: add a rated note to a container ------------------------ */
  function addAxis(container, name, init) {
    var host = document.createElement('div');
    host.className = 'axis';
    host.dataset.axis = name;
    host.dataset.init = init || 0;
    host.setAttribute('data-removable', '');
    container.appendChild(host);
    return mountInput(host);
  }

  window.MatchaRatings = { addAxis: addAxis, max: CELLS };

  document.querySelectorAll('.bar-track[data-value]').forEach(mountStatic);
  document.querySelectorAll('.axis[data-axis]').forEach(mountInput);
})();
