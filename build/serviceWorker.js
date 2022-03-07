const Cache_Name = 'version-1.0.0';
const urlsToCache = ['index.html', 'offline.html'];

// in order to mitigate the errors, we do this because service worker is considered as this in serviceworker.js: 
const self = this;

// init the ServiceWorker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(Cache_Name)
            .then((cache) => {
                console.log("Opened the cache");

                return cache.addAll(urlsToCache)
            })
    )
})

// listen for the requests 
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'));
            })

    )
})

// activate the ServiceWorker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(Cache_Name);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))

    )
});