
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { supabase } from '@/integrations/supabase/client';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData, getMockData } from '../../mockDataHandler';

export async function updateLandingPage(id: string, data: Partial<LandingPageFormData>): Promise<LandingPage> {
  console.log(`[updateLandingPage] Updating landing page ${id} with data:`, data);
  
  // First fetch the current landing page to get the hero_content_id
  const { data: currentPage, error: fetchError } = await supabase
    .from('landing_pages')
    .select('hero_content_id')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.error(`[updateLandingPage] Error fetching landing page with id ${id}:`, fetchError);
    throw fetchError;
  }
  
  // Update the hero content
  if (data.hero) {
    console.log(`[updateLandingPage] Updating hero content with id ${currentPage.hero_content_id} with data:`, data.hero);
    
    const { error: heroError } = await supabase
      .from('hero_contents')
      .update({
        title: data.hero.title,
        subtitle: data.hero.subtitle,
        image_url: data.hero.image_url,
        image_alt: data.hero.image_alt,
        cta_primary_text: data.hero.cta_primary_text,
        cta_primary_url: data.hero.cta_primary_url,
        cta_secondary_text: data.hero.cta_secondary_text,
        cta_secondary_url: data.hero.cta_secondary_url,
        background_class: data.hero.background_class
      })
      .eq('id', currentPage.hero_content_id);
    
    if (heroError) {
      console.error(`[updateLandingPage] Error updating hero content with id ${currentPage.hero_content_id}:`, heroError);
      throw heroError;
    }
    
    console.log(`[updateLandingPage] Successfully updated hero content with id ${currentPage.hero_content_id}`);
  }
  
  // Update the landing page
  const updateData: any = {};
  if (data.page_key) updateData.page_key = data.page_key;
  if (data.page_name) updateData.page_name = data.page_name;
  
  if (Object.keys(updateData).length > 0) {
    console.log(`[updateLandingPage] Updating landing page with id ${id} with data:`, updateData);
    
    const { error: pageError } = await supabase
      .from('landing_pages')
      .update(updateData)
      .eq('id', id);
    
    if (pageError) {
      console.error(`[updateLandingPage] Error updating landing page with id ${id}:`, pageError);
      throw pageError;
    }
    
    console.log(`[updateLandingPage] Successfully updated landing page with id ${id}`);
  }
  
  // Fetch the updated landing page with hero content
  console.log(`[updateLandingPage] Fetching updated landing page with id ${id}`);
  
  const { data: updatedPage, error: fetchUpdatedError } = await supabase
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
    .eq('id', id)
    .single();
  
  if (fetchUpdatedError) {
    console.error(`[updateLandingPage] Error fetching updated landing page with id ${id}:`, fetchUpdatedError);
    throw fetchUpdatedError;
  }
  
  console.log(`[updateLandingPage] Successfully updated landing page with id ${id}:`, updatedPage);
  
  // Fix the type issue: Supabase returns hero_content as an array but we need an object
  const heroContentFixed = Array.isArray(updatedPage.hero_content) ? updatedPage.hero_content[0] : updatedPage.hero_content;
  
  const typedUpdatedPage = {
    ...updatedPage,
    hero_content: heroContentFixed
  } as LandingPage;
  
  // If in development mode, also update mock data
  if (IS_DEVELOPMENT && useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // Find the page to update
      const pageIndex = existingPages.findIndex(p => p.id === id);
      if (pageIndex !== -1) {
        // Replace the old page with the updated one
        existingPages[pageIndex] = typedUpdatedPage;
        
        // Store updated pages back to mock data
        if (!window.__MOCK_DATA) {
          window.__MOCK_DATA = {};
        }
        if (!window.__MOCK_DATA['landing-pages']) {
          window.__MOCK_DATA['landing-pages'] = [];
        }
        
        window.__MOCK_DATA['landing-pages'] = existingPages;
      }
      
      console.log(`[updateLandingPage] Updated mock data with ${existingPages.length} landing pages`);
    } catch (error) {
      console.error('[updateLandingPage] Error updating mock landing pages:', error);
    }
  }
  
  return typedUpdatedPage;
}
