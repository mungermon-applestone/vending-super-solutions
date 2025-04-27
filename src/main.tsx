
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initCMS } from './services/cms/cmsInit';
import { toast } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize application
const initApp = async () => {
  try {
    // Initialize CMS with Contentful
    await initCMS();
    toast.success('CMS initialized successfully');
    
    // Render application
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BreadcrumbProvider>
              <App />
            </BreadcrumbProvider>
          </AuthProvider>
        </QueryClientProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to initialize CMS:', error);
    toast.error('Failed to initialize CMS. Please check your configuration.');
    
    // Still render the app so we can show fallback states
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BreadcrumbProvider>
              <App />
            </BreadcrumbProvider>
          </AuthProvider>
        </QueryClientProvider>
      </React.StrictMode>,
    );
  }
};

initApp();
