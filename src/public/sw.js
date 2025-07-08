const CACHE_NAME = "story-app-cache-v5";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/images/user.png",
  "/images/icon-512.png",
  "/styles.css",
  "/home.css",
  "/app.css",
  "/app.bundle.js",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        urlsToCache.map((url) =>
          fetch(new Request(url, { cache: "reload" }))
            .then((res) => {
              if (!res.ok) throw new Error(`Gagal fetch ${url}`);
              return cache.put(url, res);
            })
            .catch(() => {
              console.warn("Tidak berhasil cache:", url);
            })
        )
      )
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      const url = request.url;

      if (
        url.includes("story-api.dicoding.dev/images/") ||
        url.includes("tile.openstreetmap.org")
      ) {
        return fetch(request)
          .then((res) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, res.clone());
              return res;
            });
          })
          .catch(() => caches.match("/images/user.png"));
      }

      return fetch(request).catch(() => {
        if (request.destination === "document") {
          return caches.match("/index.html");
        }
        if (request.destination === "script") {
          return caches.match("/app.bundle.js");
        }
        if (request.destination === "style") {
          return caches.match("/app.css") || caches.match("/styles.css");
        }
        return new Response("Offline", { status: 503 });
      });
    })
  );
});

self.addEventListener("push", (event) => {
   event.waitUntil(
    (async () => {
      let data = {
        title: "Notifikasi",
        options: {
          body: "Pesan masuk",
        },
      };

      try {
        if (event.data) {
          try {
            data = event.data.json();
          } catch {
            const fallbackText = await event.data.text();
            data = {
              title: "Notifikasi",
              options: {
                body: fallbackText,
              },
            };
          }
        }
      } catch {}

      self.registration.showNotification(data.title, data.options);
    })()
  );
});
