
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { reportWebVitals, sendToAnalytics } from './utils/webVitalsMonitoring';
import { toast } from 'sonner';
import { optimizeForBots, isBot } from './utils/botDetection';
import { registerServiceWorker, setupOfflineDetection, prefetchCriticalAssets } from './utils/serviceWorkerRegistration';

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

// Inject critical CSS
const injectCriticalCSS = () => {
  if (typeof window !== 'undefined') {
    // Load critical styles for immediate rendering
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body { display: block; }
      .fade-in { animation-duration: 0.3s; }
      #root { display: flex; flex-direction: column; min-height: 100vh; }
      img { opacity: 1; transition: opacity 0.3s; }
      img.loading { opacity: 0; }
      .header-container { position: sticky; top: 0; z-index: 30; width: 100%; background-color: white; }
      .hero-section { overflow: hidden; }
      .hero-image-container { display: flex; align-items: center; justify-content: center; }
      .hero-image { width: 100%; height: 100%; object-fit: contain; }
      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
      }
    `;

    // Create and insert style element
    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
    
    // Remove critical CSS after full CSS has loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 1000);
    });
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
    window.requestIdleCallback(() => {
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
    // Add paths to important images like logos
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
  injectCriticalCSS();
  setupPreconnects();
  preloadCriticalResources();
  
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BreadcrumbProvider>
            <App />
          </BreadcrumbProvider>
        </AuthProvider>
      </QueryClientProvider>
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
