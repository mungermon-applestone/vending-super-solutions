
import { ContentfulClientApi, EntryCollection, Entry, Asset } from 'contentful';
import { getContentfulClientInstance } from '@/services/cms/utils/contentfulClient';
import { transformMachineFromContentful } from '@/utils/cms/transformers/machineTransformer';
import { validateMachineData } from '@/utils/cms/validation/machineValidation';
import { CMSMachine, MachineFeature, MachineSpecification } from './types';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Contentful Machine Adapter Implementation
 * Provides methods for fetching machine data from Contentful CMS
 */
export const contentfulMachineAdapter = {
  /**
   * Fetch all machines from Contentful
   * 
   * @returns Promise<CMSMachine[]> - Array of machine objects
   */
  getMachines: async (): Promise<CMSMachine[]> => {
    try {
      console.log('[contentfulMachineAdapter] Fetching all machines');
      const client = getContentfulClientInstance();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Contentful client is not available');
        return [];
      }
      
      const response: EntryCollection<any> = await client.getEntries({
        content_type: 'machine',
        include: 2, // Include 2 levels of linked entries
        limit: 100,
      });
      
      console.log(`[contentfulMachineAdapter] Fetched ${response.items.length} machines`);
      
      // Transform and validate each machine entry
      const machines = response.items.map(entry => {
        const machine = transformMachineFromContentful(entry);
        validateMachineData(machine);
        return machine;
      });
      
      return machines;
    } catch (error) {
      console.error('[contentfulMachineAdapter] Error fetching machines:', error);
      return [];
    }
  },
  
  /**
   * Fetch a single machine by slug
   * 
   * @param slug - Machine slug to find
   * @returns Promise<CMSMachine | null> - Machine object or null if not found
   */
  getMachineBySlug: async (slug: string): Promise<CMSMachine | null> => {
    try {
      console.log(`[contentfulMachineAdapter] Fetching machine by slug: ${slug}`);
      
      if (!slug) {
        console.error('[contentfulMachineAdapter] Invalid slug provided');
        return null;
      }
      
      const client = getContentfulClientInstance();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Contentful client is not available');
        return null;
      }
      
      const response: EntryCollection<any> = await client.getEntries({
        content_type: 'machine',
        'fields.slug': slug,
        include: 2,
      });
      
      if (response.items.length === 0) {
        console.warn(`[contentfulMachineAdapter] No machine found with slug: ${slug}`);
        return null;
      }
      
      const machine = transformMachineFromContentful(response.items[0]);
      validateMachineData(machine);
      
      return machine;
    } catch (error) {
      console.error(`[contentfulMachineAdapter] Error fetching machine by slug ${slug}:`, error);
      return null;
    }
  },
  
  /**
   * Create a new machine
   * 
   * @param machine - Machine data to create
   * @returns Promise<CMSMachine | null> - Created machine or null on error
   */
  createMachine: async (machine: Partial<CMSMachine>): Promise<CMSMachine | null> => {
    // This is now handled through Contentful UI
    logDeprecation(
      'contentfulMachineAdapter.createMachine',
      'Creating machines through the API is deprecated',
      'Use Contentful UI to manage machine content'
    );
    
    console.warn('[contentfulMachineAdapter] Machine creation is managed through Contentful UI');
    return null;
  },
  
  /**
   * Update an existing machine
   * 
   * @param id - Machine ID to update
   * @param machine - Updated machine data
   * @returns Promise<CMSMachine | null> - Updated machine or null on error
   */
  updateMachine: async (id: string, machine: Partial<CMSMachine>): Promise<CMSMachine | null> => {
    // This is now handled through Contentful UI
    logDeprecation(
      'contentfulMachineAdapter.updateMachine',
      'Updating machines through the API is deprecated',
      'Use Contentful UI to manage machine content'
    );
    
    console.warn('[contentfulMachineAdapter] Machine updates are managed through Contentful UI');
    return null;
  },
  
  /**
   * Delete a machine
   * 
   * @param id - Machine ID to delete
   * @returns Promise<boolean> - Success status
   */
  deleteMachine: async (id: string): Promise<boolean> => {
    // This is now handled through Contentful UI
    logDeprecation(
      'contentfulMachineAdapter.deleteMachine',
      'Deleting machines through the API is deprecated',
      'Use Contentful UI to manage machine content'
    );
    
    console.warn('[contentfulMachineAdapter] Machine deletion is managed through Contentful UI');
    return false;
  },
  
  /**
   * Get featured machines
   * 
   * @param limit - Maximum number of machines to fetch
   * @returns Promise<CMSMachine[]> - Array of featured machines
   */
  getFeaturedMachines: async (limit: number = 4): Promise<CMSMachine[]> => {
    try {
      console.log(`[contentfulMachineAdapter] Fetching featured machines (limit: ${limit})`);
      const client = getContentfulClientInstance();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Contentful client is not available');
        return [];
      }
      
      const response: EntryCollection<any> = await client.getEntries({
        content_type: 'machine',
        'fields.featured': true,
        order: 'fields.displayOrder',
        limit,
        include: 2,
      });
      
      console.log(`[contentfulMachineAdapter] Fetched ${response.items.length} featured machines`);
      
      const machines = response.items.map(entry => {
        const machine = transformMachineFromContentful(entry);
        validateMachineData(machine);
        return machine;
      });
      
      return machines;
    } catch (error) {
      console.error('[contentfulMachineAdapter] Error fetching featured machines:', error);
      return [];
    }
  },
  
  /**
   * Get machines by type
   * 
   * @param type - Machine type to filter by
   * @returns Promise<CMSMachine[]> - Array of matching machines
   */
  getMachinesByType: async (type: string): Promise<CMSMachine[]> => {
    try {
      console.log(`[contentfulMachineAdapter] Fetching machines by type: ${type}`);
      
      if (!type) {
        console.error('[contentfulMachineAdapter] Invalid type provided');
        return [];
      }
      
      const client = getContentfulClientInstance();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Contentful client is not available');
        return [];
      }
      
      const response: EntryCollection<any> = await client.getEntries({
        content_type: 'machine',
        'fields.type': type,
        order: 'fields.displayOrder',
        include: 2,
      });
      
      console.log(`[contentfulMachineAdapter] Fetched ${response.items.length} machines of type ${type}`);
      
      const machines = response.items.map(entry => {
        const machine = transformMachineFromContentful(entry);
        validateMachineData(machine);
        return machine;
      });
      
      return machines;
    } catch (error) {
      console.error(`[contentfulMachineAdapter] Error fetching machines by type ${type}:`, error);
      return [];
    }
  }
};
