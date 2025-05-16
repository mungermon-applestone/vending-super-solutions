
import { ContentfulMachine } from '@/types/contentful/machine';
import { CMSMachine, CMSImage } from '@/types/cms';

/**
 * Transform a Contentful machine entry to a CMSMachine type
 */
export function transformContentfulMachine(contentfulMachine: ContentfulMachine): CMSMachine {
  // Extract from either top level or fields
  const fields = contentfulMachine.fields || contentfulMachine;
  const sys = contentfulMachine.sys || { id: contentfulMachine.id || '' };

  // Transform images
  const images: CMSImage[] = [];
  
  // Handle images array if it exists
  if (fields.images && Array.isArray(fields.images)) {
    fields.images.forEach((image: any) => {
      if (image && image.fields && image.fields.file && image.fields.file.url) {
        const url = `https:${image.fields.file.url}`;
        images.push({ 
          id: image.sys?.id || `img-${Math.random().toString(36).substr(2, 9)}`,
          url, 
          alt: image.fields.title || 'Machine image'
        });
      }
    });
  }
  
  // Handle thumbnail if it exists
  let thumbnail: CMSImage | undefined = undefined;
  if (fields.thumbnail && fields.thumbnail.fields && fields.thumbnail.fields.file) {
    const url = `https:${fields.thumbnail.fields.file.url}`;
    thumbnail = {
      id: fields.thumbnail.sys?.id || `thumb-${Math.random().toString(36).substr(2, 9)}`,
      url,
      alt: fields.thumbnail.fields.title || 'Machine thumbnail'
    };
  }

  // Handle specs
  const specs = fields.specs || {};
  
  // Add individual specs if they exist at the top level
  if (fields.dimensions) specs.dimensions = fields.dimensions;
  if (fields.weight) specs.weight = fields.weight;
  if (fields.capacity) specs.capacity = fields.capacity;
  if (fields.powerRequirements) specs.powerRequirements = fields.powerRequirements;
  if (fields.paymentOptions) specs.paymentOptions = fields.paymentOptions;
  if (fields.connectivity) specs.connectivity = fields.connectivity;
  if (fields.manufacturer) specs.manufacturer = fields.manufacturer;
  if (fields.warranty) specs.warranty = fields.warranty;
  if (fields.temperature || fields.temperature === '') specs.temperature = fields.temperature;

  // Transform to final format with proper typing
  return {
    id: sys.id,
    title: fields.title || 'Untitled Machine',
    slug: fields.slug || sys.id,
    type: (fields.type as 'vending' | 'locker') || 'vending',
    description: fields.description || '',
    thumbnail: thumbnail,
    images: images,
    features: Array.isArray(fields.features) ? fields.features : [],
    specs: specs
  };
}
