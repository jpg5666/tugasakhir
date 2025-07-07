const CACHE_NAME = "story-app-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/images/user.png",
  "/images/icon-512.png",
  "/styles.css",
  "/home.css",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        urlsToCache.map((url) =>
          fetch(url)
            .then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch ${url}`);
              return cache.put(url, res.clone());
            })
            .catch(() => {})
        )
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      const url = event.request.url;

      if (
        url.includes("story-api.dicoding.dev/images/") ||
        url.includes("tile.openstreetmap.org")
      ) {
        return caches.open(CACHE_NAME).then((cache) =>
          fetch(event.request)
            .then((response) => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => caches.match("/images/user.png"))
        );
      }

      return fetch(event.request).catch(
        () =>
          new Response("<h1>Offline</h1>", {
            headers: { "Content-Type": "text/html" },
            status: 200,
          })
      );
    })
  );
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const title = data.title || "Notifikasi";
  const options = data.options || { body: "Notifikasi baru diterima." };
  event.waitUntil(self.registration.showNotification(title, options));
});
