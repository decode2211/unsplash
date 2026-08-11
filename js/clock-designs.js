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

const CLOCK_DESIGNS = [
  makeSkylineDesign()
  // tomorrow: makeHandwrittenDesign(), makeLiquidTubeDesign(), etc.
];