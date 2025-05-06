
import { toast } from 'sonner';

// Detect if the app is running in a production environment
const isProduction = () => {
  return import.meta.env.PROD || 
    window.location.hostname === 'applestonesolutions.com' ||
    window.location.hostname.endsWith('.applestonesolutions.com') ||
    window.location.hostname === 'vendingsolutions.app' ||
    window.location.hostname.endsWith('.vendingsolutions.app');
};

// Define service worker registration options
interface RegistrationOptions {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

// Feature detection for service workers
const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator && 
         'ServiceWorkerRegistration' in window && 
         'caches' in window;
};

// Register the service worker with enhanced options
export function registerServiceWorker(options: RegistrationOptions = {}): void {
  // Only register in production and if service workers are supported
  if (!isProduction() || !isServiceWorkerSupported()) {
    console.log('[ServiceWorker] Not registering in development or unsupported browser');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/service-worker.js';

    registerValidServiceWorker(swUrl, options);
    
    // Check for service worker updates every 60 minutes
    setInterval(() => {
      checkForUpdates(swUrl);
    }, 60 * 60 * 1000);
  });
}

function registerValidServiceWorker(swUrl: string, options: RegistrationOptions): void {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('[ServiceWorker] Registered successfully');
      
      // Listen for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; notify user for refresh
              console.log('[ServiceWorker] New content available; notify user');
              
              if (options.onUpdate) {
                options.onUpdate(registration);
              } else {
                toast.info(
                  'New app version available! Refresh to update.',
                  { 
                    duration: 10000,
                    action: {
                      label: 'Refresh',
                      onClick: () => window.location.reload(),
                    }
                  }
                );
              }
            } else {
              // Content is cached for offline use
              console.log('[ServiceWorker] Content is cached for offline use');
              
              if (options.onSuccess) {
                options.onSuccess(registration);
              } else {
                toast.success('App is ready for offline use!', { duration: 3000 });
                
                // Cache common routes for offline access
                cacheCommonRoutes();
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('[ServiceWorker] Error during registration:', error);
    });
}

// Cache common routes for better offline experience
function cacheCommonRoutes(): void {
  const routesToCache = [
    '/',
    '/products',
    '/technology',
    '/machines',
    '/business-goals',
    '/about',
    '/contact',
    '/offline.html'
  ];

  if ('caches' in window) {
    caches.open('app-pages-cache-v1').then(cache => {
      cache.addAll(routesToCache)
        .then(() => console.log('[ServiceWorker] Common routes cached for offline use'))
        .catch(err => console.error('[ServiceWorker] Failed to cache routes:', err));
    });
  }
}

// Function to check for service worker updates
function checkForUpdates(swUrl: string): void {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
    cache: 'no-cache'
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      
      if (
        response.status === 404 ||
        (contentType && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            console.log('[ServiceWorker] Unregistered due to 404 or invalid content type');
            window.location.reload();
          });
        });
      } else {
        // Valid service worker found; update if needed
        navigator.serviceWorker.register(swUrl);
      }
    })
    .catch(() => {
      console.log('[ServiceWorker] No internet connection; app running in offline mode');
    });
}

// Setup offline detection with callbacks
export function setupOfflineDetection(
  onOffline: () => void,
  onOnline: () => void
): void {
  const handleOffline = () => {
    console.log('[Network] Connection offline');
    onOffline();
    document.documentElement.classList.add('is-offline');
  };

  const handleOnline = () => {
    console.log('[Network] Connection restored');
    onOnline();
    document.documentElement.classList.remove('is-offline');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Check initial state
  if (!navigator.onLine) {
    handleOffline();
  }
}

// Function to prefetch critical assets
export function prefetchCriticalAssets(): void {
  const prefetchLinks = [
    { href: '/favicon.svg', as: 'image' },
    { href: '/icons/icon-192x192.png', as: 'image' },
  ];
  
  if (isServiceWorkerSupported() && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchLinks.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.as = link.as;
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      });
    });
  }
}

// Add to main.tsx during app initialization
export function initServiceWorker(): void {
  registerServiceWorker({
    onSuccess: (registration) => {
      console.log('[ServiceWorker] Successfully registered', registration);
      prefetchCriticalAssets();
    },
    onUpdate: (registration) => {
      console.log('[ServiceWorker] New version available', registration);
      // Show update notification handled in registerValidServiceWorker
    }
  });
  
  setupOfflineDetection(
    () => toast.error('You are offline. Some features may be limited.'), 
    () => toast.success('You are back online!')
  );
}
