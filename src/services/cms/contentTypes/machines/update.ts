
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
    if (machineData.images && machineData.images.length > 0) {
      // Filter out empty image URLs
      const validImages = machineData.images.filter(img => img.url && img.url.trim() !== '');
      
      if (validImages.length > 0) {
        console.log(`[updateMachine] Updating ${validImages.length} images for machine ${id}`);
        await updateMachineImages(id, { ...machineData, images: validImages });
      } else {
        console.log(`[updateMachine] No valid images to update for machine ${id}`);
      }
    }
    
    // Update specs: first delete existing, then add new ones
    if (machineData.specs && machineData.specs.length > 0) {
      await updateMachineSpecs(id, machineData);
    }
    
    // Update features: first delete existing, then add new ones
    if (machineData.features && machineData.features.length > 0) {
      await updateMachineFeatures(id, machineData);
    }
    
    return true;
  } catch (error) {
    console.error(`[updateMachine] Error updating machine ${id}:`, error);
    throw error;
  }
}
