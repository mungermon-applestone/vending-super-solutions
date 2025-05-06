
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
  '/sitemap.xml',
  '/logo.png'
];

// Cache duration settings (in milliseconds)
const CACHE_SETTINGS = {
  contentful: 30 * 60 * 1000, // 30 minutes for Contentful content
  static: 24 * 60 * 60 * 1000, // 24 hours for static assets
  html: 1 * 60 * 60 * 1000 // 1 hour for HTML pages
};

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

// Determine if the current request is from a bot/crawler
const isBot = (request) => {
  const userAgent = request.headers.get('User-Agent') || '';
  return userAgent.toLowerCase().includes('bot') || 
         userAgent.toLowerCase().includes('crawler') || 
         userAgent.toLowerCase().includes('spider');
};

// Determine cache duration based on resource type
const getCacheDuration = (url, resourceType) => {
  if (url.includes('contentful.com')) {
    return CACHE_SETTINGS.contentful;
  }
  
  if (resourceType === 'document') {
    return CACHE_SETTINGS.html;
  }
  
  // Static assets get longer cache time
  if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    return CACHE_SETTINGS.static;
  }
  
  // Default to shorter cache time for other resources
  return CACHE_SETTINGS.html;
};

// Cache responses with the appropriate headers
const cacheResponse = (request, response, cacheKey) => {
  // Clone the response as it can only be consumed once
  const responseToCache = response.clone();
  const url = new URL(request.url);
  const resourceType = response.headers.get('Content-Type') || '';
  
  // Get the appropriate cache duration
  const cacheDuration = getCacheDuration(url.href, resourceType);
  
  caches.open(CACHE_NAME).then(cache => {
    // Add expiration headers
    const headers = new Headers(responseToCache.headers);
    headers.append('sw-fetched-on', new Date().getTime());
    headers.append('sw-cache-expires', new Date().getTime() + cacheDuration);
    
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

// Don't cache requests with authorization headers, crawler requests, or env config
const shouldNotCacheRequest = (request) => {
  return (
    request.headers.has('Authorization') || 
    request.headers.has('authorization') ||
    request.url.includes('env-config.js') ||
    isBot(request)
  );
};

// Network-first strategy for HTML and API requests
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache the successful response
      return cacheResponse(request, response, request);
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    console.log('Network request failed, falling back to cache', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || Promise.reject('No cached response available');
  }
};

// Cache-first strategy for static assets
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isResponseExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the new response
      return cacheResponse(request, networkResponse, request);
    }
    return networkResponse;
  } catch (error) {
    // If we got this far and still have a cached response, return it even if expired
    return cachedResponse || Promise.reject('Resource not in cache and network unavailable');
  }
};

// Stale-while-revalidate strategy for Contentful content
const staleWhileRevalidate = async (request) => {
  const cachedResponse = await caches.match(request);
  
  // Start network fetch regardless of whether we have a cached response
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      // Cache the new response
      cacheResponse(request, response.clone(), request);
    }
    return response;
  }).catch(err => {
    console.error('Fetch failed in stale-while-revalidate:', err);
    // This will be caught by the Promise.race below
    throw err;
  });
  
  // If we have a cached response, return it immediately
  if (cachedResponse && !isResponseExpired(cachedResponse)) {
    // Still do the network request in the background to update cache
    networkPromise.catch(() => console.log('Background update failed'));
    return cachedResponse;
  }
  
  // If we have a stale cached response, race it with the network
  if (cachedResponse) {
    return Promise.race([
      networkPromise,
      // Small delay to prefer network if it's quick
      new Promise(resolve => setTimeout(() => resolve(cachedResponse), 100))
    ]).catch(() => cachedResponse); // Fall back to cache if network fails
  }
  
  // No cached response, must use network
  return networkPromise;
};

// Fetch event - apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests that aren't critical
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('contentful.com')) {
    return;
  }
  
  // Don't cache requests with credentials or from bots
  if (shouldNotCacheRequest(event.request)) {
    return;
  }

  const url = new URL(event.request.url);
  
  // For HTML pages - Network first for freshness
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       (event.request.headers.get('accept') || '').includes('text/html'))) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // For Contentful API requests - Stale-while-revalidate
  if (event.request.url.includes('contentful.com')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }
  
  // For static assets - Cache first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // Default to network-first for other requests
  event.respondWith(networkFirst(event.request));
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
  
  // Handle notification subscription requests
  if (event.data && event.data.type === 'SUBSCRIBE_PUSH') {
    self.registration.pushManager.getSubscription().then(subscription => {
      if (subscription) {
        // Already subscribed
        event.ports[0].postMessage({ success: true, subscription, alreadySubscribed: true });
      }
    });
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    // Default notification options
    const title = data.title || 'Vending Solutions';
    const options = {
      body: data.body || 'New notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-96x96.png',
      data: {
        url: data.url || '/',
        ...data.data
      },
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'default',
      vibrate: data.vibrate || [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
    
    // Fallback to text notification if JSON parsing fails
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Vending Solutions', {
        body: text,
        icon: '/icons/icon-192x192.png'
      })
    );
  }
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();
  
  // Navigate to URL if provided in notification data
  if (notification.data && notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open with the URL, open a new one
        if (clients.openWindow) {
          return clients.openWindow(notification.data.url);
        }
      })
    );
  }
});
