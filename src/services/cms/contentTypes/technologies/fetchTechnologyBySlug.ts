
import { supabase } from '@/integrations/supabase/client';
import { handleError, transformTechnologyData } from '../../utils/transformers';
import { logSlugSearch } from '../../utils/slugMatching';

export async function fetchTechnologyBySlug<T>(slug: string): Promise<T | null> {
  logSlugSearch('technology', slug);

  try {
    if (!slug || slug.trim() === '') {
      console.error('[fetchTechnologyBySlug] Empty slug provided');
      return null;
    }
    
    const { data: technology, error } = await supabase
      .from('technologies')
      .select(`
        *,
        technology_sections!technology_sections_technology_id_fkey (
          *,
          technology_features!technology_features_section_id_fkey (
            *,
            technology_feature_items!technology_feature_items_feature_id_fkey (*)
          ),
          technology_images!technology_images_section_id_fkey (*)
        ),
        technology_images!technology_images_technology_id_fkey (*)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!technology) {
      console.log(`[fetchTechnologyBySlug] No technology found with slug "${slug}"`);
      return null;
    }
    
    console.log(`[fetchTechnologyBySlug] Found technology: "${technology.title}"`);
    const transformedData = await transformTechnologyData(technology);
    
    return transformedData as T;
  } catch (error) {
    return handleError('fetchTechnologyBySlug', error);
  }
}
