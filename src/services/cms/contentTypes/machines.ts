import { supabase } from '@/integrations/supabase/client';
import { transformMachineData } from '../utils/transformers';

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
    
    // Print the final query for debugging
    console.log('[fetchMachines] Running query with filters:', params);
    
    const { data, error } = await query.order('title');
    
    if (error) {
      console.error('[fetchMachines] Error fetching machines:', error);
      throw error;
    }

    // Log raw data before transformation
    console.log(`[fetchMachines] Raw data received: ${data?.length || 0} machines`);
    if (data?.length > 0) {
      console.log('[fetchMachines] First machine sample:', {
        id: data[0].id,
        title: data[0].title,
        slug: data[0].slug
      });
    } else {
      console.warn('[fetchMachines] No machines found in database');
    }

    // Check for possible RLS issues
    if (!data || data.length === 0) {
      console.warn('[fetchMachines] Empty result may indicate RLS policy issues - checking table access');
      
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

    const transformed = transformMachineData<T>(data);
    console.log(`[fetchMachines] Transformed data: ${transformed.length} machines`);
    
    return transformed;
  } catch (error) {
    console.error('[fetchMachines] Error fetching machines:', error);
    throw error;
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
export async function createMachine(machineData: any) {
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
    if (machineData.images && machineData.images.length > 0) {
      const imageInserts = machineData.images.map((image: any, index: number) => ({
        machine_id: machine.id,
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
        console.error('[createMachine] Error adding machine images:', imageError);
        // Continue despite image error
      }
    }
    
    // Add machine specs if provided
    if (machineData.specs && machineData.specs.length > 0) {
      const specInserts = machineData.specs.map((spec: any) => ({
        machine_id: machine.id,
        key: spec.key,
        value: spec.value
      }));
      
      const { error: specError } = await supabase
        .from('machine_specs')
        .insert(specInserts);
      
      if (specError) {
        console.error('[createMachine] Error adding machine specs:', specError);
        // Continue despite spec error
      }
    }
    
    // Add machine features if provided
    if (machineData.features && machineData.features.length > 0) {
      const featureInserts = machineData.features.map((feature: any, index: number) => ({
        machine_id: machine.id,
        feature: feature.text,
        display_order: index
      }));
      
      const { error: featureError } = await supabase
        .from('machine_features')
        .insert(featureInserts);
      
      if (featureError) {
        console.error('[createMachine] Error adding machine features:', featureError);
        // Continue despite feature error
      }
    }
    
    return machine.id;
  } catch (error) {
    console.error('[createMachine] Error:', error);
    throw error;
  }
}

/**
 * Update an existing machine in the CMS
 */
export async function updateMachine(id: string, machineData: any) {
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
      // Delete existing images
      const { error: deleteError } = await supabase
        .from('machine_images')
        .delete()
        .eq('machine_id', id);
      
      if (deleteError) {
        console.error(`[updateMachine] Error deleting existing images for machine ${id}:`, deleteError);
        // Continue despite error
      }
      
      // Add new images
      if (machineData.images.length > 0) {
        const imageInserts = machineData.images.map((image: any, index: number) => ({
          machine_id: id,
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
          console.error(`[updateMachine] Error adding new images for machine ${id}:`, imageError);
          // Continue despite image error
        }
      }
    }
    
    // Update specs: first delete existing, then add new ones
    if (machineData.specs) {
      // Delete existing specs
      const { error: deleteError } = await supabase
        .from('machine_specs')
        .delete()
        .eq('machine_id', id);
      
      if (deleteError) {
        console.error(`[updateMachine] Error deleting existing specs for machine ${id}:`, deleteError);
        // Continue despite error
      }
      
      // Add new specs
      if (machineData.specs.length > 0) {
        const specInserts = machineData.specs.map((spec: any) => ({
          machine_id: id,
          key: spec.key,
          value: spec.value
        }));
        
        const { error: specError } = await supabase
          .from('machine_specs')
          .insert(specInserts);
        
        if (specError) {
          console.error(`[updateMachine] Error adding new specs for machine ${id}:`, specError);
          // Continue despite spec error
        }
      }
    }
    
    // Update features: first delete existing, then add new ones
    if (machineData.features) {
      // Delete existing features
      const { error: deleteError } = await supabase
        .from('machine_features')
        .delete()
        .eq('machine_id', id);
      
      if (deleteError) {
        console.error(`[updateMachine] Error deleting existing features for machine ${id}:`, deleteError);
        // Continue despite error
      }
      
      // Add new features
      if (machineData.features.length > 0) {
        const featureInserts = machineData.features.map((feature: any, index: number) => ({
          machine_id: id,
          feature: feature.text,
          display_order: index
        }));
        
        const { error: featureError } = await supabase
          .from('machine_features')
          .insert(featureInserts);
        
        if (featureError) {
          console.error(`[updateMachine] Error adding new features for machine ${id}:`, featureError);
          // Continue despite feature error
        }
      }
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
export async function deleteMachine(id: string) {
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
