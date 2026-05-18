 self.addEventListener("install", (e) => {
  console.log("App installée");
});

self.addEventListener("fetch", (e) => {});
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.map(key => caches.delete(key)))
)
)
})
