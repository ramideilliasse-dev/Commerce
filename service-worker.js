 const CACHE_NAME = "toma-cache-v2";

const urlsToCache = [
"/",
"/index.html",
"/offline.html",
"/manifest.json"
];

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))

);

self.skipWaiting();

});

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => {

if(key !== CACHE_NAME){
return caches.delete(key);
}

})

);

})

);

self.clients.claim();

});

self.addEventListener("fetch", event => {

event.respondWith(

fetch(event.request)

.then(response => {

const clone = response.clone();

caches.open(CACHE_NAME)
.then(cache => cache.put(event.request, clone));

return response;

})

.catch(async () => {

const cached = await caches.match(event.request);

return cached || caches.match("/offline.html");

})

);

});
