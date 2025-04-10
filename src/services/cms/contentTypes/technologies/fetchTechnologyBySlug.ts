
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
    
    // First, get the technology data
    const { data: technology, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!technology) {
      return null;
    }
    
    console.log(`[fetchTechnologyBySlug] Found technology: "${technology.title}"`);
    
    // Next, get all sections for this technology
    const { data: sections, error: sectionsError } = await supabase
      .from('technology_sections')
      .select('*')
      .eq('technology_id', technology.id)
      .order('display_order', { ascending: true });
    
    if (sectionsError) {
      console.error('[fetchTechnologyBySlug] Error fetching technology sections:', sectionsError);
      throw sectionsError;
    }
    
    // For each section, get its features
    const sectionsWithFeatures = await Promise.all(
      sections.map(async (section) => {
        const { data: features, error: featuresError } = await supabase
          .from('technology_features')
          .select('*')
          .eq('section_id', section.id)
          .order('display_order', { ascending: true });
          
        if (featuresError) {
          console.error('[fetchTechnologyBySlug] Error fetching section features:', featuresError);
          throw featuresError;
        }
        
        // For each feature, get its items
        const featuresWithItems = await Promise.all(
          features.map(async (feature) => {
            const { data: items, error: itemsError } = await supabase
              .from('technology_feature_items')
              .select('*')
              .eq('feature_id', feature.id)
              .order('display_order', { ascending: true });
              
            if (itemsError) {
              console.error('[fetchTechnologyBySlug] Error fetching feature items:', itemsError);
              throw itemsError;
            }
            
            return {
              ...feature,
              items: items || []
            };
          })
        );
        
        return {
          ...section,
          features: featuresWithItems || []
        };
      })
    );
    
    // Combine everything into the final technology object
    const technologyWithSections: CMSTechnology = {
      ...technology,
      sections: sectionsWithFeatures || []
    };
    
    console.log(`[fetchTechnologyBySlug] Loaded technology with ${technologyWithSections.sections.length} sections`);
    return technologyWithSections;
    
  } catch (error) {
    console.error(`[fetchTechnologyBySlug] Error fetching technology with slug "${slug}":`, error);
    throw error;
  }
};
