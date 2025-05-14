
import { CMSImage, CMSMachine } from '@/types/cms';

/**
 * Transforms a Contentful machine entry into our application's CMSMachine format
 * 
 * @param entry - Contentful entry for a machine
 * @returns CMSMachine - Transformed machine object
 */
export function transformMachineFromContentful(entry: any): CMSMachine {
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
      fields.images.forEach((imageAsset: any) => {
        if (imageAsset && imageAsset.fields) {
          const image = transformContentfulAsset(imageAsset);
          if (image) images.push(image);
        }
      });
    }
    
    // Transform features
    const features: string[] = Array.isArray(fields.features) 
      ? fields.features.filter((f: any) => typeof f === 'string') 
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
      title: String(fields.title || ''),
      name: String(fields.title || ''), // For backward compatibility
      slug: String(fields.slug || ''),
      type: String(fields.type || ''),
      description: String(fields.description || ''),
      shortDescription: String(fields.shortDescription || fields.description?.substring(0, 160) || ''),
      images: images,
      thumbnail: thumbnail,
      mainImage: mainImage,
      features: features,
      specs: specs,
      temperature: fields.temperature ? String(fields.temperature) : 'ambient',
      visible: Boolean(fields.visible),
      featured: Boolean(fields.featured),
      displayOrder: typeof fields.displayOrder === 'number' ? fields.displayOrder : 999,
      showOnHomepage: Boolean(fields.showOnHomepage),
      homepageOrder: typeof fields.homepageOrder === 'number' ? fields.homepageOrder : null,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt
    };
    
    return machine;
  } catch (error) {
    console.error('[machineTransformer] Error transforming machine:', error);
    throw new Error(`Failed to transform machine: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
}

/**
 * Transform a Contentful asset to our CMSImage format
 */
function transformContentfulAsset(asset: any): CMSImage | undefined {
  if (!asset || !asset.fields || !asset.fields.file) {
    return undefined;
  }

  try {
    const file = asset.fields.file;
    const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
    
    return {
      id: asset.sys?.id,
      url,
      alt: asset.fields.title || '',
      filename: file.fileName,
      width: file.details?.image?.width,
      height: file.details?.image?.height
    };
  } catch (error) {
    console.error('[machineTransformer] Error transforming asset:', error);
    return undefined;
  }
}
