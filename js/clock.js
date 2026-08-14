// clock.js
// Picks which design shows today, mounts it into #clock, hands ticking off to ClockEngine.
// Deterministic by date — no storage, nothing to get out of sync. If AuraTab isn't
// open at midnight, it just picks correctly whenever it's next opened.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("clock");
  if (!container || CLOCK_DESIGNS.length === 0) return;

  const dayIndex = dayOfEpoch(new Date());
  const design = CLOCK_DESIGNS[dayIndex % CLOCK_DESIGNS.length];

  const greetingEl = document.createElement("div");
  greetingEl.id = "greeting";
  container.parentNode.insertBefore(greetingEl, container);

  let lastGreeting = "";
  function updateGreeting(h) {
    let text;
    if (h < 5) text = "Good night";
    else if (h < 12) text = "Good morning";
    else if (h < 17) text = "Good afternoon";
    else if (h < 21) text = "Good evening";
    else text = "Good night";
    if (text !== lastGreeting) {
      lastGreeting = text;
      greetingEl.textContent = text;
    }
  }

  // Wrap the design so the engine's single tick also refreshes the greeting.
  // clock-designs.js and clock-engine.js stay untouched.
  const wrappedDesign = {
    mount: (el) => design.mount(el),
    update(h, m, s) {
      design.update(h, m, s);
      updateGreeting(h);
    }
  };

  container.classList.add("clock-frame");
  wrappedDesign.mount(container);
  updateGreeting(new Date().getHours());
  ClockEngine.start(wrappedDesign);
});

// Whole numbers of days since epoch, in local time. Using a plain day count
// (not just the date string) makes rotation order stable and predictable —
// day N always maps to the same design index.
function dayOfEpoch(date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86400000);
}