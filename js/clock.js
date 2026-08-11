document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById('clock');
  if (!clock) return;

  clock.classList.add('skyline-clock');

  const skyline = document.createElement('div');
  skyline.className = 'skyline';
  clock.appendChild(skyline);

  const clockwrap = document.createElement('div');
  clockwrap.className = 'clockwrap';
  clock.appendChild(clockwrap);

  const labels = document.createElement('div');
  labels.className = 'labels';
  labels.innerHTML =
    '<div class="group-label">Hour</div>' +
    '<div class="group-label">Min</div>' +
    '<div class="group-label">Sec</div>';
  clock.appendChild(labels);

  const groups = [
    { cls: 'h', cols: 2 },
    { cls: 'm', cols: 2 },
    { cls: 's', cols: 2 }
  ];

  const colRefs = [];

  groups.forEach((g, gi) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'group';
    for (let c = 0; c < g.cols; c++) {
      const col = document.createElement('div');
      col.className = 'col';
      col.dataset.cls = g.cls;
      col.dataset.value = -1;
      const baseline = document.createElement('div');
      baseline.className = 'baseline';
      col.appendChild(baseline);
      groupEl.appendChild(col);
      colRefs.push(col);
    }
    clockwrap.appendChild(groupEl);
    if (gi < groups.length - 1) {
      const sep = document.createElement('div');
      sep.className = 'sep';
      sep.innerHTML = '<span></span><span></span>';
      clockwrap.appendChild(sep);
    }
  });

  function renderColumn(col, digit) {
    if (parseInt(col.dataset.value, 10) === digit) return;
    col.dataset.value = digit;

    [...col.querySelectorAll('.block,.slot')].forEach(n => n.remove());

    for (let i = 0; i < 9; i++) {
      if (i < digit) {
        const b = document.createElement('div');
        b.className = 'block ' + col.dataset.cls;
        b.style.animationDelay = (i * 35) + 'ms';
        col.appendChild(b);
      } else {
        const s = document.createElement('div');
        s.className = 'slot';
        col.appendChild(s);
      }
    }
  }

  function tick() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const digits = [
      Math.floor(h / 10), h % 10,
      Math.floor(m / 10), m % 10,
      Math.floor(s / 10), s % 10
    ];

    digits.forEach((d, i) => renderColumn(colRefs[i], d));
  }

  tick();
  setInterval(tick, 1000);
});