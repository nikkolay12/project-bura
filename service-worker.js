const CACHE_NAME = "five-card-bura-v85";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=85",
  "./app.js?v=85",
  "./supabase-config.js?v=85",
  "./labels.js?v=85",
  "./manifest.webmanifest",
  "./icon.svg"
];
const DESIGN_FILES = ["./assets/design/ornament1%201.svg"];
const CARD_FILES = [
  "hearts-6", "hearts-7", "hearts-8", "hearts-9", "hearts-10", "hearts-j", "hearts-q", "hearts-k", "hearts-a",
  "diamonds-6", "diamonds-7", "diamonds-8", "diamonds-9", "diamonds-10", "diamonds-j", "diamonds-q", "diamonds-k", "diamonds-a",
  "clubs-6", "clubs-7", "clubs-8", "clubs-9", "clubs-10", "clubs-j", "clubs-q", "clubs-k", "clubs-a",
  "spades-6", "spades-7", "spades-8", "spades-9", "spades-10", "spades-j", "spades-q", "spades-k", "spades-a",
  "card-back"
].map((name) => `./assets/cards/${name}.svg`);
const SOUND_FILES = Array.from(
  { length: 22 },
  (_, index) => `./assets/sound/cardonmat/CM${index + 1}.wav`
).concat(
  "./assets/sound/dealwin.mp3",
  "./assets/sound/increaseoffer.wav",
  "./assets/sound/entergame.mp3",
  "./assets/sound/matchwon.wav",
  "./assets/sound/matchlost.wav"
);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([...APP_FILES, ...CARD_FILES, ...SOUND_FILES, ...DESIGN_FILES]))
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
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
