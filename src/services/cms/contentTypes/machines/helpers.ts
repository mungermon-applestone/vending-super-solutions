
import { supabase } from '@/integrations/supabase/client';
import { MachineFormValues } from '@/utils/machineMigration/types';

/**
 * Helper function to add machine images
 */
export async function addMachineImages(machineId: string, machineData: any) {
  if (machineData.images && machineData.images.length > 0) {
    // Filter out invalid images
    const validImages = machineData.images.filter((image: any) => image.url && image.url.trim() !== '');
    
    if (validImages.length === 0) {
      console.log(`[addMachineImages] No valid images to add for machine ${machineId}`);
      return;
    }
    
    const imageInserts = validImages.map((image: any, index: number) => ({
      machine_id: machineId,
      url: image.url.trim(),
      alt: image.alt || machineData.title || '',
      width: image.width || 800,
      height: image.height || 600,
      display_order: index
    }));
    
    console.log(`[addMachineImages] Adding ${imageInserts.length} images for machine ${machineId}`, imageInserts);
    
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
export async function addMachineSpecs(machineId: string, machineData: MachineFormValues) {
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
export async function addMachineFeatures(machineId: string, machineData: MachineFormValues) {
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
export async function updateMachineImages(machineId: string, machineData: any) {
  try {
    // Delete existing images
    console.log(`[updateMachineImages] Deleting existing images for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_images')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineImages] Error deleting existing images for machine ${machineId}:`, deleteError);
      throw deleteError;
    }
    
    // Add new images
    if (machineData.images && machineData.images.length > 0) {
      const validImages = machineData.images.filter((img: any) => img.url && img.url.trim() !== '');
      
      if (validImages.length > 0) {
        console.log(`[updateMachineImages] Adding ${validImages.length} new images for machine ${machineId}`);
        await addMachineImages(machineId, { ...machineData, images: validImages });
      } else {
        console.log(`[updateMachineImages] No valid images to add for machine ${machineId}`);
      }
    }
  } catch (error) {
    console.error(`[updateMachineImages] Error updating images for machine ${machineId}:`, error);
    throw error;
  }
}

/**
 * Helper function to update machine specs
 */
export async function updateMachineSpecs(machineId: string, machineData: MachineFormValues) {
  try {
    // Delete existing specs
    console.log(`[updateMachineSpecs] Deleting existing specs for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_specs')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineSpecs] Error deleting existing specs for machine ${machineId}:`, deleteError);
      throw deleteError;
    }
    
    // Add new specs
    if (machineData.specs && machineData.specs.length > 0) {
      await addMachineSpecs(machineId, machineData);
    }
  } catch (error) {
    console.error(`[updateMachineSpecs] Error updating specs for machine ${machineId}:`, error);
    throw error;
  }
}

/**
 * Helper function to update machine features
 */
export async function updateMachineFeatures(machineId: string, machineData: any) {
  try {
    // Delete existing features
    console.log(`[updateMachineFeatures] Deleting existing features for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_features')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineFeatures] Error deleting existing features for machine ${machineId}:`, deleteError);
      throw deleteError;
    }
    
    // Add new features
    if (machineData.features && machineData.features.length > 0) {
      await addMachineFeatures(machineId, machineData);
    }
  } catch (error) {
    console.error(`[updateMachineFeatures] Error updating features for machine ${machineId}:`, error);
    throw error;
  }
}
