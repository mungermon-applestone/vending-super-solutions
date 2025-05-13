
/**
 * Contentful Machine Adapter
 * 
 * This adapter interfaces with Contentful to provide machine data.
 */

import { CMSMachine } from '@/types/cms';
import { MachineAdapter, MachineCreateInput, MachineUpdateInput } from './types';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulEntry } from '@/types/contentful/machine';
import { transformContentfulEntry } from '@/utils/cms/transformers/machineTransformer';
import { createDeprecatedWriteOperation } from '@/services/cms/utils/deprecation';

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
      const query: Record<string, any> = {};
      
      // Add filters for type if specified
      if (filters.type) {
        query['fields.type'] = filters.type;
      }
      
      // Add filters for slug if specified
      if (filters.slug) {
        query['fields.slug'] = filters.slug;
      }
      
      // Filter by visibility status if specified
      if (filters.visible !== undefined) {
        query['fields.visible'] = filters.visible;
      }
      
      // Add filters for temperature if specified
      if (filters.temperature) {
        query['fields.temperature'] = filters.temperature;
      }
      
      // Get entries from Contentful
      const entries = await fetchContentfulEntries<ContentfulEntry>('machine', query);
      
      // Transform entries to CMSMachine objects
      const machines = entries.map(entry => transformContentfulEntry(entry));
      
      return machines;
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
      // Query by slug
      const entries = await fetchContentfulEntries<ContentfulEntry>('machine', {
        'fields.slug': slug
      });
      
      if (entries.length === 0) {
        console.log(`No machine found with slug: ${slug}`);
        return null;
      }
      
      // Transform the first entry to a CMSMachine object
      const machine = transformContentfulEntry(entries[0]);
      
      return machine;
    } catch (error) {
      console.error(`Error fetching machine with slug: ${slug}`, error);
      return null;
    }
  },
  
  /**
   * Get a machine by its ID
   */
  getById: async (id: string) => {
    console.log(`Fetching machine with ID: ${id} from Contentful`);
    
    try {
      // Direct fetch by entry ID
      const entry = await fetchContentfulEntry<ContentfulEntry>(id);
      
      // Transform the entry to a CMSMachine object
      const machine = transformContentfulEntry(entry);
      
      return machine;
    } catch (error) {
      console.error(`Error fetching machine with ID: ${id}`, error);
      return null;
    }
  },
  
  // Write operations are deprecated in favor of using Contentful directly
  create: createDeprecatedWriteOperation('create', 'machine'),
  update: createDeprecatedWriteOperation('update', 'machine'),
  delete: createDeprecatedWriteOperation('delete', 'machine'),
  clone: createDeprecatedWriteOperation('clone', 'machine')
};
