
import { LandingPage } from '@/types/landingPage';
import { getMockLandingPages } from './mock';

/**
 * Fetch all landing pages
 * @returns Promise resolving to list of landing pages
 */
export const fetchLandingPages = async (): Promise<LandingPage[]> => {
  console.log('[fetchLandingPages] Fetching landing pages');
  
  try {
    // Use mock data since we're no longer using Supabase
    const pages = getMockLandingPages();
    console.log(`[fetchLandingPages] Fetched ${pages.length} landing pages`);
    return pages;
  } catch (error) {
    console.error('[fetchLandingPages] Error fetching landing pages:', error);
    return [];
  }
};

/**
 * Fetch a landing page by key
 * @param key The page key to look for
 * @returns Promise resolving to the landing page or null if not found
 */
export const fetchLandingPageByKey = async (key: string): Promise<LandingPage | null> => {
  console.log(`[fetchLandingPageByKey] Fetching landing page with key: ${key}`);
  
  try {
    const pages = getMockLandingPages();
    const page = pages.find(p => p.page_key === key);
    
    if (page) {
      console.log('[fetchLandingPageByKey] Found landing page:', page.page_name);
      return page;
    } else {
      console.log('[fetchLandingPageByKey] Landing page not found');
      return null;
    }
  } catch (error) {
    console.error(`[fetchLandingPageByKey] Error fetching landing page with key ${key}:`, error);
    return null;
  }
};
