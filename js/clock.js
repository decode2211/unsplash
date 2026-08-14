// clock.js
// Picks which design shows today, mounts it into #clock, hands ticking off to ClockEngine.
// Deterministic by date — no storage, nothing to get out of sync. If AuraTab isn't
// open at midnight, it just picks correctly whenever it's next opened.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("clock");
  if (!container || CLOCK_DESIGNS.length === 0) return;

  const dayIndex = dayOfEpoch(new Date());
  const design = CLOCK_DESIGNS[dayIndex % CLOCK_DESIGNS.length];

  container.classList.add("clock-frame");
  design.mount(container);
  ClockEngine.start(design);
});

// Whole numbers of days since epoch, in local time. Using a plain day count
// (not just the date string) makes rotation order stable and predictable —
// day N always maps to the same design index.
function dayOfEpoch(date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86400000);
}