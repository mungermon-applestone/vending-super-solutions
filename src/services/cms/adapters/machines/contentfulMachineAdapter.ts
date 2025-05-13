
/**
 * Contentful Machine Adapter
 * 
 * This adapter interfaces with Contentful to provide machine data.
 */

import { CMSMachine, CMSImage } from '@/types/cms';
import { MachineAdapter } from './types';
import { createDeprecatedWriteOperation } from '@/services/cms/utils/deprecation';

/**
 * Process an image from Contentful to ensure it has the required fields
 */
function processContentfulImage(image: any, machineId: string, index: number): CMSImage {
  if (!image) return { id: `${machineId}-fallback-${index}`, url: '', alt: 'Image not found' };
  
  const fileUrl = image.fields?.file?.url || '';
  const url = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  const alt = image.fields?.title || 'Machine image';
  const id = image.sys?.id || `${machineId}-image-${index}`;
  
  return { id, url, alt };
}

/**
 * Process a Contentful machine entry to normalize the data format
 */
function processContentfulMachine(entry: any): CMSMachine {
  const id = entry.sys?.id || entry.id || 'unknown';
  const fields = entry.fields || entry;
  
  // Process images to ensure they have required fields
  const images = Array.isArray(fields.images) 
    ? fields.images.map((img, idx) => processContentfulImage(img, id, idx))
    : [];
    
  // Process thumbnail if it exists
  let thumbnail;
  if (fields.thumbnail) {
    thumbnail = processContentfulImage(fields.thumbnail, id, 0);
  }
  
  return {
    id,
    title: fields.title || 'Unnamed Machine',
    slug: fields.slug || id,
    type: fields.type || 'vending',
    description: fields.description || '',
    temperature: fields.temperature || 'ambient',
    features: Array.isArray(fields.features) ? fields.features : [],
    images,
    ...(thumbnail ? { thumbnail } : {}),
    specs: fields.specs || {},
    visible: fields.visible !== false // Default to true if not specified
  };
}

/**
 * Implements the machine adapter interface for Contentful
 */
export const contentfulMachineAdapter: MachineAdapter = {
  /**
   * Get all machines from Contentful
   */
  getAll: async (filters = {}) => {
    console.log('Fetching all machines from Contentful with filters:', filters);
    
    // Implementation would query the Contentful API here
    // For now, we return a placeholder
    return Promise.resolve([]);
  },
  
  /**
   * Get a machine by its slug
   */
  getBySlug: async (slug: string) => {
    console.log(`Fetching machine with slug: ${slug} from Contentful`);
    
    // Implementation would query the Contentful API here
    // For now, we return null to indicate "not found"
    return Promise.resolve(null);
  },
  
  /**
   * Get a machine by its ID
   */
  getById: async (id: string) => {
    console.log(`Fetching machine with ID: ${id} from Contentful`);
    
    // Implementation would query the Contentful API here
    // For now, we return null to indicate "not found"
    return Promise.resolve(null);
  },
  
  // Use the deprecated write operation factory for write operations
  create: createDeprecatedWriteOperation('create', 'machine'),
  update: createDeprecatedWriteOperation('update', 'machine'),
  delete: createDeprecatedWriteOperation('delete', 'machine'),
  clone: createDeprecatedWriteOperation('clone', 'machine')
};
