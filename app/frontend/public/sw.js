// pickyeat service worker.
// Strategy:
//   - HTML / app shell        → network-first, fall back to cache
//   - Static assets (icons, manifest, font CSS) → stale-while-revalidate
//   - API responses           → network-only (no cache, picks must be fresh)
//
// Bump VERSION to invalidate previous caches on deploy.

const VERSION = "v1";
const STATIC_CACHE = `pickyeat-static-${VERSION}`;
const SHELL_CACHE = `pickyeat-shell-${VERSION}`;

const STATIC_ASSETS = [
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
  "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("pickyeat-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // Skip cross-origin and API
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // HTML — network-first
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((res) => res ?? caches.match("/")))
    );
    return;
  }

  // Static — stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((res) => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached ?? fetchPromise;
    })
  );
});
