
import { supabase } from '@/integrations/supabase/client';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData, getMockData } from '../../mockDataHandler';
import { LandingPage } from '@/types/landingPage';

export async function deleteLandingPage(id: string): Promise<void> {
  console.log(`[deleteLandingPage] Deleting landing page with ID: ${id}`);
  
  // First fetch the hero_content_id
  const { data: landingPage, error: fetchError } = await supabase
    .from('landing_pages')
    .select('hero_content_id')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.error(`[deleteLandingPage] Error fetching landing page with id ${id}:`, fetchError);
    throw fetchError;
  }
  
  // Delete the landing page first (due to foreign key constraints)
  const { error: deletePageError } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);
  
  if (deletePageError) {
    console.error(`[deleteLandingPage] Error deleting landing page with id ${id}:`, deletePageError);
    throw deletePageError;
  }
  
  // Then delete the hero content
  const { error: deleteHeroError } = await supabase
    .from('hero_contents')
    .delete()
    .eq('id', landingPage.hero_content_id);
  
  if (deleteHeroError) {
    console.error(`[deleteLandingPage] Error deleting hero content with id ${landingPage.hero_content_id}:`, deleteHeroError);
    throw deleteHeroError;
  }
  
  console.log(`[deleteLandingPage] Successfully deleted landing page with id ${id} and associated hero content`);
  
  // If in development mode, also update mock data
  if (IS_DEVELOPMENT && useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // Filter out the page to delete
      const filteredPages = existingPages.filter(p => p.id !== id);
      
      // Store updated pages back to mock data
      if (!window.__MOCK_DATA) {
        window.__MOCK_DATA = {};
      }
      window.__MOCK_DATA['landing-pages'] = filteredPages;
      
      console.log(`[deleteLandingPage] Removed page from mock data, now have ${filteredPages.length} landing pages`);
    } catch (error) {
      console.error('[deleteLandingPage] Error deleting mock landing page:', error);
    }
  }
}
