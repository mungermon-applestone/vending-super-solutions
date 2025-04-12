
import { supabase } from '@/integrations/supabase/client';
import { MachineFormValues } from '@/utils/machineMigration/types';

/**
 * Helper function to add machine images
 */
export async function addMachineImages(machineId: string, machineData: any) {
  if (!machineId) {
    console.error('[addMachineImages] No machine ID provided');
    return;
  }
  
  if (machineData.images && Array.isArray(machineData.images) && machineData.images.length > 0) {
    // Filter out invalid images
    const validImages = machineData.images.filter((image: any) => image && image.url && image.url.trim() !== '');
    
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
      throw imageError;
    } else {
      console.log(`[addMachineImages] Successfully added ${imageInserts.length} images for machine ${machineId}`);
    }
  }
}

/**
 * Helper function to add machine specs
 */
export async function addMachineSpecs(machineId: string, machineData: MachineFormValues) {
  if (!machineId) {
    console.error('[addMachineSpecs] No machine ID provided');
    return;
  }
  
  if (machineData.specs && Array.isArray(machineData.specs) && machineData.specs.length > 0) {
    console.log(`[addMachineSpecs] Processing ${machineData.specs.length} specs for machine ${machineId}`);
    
    const specInserts = machineData.specs
      .filter(spec => spec && spec.key && spec.value) // Only process specs with both key and value
      .map(spec => ({
        machine_id: machineId,
        key: spec.key,
        value: spec.value
      }));
    
    if (specInserts.length === 0) {
      console.log(`[addMachineSpecs] No valid specs to insert for machine ${machineId}`);
      return;
    }
    
    console.log(`[addMachineSpecs] Inserting ${specInserts.length} specs for machine ${machineId}`);
    const { error: specError } = await supabase
      .from('machine_specs')
      .insert(specInserts);
    
    if (specError) {
      console.error(`[addMachineSpecs] Error adding specs for machine ${machineId}:`, specError);
      throw specError;
    } else {
      console.log(`[addMachineSpecs] Successfully added ${specInserts.length} specs for machine ${machineId}`);
    }
  }
}

/**
 * Helper function to add machine features
 */
export async function addMachineFeatures(machineId: string, machineData: MachineFormValues) {
  if (!machineId) {
    console.error('[addMachineFeatures] No machine ID provided');
    return;
  }
  
  if (machineData.features && Array.isArray(machineData.features) && machineData.features.length > 0) {
    console.log(`[addMachineFeatures] Processing ${machineData.features.length} features for machine ${machineId}`);
    
    const featureInserts = machineData.features
      .filter(feature => feature && feature.text) // Only process features with text
      .map((feature, index) => ({
        machine_id: machineId,
        feature: feature.text,
        display_order: index
      }));
    
    if (featureInserts.length === 0) {
      console.log(`[addMachineFeatures] No valid features to insert for machine ${machineId}`);
      return;
    }
    
    console.log(`[addMachineFeatures] Inserting ${featureInserts.length} features for machine ${machineId}`);
    const { error: featureError } = await supabase
      .from('machine_features')
      .insert(featureInserts);
    
    if (featureError) {
      console.error(`[addMachineFeatures] Error adding features for machine ${machineId}:`, featureError);
      throw featureError;
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
    if (!machineId) {
      console.error('[updateMachineImages] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    // Delete existing images
    console.log(`[updateMachineImages] Deleting existing images for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_images')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineImages] Error deleting existing images for machine ${machineId}:`, deleteError);
      throw deleteError;
    } else {
      console.log(`[updateMachineImages] Successfully deleted existing images for machine ${machineId}`);
    }
    
    // Add new images if available
    if (machineData.images && Array.isArray(machineData.images) && machineData.images.length > 0) {
      // Ensure all images have valid URLs
      const validImages = machineData.images.filter((img: any) => img && img.url && img.url.trim() !== '');
      
      if (validImages.length > 0) {
        console.log(`[updateMachineImages] Adding ${validImages.length} new images for machine ${machineId}`);
        await addMachineImages(machineId, { ...machineData, images: validImages });
      } else {
        console.log(`[updateMachineImages] No valid images to add for machine ${machineId}`);
      }
    } else {
      console.log(`[updateMachineImages] No images to add for machine ${machineId}`);
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
    if (!machineId) {
      console.error('[updateMachineSpecs] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    // Delete existing specs
    console.log(`[updateMachineSpecs] Deleting existing specs for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_specs')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineSpecs] Error deleting existing specs for machine ${machineId}:`, deleteError);
      throw deleteError;
    } else {
      console.log(`[updateMachineSpecs] Successfully deleted existing specs for machine ${machineId}`);
    }
    
    // Add new specs if available
    if (machineData.specs && Array.isArray(machineData.specs) && machineData.specs.length > 0) {
      const validSpecs = machineData.specs.filter(spec => spec && spec.key && spec.value);
      if (validSpecs.length > 0) {
        console.log(`[updateMachineSpecs] Adding ${validSpecs.length} new specs for machine ${machineId}`);
        await addMachineSpecs(machineId, { ...machineData, specs: validSpecs });
      } else {
        console.log(`[updateMachineSpecs] No valid specs to add for machine ${machineId}`);
      }
    } else {
      console.log(`[updateMachineSpecs] No specs to add for machine ${machineId}`);
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
    if (!machineId) {
      console.error('[updateMachineFeatures] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    // Delete existing features
    console.log(`[updateMachineFeatures] Deleting existing features for machine ${machineId}`);
    const { error: deleteError } = await supabase
      .from('machine_features')
      .delete()
      .eq('machine_id', machineId);
    
    if (deleteError) {
      console.error(`[updateMachineFeatures] Error deleting existing features for machine ${machineId}:`, deleteError);
      throw deleteError;
    } else {
      console.log(`[updateMachineFeatures] Successfully deleted existing features for machine ${machineId}`);
    }
    
    // Add new features if available
    if (machineData.features && Array.isArray(machineData.features) && machineData.features.length > 0) {
      const validFeatures = machineData.features.filter(feature => feature && feature.text);
      if (validFeatures.length > 0) {
        console.log(`[updateMachineFeatures] Adding ${validFeatures.length} new features for machine ${machineId}`);
        await addMachineFeatures(machineId, { ...machineData, features: validFeatures });
      } else {
        console.log(`[updateMachineFeatures] No valid features to add for machine ${machineId}`);
      }
    } else {
      console.log(`[updateMachineFeatures] No features to add for machine ${machineId}`);
    }
  } catch (error) {
    console.error(`[updateMachineFeatures] Error updating features for machine ${machineId}:`, error);
    throw error;
  }
}
