
import { LandingPage, LandingPageFormData } from '@/types/landingPage';

// Import refactored operations
import { fetchLandingPages } from './fetchLandingPages';
import { fetchLandingPageByKey } from './fetchLandingPageByKey';
import { createLandingPage } from './createLandingPage';
import { updateLandingPage } from './updateLandingPage';
import { deleteLandingPage } from './deleteLandingPage';
import { getMockLandingPages } from './mock';

// Re-export operations
export {
  fetchLandingPages,
  fetchLandingPageByKey,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
};

// Export mock data helper for internal use
export const _getMockLandingPages = getMockLandingPages;

// Define window.__MOCK_DATA type to avoid TypeScript errors
declare global {
  interface Window {
    __MOCK_DATA: {
      [key: string]: any[];
    };
  }
}
