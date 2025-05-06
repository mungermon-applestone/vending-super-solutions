
// Register the service worker for PWA support and caching
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          // Store registration for later use
          window._swRegistration = registration;
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}

// This function can be called from a UI button to clear cache
export function clearServiceWorkerCache() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({ type: 'CLEAR_CACHE' });
    });
  }
}

// Check connectivity using service worker
export function checkConnectivity(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      // Fallback to navigator.onLine if service worker isn't available
      resolve(navigator.onLine);
      return;
    }
    
    // Create a message channel for the response
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      resolve(event.data.online);
    };
    
    // Ask service worker to check connectivity
    navigator.serviceWorker.controller.postMessage(
      { type: 'CHECK_CONNECTIVITY', url: '/api/ping' },
      [channel.port2]
    );
    
    // Timeout after 3 seconds and fallback to navigator.onLine
    setTimeout(() => {
      resolve(navigator.onLine);
    }, 3000);
  });
}

// Listen for messages from the service worker
export function setupServiceWorkerMessageListener(callback: (message: any) => void) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      callback(event.data);
    });
  }
}

// Check if the app is running in offline mode
export function checkOfflineStatus(): boolean {
  return !navigator.onLine;
}

// Force update the service worker
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update().then(() => {
        console.log('Service worker updated');
      });
    });
  }
}

// Add offline event listeners
export function setupOfflineDetection(onOffline: () => void, onOnline: () => void) {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Initial check
  if (!navigator.onLine) {
    onOffline();
  }
}

// Check if content is likely to be available offline
export function isLikelyAvailableOffline(url: string): Promise<boolean> {
  if (!('caches' in window)) {
    return Promise.resolve(false);
  }
  
  // Check if the URL is in the cache
  return caches.match(url)
    .then(response => !!response)
    .catch(() => false);
}

// Prefetch important routes for offline use
export function prefetchRoutes(routes: string[]) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        routes.forEach(route => {
          const fullRoute = window.location.origin + route;
          fetch(fullRoute, { method: 'GET', mode: 'no-cors' })
            .catch(() => console.log(`Failed to prefetch ${route}`));
        });
      });
    }
  }
}
