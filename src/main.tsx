
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import ContentfulInitializer from './components/contentful/ContentfulInitializer.tsx';
import './index.css';
import { forceContentfulProvider } from './services/cms/cmsInit.ts';

// Initialize Contentful as the CMS provider
forceContentfulProvider();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ContentfulInitializer>
          <App />
          <Toaster position="top-right" richColors />
        </ContentfulInitializer>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
