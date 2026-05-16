const { cache } = require("react");

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("neon-tictactoe-v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./favicon.png",
      ]);
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }),
  );
});
