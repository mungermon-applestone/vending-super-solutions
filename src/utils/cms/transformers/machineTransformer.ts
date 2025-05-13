
import { ContentfulEntry } from '@/types/contentful/machine';
import { CMSMachine } from '@/types/cms';
import { validateMachineData } from '../validation/machineValidation';

/**
 * Transforms a Contentful entry into a consistent CMSMachine format
 * 
 * @param entry - The raw Contentful entry to transform
 * @returns A standardized CMSMachine object
 */
export const transformContentfulEntry = (entry: ContentfulEntry): CMSMachine => {
  console.log('Transforming entry:', entry);
  
  // Handle nested Contentful structure - fields may be at top level or in fields property
  const fields = entry.fields || entry;
  const title = fields.title || '';
  const slug = fields.slug || '';
  
  // Ensure type is strictly "vending" or "locker"
  const type = fields.type === 'locker' ? 'locker' : 'vending';
  
  const description = fields.description || '';
  const temperature = fields.temperature || 'ambient';
  const features = fields.features || [];
  
  // Handle images, which can be complex in Contentful
  let images = [];
  if (fields.images && Array.isArray(fields.images)) {
    images = fields.images.map((image) => {
      const imageFields = image.fields || {};
      const url = imageFields.file?.url ? `https:${imageFields.file.url}` : '';
      const alt = imageFields.title || title || '';
      return {
        id: image.sys?.id || '',
        url: url,
        alt: alt
      };
    });
  }
  
  // Extract thumbnail if available
  let thumbnail = undefined;
  if (fields.thumbnail) {
    const thumbFields = fields.thumbnail.fields || {};
    const thumbUrl = thumbFields.file?.url ? `https:${thumbFields.file.url}` : '';
    const thumbAlt = thumbFields.title || title || '';
    thumbnail = {
      id: fields.thumbnail.sys?.id || '',
      url: thumbUrl,
      alt: thumbAlt
    };
  }
  
  // Safe access to specs with proper fallbacks
  const specs = {
    dimensions: fields.dimensions || (fields.specs?.dimensions) || '',
    weight: fields.weight || (fields.specs?.weight) || '',
    capacity: fields.capacity || (fields.specs?.capacity) || '',
    powerRequirements: fields.powerRequirements || (fields.specs?.powerRequirements) || '',
    paymentOptions: fields.paymentOptions || (fields.specs?.paymentOptions) || '',
    connectivity: fields.connectivity || (fields.specs?.connectivity) || '',
    manufacturer: fields.manufacturer || (fields.specs?.manufacturer) || '',
    warranty: fields.warranty || (fields.specs?.warranty) || '',
    temperature: fields.temperature || (fields.specs?.temperature) || ''
  };
  
  // Construct the final object
  const machineData: CMSMachine = {
    id: entry.sys?.id || entry.id || '',
    title: title,
    slug: slug,
    type: type, 
    description: description,
    temperature: temperature,
    features: features,
    images: images,
    thumbnail: thumbnail,
    specs: specs
  };
  
  // Validate before returning
  try {
    const safeMachine = validateMachineData(machineData);
    return safeMachine;
  } catch (validationError) {
    console.error('[CRITICAL] Machine data validation failed', {
      error: validationError,
      entry,
      timestamp: new Date().toISOString()
    });
    throw validationError;
  }
};
