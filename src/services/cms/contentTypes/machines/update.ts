
import { supabase } from '@/integrations/supabase/client';
import { MachineFormValues } from '@/utils/machineMigration/types';
import { 
  updateMachineImages, 
  updateMachineSpecs, 
  updateMachineFeatures 
} from './helpers';

/**
 * Update an existing machine in the CMS
 */
export async function updateMachine(id: string, machineData: MachineFormValues): Promise<boolean> {
  try {
    console.log(`[updateMachine] Starting update for machine with ID: ${id}`, JSON.stringify(machineData));
    
    // Check if the ID is valid
    if (!id) {
      console.error('[updateMachine] Invalid machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    // Validate required fields
    if (!machineData.title || !machineData.slug || !machineData.type || !machineData.temperature) {
      console.error('[updateMachine] Missing required fields:', { 
        title: !!machineData.title, 
        slug: !!machineData.slug, 
        type: !!machineData.type, 
        temperature: !!machineData.temperature 
      });
      throw new Error('Missing required machine fields');
    }
    
    console.log(`[updateMachine] Updating main record for machine ID: ${id}`);
    
    // Update the main machine record
    const { error: machineError } = await supabase
      .from('machines')
      .update({
        title: machineData.title,
        slug: machineData.slug,
        type: machineData.type,
        temperature: machineData.temperature,
        description: machineData.description || ''
      })
      .eq('id', id);
    
    if (machineError) {
      console.error(`[updateMachine] Error updating machine with ID ${id}:`, machineError);
      throw machineError;
    }
    
    console.log(`[updateMachine] Main record updated successfully for machine ID: ${id}`);
    
    // Process images
    if (machineData.images && Array.isArray(machineData.images)) {
      // Filter out empty image URLs before processing
      const validImages = machineData.images.filter(img => img && img.url && img.url.trim() !== '');
      
      console.log(`[updateMachine] Processing ${validImages.length} images for machine ${id}`);
      await updateMachineImages(id, { ...machineData, images: validImages });
    } else {
      console.log(`[updateMachine] No images to process for machine ${id}`);
      await updateMachineImages(id, { ...machineData, images: [] });
    }
    
    // Process specs
    if (machineData.specs && Array.isArray(machineData.specs)) {
      // Filter out invalid specs
      const validSpecs = machineData.specs.filter(spec => spec && spec.key && spec.value);
      console.log(`[updateMachine] Processing ${validSpecs.length} specs for machine ${id}`);
      await updateMachineSpecs(id, { ...machineData, specs: validSpecs });
    } else {
      console.log(`[updateMachine] No specs to process for machine ${id}`);
      await updateMachineSpecs(id, { ...machineData, specs: [] });
    }
    
    // Process features
    if (machineData.features && Array.isArray(machineData.features)) {
      // Filter out invalid features
      const validFeatures = machineData.features.filter(feature => feature && feature.text);
      console.log(`[updateMachine] Processing ${validFeatures.length} features for machine ${id}`);
      await updateMachineFeatures(id, { ...machineData, features: validFeatures });
    } else {
      console.log(`[updateMachine] No features to process for machine ${id}`);
      await updateMachineFeatures(id, { ...machineData, features: [] });
    }
    
    console.log(`[updateMachine] Successfully completed update for machine ${id}`);
    return true;
  } catch (error) {
    console.error(`[updateMachine] Error updating machine ${id}:`, error);
    throw error;
  }
}
