
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { useMockData, getMockData, _getMockLandingPages } from '../../mockDataHandler';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// In a real app, this would be a Supabase query
export async function fetchLandingPages(): Promise<LandingPage[]> {
  console.log("[fetchLandingPages] Starting to fetch landing pages");
  
  if (useMockData) {
    try {
      console.log("[fetchLandingPages] Using mock data");
      
      // Initialize mock data if it doesn't exist
      if (typeof window !== 'undefined' && (!window.__MOCK_DATA || !window.__MOCK_DATA['landing-pages'])) {
        console.log("[fetchLandingPages] Window mock data not initialized, doing it now");
        if (!window.__MOCK_DATA) window.__MOCK_DATA = {};
        
        // Set the mock data directly without any dynamic imports
        window.__MOCK_DATA['landing-pages'] = _getMockLandingPages();
        console.log("[fetchLandingPages] Initialized landing pages mock data with count:", 
          window.__MOCK_DATA['landing-pages'].length);
      }
      
      // Get the mock data directly from window.__MOCK_DATA first
      if (window.__MOCK_DATA && Array.isArray(window.__MOCK_DATA['landing-pages'])) {
        console.log(`[fetchLandingPages] Returning ${window.__MOCK_DATA['landing-pages'].length} landing pages from window.__MOCK_DATA`);
        return window.__MOCK_DATA['landing-pages'];
      }
      
      // Fallback to getMockData
      const landingPages = await getMockData<LandingPage>('landing-pages');
      console.log(`[fetchLandingPages] Fetched ${landingPages.length} landing pages via getMockData`);
      return landingPages;
    } catch (error) {
      console.error("[fetchLandingPages] Error fetching mock landing pages:", error);
      
      // As a last resort, return hardcoded mock data directly from the function
      const directMockData = _getMockLandingPages();
      console.log(`[fetchLandingPages] Returning ${directMockData.length} landing pages directly from _getMockLandingPages`);
      return directMockData;
    }
  }
  
  // In a real implementation, this would connect to Supabase
  try {
    console.log("[fetchLandingPages] Attempting to fetch from Supabase");
    // This would be replaced with actual Supabase query in a real implementation
    return [];
  } catch (error) {
    console.error("[fetchLandingPages] Error fetching from Supabase:", error);
    throw error;
  }
}

export async function fetchLandingPageByKey(key: string): Promise<LandingPage | null> {
  try {
    console.log(`[fetchLandingPageByKey] Fetching landing page with key: ${key}`);
    const pages = await fetchLandingPages();
    const page = pages.find(page => page.page_key === key);
    console.log(`[fetchLandingPageByKey] Found page for key ${key}:`, page ? "Yes" : "No", page);
    return page || null;
  } catch (error) {
    console.error(`[fetchLandingPageByKey] Error fetching landing page with key ${key}:`, error);
    return null;
  }
}

export async function createLandingPage(data: LandingPageFormData): Promise<LandingPage> {
  console.log("[createLandingPage] Creating new landing page with data:", data);
  
  const heroId = uuidv4();
  const pageId = uuidv4();
  const timestamp = new Date().toISOString();
  
  const newPage: LandingPage = {
    id: pageId,
    page_key: data.page_key,
    page_name: data.page_name,
    hero_content_id: heroId,
    hero_content: {
      id: heroId,
      title: data.hero.title,
      subtitle: data.hero.subtitle,
      image_url: data.hero.image_url,
      image_alt: data.hero.image_alt,
      cta_primary_text: data.hero.cta_primary_text,
      cta_primary_url: data.hero.cta_primary_url,
      cta_secondary_text: data.hero.cta_secondary_text,
      cta_secondary_url: data.hero.cta_secondary_url,
      background_class: data.hero.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      created_at: timestamp,
      updated_at: timestamp,
    },
    created_at: timestamp,
    updated_at: timestamp,
  };
  
  console.log("[createLandingPage] Created new landing page:", newPage);
  
  // With mock data, we need to add the new page to our mock data store
  if (useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // If another page with the same key already exists, update it instead
      const existingPageIndex = existingPages.findIndex(p => p.page_key === data.page_key);
      
      if (existingPageIndex !== -1) {
        console.log(`[createLandingPage] Page with key ${data.page_key} already exists, updating instead`);
        existingPages[existingPageIndex] = newPage;
      } else {
        // Add the new page
        console.log(`[createLandingPage] Adding new page with key ${data.page_key}`);
        existingPages.push(newPage);
      }
      
      // Store updated pages back to mock data
      if (typeof window !== 'undefined') {
        if (!window.__MOCK_DATA) {
          window.__MOCK_DATA = {};
        }
        window.__MOCK_DATA['landing-pages'] = existingPages;
      }
      
      console.log(`[createLandingPage] Updated mock data with ${existingPages.length} landing pages:`, existingPages);
    } catch (error) {
      console.error('[createLandingPage] Error updating mock landing pages:', error);
    }
  }
  
  // With Supabase, this would insert the new page and hero content
  return newPage;
}

export async function updateLandingPage(id: string, data: Partial<LandingPageFormData>): Promise<LandingPage> {
  console.log(`[updateLandingPage] Updating landing page ${id} with data:`, data);
  
  const pages = await fetchLandingPages();
  const pageToUpdate = pages.find(page => page.id === id);
  
  if (!pageToUpdate) {
    console.error(`[updateLandingPage] Landing page with ID ${id} not found`);
    throw new Error(`Landing page with ID ${id} not found`);
  }
  
  const updatedPage = {
    ...pageToUpdate,
    page_key: data.page_key || pageToUpdate.page_key,
    page_name: data.page_name || pageToUpdate.page_name,
    updated_at: new Date().toISOString(),
    hero_content: {
      ...pageToUpdate.hero_content,
      title: data.hero?.title || pageToUpdate.hero_content.title,
      subtitle: data.hero?.subtitle || pageToUpdate.hero_content.subtitle,
      image_url: data.hero?.image_url || pageToUpdate.hero_content.image_url,
      image_alt: data.hero?.image_alt || pageToUpdate.hero_content.image_alt,
      cta_primary_text: data.hero?.cta_primary_text || pageToUpdate.hero_content.cta_primary_text,
      cta_primary_url: data.hero?.cta_primary_url || pageToUpdate.hero_content.cta_primary_url,
      cta_secondary_text: data.hero?.cta_secondary_text || pageToUpdate.hero_content.cta_secondary_text,
      cta_secondary_url: data.hero?.cta_secondary_url || pageToUpdate.hero_content.cta_secondary_url,
      background_class: data.hero?.background_class || pageToUpdate.hero_content.background_class,
      updated_at: new Date().toISOString(),
    }
  };
  
  console.log("[updateLandingPage] Updated landing page:", updatedPage);
  
  // With mock data, we need to update our mock data store
  if (useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // Find the page to update
      const pageIndex = existingPages.findIndex(p => p.id === id);
      if (pageIndex !== -1) {
        // Replace the old page with the updated one
        existingPages[pageIndex] = updatedPage;
        
        // Store updated pages back to mock data
        if (!Array.isArray(window.__MOCK_DATA)) {
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
  
  return updatedPage;
}

export async function deleteLandingPage(id: string): Promise<void> {
  console.log(`[deleteLandingPage] Deleting landing page with ID: ${id}`);
  
  // With mock data, we need to remove the page from our mock data store
  if (useMockData) {
    try {
      // Get existing landing pages
      const existingPages = await getMockData<LandingPage>('landing-pages');
      
      // Filter out the page to delete
      const filteredPages = existingPages.filter(p => p.id !== id);
      
      // Store updated pages back to mock data
      if (!Array.isArray(window.__MOCK_DATA)) {
        window.__MOCK_DATA = {};
      }
      window.__MOCK_DATA['landing-pages'] = filteredPages;
      
      console.log(`[deleteLandingPage] Removed page from mock data, now have ${filteredPages.length} landing pages`);
    } catch (error) {
      console.error('[deleteLandingPage] Error deleting mock landing page:', error);
    }
  }
  
  // Implementation would delete both the page and associated hero content
}

// Define window.__MOCK_DATA type to avoid TypeScript errors
declare global {
  interface Window {
    __MOCK_DATA: {
      [key: string]: any[];
    };
  }
}
