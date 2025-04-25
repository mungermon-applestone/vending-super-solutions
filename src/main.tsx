
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { forceContentfulProvider } from './services/cms/cmsInit'
import { toast } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
  // Force use of Contentful provider
  forceContentfulProvider();
  toast.success('Using Contentful as CMS provider');
  
  // Render application
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  )
};

initApp();
