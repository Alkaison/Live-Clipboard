// cache app name with version stages
const cacheData = "realtime-clipboard-cache-v2";

// Add the URLs of the Google Fonts you want to cache here
const fontUrls = [
  "https://fonts.googleapis.com/css2?family=Rubik&display=swap",
  "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
];

// store the files into cache storage
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll([
        "/static/js/main.272abdc0.js",
        "/static/css/main.72ee3a12.css",
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
        "/index.html",
        "/",
      ]);

      // Cache Google Fonts
      fontUrls.forEach((fontUrl) => {
        fetch(new Request(fontUrl, { mode: "cors" })) // Use 'cors' mode for Google Fonts
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${fontUrl}`);
            }
            cache.put(fontUrl, response);
          })
          .catch((error) => console.error(error));
      });
    })
  );

  this.skipWaiting();
});

// remove old caches when a new service worker is activated
this.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheData).map((key) => caches.delete(key))
      );
    })
  );
});

// fetch files from cache storage
this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((res) => {
        if (res) {
          return res;
        }
        return fetch(event.request).catch(() => caches.match("/offline.html"));
      })
    );
  }
});
