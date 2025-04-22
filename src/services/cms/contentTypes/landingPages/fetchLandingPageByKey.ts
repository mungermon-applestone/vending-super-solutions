
import { LandingPage } from '@/types/landingPage';
import { supabase } from '@/integrations/supabase/client';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData } from '../../mockDataHandler';
import { fetchLandingPages } from './fetchLandingPages';

export async function fetchLandingPageByKey(key: string): Promise<LandingPage | null> {
  try {
    console.log(`[fetchLandingPageByKey] Fetching landing page with key: ${key}`);
    
    // Try to fetch from Supabase first
    const { data: landingPage, error } = await supabase
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
      `)
      .eq('page_key', key)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error(`[fetchLandingPageByKey] Supabase error for key ${key}:`, error);
      } else {
        console.log(`[fetchLandingPageByKey] No landing page found in Supabase with key ${key}`);
      }
    } else if (landingPage) {
      console.log(`[fetchLandingPageByKey] Found landing page in Supabase with key ${key}:`, landingPage);
      
      // Fix the type issue: Supabase returns hero_content as an array but we need an object
      const heroContent = Array.isArray(landingPage.hero_content) ? landingPage.hero_content[0] : landingPage.hero_content;
      
      return {
        ...landingPage,
        hero_content: heroContent
      } as LandingPage;
    }
    
    // Fallback to mock data if no records found in Supabase or in development mode
    if (IS_DEVELOPMENT && useMockData) {
      const pages = await fetchLandingPages();
      const page = pages.find(page => page.page_key === key);
      console.log(`[fetchLandingPageByKey] Mock data result for key ${key}:`, page ? "Found" : "Not found");
      return page || null;
    }
    
    return null;
  } catch (error) {
    console.error(`[fetchLandingPageByKey] Error fetching landing page with key ${key}:`, error);
    return null;
  }
}
