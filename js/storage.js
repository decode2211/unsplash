// storage.js
// Small shared storage helper so every module (clock, wallpaper, search)
// reads/writes preferences the same way instead of each rolling its own.
// Uses localStorage — persists per-extension, needs no manifest permission.

const AuraStorage = (() => {
  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  return { get, set, remove };
})();