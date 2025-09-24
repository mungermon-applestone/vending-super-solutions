
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { reportWebVitals, sendToAnalytics } from './utils/webVitalsMonitoring';
import { toast } from 'sonner';
import { optimizeForBots, isBot } from './utils/botDetection';
import { registerServiceWorker, setupOfflineDetection, prefetchCriticalAssets } from './utils/serviceWorkerRegistration';
import { extractCriticalCSS, setupDeferredCSS } from './utils/criticalCss';
import { HelmetProvider } from 'react-helmet-async';
import { performSecurityCheck } from './utils/securityUtils';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Setup performance optimizations
const setupPerformanceOptimizations = () => {
  // Inject critical CSS for faster initial render
  extractCriticalCSS();
  
  // Setup deferred loading of non-critical CSS
  setupDeferredCSS();
  
  // Preconnect to important domains
  setupPreconnects();
  
  // Prefetch important resources
  preloadCriticalResources();
  
  // Run security check
  const securityCheckResult = performSecurityCheck();
  if (!securityCheckResult.passed) {
    console.warn('Security check failed:', securityCheckResult.issues);
  }
};

// Preconnect to important domains
const setupPreconnects = () => {
  const domains = [
    'https://images.ctfassets.net',  // Contentful Images
    'https://cdn.contentful.com',    // Contentful API
    'https://fonts.googleapis.com',  // Google Fonts
    'https://fonts.gstatic.com',     // Google Fonts
    'https://images.unsplash.com',   // Unsplash (commonly used for images)
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    // DNS prefetch as fallback
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = domain;
    document.head.appendChild(dnsLink);
  });
};

// Prefetch key routes that users are likely to navigate to
const prefetchCriticalRoutes = () => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      const routesToPrefetch = [
        '/products',
        '/technology',
        '/contact'
      ];
      
      routesToPrefetch.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
};

// Add preload for critical resources
const preloadCriticalResources = () => {
  // Preload logo or critical images
  const criticalImages = [
    '/logo.png',
    '/og-image.jpg',
    '/icons/icon-192x192.png',
    '/icons/badge-96x96.png'
  ];
  
  criticalImages.forEach(imagePath => {
    if (!imagePath) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = imagePath;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Check if Contentful credentials are properly loaded
const checkCredentialsLoaded = () => {
  if (typeof window !== 'undefined' && window.env) {
    const hasCredentials = 
      !!window.env.VITE_CONTENTFUL_SPACE_ID && 
      !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
      
    if (hasCredentials) {
      console.log('[main.tsx] Contentful credentials found in window.env');
    } else {
      console.warn('[main.tsx] Contentful credentials missing from window.env');
    }
  } else {
    console.warn('[main.tsx] window.env not initialized');
  }
};

// Render application
const renderApp = () => {
  // Setup performance optimizations
  setupPerformanceOptimizations();
  
  // Bot detection and optimization
  const detectedBot = isBot();
  if (detectedBot) {
    optimizeForBots();
  }
  
  checkCredentialsLoaded();
  
  // Create performance markers for initial load
  if ('performance' in window) {
    performance.mark('app-render-start');
  }
  
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <CustomerAuthProvider>
                <BreadcrumbProvider>
                  <App />
                </BreadcrumbProvider>
              </CustomerAuthProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  
  if ('performance' in window) {
    performance.mark('app-render-end');
    performance.measure('app-render-time', 'app-render-start', 'app-render-end');
  }
  
  // Initialize service worker and offline capabilities
  registerServiceWorker();
  
  // Fix: Pass the required parameters to setupOfflineDetection
  // Using toast.error and toast.success as the notification handlers
  setupOfflineDetection(
    (message: string) => toast.error(message),
    (message: string) => toast.success(message)
  );
  
  // Prefetch critical routes when browser is idle
  if (!detectedBot) {
    prefetchCriticalRoutes();
    prefetchCriticalAssets();
  }
  
  // Initialize web vitals reporting in production
  if (import.meta.env.PROD) {
    reportWebVitals(sendToAnalytics);
  }
};

// Wait for window.env to be populated before rendering app
if (document.readyState === 'complete') {
  renderApp();
} else {
  window.addEventListener('load', renderApp);
}
