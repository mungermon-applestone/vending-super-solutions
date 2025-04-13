
import { _getMockLandingPages } from './mockDataHandler';
import { fetchLandingPages } from './contentTypes/landingPages';

/**
 * Initializes mock data for landing pages
 * This is called at application startup to ensure mock data is available
 */
export async function initMockLandingPagesData(): Promise<void> {
  console.log("[initMockData] Initializing landing pages mock data");
  
  // Ensure the window.__MOCK_DATA object exists
  if (typeof window === 'undefined') {
    console.warn("[initMockData] Window is undefined, cannot initialize mock data");
    return;
  }
  
  // Always ensure the __MOCK_DATA object exists
  if (!window.__MOCK_DATA) {
    console.log("[initMockData] Creating window.__MOCK_DATA object");
    window.__MOCK_DATA = {};
  }
  
  try {
    // First try to load data from Supabase
    console.log("[initMockData] Attempting to load landing pages from Supabase");
    const landingPages = await fetchLandingPages();
    
    if (landingPages && landingPages.length > 0) {
      console.log(`[initMockData] Loaded ${landingPages.length} landing pages from Supabase`);
      window.__MOCK_DATA['landing-pages'] = landingPages;
    } else {
      console.log("[initMockData] No landing pages found in Supabase, using mock data");
      // Get the mock landing pages data
      const mockLandingPages = _getMockLandingPages();
      window.__MOCK_DATA['landing-pages'] = mockLandingPages;
    }
    
    console.log(`[initMockData] Landing pages mock data initialized with ${window.__MOCK_DATA['landing-pages'].length} items`);
  } catch (error) {
    console.error("[initMockData] Error initializing landing pages data:", error);
    
    // Fallback to mock data
    const mockLandingPages = _getMockLandingPages();
    window.__MOCK_DATA['landing-pages'] = mockLandingPages;
    
    console.log(`[initMockData] Used fallback mock data with ${mockLandingPages.length} items due to error`);
  }
  
  // Log the data to verify structure
  if (window.__MOCK_DATA['landing-pages'] && window.__MOCK_DATA['landing-pages'].length > 0) {
    console.log("[initMockData] First landing page:", {
      id: window.__MOCK_DATA['landing-pages'][0].id,
      key: window.__MOCK_DATA['landing-pages'][0].page_key,
      name: window.__MOCK_DATA['landing-pages'][0].page_name
    });
  }
}

// Define window.__MOCK_DATA type to avoid TypeScript errors
declare global {
  interface Window {
    __MOCK_DATA: {
      [key: string]: any[];
    };
  }
}
