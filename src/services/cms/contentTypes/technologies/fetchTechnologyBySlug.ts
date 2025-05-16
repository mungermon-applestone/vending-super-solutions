
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';

export async function fetchTechnologyBySlug(slug: string): Promise<CMSTechnology | null> {
  console.log(`[fetchTechnologyBySlug] Fetching technology with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[fetchTechnologyBySlug] Empty slug passed to fetchTechnologyBySlug");
    return null;
  }
  
  try {
    // In mock mode, return mock data
    console.log(`[fetchTechnologyBySlug] Returning mock data for slug: "${slug}"`);
    
    return {
      id: `mock-${slug}-id`,
      title: `Technology: ${slug}`,
      slug: slug,
      description: `This is a mock description for technology with slug: ${slug}`,
      visible: true,
      sections: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[fetchTechnologyBySlug] Error fetching technology with slug "${slug}":`, error);
    throw error;
  }
}

// Also export with the alternate name for backwards compatibility
export const getTechnologyBySlug = fetchTechnologyBySlug;
