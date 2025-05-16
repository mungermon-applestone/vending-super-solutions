
import { MachineFormValues } from '@/utils/machineMigration/types';

// Mock implementations that don't depend on Supabase

/**
 * Helper function to add machine images (mock implementation)
 */
export async function addMachineImages(machineId: string, machineData: any): Promise<void> {
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
    
    console.log(`[addMachineImages] Mock: Would add ${validImages.length} images for machine ${machineId}`);
  }
}

/**
 * Helper function to add machine specs (mock implementation)
 */
export async function addMachineSpecs(machineId: string, machineData: MachineFormValues): Promise<void> {
  if (!machineId) {
    console.error('[addMachineSpecs] No machine ID provided');
    return;
  }
  
  if (machineData.specs && Array.isArray(machineData.specs) && machineData.specs.length > 0) {
    console.log(`[addMachineSpecs] Mock: Would add ${machineData.specs.length} specs for machine ${machineId}`);
  }
}

/**
 * Helper function to add machine features (mock implementation)
 */
export async function addMachineFeatures(machineId: string, machineData: MachineFormValues): Promise<void> {
  if (!machineId) {
    console.error('[addMachineFeatures] No machine ID provided');
    return;
  }
  
  if (machineData.features && Array.isArray(machineData.features) && machineData.features.length > 0) {
    console.log(`[addMachineFeatures] Mock: Would add ${machineData.features.length} features for machine ${machineId}`);
  }
}

/**
 * Helper function to update machine images (mock implementation)
 */
export async function updateMachineImages(machineId: string, machineData: any): Promise<void> {
  try {
    if (!machineId) {
      console.error('[updateMachineImages] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    console.log(`[updateMachineImages] Mock: Would delete existing images for machine ${machineId}`);
    
    // Add new images if available
    if (machineData.images && Array.isArray(machineData.images) && machineData.images.length > 0) {
      // Ensure all images have valid URLs
      const validImages = machineData.images.filter((img: any) => img && img.url && img.url.trim() !== '');
      
      if (validImages.length > 0) {
        console.log(`[updateMachineImages] Mock: Would add ${validImages.length} new images for machine ${machineId}`);
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
 * Helper function to update machine specs (mock implementation)
 */
export async function updateMachineSpecs(machineId: string, machineData: MachineFormValues): Promise<void> {
  try {
    if (!machineId) {
      console.error('[updateMachineSpecs] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    console.log(`[updateMachineSpecs] Mock: Would delete existing specs for machine ${machineId}`);
    
    // Add new specs if available
    if (machineData.specs && Array.isArray(machineData.specs) && machineData.specs.length > 0) {
      const validSpecs = machineData.specs.filter(spec => spec && spec.key && spec.value);
      if (validSpecs.length > 0) {
        console.log(`[updateMachineSpecs] Mock: Would add ${validSpecs.length} new specs for machine ${machineId}`);
      }
    }
  } catch (error) {
    console.error(`[updateMachineSpecs] Error updating specs for machine ${machineId}:`, error);
    throw error;
  }
}

/**
 * Helper function to update machine features (mock implementation)
 */
export async function updateMachineFeatures(machineId: string, machineData: any): Promise<void> {
  try {
    if (!machineId) {
      console.error('[updateMachineFeatures] No machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    console.log(`[updateMachineFeatures] Mock: Would delete existing features for machine ${machineId}`);
    
    // Add new features if available
    if (machineData.features && Array.isArray(machineData.features) && machineData.features.length > 0) {
      const validFeatures = machineData.features.filter(feature => feature && feature.text);
      if (validFeatures.length > 0) {
        console.log(`[updateMachineFeatures] Mock: Would add ${validFeatures.length} new features for machine ${machineId}`);
      }
    }
  } catch (error) {
    console.error(`[updateMachineFeatures] Error updating features for machine ${machineId}:`, error);
    throw error;
  }
}
