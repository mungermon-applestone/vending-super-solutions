
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';
import { reportWebVitals, sendToAnalytics } from './utils/webVitalsMonitoring';

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

// Preconnect to important domains
const setupPreconnects = () => {
  const domains = [
    'https://images.ctfassets.net',  // Contentful Images
    'https://cdn.contentful.com',    // Contentful API
    'https://fonts.googleapis.com',  // Google Fonts
    'https://fonts.gstatic.com',     // Google Fonts
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

// Render application
const renderApp = () => {
  // Setup performance optimizations
  injectCriticalCSS();
  setupPreconnects();
  
  checkCredentialsLoaded();
  
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
  
  // Register service worker after the app has loaded
  registerServiceWorker();
  
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
