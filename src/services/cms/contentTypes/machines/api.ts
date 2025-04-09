
import { supabase } from '@/integrations/supabase/client';
import { transformMachineData } from '../../utils/transformers';

/**
 * Fetch machines from the CMS
 */
export async function fetchMachines<T>(params: Record<string, any> = {}): Promise<T[]> {
  try {
    console.log('[fetchMachines] Starting fetch with params:', params);
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
    query = applyFiltersToQuery(query, params);
    
    // Print the final query for debugging
    console.log('[fetchMachines] Running query with filters:', params);
    
    const { data, error } = await query.order('title');
    
    if (error) {
      console.error('[fetchMachines] Error fetching machines:', error);
      throw error;
    }

    // Log data received
    logMachinesData(data);

    const transformed = transformMachineData<T>(data);
    console.log(`[fetchMachines] Transformed data: ${transformed.length} machines`);
    
    return transformed;
  } catch (error) {
    console.error('[fetchMachines] Error fetching machines:', error);
    throw error;
  }
}

/**
 * Helper function to apply filters to the query
 */
function applyFiltersToQuery(query: any, params: Record<string, any>) {
  if (params.type) {
    query = query.eq('type', params.type);
  }
  
  if (params.temperature) {
    query = query.eq('temperature', params.temperature);
  }
  
  if (params.slug) {
    query = query.eq('slug', params.slug);
  }
  
  if (params.id) {
    query = query.eq('id', params.id);
  }
  
  return query;
}

/**
 * Helper function to log fetched machines data
 */
function logMachinesData(data: any[] | null) {
  console.log(`[fetchMachines] Raw data received: ${data?.length || 0} machines`);
  if (data?.length > 0) {
    console.log('[fetchMachines] First machine sample:', {
      id: data[0].id,
      title: data[0].title,
      slug: data[0].slug
    });
  } else {
    console.warn('[fetchMachines] No machines found in database');
    
    // Check for possible RLS issues
    console.warn('[fetchMachines] Empty result may indicate RLS policy issues - checking table access');
    checkTableAccess();
  }
}

/**
 * Helper function to check database table access
 */
async function checkTableAccess() {
  // Try a simple count query to verify basic table access
  const { count, error: countError } = await supabase
    .from('machines')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('[fetchMachines] Error accessing machines table:', countError);
  } else {
    console.log(`[fetchMachines] Total count in machines table (may be filtered by RLS): ${count}`);
  }
}

/**
 * Fetch a single machine by its ID
 */
export async function fetchMachineById<T>(id: string): Promise<T | null> {
  try {
    console.log(`[fetchMachineById] Fetching machine with ID: ${id}`);
    
    const { data, error } = await supabase
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
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`[fetchMachineById] Error fetching machine with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      console.warn(`[fetchMachineById] No machine found with ID: ${id}`);
      return null;
    }
    
    const transformed = transformMachineData<T>([data]);
    return transformed.length > 0 ? transformed[0] : null;
  } catch (error) {
    console.error(`[fetchMachineById] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
