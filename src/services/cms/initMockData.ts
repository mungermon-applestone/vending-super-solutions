import { v4 as uuidv4 } from 'uuid';
import { _getMockLandingPages } from './contentTypes/landingPages';

/**
 * Initializes mock data for landing pages
 * This is called at application startup to ensure mock data is available
 */
export function initMockLandingPagesData() {
  console.log('Initializing mock landing pages data...');
  
  if (typeof window === 'undefined') {
    console.warn('Cannot initialize mock data: window is undefined (server-side?)');
    return;
  }
  
  // Initialize window.__MOCK_DATA if it doesn't exist
  if (!window.__MOCK_DATA) {
    window.__MOCK_DATA = {};
  }
  
  // Initialize landing pages if they don't exist
  if (!window.__MOCK_DATA['landing-pages'] || !Array.isArray(window.__MOCK_DATA['landing-pages'])) {
    const mockPages = _getMockLandingPages();
    window.__MOCK_DATA['landing-pages'] = mockPages;
    console.log(`Initialized ${mockPages.length} mock landing pages`);
  } else {
    console.log(`Found ${window.__MOCK_DATA['landing-pages'].length} existing mock landing pages`);
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
