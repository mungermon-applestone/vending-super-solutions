
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
          url, 
          alt: image.fields.title || 'Machine image',
          contentType: image.fields.file.contentType || 'image/jpeg'
        });
      }
    });
  }
  
  // Handle thumbnail if it exists
  if (fields.thumbnail && fields.thumbnail.fields && fields.thumbnail.fields.file) {
    const url = `https:${fields.thumbnail.fields.file.url}`;
    if (!images.some(img => img.url === url)) {
      images.push({ 
        url, 
        alt: fields.thumbnail.fields.title || 'Machine thumbnail',
        contentType: fields.thumbnail.fields.file.contentType || 'image/jpeg'
      });
    }
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

  // Transform to final format
  return {
    id: sys.id,
    title: fields.title || 'Untitled Machine',
    slug: fields.slug || sys.id,
    type: fields.type || 'Unknown',
    description: fields.description || '',
    thumbnail: images.length > 0 ? images[0].url : '',
    images: images,
    features: Array.isArray(fields.features) ? fields.features : [],
    specs: specs
  };
}
