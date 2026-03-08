const CACHE_NAME = "cga-pwa-v21"; // Versiyonu artırdık

const CORE_FILES = [
  "/",
  "/index.html",
  "/site.html",
  "/sitemobil.html",
  "/olaylar.html",
  "/manifest.json",
  "/logo.png",
  "/sablon.pdf",
  
  // --- Ana İkonlar ---
  "/icon-120.png",
  "/icon-152.png",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png",
  
  // --- Apple İkon Seti (iPhone 13 Uyumluluğu İçin) ---
  "/apple-icon-57x57.png",
  "/apple-icon-60x60.png",
  "/apple-icon-72x72.png",
  "/apple-icon-76x76.png",
  "/apple-icon-114x114.png",
  "/apple-icon-120x120.png",
  "/apple-icon-144x144.png",
  "/apple-icon-152x152.png",
  "/apple-icon-180x180.png",
  "/apple-icon-precomposed.png",
  "/apple-icon.png",

  // --- Android İkon Seti ---
  "/android-icon-36x36.png",
  "/android-icon-48x48.png",
  "/android-icon-72x72.png",
  "/android-icon-96x96.png",
  "/android-icon-144x144.png",
  "/android-icon-192x192.png",

  // --- Windows & Favicon ---
  "/ms-icon-70x70.png",
  "/ms-icon-144x144.png",
  "/ms-icon-150x150.png",
  "/ms-icon-310x310.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-96x96.png",
  "/favicon.ico"
];

// 🔹 INSTALL: Dosyaları Önbelleğe Al
self.addEventListener("install", (event) => {
  console.log("[SW] Install: Tüm dosyalar önbelleğe alınıyor.");
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
});

// 🔹 ACTIVATE: Eski Cache'leri Temizle
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate: Eski sürüm dosyaları siliniyor.");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 🔹 FETCH: Önce Şebeke, Hata Varsa Cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Geçerli bir yanıt geldiyse cache'e kopyasını at
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // İnternet yoksa hafızadan getir
  );
});

// 🔹 MESSAGE: Manuel Güncelleme Tetikleyici
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

