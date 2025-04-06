
import { supabase } from '@/integrations/supabase/client';
import { transformMachineData } from '../utils/transformers';

/**
 * Fetch machines from the CMS
 */
export async function fetchMachines<T>(params: Record<string, any> = {}): Promise<T[]> {
  try {
    let query = supabase
      .from('machines')
      .select(`
        id,
        slug,
        title,
        type,
        temperature,
        description,
        machine_images (
          id,
          url,
          alt,
          width,
          height,
          display_order
        ),
        machine_specs (
          id,
          key,
          value
        ),
        machine_features (
          id,
          feature,
          display_order
        ),
        deployment_examples (
          id,
          title,
          description,
          image_url,
          image_alt,
          display_order
        )
      `)
      .eq('visible', true);
    
    // Apply filters if provided
    if (params.type) {
      query = query.eq('type', params.type);
    }
    
    if (params.temperature) {
      query = query.eq('temperature', params.temperature);
    }
    
    if (params.slug) {
      query = query.eq('slug', params.slug);
    }
    
    const { data, error } = await query.order('title');
    
    if (error) {
      throw error;
    }

    return transformMachineData<T>(data);
  } catch (error) {
    console.error('[fetchFromCMS] Error fetching machines:', error);
    throw error;
  }
}
