
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import routes from './routes';
import { Toaster } from 'sonner';

// Configure the query client with better defaults for our Contentful use case
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 10, // 10 minutes - increased for better caching
      gcTime: 1000 * 60 * 20, // 20 minutes - keep data in cache longer
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  }
});

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
