
import { Entry, Asset } from 'contentful';
import { CMSMachine, CMSImage } from '@/types/cms';

/**
 * Transforms a Contentful machine entry into our application's CMSMachine format
 * 
 * @param entry - Contentful entry for a machine
 * @returns CMSMachine - Transformed machine object
 */
export function transformMachineFromContentful(entry: Entry<any>): CMSMachine {
  if (!entry || !entry.fields) {
    console.error('[machineTransformer] Invalid entry provided:', entry);
    throw new Error('Invalid Contentful entry provided');
  }
  
  try {
    const fields = entry.fields;
    
    // Transform main image (if exists)
    const mainImage = fields.mainImage ? transformContentfulAsset(fields.mainImage) : undefined;
    
    // Transform thumbnail (if exists)
    const thumbnail = fields.machineThumbnail ? transformContentfulAsset(fields.machineThumbnail) : undefined;
    
    // Transform gallery images
    const images: CMSImage[] = [];
    if (Array.isArray(fields.images)) {
      fields.images.forEach(imageAsset => {
        if (imageAsset && imageAsset.fields) {
          const image = transformContentfulAsset(imageAsset);
          if (image) images.push(image);
        }
      });
    }
    
    // Transform features
    const features: string[] = Array.isArray(fields.features) 
      ? fields.features.filter(f => typeof f === 'string') 
      : [];
    
    // Build specs object from individual specification fields
    const specs: Record<string, string> = {};
    if (fields.dimensions) specs.dimensions = String(fields.dimensions);
    if (fields.weight) specs.weight = String(fields.weight);
    if (fields.powerRequirements) specs.powerRequirements = String(fields.powerRequirements);
    if (fields.capacity) specs.capacity = String(fields.capacity);
    if (fields.paymentOptions) specs.paymentOptions = String(fields.paymentOptions);
    if (fields.connectivity) specs.connectivity = String(fields.connectivity);
    if (fields.manufacturer) specs.manufacturer = String(fields.manufacturer);
    if (fields.warranty) specs.warranty = String(fields.warranty);
    if (fields.temperature) specs.temperature = String(fields.temperature);
    
    // Handle nested specs object if it exists
    if (fields.specs && typeof fields.specs === 'object') {
      Object.entries(fields.specs).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          specs[key] = String(value);
        }
      });
    }
    
    // Build the machine object
    const machine: CMSMachine = {
      id: entry.sys.id,
      contentType: 'machine',
      title: String(fields.title || ''),
      name: String(fields.title || ''), // Some components use name instead of title
      slug: String(fields.slug || ''),
      description: String(fields.description || ''),
      type: String(fields.type || ''),
      mainImage,
      thumbnail,
      images,
      features,
      specs,
      featured: Boolean(fields.visible),
      displayOrder: typeof fields.displayOrder === 'number' ? fields.displayOrder : 999,
      temperature: fields.temperature ? String(fields.temperature) : 'ambient',
      shortDescription: fields.shortDescription ? String(fields.shortDescription) : '',
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt
    };
    
    return machine;
  } catch (error) {
    console.error('[machineTransformer] Error transforming machine:', error);
    throw new Error(`Failed to transform machine: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Transform a Contentful entry to our CMSMachine format
 * This is the main function used by the hooks
 */
export function transformContentfulEntry(entry: any): CMSMachine {
  return transformMachineFromContentful(entry);
}

/**
 * Transforms a Contentful asset to our CMSImage format
 * 
 * @param asset - Contentful asset
 * @returns CMSImage - Transformed image object
 */
function transformContentfulAsset(asset: any): CMSImage {
  if (!asset || !asset.fields || !asset.fields.file) {
    return {
      url: '',
      alt: '',
      width: 0,
      height: 0
    };
  }
  
  const file = asset.fields.file;
  const imageDetails = file.details && file.details.image;
  
  return {
    url: file.url ? `https:${file.url}` : '',
    alt: asset.fields.title || '',
    width: imageDetails ? imageDetails.width : 0,
    height: imageDetails ? imageDetails.height : 0
  };
}
