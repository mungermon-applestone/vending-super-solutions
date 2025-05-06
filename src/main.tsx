
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
