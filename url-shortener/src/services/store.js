const KEY = "us_store_v1";

let state = { urls: {} }; // code -> entry

try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = JSON.parse(raw);
} catch {}

const save = () => localStorage.setItem(KEY, JSON.stringify(state));

export const Store = {
  getAll: () => state.urls,
  get: (code) => state.urls[code] || null,
  exists: (code) => !!state.urls[code],
  put: (entry) => { state.urls[entry.code] = entry; save(); },
  remove: (code) => { delete state.urls[code]; save(); },
  replace: (urls) => { state.urls = urls; save(); }
};
