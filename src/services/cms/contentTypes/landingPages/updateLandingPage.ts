
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { getMockLandingPages } from './mock';

export async function updateLandingPage(id: string, data: Partial<LandingPageFormData>): Promise<LandingPage> {
  console.log(`[updateLandingPage] Updating landing page ${id} with data:`, data);
  
  // In a real application, we would fetch the current landing page from a database
  const pages = typeof window !== 'undefined' && window.__MOCK_DATA && window.__MOCK_DATA['landing-pages'] 
    ? window.__MOCK_DATA['landing-pages'] 
    : getMockLandingPages();
  
  const pageIndex = pages.findIndex(p => p.id === id);
  
  if (pageIndex === -1) {
    throw new Error(`Landing page with ID ${id} not found`);
  }
  
  const currentPage = pages[pageIndex];
  const timestamp = new Date().toISOString();
  
  // Create updated page object
  const updatedPage: LandingPage = {
    ...currentPage,
    page_key: data.page_key || currentPage.page_key,
    page_name: data.page_name || currentPage.page_name,
    updated_at: timestamp,
    hero_content: {
      ...currentPage.hero_content,
      title: data.hero?.title || currentPage.hero_content.title,
      subtitle: data.hero?.subtitle || currentPage.hero_content.subtitle,
      image_url: data.hero?.image_url || currentPage.hero_content.image_url,
      image_alt: data.hero?.image_alt || currentPage.hero_content.image_alt,
      cta_primary_text: data.hero?.cta_primary_text || currentPage.hero_content.cta_primary_text,
      cta_primary_url: data.hero?.cta_primary_url || currentPage.hero_content.cta_primary_url,
      cta_secondary_text: data.hero?.cta_secondary_text || currentPage.hero_content.cta_secondary_text,
      cta_secondary_url: data.hero?.cta_secondary_url || currentPage.hero_content.cta_secondary_url,
      background_class: data.hero?.background_class || currentPage.hero_content.background_class,
      updated_at: timestamp
    }
  };
  
  // In a real application, we would save this to a database
  // For now, just update the mock data if we're in a browser environment
  if (typeof window !== 'undefined' && window.__MOCK_DATA && window.__MOCK_DATA['landing-pages']) {
    window.__MOCK_DATA['landing-pages'][pageIndex] = updatedPage;
  }
  
  console.log(`[updateLandingPage] Successfully updated landing page with id ${id}:`, updatedPage);
  
  return updatedPage;
}
