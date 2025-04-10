
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData, getMockData } from '../../mockDataHandler';

/**
 * Fetches a single technology by slug
 * @param slug The slug of the technology to fetch
 * @returns Promise resolving to the technology or null if not found
 */
export const fetchTechnologyBySlug = async (slug: string): Promise<CMSTechnology | null> => {
  console.log(`[fetchTechnologyBySlug] Fetching technology for slug: "${slug}"`);
  
  try {
    // If mock data is enabled, use it instead of actual API calls
    if (useMockData) {
      const mockData = await getMockData<CMSTechnology>('technologies', { slug });
      return mockData[0] || null;
    }
    
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    console.log(`[fetchTechnologyBySlug] Found technology: "${data.title}"`);
    return data as CMSTechnology;
  } catch (error) {
    console.error(`[fetchTechnologyBySlug] Error fetching technology with slug "${slug}":`, error);
    throw error;
  }
};
