
import { LandingPage } from '@/types/landingPage';
import { getMockLandingPages } from './mock';

export async function deleteLandingPage(id: string): Promise<void> {
  console.log(`[deleteLandingPage] Deleting landing page with ID: ${id}`);
  
  try {
    // In a real application, we would delete from a database
    // For now, just update the mock data if we're in a browser environment
    if (typeof window !== 'undefined' && window.__MOCK_DATA && window.__MOCK_DATA['landing-pages']) {
      const existingPages = window.__MOCK_DATA['landing-pages'];
      
      // Filter out the page to delete
      const filteredPages = existingPages.filter(p => p.id !== id);
      
      // Update mock data
      window.__MOCK_DATA['landing-pages'] = filteredPages;
      
      console.log(`[deleteLandingPage] Removed page from mock data, now have ${filteredPages.length} landing pages`);
    } else {
      console.log('[deleteLandingPage] No mock data found to update');
    }
  } catch (error) {
    console.error('[deleteLandingPage] Error deleting landing page:', error);
    throw error;
  }
  
  console.log(`[deleteLandingPage] Successfully deleted landing page with id ${id}`);
}
