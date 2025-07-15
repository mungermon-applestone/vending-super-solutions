import { CMSMachine, CMSImage } from '@/types/cms';

/**
 * Adapter function that converts legacy machine data format to CMSMachine type
 */
export function adaptMachineData(machineData: any): CMSMachine {
  // If it's already a CMSMachine type, return as is
  if (machineData && 'images' in machineData && machineData.images && 
      machineData.images.length > 0 && 'id' in machineData.images[0]) {
    return machineData as CMSMachine;
  }
  
  // Otherwise adapt the data to match CMSMachine type
  return {
    ...machineData,
    // Convert images to CMSImage format with required id field
    images: machineData?.images?.map((img: any, index: number) => ({
      id: `img-${index}-${Date.now()}`,
      url: img.url,
      alt: img.alt || '',
      width: img.width || 800,
      height: img.height || 600,
    })) || [],
    // Ensure thumbnail has id if present
    thumbnail: machineData?.thumbnail 
      ? {
          id: `thumb-${Date.now()}`,
          url: machineData.thumbnail.url,
          alt: machineData.thumbnail.alt || '',
          width: machineData.thumbnail.width || 400,
          height: machineData.thumbnail.height || 300,
        }
      : undefined,
  } as CMSMachine;
}
