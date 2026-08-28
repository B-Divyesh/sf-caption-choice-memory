const CACHE = "caption-choice-memory-v3";
const BUILT_ASSETS = [];
const SHELL = [
  "/",
  "/demo",
  "/privacy",
  "/terms",
  "/favicon.svg",
  "/assets/hero-control-board-768.webp",
  "/assets/hero-control-board.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all([...SHELL, ...BUILT_ASSETS].map(async (url) => {
      const response = await fetch(new Request(url, { cache: "reload" }));
      if (!response.ok) throw new Error(`Could not cache ${url}`);
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      if (event.request.mode === "navigate") return caches.match("/");
      return Response.error();
    }
  })());
});
