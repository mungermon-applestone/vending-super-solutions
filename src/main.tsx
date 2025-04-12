
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { IS_DEVELOPMENT } from '@/config/cms'
import { initMockLandingPagesData } from './services/cms/initMockData'

// Initialize mock data if we're in development mode
if (IS_DEVELOPMENT) {
  console.log("Initializing mock data for development environment");
  initMockLandingPagesData();
}

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
