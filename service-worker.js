const CACHE_NAME = "five-card-bura-v2.130b.1";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=2.130b.1",
  "./app.js?v=2.130b.1",
  "./supabase-config.js?v=2.130b.1",
  "./sync-core.js?v=2.130b.1",
  "./labels.js?v=2.130b.1",
  "./manifest.webmanifest",
  "./icon.svg"
];
const CARD_FILES = [
  "card-back",
  ...["clubs", "diamonds", "hearts", "spades"].flatMap((suit) =>
    ["6", "7", "8", "9", "10", "j", "q", "k", "a"].map((rank) => `${suit}-${rank}`)
  )
].map((name) => `./assets/cards/${name}.svg`);
const FONT_FILES = [
  "alk-sanet-webfont.ttf",
  "alkdots-webfont.ttf",
  "archyedt-bold-webfont.ttf",
  "arial-geo-webfont.ttf",
  "BPG%20Classic%20Black%20Caps.ttf",
  "BPG%20SF%20DG.ttf",
  "BPG%20Square%2038%20Caps.ttf",
  "BPG%20Square%2038.ttf",
  "bpg-glaho-bold-webfont.ttf",
  "bpg-glaho-web-webfont.ttf",
  "bpg-web-002-caps-webfont.ttf"
].map((name) => `./assets/fonts/${name}`);
const DESIGN_FILES = ["./assets/design/ornament1%201.svg"];
const CARD_SOUND_FILES = Array.from(
  { length: 22 },
  (_, index) => `./assets/sound/cardonmat/CM${index + 1}.wav`
);
const IMMEDIATE_SOUND_FILES = [
  ...CARD_SOUND_FILES,
  "./assets/sound/entergame.mp3",
  "./assets/sound/ES_Games,%20Misc,%20Playing%20Cards,%20Card%20Deck,%20Dealing%20Cards%20On%20Cardboard%2001%20-%20Epidemic%20Sound.mp3",
  "./assets/sound/increaseoffer.wav",
  "./assets/sound/turn-warning-loop.mp3"
];
const BACKGROUND_SOUND_FILES = [
  "./assets/sound/matchwon.wav",
  "./assets/sound/matchlost.wav",
  "./assets/sound/pointsup.wav",
  "./assets/sound/pointsdown.wav",
  "./assets/sound/dealwin.mp3"
];
const PRECACHE_FILES = [
  ...APP_FILES,
  ...CARD_FILES,
  ...FONT_FILES,
  ...DESIGN_FILES,
  ...IMMEDIATE_SOUND_FILES
];

async function cacheMissingFiles(files) {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(files.map(async (file) => {
    if (await cache.match(file)) return;
    const response = await fetch(file);
    if (response.ok) await cache.put(file, response);
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_FILES))
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

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_BACKGROUND_SOUNDS") return;
  event.waitUntil(cacheMissingFiles(BACKGROUND_SOUND_FILES));
});
