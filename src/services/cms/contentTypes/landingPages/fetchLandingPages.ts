
import { LandingPage } from '@/types/landingPage';
import { useMockData, getMockData, _getMockLandingPages } from '../../mockDataHandler';
import { supabase } from '@/integrations/supabase/client';
import { IS_DEVELOPMENT } from '@/config/cms';

// In a real app, this would be a Supabase query
export async function fetchLandingPages(): Promise<LandingPage[]> {
  console.log("[fetchLandingPages] Starting to fetch landing pages");
  
  try {
    // Always try Supabase first
    console.log("[fetchLandingPages] Fetching landing pages from Supabase");
    const { data: landingPagesData, error } = await supabase
      .from('landing_pages')
      .select(`
        id, 
        page_key, 
        page_name, 
        hero_content_id,
        created_at,
        updated_at,
        hero_content:hero_content_id (
          id, 
          title, 
          subtitle, 
          image_url, 
          image_alt, 
          cta_primary_text, 
          cta_primary_url, 
          cta_secondary_text, 
          cta_secondary_url, 
          background_class,
          created_at, 
          updated_at
        )
      `);
      
    if (error) {
      console.error("[fetchLandingPages] Supabase error:", error);
      throw error;
    }
    
    if (landingPagesData && landingPagesData.length > 0) {
      console.log(`[fetchLandingPages] Found ${landingPagesData.length} landing pages in Supabase`);
      
      // Fix the type issue: Supabase returns hero_content as an array but we need an object
      const typedLandingPages = landingPagesData.map(page => {
        // Extract the first (and should be only) item from hero_content array
        const heroContent = Array.isArray(page.hero_content) ? page.hero_content[0] : page.hero_content;
        
        return {
          ...page,
          hero_content: heroContent
        } as LandingPage;
      });
      
      return typedLandingPages;
    }
    
    console.log("[fetchLandingPages] No landing pages found in Supabase, falling back to mock data");
    
    // Fallback to mock data if no records found in Supabase or in development mode
    if (IS_DEVELOPMENT && useMockData) {
      console.log("[fetchLandingPages] Using mock data as fallback");
      
      // Check if window.__MOCK_DATA exists and has landing pages data
      if (typeof window !== 'undefined') {
        // Direct access to window.__MOCK_DATA
        if (window.__MOCK_DATA && Array.isArray(window.__MOCK_DATA['landing-pages'])) {
          const pages = window.__MOCK_DATA['landing-pages'];
          console.log(`[fetchLandingPages] Found ${pages.length} landing pages in window.__MOCK_DATA`);
          
          // Check if the array is empty
          if (pages.length === 0) {
            console.warn("[fetchLandingPages] Landing pages array is empty, initializing with mock data");
            const mockPages = _getMockLandingPages();
            window.__MOCK_DATA['landing-pages'] = mockPages;
            return mockPages;
          }
          
          return pages;
        } else {
          console.warn("[fetchLandingPages] No landing pages found in window.__MOCK_DATA, initializing now");
          
          // Initialize if not found
          if (!window.__MOCK_DATA) window.__MOCK_DATA = {};
          const mockPages = _getMockLandingPages();
          window.__MOCK_DATA['landing-pages'] = mockPages;
          console.log(`[fetchLandingPages] Initialized ${mockPages.length} landing pages`);
          return mockPages;
        }
      } else {
        console.warn("[fetchLandingPages] Window is undefined, using direct mock data");
        return _getMockLandingPages();
      }
    }
    
    // If no records in Supabase and not using mock data, return empty array
    return [];
  } catch (error) {
    console.error("[fetchLandingPages] Error fetching landing pages:", error);
    
    // As a last resort, return hardcoded mock data
    console.log("[fetchLandingPages] Returning hardcoded mock data as fallback");
    return _getMockLandingPages();
  }
}
