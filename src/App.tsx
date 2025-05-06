import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { initEmailJS } from './utils/emailjs';

// Create optimized router with performance monitoring
const router = createBrowserRouter(routes);

// Initialize EmailJS
initEmailJS();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => {
  // Monitor route changes for performance metrics
  React.useEffect(() => {
    const handleRouteChange = () => {
      // Mark route change for performance monitoring
      if ('performance' in window) {
        performance.mark('route-change');
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <HelmetProvider>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" />
    </HelmetProvider>
  );
};

export default App;
