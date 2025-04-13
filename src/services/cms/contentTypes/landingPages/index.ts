
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { useMockData, getMockData, _getMockLandingPages } from '../../mockDataHandler';
import { v4 as uuidv4 } from 'uuid';
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
  }
  
  // Update the landing page
  const updateData: any = {};
  if (data.page_key) updateData.page_key = data.page_key;
  if (data.page_name) updateData.page_name = data.page_name;
  
  if (Object.keys(updateData).length > 0) {
    const { error: pageError } = await supabase
      .from('landing_pages')
      .update(updateData)
      .eq('id', id);
    
    if (pageError) {
      console.error(`[updateLandingPage] Error updating landing page with id ${id}:`, pageError);
      throw pageError;
    }
  }
  
  // Fetch the updated landing page with hero content
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

// Define window.__MOCK_DATA type to avoid TypeScript errors
declare global {
  interface Window {
    __MOCK_DATA: {
      [key: string]: any[];
    };
  }
}
