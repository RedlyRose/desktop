/* Storage layer.
 *
 * Two seams, both async on purpose so swapping the local dummy backend for
 * Cloudflare later is a drop-in change, not a rewrite:
 *
 *   DB    -> records   (localStorage now, D1 via /api/... later)
 *   Blobs -> raw media (IndexedDB now, R2 via /api/media/... later)
 */

const DB = (() => {
  const KEY = 'webos.db';
  const load = () => JSON.parse(localStorage.getItem(KEY) || '{}');
  const save = (d) => localStorage.setItem(KEY, JSON.stringify(d));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  return {
    async list(table) {
      return load()[table] || [];
    },

    async get(table, id) {
      return (load()[table] || []).find((r) => r.id === id) || null;
    },

    async put(table, row) {
      const db = load();
      const rows = db[table] || (db[table] = []);
      if (!row.id) row.id = uid();
      row.updated_at = Date.now();
      const i = rows.findIndex((r) => r.id === row.id);
      if (i < 0) { row.created_at = row.updated_at; rows.push(row); } else { rows[i] = { ...rows[i], ...row }; }
      save(db);
      return row;
    },

    async del(table, id) {
      const db = load();
      db[table] = (db[table] || []).filter((r) => r.id !== id);
      save(db);
    },

    // Small key/value side channel for settings, wallpaper, window layout, etc.
    setting(k, v) {
      const db = load();
      const s = db.settings || (db.settings = {});
      if (v === undefined) return s[k];
      s[k] = v;
      save(db);
      return v;
    },
  };
})();

const Blobs = (() => {
  const NAME = 'webos.blobs';
  let dbp;

  const open = () => (dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open(NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));

  const tx = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const req = fn(db.transaction('files', mode).objectStore('files'));
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  };

  const api = {
    put: (key, blob) => tx('readwrite', (s) => s.put(blob, key)),
    get: (key) => tx('readonly', (s) => s.get(key)),
    del: (key) => tx('readwrite', (s) => s.delete(key)),
    keys: () => tx('readonly', (s) => s.getAllKeys()),
    async url(key) {
      const blob = await api.get(key);
      return blob ? URL.createObjectURL(blob) : null;
    },
  };

  return api;
})();
