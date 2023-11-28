const CACHE_NAME = 'weabur-data';

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/api/cityLocation') ||
    event.request.url.includes('/api/getCityCodeList') ||
    event.request.url.includes('/api/weather')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      }),
    );
  }
});
