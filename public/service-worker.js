// Service Worker for Vending Solutions
const CACHE_NAME = 'vendingsolutions-v1';

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/og-image.jpg',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache Contentful responses for 30 minutes
const contentfulCache = (request, response) => {
  // Clone the response as it can only be consumed once
  const responseToCache = response.clone();
  
  caches.open(CACHE_NAME).then(cache => {
    const cacheKey = request.url;
    
    // Cache for 30 minutes
    const headers = new Headers(responseToCache.headers);
    headers.append('sw-fetched-on', new Date().getTime());
    headers.append('sw-cache-expires', new Date().getTime() + (30 * 60 * 1000));
    
    const cachedResponse = new Response(
      responseToCache.body, 
      {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      }
    );
    
    cache.put(cacheKey, cachedResponse);
  });
  
  return response;
};

// Check if response is expired
const isResponseExpired = (response) => {
  const fetchedOn = response.headers.get('sw-fetched-on');
  const cacheExpires = response.headers.get('sw-cache-expires');
  
  if (!fetchedOn || !cacheExpires) {
    return true;  // No timestamp, assume expired
  }
  
  return parseInt(cacheExpires) < new Date().getTime();
};

// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('contentful.com')) {
    return;
  }
  
  // Special handling for Contentful API requests
  if (event.request.url.includes('contentful.com')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // If we have a cached response that's not expired, use it
        if (cachedResponse && !isResponseExpired(cachedResponse)) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache the network response for future use
            if (response.ok) {
              return contentfulCache(event.request, response);
            }
            return response;
          })
          .catch(error => {
            // If we have any cached response, use it as fallback
            if (cachedResponse) {
              return cachedResponse;
            }
            throw error;
          });
      })
    );
    return;
  }
  
  // Standard stale-while-revalidate for other requests
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const networkFetch = fetch(event.request).then(response => {
        // Don't cache non-GET requests or failed responses
        if (event.request.method !== 'GET' || !response.ok) {
          return response;
        }
        
        // Clone the response to cache it for later
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(error => {
        console.error('Fetch failed:', error);
        // Try to serve from cache if network fails
        return cachedResponse;
      });
      
      // Return the cached response if we have one, otherwise wait for network
      return cachedResponse || networkFetch;
    })
  );
});

// Listen for messages (e.g., to clear cache)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('Cache cleared successfully');
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({
          type: 'CACHE_CLEARED'
        }));
      });
    });
  }
});
