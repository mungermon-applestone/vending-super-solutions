
/**
 * Contentful Machine Adapter
 * 
 * This adapter interfaces with Contentful to provide machine data.
 */

import { CMSMachine, CMSImage } from '@/types/cms';
import { MachineAdapter } from './types';
import { createDeprecatedWriteOperation } from '@/services/cms/utils/deprecation';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CONTENTFUL_CONFIG } from '@/config/cms';

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
    ? fields.images.map((img: any, idx: number) => processContentfulImage(img, id, idx))
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
    
    try {
      // Check if Contentful is configured
      if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
        console.error('Contentful not properly configured. Check environment variables.');
        return [];
      }
      
      // Build query for filters
      const query: Record<string, any> = {};
      
      // Process filters
      if (filters.slug) {
        query['fields.slug'] = filters.slug;
      }
      
      if (filters.type) {
        query['fields.type'] = filters.type;
      }
      
      if (filters.visible !== undefined) {
        query['fields.visible'] = filters.visible ? 'true' : 'false';
      }
      
      // Fetch machines from Contentful
      const entries = await fetchContentfulEntries('machine', query);
      console.log(`Fetched ${entries.length} machines from Contentful`);
      
      // Process and return machine data
      return entries.map(processContentfulMachine);
    } catch (error) {
      console.error('Error fetching machines from Contentful:', error);
      return [];
    }
  },
  
  /**
   * Get a machine by its slug
   */
  getBySlug: async (slug: string) => {
    console.log(`Fetching machine with slug: ${slug} from Contentful`);
    
    try {
      // Check if Contentful is configured
      if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
        console.error('Contentful not properly configured. Check environment variables.');
        return null;
      }
      
      // Fetch machines with the specified slug
      const entries = await fetchContentfulEntries('machine', {
        'fields.slug': slug
      });
      
      if (entries.length === 0) {
        console.log(`No machine found with slug: ${slug}`);
        return null;
      }
      
      // Process and return the first matching machine
      return processContentfulMachine(entries[0]);
    } catch (error) {
      console.error(`Error fetching machine with slug ${slug} from Contentful:`, error);
      return null;
    }
  },
  
  /**
   * Get a machine by its ID
   */
  getById: async (id: string) => {
    console.log(`Fetching machine with ID: ${id} from Contentful`);
    
    try {
      // Check if Contentful is configured
      if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
        console.error('Contentful not properly configured. Check environment variables.');
        return null;
      }
      
      // Fetch the machine with the specified ID
      const entry = await fetchContentfulEntry(id);
      
      if (!entry) {
        console.log(`No machine found with ID: ${id}`);
        return null;
      }
      
      // Process and return the machine
      return processContentfulMachine(entry);
    } catch (error) {
      console.error(`Error fetching machine with ID ${id} from Contentful:`, error);
      return null;
    }
  },
  
  // Use the deprecated write operation factory for write operations
  create: createDeprecatedWriteOperation('create', 'machine'),
  update: createDeprecatedWriteOperation('update', 'machine'),
  delete: createDeprecatedWriteOperation('delete', 'machine'),
  clone: createDeprecatedWriteOperation('clone', 'machine')
};
