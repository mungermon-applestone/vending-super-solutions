
import { supabase } from '@/integrations/supabase/client';
import { transformMachineData } from '../utils/transformers';
import { CMSMachine } from '@/types/cms';
import { MachineFormValues } from '@/utils/machineMigration/types';

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

/**
 * Create a new machine in the CMS
 */
export async function createMachine(machineData: MachineFormValues): Promise<string> {
  try {
    console.log('[createMachine] Creating new machine with data:', machineData);
    
    // First, create the machine record
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .insert({
        title: machineData.title,
        slug: machineData.slug,
        type: machineData.type,
        temperature: machineData.temperature,
        description: machineData.description,
        visible: true
      })
      .select('id')
      .single();
    
    if (machineError) {
      console.error('[createMachine] Error creating machine:', machineError);
      throw machineError;
    }
    
    console.log(`[createMachine] Created machine with ID: ${machine.id}`);
    
    // Add machine images if provided
    await addMachineImages(machine.id, machineData);
    
    // Add machine specs if provided
    await addMachineSpecs(machine.id, machineData);
    
    // Add machine features if provided
    await addMachineFeatures(machine.id, machineData);
    
    return machine.id;
  } catch (error) {
    console.error('[createMachine] Error:', error);
    throw error;
  }
}

/**
 * Update an existing machine in the CMS
 */
export async function updateMachine(id: string, machineData: MachineFormValues): Promise<boolean> {
  try {
    console.log(`[updateMachine] Updating machine with ID: ${id}`, machineData);
    
    // Update the main machine record
    const { error: machineError } = await supabase
      .from('machines')
      .update({
        title: machineData.title,
        slug: machineData.slug,
        type: machineData.type,
        temperature: machineData.temperature,
        description: machineData.description
      })
      .eq('id', id);
    
    if (machineError) {
      console.error(`[updateMachine] Error updating machine with ID ${id}:`, machineError);
      throw machineError;
    }
    
    // Update images: first delete existing, then add new ones
    if (machineData.images) {
      await updateMachineImages(id, machineData);
    }
    
    // Update specs: first delete existing, then add new ones
    if (machineData.specs) {
      await updateMachineSpecs(id, machineData);
    }
    
    // Update features: first delete existing, then add new ones
    if (machineData.features) {
      await updateMachineFeatures(id, machineData);
    }
    
    return true;
  } catch (error) {
    console.error(`[updateMachine] Error updating machine ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a machine from the CMS
 */
export async function deleteMachine(id: string): Promise<boolean> {
  try {
    console.log(`[deleteMachine] Deleting machine with ID: ${id}`);
    
    // Note: We're relying on cascading deletes for related records in the database
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[deleteMachine] Error deleting machine with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`[deleteMachine] Error:`, error);
    throw error;
  }
}

/**
 * Helper function to add machine images
 */
async function addMachineImages(machineId: string, machineData: any) {
  if (machineData.images && machineData.images.length > 0) {
    const imageInserts = machineData.images.map((image: any, index: number) => ({
      machine_id: machineId,
      url: image.url,
      alt: image.alt || machineData.title,
      width: image.width || 800,
      height: image.height || 600,
      display_order: index
    }));
    
    const { error: imageError } = await supabase
      .from('machine_images')
      .insert(imageInserts);
    
    if (imageError) {
      console.error(`[addMachineImages] Error adding images for machine ${machineId}:`, imageError);
      // Continue despite image error
    }
  }
}

/**
 * Helper function to add machine specs
 */
async function addMachineSpecs(machineId: string, machineData: MachineFormValues) {
  if (machineData.specs && machineData.specs.length > 0) {
    console.log(`[addMachineSpecs] Adding ${machineData.specs.length} specs for machine ${machineId}`);
    
    const specInserts = machineData.specs
      .filter(spec => spec.key && spec.value) // Only process specs with both key and value
      .map(spec => ({
        machine_id: machineId,
        key: spec.key,
        value: spec.value
      }));
    
    if (specInserts.length === 0) {
      console.log(`[addMachineSpecs] No valid specs to insert for machine ${machineId}`);
      return;
    }
    
    const { error: specError } = await supabase
      .from('machine_specs')
      .insert(specInserts);
    
    if (specError) {
      console.error(`[addMachineSpecs] Error adding specs for machine ${machineId}:`, specError);
      // Continue despite spec error
    } else {
      console.log(`[addMachineSpecs] Successfully added ${specInserts.length} specs for machine ${machineId}`);
    }
  }
}

/**
 * Helper function to add machine features
 */
async function addMachineFeatures(machineId: string, machineData: MachineFormValues) {
  if (machineData.features && machineData.features.length > 0) {
    console.log(`[addMachineFeatures] Adding ${machineData.features.length} features for machine ${machineId}`);
    
    const featureInserts = machineData.features
      .filter(feature => feature.text) // Only process features with text
      .map((feature, index) => ({
        machine_id: machineId,
        feature: feature.text,
        display_order: index
      }));
    
    if (featureInserts.length === 0) {
      console.log(`[addMachineFeatures] No valid features to insert for machine ${machineId}`);
      return;
    }
    
    const { error: featureError } = await supabase
      .from('machine_features')
      .insert(featureInserts);
    
    if (featureError) {
      console.error(`[addMachineFeatures] Error adding features for machine ${machineId}:`, featureError);
      // Continue despite feature error
    } else {
      console.log(`[addMachineFeatures] Successfully added ${featureInserts.length} features for machine ${machineId}`);
    }
  }
}

/**
 * Helper function to update machine images
 */
async function updateMachineImages(machineId: string, machineData: any) {
  // Delete existing images
  const { error: deleteError } = await supabase
    .from('machine_images')
    .delete()
    .eq('machine_id', machineId);
  
  if (deleteError) {
    console.error(`[updateMachineImages] Error deleting existing images for machine ${machineId}:`, deleteError);
    // Continue despite error
  }
  
  // Add new images
  if (machineData.images && machineData.images.length > 0) {
    await addMachineImages(machineId, machineData);
  }
}

/**
 * Helper function to update machine specs
 */
async function updateMachineSpecs(machineId: string, machineData: MachineFormValues) {
  // Delete existing specs
  console.log(`[updateMachineSpecs] Deleting existing specs for machine ${machineId}`);
  const { error: deleteError } = await supabase
    .from('machine_specs')
    .delete()
    .eq('machine_id', machineId);
  
  if (deleteError) {
    console.error(`[updateMachineSpecs] Error deleting existing specs for machine ${machineId}:`, deleteError);
    // Continue despite error
  }
  
  // Add new specs
  if (machineData.specs && machineData.specs.length > 0) {
    await addMachineSpecs(machineId, machineData);
  }
}

/**
 * Helper function to update machine features
 */
async function updateMachineFeatures(machineId: string, machineData: any) {
  // Delete existing features
  console.log(`[updateMachineFeatures] Deleting existing features for machine ${machineId}`);
  const { error: deleteError } = await supabase
    .from('machine_features')
    .delete()
    .eq('machine_id', machineId);
  
  if (deleteError) {
    console.error(`[updateMachineFeatures] Error deleting existing features for machine ${machineId}:`, deleteError);
    // Continue despite error
  }
  
  // Add new features
  if (machineData.features && machineData.features.length > 0) {
    await addMachineFeatures(machineId, machineData);
  }
}
