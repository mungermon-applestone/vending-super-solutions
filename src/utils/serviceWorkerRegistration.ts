
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
