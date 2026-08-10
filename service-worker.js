// NutriSuivi service-worker — stratégie network-first pour toujours servir la dernière version.
// À copier dans le dépôt GitHub `nutrisuivi/` à côté d'index.html.
// Le numéro de cache change à chaque build ; le SW s'active immédiatement (skipWaiting).

const CACHE = "nutrisuivi-v2.3";
const CORE = ["./", "./index.html", "./app.bundle.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

// Network-first pour les ressources de l'app (HTML/JS/CSS/manifest) ; cache en secours hors-ligne.
// Ne touche pas aux requêtes Firebase / Anthropic / autres origines.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith((async () => {
    try {
      const fresh = await fetch(req, { cache: "no-store" });
      if (fresh && fresh.ok) {
        const copy = fresh.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
