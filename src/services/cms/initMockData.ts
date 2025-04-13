
import { _getMockLandingPages } from './mockDataHandler';

/**
 * Initializes mock data for landing pages
 * This is called at application startup to ensure mock data is available
 */
export function initMockLandingPagesData(): void {
  console.log("[initMockData] Initializing landing pages mock data");
  
  // Ensure the window.__MOCK_DATA object exists
  if (typeof window === 'undefined') {
    console.warn("[initMockData] Window is undefined, cannot initialize mock data");
    return;
  }
  
  if (!window.__MOCK_DATA) {
    console.log("[initMockData] Creating window.__MOCK_DATA object");
    window.__MOCK_DATA = {};
  }
  
  // Get the mock landing pages data
  const landingPages = _getMockLandingPages();
  
  // Store the data in the window.__MOCK_DATA object
  window.__MOCK_DATA['landing-pages'] = landingPages;
  
  console.log("[initMockData] Landing pages mock data initialized with", landingPages.length, "items");
  
  // Log the first item to verify data structure is correct
  if (landingPages.length > 0) {
    console.log("[initMockData] First landing page:", {
      id: landingPages[0].id,
      key: landingPages[0].page_key,
      name: landingPages[0].page_name
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
