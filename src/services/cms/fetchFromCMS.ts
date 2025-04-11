import { IS_DEVELOPMENT } from '@/config/cms';
import { CMSContentTypeFactory } from './contentTypeFactory';
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
    
    // Use our factory to get the right operations for this content type
    try {
      const contentTypeOps = CMSContentTypeFactory.getOperations<T>(contentType);
      return await contentTypeOps.fetchAll({ filters: params });
    } catch (error) {
      // If the content type isn't registered in our factory yet,
      // fall back to the direct import approach
      console.log(`[fetchFromCMS] Content type "${contentType}" not registered in factory, using direct imports.`);
      
      // Otherwise delegate to the appropriate handler based on content type
      switch (contentType) {
        case 'machines':
          const { fetchMachines } = await import('./contentTypes/machines');
          return await fetchMachines(params) as unknown as T[];
        case 'product-types':
          const { fetchProductTypes } = await import('./contentTypes/productTypes');
          return await fetchProductTypes(params) as unknown as T[];
        case 'testimonials':
          const { fetchTestimonials } = await import('./contentTypes/testimonials');
          return await fetchTestimonials() as unknown as T[];
        case 'business-goals':
          const { fetchBusinessGoals } = await import('./contentTypes/businessGoals');
          return await fetchBusinessGoals() as unknown as T[];
        case 'technologies':
          const { fetchTechnologies } = await import('./contentTypes/technologies');
          return await fetchTechnologies() as unknown as T[];
        default:
          console.warn(`[fetchFromCMS] Unknown content type: ${contentType}`);
          return [] as T[];
      }
    }
  } catch (error) {
    console.error(`[fetchFromCMS] Error fetching ${contentType}:`, error);
    throw error;
  }
}
