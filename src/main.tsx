
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { IS_DEVELOPMENT } from '@/config/cms'
import { initMockLandingPagesData } from './services/cms/initMockData'

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize mock data if we're in development mode
if (IS_DEVELOPMENT) {
  console.log("Initializing mock data for development environment");
  initMockLandingPagesData();
  
  // Log the initialized data to verify it's working
  if (typeof window !== 'undefined' && window.__MOCK_DATA && window.__MOCK_DATA['landing-pages']) {
    console.log("Mock landing pages initialized with count:", window.__MOCK_DATA['landing-pages'].length);
  } else {
    console.warn("Failed to initialize mock landing pages data");
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
