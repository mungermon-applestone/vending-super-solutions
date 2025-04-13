
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { IS_DEVELOPMENT } from '@/config/cms'
import { initMockLandingPagesData } from './services/cms/initMockData'

// Initialize mock data immediately for development mode
if (IS_DEVELOPMENT) {
  console.log("Initializing mock data for development environment");
  initMockLandingPagesData();
  
  // Log the initialized data to verify it's working
  if (typeof window !== 'undefined' && window.__MOCK_DATA && window.__MOCK_DATA['landing-pages']) {
    console.log("Mock landing pages initialized with count:", window.__MOCK_DATA['landing-pages'].length);
    console.log("Mock landing pages content:", JSON.stringify(window.__MOCK_DATA['landing-pages']).substring(0, 200) + "...");
  } else {
    console.warn("Failed to initialize mock landing pages data");
  }
}

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 0, // Always consider data stale to ensure fresh data on mount
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
