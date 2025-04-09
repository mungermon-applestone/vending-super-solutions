
import { IS_DEVELOPMENT } from '@/config/cms';
import { fetchMachines } from './contentTypes/machines';
import { fetchProductTypes } from './contentTypes/productTypes';
import { fetchTestimonials } from './contentTypes/testimonials';
import { fetchBusinessGoals } from './contentTypes/businessGoals';
import { fetchTechnologies } from './contentTypes/technologies';
import { useMockData, getMockData } from './mockDataHandler';

/**
 * Generic function for fetching data from the CMS (either mock or Supabase)
 * @param contentType The type of content to fetch
 * @param params Query parameters to filter results
 * @returns Promise resolving to the requested data
 */
export async function fetchFromCMS<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[fetchFromCMS] Fetching ${contentType} with params:`, params);
  
  try {
    // If mock data is enabled, use it instead of actual API calls
    if (useMockData) {
      return await getMockData<T>(contentType, params);
    }
    
    // Otherwise delegate to the appropriate handler based on content type
    switch (contentType) {
      case 'machines':
        return await fetchMachines<T>(params);
      case 'product-types':
        return await fetchProductTypes<T>(params);
      case 'testimonials':
        return await fetchTestimonials<T>();
      case 'business-goals':
        return await fetchBusinessGoals<T>();
      case 'technologies':
        return await fetchTechnologies<T>();
      default:
        console.warn(`[fetchFromCMS] Unknown content type: ${contentType}`);
        return [] as T[];
    }
  } catch (error) {
    console.error(`[fetchFromCMS] Error fetching ${contentType}:`, error);
    throw error;
  }
}
