// clock-designs.js
// Registry of clock designs. Each design is { id, mount(container), update(h, m, s) }.
// mount() builds DOM ONCE. update() only ever toggles class/opacity/transform
// on nodes that already exist — never adds/removes nodes on tick.
// Add new designs to CLOCK_DESIGNS in any order; the picker in clock.js
// selects one by date, it doesn't care how many exist.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeSkylineDesign() {
  let colRefs = []; // [h1, h2, m1, m2, s1, s2], each an array of 9 unit elements

  function mount(container) {
    container.classList.add("skyline-clock");
    container.innerHTML = "";

    const skyline = document.createElement("div");
    skyline.className = "skyline";
    container.appendChild(skyline);

    const clockwrap = document.createElement("div");
    clockwrap.className = "clockwrap";
    container.appendChild(clockwrap);

    const labels = document.createElement("div");
    labels.className = "labels";
    labels.innerHTML =
      '<div class="group-label">Hour</div>' +
      '<div class="group-label">Min</div>' +
      '<div class="group-label">Sec</div>';
    container.appendChild(labels);

    const groups = [
      { cls: "h", cols: 2 },
      { cls: "m", cols: 2 },
      { cls: "s", cols: 2 }
    ];

    colRefs = [];

    groups.forEach((g, gi) => {
      const groupEl = document.createElement("div");
      groupEl.className = "group";
      for (let c = 0; c < g.cols; c++) {
        const col = document.createElement("div");
        col.className = "col";

        const baseline = document.createElement("div");
        baseline.className = "baseline";
        col.appendChild(baseline);

        // Build all 9 units once. Each has a static "slot" background
        // and a "fill" overlay we fade/scale in via CSS class toggle.
        const units = [];
        for (let i = 0; i < 9; i++) {
          const unit = document.createElement("div");
          unit.className = "unit";
          const fill = document.createElement("div");
          fill.className = "fill " + g.cls;
          unit.appendChild(fill);
          col.appendChild(unit);
          units.push(unit);
        }

        col.dataset.value = -1;
        groupEl.appendChild(col);
        colRefs.push({ col, units });
      }
      clockwrap.appendChild(groupEl);
      if (gi < groups.length - 1) {
        const sep = document.createElement("div");
        sep.className = "sep";
        sep.innerHTML = "<span></span><span></span>";
        clockwrap.appendChild(sep);
      }
    });
  }

  function setColumn(entry, digit) {
    if (parseInt(entry.col.dataset.value, 10) === digit) return; // unchanged, do nothing
    entry.col.dataset.value = digit;
    entry.units.forEach((unit, i) => {
      unit.classList.toggle("lit", i < digit);
      if (!reduceMotion) {
        unit.style.transitionDelay = i < digit ? (i * 25) + "ms" : "0ms";
      }
    });
  }

  function update(h, m, s) {
    const digits = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];
    digits.forEach((d, i) => setColumn(colRefs[i], d));
  }

  return { id: "skyline-blocks", mount, update };
}

function makeLiquidDesign() {
  let colRefs = []; // [h1, h2, m1, m2, s1, s2], each { col, fill }

  function mount(container) {
    container.classList.add("liquid-clock");
    container.innerHTML = "";

    const clockwrap = document.createElement("div");
    clockwrap.className = "clockwrap liquid-wrap";
    container.appendChild(clockwrap);

    const labels = document.createElement("div");
    labels.className = "labels";
    labels.innerHTML =
      '<div class="group-label">Hour</div>' +
      '<div class="group-label">Min</div>' +
      '<div class="group-label">Sec</div>';
    container.appendChild(labels);

    const groups = [
      { cls: "h", cols: 2 },
      { cls: "m", cols: 2 },
      { cls: "s", cols: 2 }
    ];

    colRefs = [];

    groups.forEach((g, gi) => {
      const groupEl = document.createElement("div");
      groupEl.className = "group";
      for (let c = 0; c < g.cols; c++) {
        const tube = document.createElement("div");
        tube.className = "tube";

        const fill = document.createElement("div");
        fill.className = "tube-fill " + g.cls;
        fill.style.setProperty("--level", 0);

        const wave = document.createElement("div");
        wave.className = "tube-wave";
        fill.appendChild(wave);

        tube.appendChild(fill);
        tube.dataset.value = -1;
        groupEl.appendChild(tube);
        colRefs.push({ tube, fill });
      }
      clockwrap.appendChild(groupEl);
      if (gi < groups.length - 1) {
        const sep = document.createElement("div");
        sep.className = "sep";
        sep.innerHTML = "<span></span><span></span>";
        clockwrap.appendChild(sep);
      }
    });
  }

  function setTube(entry, digit) {
    if (parseInt(entry.tube.dataset.value, 10) === digit) return;
    entry.tube.dataset.value = digit;
    // Only ever change a CSS custom property + a transform-driven scale.
    // No layout thrash: fill height is done via transform:scaleY, not height.
    entry.fill.style.setProperty("--level", digit / 9);
  }

  function update(h, m, s) {
    const digits = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];
    digits.forEach((d, i) => setTube(colRefs[i], d));
  }

  return { id: "liquid-tubes", mount, update };
}

function makeStampDesign() {
  let digitEls = []; // 6 elements

  function mount(container) {
    container.classList.add("stamp-clock");
    container.innerHTML = "";

    const clockwrap = document.createElement("div");
    clockwrap.className = "clockwrap stamp-wrap";
    container.appendChild(clockwrap);

    const labels = document.createElement("div");
    labels.className = "labels";
    labels.innerHTML =
      '<div class="group-label">Hour</div>' +
      '<div class="group-label">Min</div>' +
      '<div class="group-label">Sec</div>';
    container.appendChild(labels);

    const groups = [2, 2, 2];
    digitEls = [];

    groups.forEach((cols, gi) => {
      const groupEl = document.createElement("div");
      groupEl.className = "group";
      for (let c = 0; c < cols; c++) {
        const stamp = document.createElement("div");
        stamp.className = "stamp-digit";
        // fixed slight per-column tilt, set once, so it reads as
        // "hand stamped" rather than perfectly machine aligned
        const tilt = (Math.random() * 6 - 3).toFixed(2);
        stamp.style.setProperty("--tilt", tilt + "deg");
        stamp.textContent = "0";
        stamp.dataset.value = -1;
        groupEl.appendChild(stamp);
        digitEls.push(stamp);
      }
      clockwrap.appendChild(groupEl);
      if (gi < groups.length - 1) {
        const sep = document.createElement("div");
        sep.className = "sep stamp-sep";
        sep.innerHTML = "<span></span><span></span>";
        clockwrap.appendChild(sep);
      }
    });
  }

  function setDigit(el, digit) {
    if (parseInt(el.dataset.value, 10) === digit) return;
    el.dataset.value = digit;
    el.textContent = digit;
    if (reduceMotion) return;
    // restart the CSS animation on every change by forcing a reflow
    el.classList.remove("stamp-hit");
    void el.offsetWidth;
    el.classList.add("stamp-hit");
  }

  function update(h, m, s) {
    const digits = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];
    digits.forEach((d, i) => setDigit(digitEls[i], d));
  }

  return { id: "ink-stamp", mount, update };
}

function makeShadowDesign() {
  let digitEls = [];
  let container = null;

  function mount(rootEl) {
    container = rootEl;
    container.classList.add("shadow-clock");
    container.innerHTML = "";

    const clockwrap = document.createElement("div");
    clockwrap.className = "clockwrap shadow-wrap";
    container.appendChild(clockwrap);

    const labels = document.createElement("div");
    labels.className = "labels";
    labels.innerHTML =
      '<div class="group-label">Hour</div>' +
      '<div class="group-label">Min</div>' +
      '<div class="group-label">Sec</div>';
    container.appendChild(labels);

    const groups = [2, 2, 2];
    digitEls = [];

    groups.forEach((cols, gi) => {
      const groupEl = document.createElement("div");
      groupEl.className = "group";
      for (let c = 0; c < cols; c++) {
        const d = document.createElement("div");
        d.className = "shadow-digit";
        d.textContent = "0";
        d.dataset.value = -1;
        groupEl.appendChild(d);
        digitEls.push(d);
      }
      clockwrap.appendChild(groupEl);
      if (gi < groups.length - 1) {
        const sep = document.createElement("div");
        sep.className = "sep";
        sep.innerHTML = "<span></span><span></span>";
        clockwrap.appendChild(sep);
      }
    });
  }

  function update(h, m, s) {
    const digits = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];
    digits.forEach((d, i) => {
      const el = digitEls[i];
      if (parseInt(el.dataset.value, 10) !== d) {
        el.dataset.value = d;
        el.textContent = d;
      }
    });

    // Stylized sun position across the day (not astronomically exact —
    // just enough to make the shadow visibly drift as the day goes on).
    // One setProperty per tick on the container; children inherit the
    // custom property, so this is a single cheap paint update, no layout.
    const dayFrac = (h * 3600 + m * 60 + s) / 86400;
    const theta = dayFrac * Math.PI * 2 - Math.PI / 2; // noon ≈ overhead
    const elevation = Math.max(0.08, Math.sin(theta) * 0.5 + 0.5); // 0..1, low at night
    const offsetX = (Math.cos(theta) * 26).toFixed(1);
    const length = (10 + (1 - elevation) * 46).toFixed(1);
    const hue = 25 + elevation * 15; // warmer by day, cooler-ish at low elevation

    container.style.setProperty("--shadow-x", offsetX + "px");
    container.style.setProperty("--shadow-len", length + "px");
    container.style.setProperty("--shadow-hue", hue.toFixed(0));
    container.style.setProperty("--shadow-alpha", (0.25 + (1 - elevation) * 0.35).toFixed(2));
  }

  return { id: "shadow-cast", mount, update };
}

const CLOCK_DESIGNS = [
  makeSkylineDesign(),
  makeLiquidDesign(),
  makeStampDesign(),
  makeShadowDesign()
];