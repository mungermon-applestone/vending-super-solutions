
import { IS_DEVELOPMENT } from '@/config/cms';
import { mockMachines, mockProductTypes } from '@/data/mockCmsData';

// Use mock data in development mode if needed
export const useMockData = IS_DEVELOPMENT && false; // Set to true to use mock data instead of Supabase

/**
 * Get mock data for a specific content type
 * @param contentType The type of content to fetch
 * @param params Query parameters to filter results
 * @returns Promise resolving to the requested mock data
 */
export async function getMockData<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[fetchFromCMS] Getting mock data for ${contentType} with params:`, params);
  
  switch (contentType) {
    case 'machines':
      if (params.slug) {
        const machine = mockMachines.find(m => m.slug === params.slug);
        return machine ? [machine] as unknown as T[] : [] as T[];
      }
      return mockMachines as unknown as T[];
      
    case 'product-types':
      if (params.slug) {
        const productType = mockProductTypes.find(p => p.slug === params.slug);
        return productType ? [productType] as unknown as T[] : [] as T[];
      }
      return mockProductTypes as unknown as T[];
      
    default:
      return [] as T[];
  }
}
