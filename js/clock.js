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

  const GREETING_MOODS = ["casual", "motivational", "minimal", "witty"];

  const GREETING_LINES = {
    morning: {
      casual: ["Hope you slept well.", "Let's ease into the day.", "Coffee's calling.", "Fresh start, no pressure."],
      motivational: ["Time to make today count.", "Small steps, big momentum.", "Go build something worth remembering.", "Today's a clean page."],
      minimal: ["", "", ""],
      witty: ["The early bird thing is overrated, but here you are.", "Let's pretend mornings are our thing.", "Ambitious of you, opening a new tab this early."]
    },
    evening: {
      casual: ["Hope the day treated you well.", "Good time to slow down a bit.", "Almost through the day."],
      motivational: ["Still time to make progress.", "Finish the day strong.", "One more good decision before it ends."],
      minimal: ["", "", ""],
      witty: ["The night is young, unlike your sleep schedule.", "Prime time for good ideas and worse decisions.", "Evening: nature's plot twist."]
    }
  };

  // Mood changes every 6 hours, deterministically — not random per tab-open,
  // so it doesn't flicker between moods on every reload within the same window.
  function currentMood(date) {
    const slot = Math.floor(date.getTime() / (6 * 3600 * 1000));
    const hash = Math.abs((slot * 2654435761) % GREETING_MOODS.length);
    return GREETING_MOODS[hash];
  }

  function timeBucket(h) {
    return h < 12 ? "morning" : "evening";
  }

  // Picked once per page load, not per tick — so the line doesn't change
  // mid-session, only the morning/evening prefix does if the tab stays
  // open across that boundary.
  const mood = currentMood(new Date());
  const sessionTails = {};
  ["morning", "evening"].forEach((bucket) => {
    const pool = GREETING_LINES[bucket][mood];
    sessionTails[bucket] = pool[Math.floor(Math.random() * pool.length)];
  });

  let lastGreeting = "";
  function updateGreeting(h) {
    const bucket = timeBucket(h);
    const prefix = bucket === "morning" ? "Good morning" : "Good evening";
    const name = AuraStorage.get("userName", null);
    const tail = sessionTails[bucket];

    let text = name ? prefix + ", " + name : prefix;
    if (tail) text += ". " + tail;

    if (text !== lastGreeting) {
      lastGreeting = text;
      greetingEl.textContent = text;
    }
  }

  // First run only: ask what to call them, store it, never ask again.
  if (AuraStorage.get("userName", null) === null) {
    const entered = window.prompt("What should I call you?");
    if (entered && entered.trim()) {
      AuraStorage.set("userName", entered.trim());
    } else {
      // remember they were asked so we don't re-prompt every new tab
      AuraStorage.set("userName", "");
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