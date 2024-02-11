const cacheDataName = "realtime-clipboard-cache-v4";

const staticAssets = [
  // "/static/js/main.272abdc0.js",
  // "/static/css/main.72ee3a12.css",
  "/static/js/bundle.js",
  "/assets/clipboard-logo.webp",
  "/assets/clipboard.webp",
  "/assets/no-internet.webp",
  "/assets/avatar-Alkaison.webp",
  "/assets/avatar-Uzumaki.webp",
  "/assets/moon.webp",
  "/assets/sun.webp",
  "/assets/copy.svg",
  "/favicon/android-chrome-192x192.png",
  "/favicon/android-chrome-512x512.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/favicon-16x16.png",
  "/favicon/favicon-32x32.png",
  "/favicon/favicon.ico",
  "/favicon/site.webmanifest",
  "/manifest.json",
  "/index.html",
  "/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheDataName).then((cache) => {
      return cache.addAll(staticAssets);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== cacheDataName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Prioritize network for fetches with a fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Check if request is for an asset in the cache
    caches.match(event.request).then((cachedResponse) => {
      // Cache hit (return cached response)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Network request with caching
      return fetch(event.request).then((fetchResponse) => {
        const clonedResponse = fetchResponse.clone(); // Clone for caching before use

        caches.open(cacheDataName).then((cache) => {
          cache.put(event.request, clonedResponse); // Cache the cloned response
        });

        return fetchResponse; // Return the original response for immediate use
      });
    })
  );
});
