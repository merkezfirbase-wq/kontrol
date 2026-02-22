const CACHE_NAME = "cga-pwa-v9"; // Her güncellemede artır
const CORE_FILES = [
  "/",
  "/index.html",
  "/site.html",
  "/manifest.json",
  "/logo.png",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png"
];

// 🔹 INSTALL
self.addEventListener("install", (event) => {
  console.log("[SW] Install başladı");
  self.skipWaiting(); // SW hemen aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
});

// 🔹 ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Eski cache silindi:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 🔹 FETCH: Network-first, fallback cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 🔹 MESSAGE: Yeni SW yüklendiğinde client’a haber ver
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});



