
/**
 * Service worker registration and offline detection utilities
 */
import { toast } from 'sonner';

/**
 * Registers the service worker for offline functionality
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
}

/**
 * Setup detection for offline/online status changes
 * @param offlineCallback Function to call when the app goes offline
 * @param onlineCallback Function to call when the app comes back online
 */
export function setupOfflineDetection(
  offlineCallback: (message: string) => void = (msg) => toast.error(msg),
  onlineCallback: (message: string) => void = (msg) => toast.success(msg)
) {
  if (typeof window !== 'undefined') {
    const handleOffline = () => {
      offlineCallback('You are currently offline. Some features may be unavailable.');
      document.documentElement.classList.add('is-offline');
    };
    
    const handleOnline = () => {
      onlineCallback('You are back online!');
      document.documentElement.classList.remove('is-offline');
    };
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Check initial state
    if (!navigator.onLine) {
      handleOffline();
    }
    
    // Return cleanup function for React components
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }
  
  // Return no-op cleanup for SSR
  return () => {};
}

/**
 * Prefetches critical assets for offline use
 */
export function prefetchCriticalAssets() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Use requestIdleCallback to not block main thread
    const requestIdleCallback = 
      (window as any).requestIdleCallback || 
      ((cb: Function) => setTimeout(cb, 1000));
    
    requestIdleCallback(() => {
      // List of critical assets to cache
      const criticalAssets = [
        '/offline.html',
        '/icons/icon-192x192.png',
        '/icons/badge-96x96.png'
      ];
      
      // Trigger cache operations on service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ASSETS',
        payload: criticalAssets
      });
    });
  }
}
