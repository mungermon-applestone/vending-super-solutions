
import React, { lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { Spinner } from '@/components/ui/spinner';

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
      <ShadToaster />
      <SonnerToaster position="top-right" />
    </HelmetProvider>
  );
};

export default App;
