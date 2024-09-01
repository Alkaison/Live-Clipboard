const cacheDataName = "realtime-clipboard-v1-3-1";

const staticAssets = [
  "/assets/index.js",
  "/assets/index.css",
  "/assets/clipboard-logo.webp",
  "/assets/clipboard.webp",
  "/assets/no-internet.webp",
  "/assets/avatar-Alkaison.webp",
  "/assets/avatar-Uzumaki.webp",
  "/assets/cloud-computing.png",
  "/assets/feedbackAvatar.png",
  "/assets/network.webp",
  "/assets/moon.webp",
  "/assets/sun.webp",
  "/assets/upload.png",
  "/assets/copy.svg",
  "/assets/right-arrow.svg",
  "/assets/release-icon.svg",
  "/assets/major-update-icon.svg",
  "/assets/alpha-icon.svg",
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

  // Inform clients about the update
  self.clients.claim().then(() => {
    self.clients.matchAll({ type: "window" }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
      });
    });
  });
});

// Prioritize network for fetches with a fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          // update the cache with a clone of the network response
          const responseClone = response.clone();
          caches.open(cacheDataName).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(function () {
          console.error("ServiceWorker fetch failed.");
        });
      // prioritize cached response over network
      return cachedResponse || networkFetch;
    })
  );
});
