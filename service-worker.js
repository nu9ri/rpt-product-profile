const CACHE_NAME = "rpt-profile-mobile-v38-group-condition";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./app-icon-192-v38.png",
  "./app-icon-512-v38.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (url.hostname.includes("githubusercontent.com") ||
      url.hostname.includes("github.io")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
