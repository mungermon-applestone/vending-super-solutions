
import { Entry, Asset } from 'contentful';
import { CMSMachine, MachineFeature, MachineImage, MachineSpecification } from '@/services/cms/adapters/machines/types';

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
    
    // Transform main image
    const mainImage = transformContentfulAsset(fields.mainImage);
    
    // Transform gallery images
    const gallery = Array.isArray(fields.gallery) 
      ? fields.gallery.map(transformContentfulAsset).filter(Boolean)
      : [];
    
    // Transform features
    const features = Array.isArray(fields.features)
      ? fields.features.map(transformFeature).filter(Boolean)
      : [];
    
    // Transform specifications
    const specifications = Array.isArray(fields.specifications)
      ? fields.specifications.map(transformSpecification).filter(Boolean)
      : [];
    
    // Build the machine object
    const machine: CMSMachine = {
      id: entry.sys.id,
      contentType: 'machine',
      name: fields.name || '',
      slug: fields.slug || '',
      description: fields.description || '',
      type: fields.type || '',
      mainImage: mainImage,
      gallery: gallery,
      features: features,
      specifications: specifications,
      featured: Boolean(fields.featured),
      displayOrder: typeof fields.displayOrder === 'number' ? fields.displayOrder : 999,
      temperature: fields.temperature || 'ambient',
      deploymentExamples: fields.deploymentExamples || [],
      shortDescription: fields.shortDescription || '',
      createdAt: entry.sys.createdAt || new Date().toISOString(),
      updatedAt: entry.sys.updatedAt || new Date().toISOString()
    };
    
    return machine;
  } catch (error) {
    console.error('[machineTransformer] Error transforming machine:', error);
    throw new Error(`Failed to transform machine: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Transforms a Contentful asset to our MachineImage format
 * 
 * @param asset - Contentful asset
 * @returns MachineImage - Transformed image object
 */
function transformContentfulAsset(asset: Asset): MachineImage {
  if (!asset || !asset.fields) {
    return {
      url: '',
      alt: '',
      width: 0,
      height: 0
    };
  }
  
  return {
    url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : '',
    alt: asset.fields.title || '',
    width: asset.fields.file?.details?.image?.width || 0,
    height: asset.fields.file?.details?.image?.height || 0
  };
}

/**
 * Transforms a Contentful feature entry to our MachineFeature format
 * 
 * @param featureEntry - Contentful feature entry
 * @returns MachineFeature - Transformed feature object
 */
function transformFeature(featureEntry: Entry<any>): MachineFeature {
  if (!featureEntry || !featureEntry.fields) {
    return {
      name: '',
      description: '',
      icon: ''
    };
  }
  
  return {
    name: featureEntry.fields.name || '',
    description: featureEntry.fields.description || '',
    icon: featureEntry.fields.icon || ''
  };
}

/**
 * Transforms a Contentful specification entry to our MachineSpecification format
 * 
 * @param specEntry - Contentful specification entry
 * @returns MachineSpecification - Transformed specification object
 */
function transformSpecification(specEntry: Entry<any>): MachineSpecification {
  if (!specEntry || !specEntry.fields) {
    return {
      name: '',
      value: '',
      unit: '',
      category: 'general'
    };
  }
  
  return {
    name: specEntry.fields.name || '',
    value: specEntry.fields.value || '',
    unit: specEntry.fields.unit || '',
    category: specEntry.fields.category || 'general'
  };
}
