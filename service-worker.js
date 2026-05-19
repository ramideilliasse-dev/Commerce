 const CACHE_NAME = "toma-v1"

const urlsToCache = [

"/",
"/index.html",
"/offline.html",
"/styles.css",
"/firebase.js",
"/manifest.json"

]

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache=>cache.addAll(urlsToCache))

)

})

self.addEventListener("fetch",event=>{

event.respondWith(

fetch(event.request)

.catch(()=>{

return caches.match(event.request)
.then(response=>{

return response || caches.match("/offline.html")

})

})

)

})
