
import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { v4 as uuidv4 } from 'uuid';
import { getMockLandingPages } from './mock';

export async function createLandingPage(data: LandingPageFormData): Promise<LandingPage> {
  console.log("[createLandingPage] Creating new landing page with data:", data);
  
  // Create mock IDs for the new content
  const heroContentId = uuidv4();
  const landingPageId = uuidv4();
  const timestamp = new Date().toISOString();
  
  // Create a new landing page object
  const newLandingPage: LandingPage = {
    id: landingPageId,
    page_key: data.page_key,
    page_name: data.page_name,
    hero_content_id: heroContentId,
    hero_content: {
      id: heroContentId,
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
      updated_at: timestamp
    },
    created_at: timestamp,
    updated_at: timestamp
  };
  
  console.log("[createLandingPage] Created new landing page:", newLandingPage);
  
  // In a real application, we would save this to a database
  // For now, just return the mock object
  
  // If using window.__MOCK_DATA for client-side mock data storage
  if (typeof window !== 'undefined') {
    if (!window.__MOCK_DATA) {
      window.__MOCK_DATA = {};
    }
    if (!window.__MOCK_DATA['landing-pages']) {
      window.__MOCK_DATA['landing-pages'] = getMockLandingPages();
    }
    window.__MOCK_DATA['landing-pages'].push(newLandingPage);
  }
  
  return newLandingPage;
}
