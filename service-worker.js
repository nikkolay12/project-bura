const CACHE_NAME = "five-card-bura-v2.125b.7";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=2.125b.7",
  "./app.js?v=2.125b.7",
  "./supabase-config.js?v=2.125b.7",
  "./sync-core.js?v=2.125b.7",
  "./labels.js?v=2.125b.7",
  "./manifest.webmanifest",
  "./icon.svg"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone())));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)));
        return response;
      });
    })
  );
});
