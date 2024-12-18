const staticDevCoffee = "chemgrid-Ashutosh_dev";
const assets = [
    "index.html",
    "PT.json",
    "manifest.json",
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            return cache.addAll(assets);
        }).catch(error => {
            console.error('Caching failed:', error);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== staticDevCoffee) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(response => {
            // Check if we found a match in the cache
            if (response) {
                return response;
            }

            // If no match is found, try fetching it from the network
            return fetch(fetchEvent.request).then(networkResponse => {
                // Optionally cache the new response
                return caches.open(staticDevCoffee).then(cache => {
                    cache.put(fetchEvent.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(error => {
            console.error('Fetch failed:', error);
            // Optionally provide a fallback response
            return caches.match('/fallback.html');
        })
    );
});
