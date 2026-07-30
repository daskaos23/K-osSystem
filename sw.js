/* K-OS — Service Worker der vereinten App
   Precache der kompletten Suite (Shell + vier Linsen) fuer Offline-Start.
   Share-Target ("Teilen mit -> K-OS") legt Dateien in IndexedDB ab und
   oeffnet die Files-Linse. Dropbox-/Meta-Aufrufe werden NIE gecacht. */

const CACHE = 'kos-suite-v10';
const SHELL = [
  './',
  './index.html',
  './files.html',
  './studio.html',
  './draw.html',
  './vektor.html',
  './linse.html',
  './manifest.json',
  './brand-wordmark.png',
  './brand-mark.png',
  './brand-mark-white.png',
  './brand-sign.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Mini-IDB (gleiche DB wie K-OS Files: "kosfiles", Store "shared") */
function idbPutShared(key, val) {
  return new Promise((res, rej) => {
    const req = indexedDB.open('kosfiles', 1);
    req.onupgradeneeded = () => {
      const d = req.result;
      ['kv', 'thumbs', 'files', 'oplog', 'shared'].forEach(s => {
        if (!d.objectStoreNames.contains(s)) d.createObjectStore(s);
      });
    };
    req.onsuccess = () => {
      const d = req.result;
      const t = d.transaction('shared', 'readwrite');
      t.objectStore('shared').put(val, key);
      t.oncomplete = () => { d.close(); res(); };
      t.onerror = () => { d.close(); rej(t.error); };
    };
    req.onerror = () => rej(req.error);
  });
}

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Share-Target: POST mit Dateien entgegennehmen -> Files-Linse oeffnen */
  if (e.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const files = form.getAll('files') || [];
        let i = 0;
        for (const f of files) {
          if (f && f.name) {
            await idbPutShared('s' + Date.now() + '_' + (i++), {
              name: f.name, type: f.type || '', ts: Date.now(), blob: f
            });
          }
        }
      } catch (err) { /* still weiterleiten */ }
      return Response.redirect('./index.html?share=1', 303);
    })());
    return;
  }

  // Dropbox-API + OAuth + Meta niemals cachen — immer live
  if (url.hostname.endsWith('dropboxapi.com') || url.hostname.endsWith('dropbox.com') ||
      url.hostname.endsWith('facebook.com')) {
    return; // Browser-Standardverhalten
  }

  // Nur GET behandeln
  if (e.request.method !== 'GET') return;

  // App-Shell + Fonts: Cache-first mit Netzwerk-Fallback und Nachlegen
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        const cacheable = res.ok && (
          url.origin === location.origin ||
          url.hostname === 'fonts.googleapis.com' ||
          url.hostname === 'fonts.gstatic.com'
        );
        if (cacheable) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
    })
  );
});
