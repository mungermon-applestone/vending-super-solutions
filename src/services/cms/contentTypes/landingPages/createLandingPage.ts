
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { supabase } from '@/integrations/supabase/client';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData, getMockData } from '../../mockDataHandler';

export async function createLandingPage(data: LandingPageFormData): Promise<LandingPage> {
  console.log("[createLandingPage] Creating new landing page with data:", data);
  
  // Create the hero content first
  const { data: heroContent, error: heroError } = await supabase
    .from('hero_contents')
    .insert({
      title: data.hero.title,
      subtitle: data.hero.subtitle,
      image_url: data.hero.image_url,
      image_alt: data.hero.image_alt,
      cta_primary_text: data.hero.cta_primary_text,
      cta_primary_url: data.hero.cta_primary_url,
      cta_secondary_text: data.hero.cta_secondary_text,
      cta_secondary_url: data.hero.cta_secondary_url,
      background_class: data.hero.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light'
    })
    .select()
    .single();
  
  if (heroError) {
    console.error("[createLandingPage] Error creating hero content:", heroError);
    throw heroError;
  }
  
  // Now create the landing page that references the hero content
  const { data: landingPage, error: pageError } = await supabase
    .from('landing_pages')
    .insert({
      page_key: data.page_key,
      page_name: data.page_name,
      hero_content_id: heroContent.id
    })
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
    .single();
  
  if (pageError) {
    console.error("[createLandingPage] Error creating landing page:", pageError);
    throw pageError;
  }
  
  console.log("[createLandingPage] Created new landing page:", landingPage);
  
  // Fix the type issue: Supabase returns hero_content as an array but we need an object
  const heroContentFixed = Array.isArray(landingPage.hero_content) ? landingPage.hero_content[0] : landingPage.hero_content;
  
  const typedLandingPage = {
    ...landingPage,
    hero_content: heroContentFixed
  } as LandingPage;
  
  // If in development mode, also update mock data
  if (IS_DEVELOPMENT && useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // If another page with the same key already exists, update it instead
      const existingPageIndex = existingPages.findIndex(p => p.page_key === data.page_key);
      
      if (existingPageIndex !== -1) {
        console.log(`[createLandingPage] Page with key ${data.page_key} already exists in mock data, updating instead`);
        existingPages[existingPageIndex] = typedLandingPage;
      } else {
        // Add the new page
        console.log(`[createLandingPage] Adding new page with key ${data.page_key} to mock data`);
        existingPages.push(typedLandingPage);
      }
      
      // Store updated pages back to mock data
      if (typeof window !== 'undefined') {
        if (!window.__MOCK_DATA) {
          window.__MOCK_DATA = {};
        }
        window.__MOCK_DATA['landing-pages'] = existingPages;
      }
      
      console.log(`[createLandingPage] Updated mock data with ${existingPages.length} landing pages`);
    } catch (error) {
      console.error('[createLandingPage] Error updating mock landing pages:', error);
    }
  }
  
  return typedLandingPage;
}
