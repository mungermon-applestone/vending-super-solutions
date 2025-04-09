
import { supabase } from '@/integrations/supabase/client';
import { handleError, transformTechnologyData } from '../../utils/transformers';

export async function fetchTechnologies<T>(): Promise<T[]> {
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
    
    // Transform the database data into our CMS format
    const transformedData = await Promise.all(
      technologies.map(technology => transformTechnologyData(technology))
    );

    return transformedData as T[];
  } catch (error) {
    return handleError('fetchTechnologies', error);
  }
}
