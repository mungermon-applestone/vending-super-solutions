
import { _getMockLandingPages } from './mockDataHandler';

/**
 * Initializes mock data for landing pages
 * This is called at application startup to ensure mock data is available
 */
export function initMockLandingPagesData(): void {
  console.log("[initMockData] Initializing landing pages mock data");
  
  if (typeof window !== 'undefined') {
    if (!window.__MOCK_DATA) {
      window.__MOCK_DATA = {};
    }
    
    // Initialize landing pages mock data
    window.__MOCK_DATA['landing-pages'] = _getMockLandingPages();
    console.log("[initMockData] Landing pages mock data initialized:", window.__MOCK_DATA['landing-pages'].length);
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
