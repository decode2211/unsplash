// clock-engine.js
// Owns exactly one job: call back once per real second, on time, forever.
// Does not know about designs, DOM, or rendering.

const ClockEngine = (() => {
  let activeDesign = null;
  let timerId = null;

  function msToNextSecond() {
    return 1000 - (Date.now() % 1000);
  }

  function tick() {
    const now = new Date();
    if (activeDesign && typeof activeDesign.update === "function") {
      activeDesign.update(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    // Re-schedule from Date.now() each time (not a fixed setInterval),
    // so a throttled/backgrounded tab self-corrects instead of drifting
    // or firing a burst of catch-up ticks.
    timerId = setTimeout(tick, msToNextSecond());
  }

  function start(design) {
    stop();
    activeDesign = design;
    tick(); // fire immediately so the clock isn't blank for up to 1s on load
  }

  function stop() {
    if (timerId) clearTimeout(timerId);
    timerId = null;
  }

  return { start, stop };
})();