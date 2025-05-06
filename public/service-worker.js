
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
  '/logo.png',
  '/offline.html'
];

// Cache duration settings (in milliseconds)
const CACHE_SETTINGS = {
  contentful: 30 * 60 * 1000, // 30 minutes for Contentful content
  static: 24 * 60 * 60 * 1000, // 24 hours for static assets
  html: 1 * 60 * 60 * 1000 // 1 hour for HTML pages
};

// Offline fallback page
const OFFLINE_PAGE = '/offline.html';
const OFFLINE_IMAGE = '/offline-image.svg';

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

// Offline fallback for failed image requests
const getOfflineImage = () => {
  return caches.match(OFFLINE_IMAGE).then(response => {
    if (response) {
      return response;
    }
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#eeeeee"/><path d="M30,40 L70,40 L70,60 L30,60 Z" fill="#cccccc"/><text x="50" y="55" font-family="Arial" font-size="12" text-anchor="middle" fill="#888888">Image</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  });
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
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If this is a navigation request, serve the offline page
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_PAGE) || caches.match('/');
    }
    
    // If this is an image request, serve an offline image placeholder
    if (request.destination === 'image') {
      return getOfflineImage();
    }
    
    return Promise.reject('No cached response available');
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
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If this is an image request, serve an offline image placeholder
    if (request.destination === 'image') {
      return getOfflineImage();
    }
    
    return Promise.reject('Resource not in cache and network unavailable');
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
  
  // Handle connection status check
  if (event.data && event.data.type === 'CHECK_CONNECTIVITY') {
    fetch(event.data.url || '/api/ping', { method: 'HEAD' })
      .then(() => {
        event.ports[0].postMessage({ online: true });
      })
      .catch(() => {
        event.ports[0].postMessage({ online: false });
      });
  }
});

// Create a basic offline HTML fallback page
const createOfflineFallback = async () => {
  const cache = await caches.open(CACHE_NAME);
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Offline - Applestone Solutions</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f9fafb;
        }
        header {
          background-color: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem;
        }
        main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .container {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 2rem;
          max-width: 28rem;
          width: 100%;
          text-align: center;
        }
        .icon {
          background-color: #fef3c7;
          color: #92400e;
          width: 4rem;
          height: 4rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        h1 {
          margin-top: 0;
          color: #1f2937;
          font-size: 1.5rem;
        }
        p {
          margin: 1rem 0;
          color: #4b5563;
        }
        .buttons {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        .primary {
          background-color: #2563eb;
          color: white;
          border: none;
        }
        .secondary {
          background-color: #ffffff;
          color: #2563eb;
          border: 1px solid #d1d5db;
        }
        footer {
          padding: 1rem;
          background-color: #fff;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <header>
        <div style="font-weight: bold; font-size: 1.25rem;">Applestone Solutions</div>
      </header>
      <main>
        <div class="container">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          </div>
          <h1>You're offline</h1>
          <p>The content you're trying to access isn't available offline. Please check your connection and try again.</p>
          <div class="buttons">
            <button class="primary" onclick="window.location.reload()">Retry Connection</button>
            <button class="secondary" onclick="window.location.href='/'">Go to Homepage</button>
          </div>
        </div>
      </main>
      <footer>
        <p>Applestone Solutions &copy; 2025</p>
      </footer>
    </body>
    </html>
  `;
  
  const response = new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  });
  
  await cache.put('/offline.html', response);
};

// Create offline image fallback
const createOfflineImage = async () => {
  const cache = await caches.open(CACHE_NAME);
  const svgImage = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f3f4f6" />
      <text x="200" y="150" font-family="system-ui, sans-serif" font-size="24" text-anchor="middle" fill="#9ca3af">Image Unavailable</text>
      <text x="200" y="180" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" fill="#9ca3af">You are currently offline</text>
    </svg>
  `;
  
  const response = new Response(svgImage, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
  
  await cache.put('/offline-image.svg', response);
};

// Create offline fallback assets when the service worker installs
self.addEventListener('install', event => {
  event.waitUntil(Promise.all([
    createOfflineFallback(),
    createOfflineImage()
  ]));
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
