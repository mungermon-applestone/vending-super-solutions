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
      const landingPages = await getMockData<LandingPage>('landing-pages');
      console.log(`[fetchLandingPages] Fetched ${landingPages.length} landing pages:`, landingPages);
      return landingPages;
    } catch (error) {
      console.error("[fetchLandingPages] Error fetching mock landing pages:", error);
      return [];
    }
  }
  
  // In a real implementation, this would connect to Supabase
  return [];
}

export async function fetchLandingPageByKey(key: string): Promise<LandingPage | null> {
  try {
    console.log(`[fetchLandingPageByKey] Fetching landing page with key: ${key}`);
    const pages = await fetchLandingPages();
    const page = pages.find(page => page.page_key === key);
    console.log(`[fetchLandingPageByKey] Found page for key ${key}:`, page ? "Yes" : "No");
    return page || null;
  } catch (error) {
    console.error(`[fetchLandingPageByKey] Error fetching landing page with key ${key}:`, error);
    return null;
  }
}

export async function createLandingPage(data: LandingPageFormData): Promise<LandingPage> {
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
  
  console.log("[createLandingPage] Created new landing page:", newPage.page_key);
  
  // With Supabase, this would insert the new page and hero content
  return newPage;
}

export async function updateLandingPage(id: string, data: Partial<LandingPageFormData>): Promise<LandingPage> {
  const pages = await fetchLandingPages();
  const pageToUpdate = pages.find(page => page.id === id);
  
  if (!pageToUpdate) {
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
  
  return updatedPage;
}

export async function deleteLandingPage(id: string): Promise<void> {
  console.log(`[deleteLandingPage] Deleting landing page with ID: ${id}`);
  // Implementation would delete both the page and associated hero content
}
