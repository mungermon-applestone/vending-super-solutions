
import { supabase } from '@/integrations/supabase/client';
import { CMSTechnology } from '@/types/cms';
import { handleError, transformTechnologyData } from '../../utils/transformers';

export async function fetchTechnologies<T = CMSTechnology>(): Promise<T[]> {
  console.log('[fetchTechnologies] Fetching all technologies from database');

  try {
    // Fetch core technology data
    const { data: technologies, error } = await supabase
      .from('technologies')
      .select(`*`)
      .order('title', { ascending: true });

    if (error) {
      throw error;
    }

    console.log(`[fetchTechnologies] Found ${technologies.length} technologies`);
    
    // Transform the database data into our CMS format - this will be enhanced later
    const transformedData = technologies.map(technology => ({
      ...technology,
      sections: technology.sections || []
    })) as T[];

    return transformedData;
  } catch (error) {
    console.error('[fetchTechnologies] Error fetching technologies:', error);
    return [];
  }
}
