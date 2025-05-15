
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';

export async function fetchTechnologyBySlug(slug: string): Promise<CMSTechnology | null> {
  console.log(`[fetchTechnologyBySlug] Fetching technology with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[fetchTechnologyBySlug] Empty slug passed to fetchTechnologyBySlug");
    return null;
  }
  
  try {
    // Fetch the technology by slug
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned by the query
        console.log(`[fetchTechnologyBySlug] No technology found with slug: "${slug}"`);
        return null;
      }
      throw error;
    }

    if (!data) {
      console.log(`[fetchTechnologyBySlug] No technology found with slug: "${slug}"`);
      return null;
    }

    console.log(`[fetchTechnologyBySlug] Found technology: "${data.title}"`);
    
    // Return the technology with an empty sections array if none exists
    return {
      ...data,
      sections: []
    };
  } catch (error) {
    console.error(`[fetchTechnologyBySlug] Error fetching technology with slug "${slug}":`, error);
    throw error;
  }
}

// Also export with the alternate name for backwards compatibility
export const getTechnologyBySlug = fetchTechnologyBySlug;
