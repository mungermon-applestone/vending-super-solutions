
import { IS_DEVELOPMENT } from '@/config/cms';
import { mockBusinessGoals } from '@/data/businessGoalsData';
import { mockMachines } from '@/data/fallbacks/machineFallbacks';

// Flag to enable mock data
export const useMockData = IS_DEVELOPMENT && true;

/**
 * Get mock data based on content type and parameters
 */
export async function getMockData<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[getMockData] Fetching mock data for ${contentType} with params:`, params);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return different mock data based on content type
  switch (contentType) {
    case 'business-goals':
      return mockBusinessGoals as unknown as T[];
    case 'machines':
      return mockMachines as unknown as T[];
    // Add other content types as needed
    default:
      console.warn(`[getMockData] No mock data available for ${contentType}`);
      return [];
  }
}
