
import { Machine } from '@/types/machine';
import { MachineAdapter } from './types';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { logDeprecation, throwDeprecatedOperationError } from '@/services/cms/utils/deprecation';

/**
 * Contentful implementation of the Machine adapter
 */
export const contentfulMachineAdapter: MachineAdapter = {
  /**
   * Get all machines
   */
  getAll: async (filters = {}): Promise<Machine[]> => {
    try {
      console.log('[contentfulMachineAdapter] Fetching all machines');
      const client = await getContentfulClient();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Failed to initialize Contentful client');
        return [];
      }
      
      const query: any = {
        content_type: 'machine',
        order: 'fields.name'
      };
      
      // Apply any filters
      if (filters && Object.keys(filters).length > 0) {
        // Handle specific filters
        if (filters.featured) {
          query['fields.featured'] = filters.featured === 'true' || filters.featured === true;
        }
        
        if (filters.machineType) {
          query['fields.machineType'] = filters.machineType;
        }
      }
      
      const response = await client.getEntries(query);
      console.log(`[contentfulMachineAdapter] Fetched ${response.items.length} machines`);
      
      // Map Contentful response to our Machine type
      return response.items.map((item: any) => {
        try {
          const machine: Machine = {
            id: item.sys.id,
            name: item.fields.name || 'Unnamed Machine',
            slug: item.fields.slug || '',
            description: item.fields.description || '',
            shortDescription: item.fields.shortDescription || '',
            featured: !!item.fields.featured,
            machineType: item.fields.machineType || 'standard',
            dimensions: {
              height: item.fields.heightInches || 0,
              width: item.fields.widthInches || 0,
              depth: item.fields.depthInches || 0
            },
            weight: item.fields.weightPounds || 0,
            capacity: item.fields.capacity || 0,
            priceRange: {
              low: item.fields.priceLow || 0,
              high: item.fields.priceHigh || 0
            },
            features: item.fields.features || [],
            compatibleProducts: item.fields.compatibleProducts || [],
            image: item.fields.image?.fields?.file?.url ? 
              `https:${item.fields.image.fields.file.url}` : 
              'https://placehold.co/600x400?text=Machine',
            gallery: (item.fields.gallery || [])
              .filter((img: any) => img.fields?.file?.url)
              .map((img: any) => ({
                url: `https:${img.fields.file.url}`,
                alt: img.fields.title || 'Machine Image',
                width: img.fields.file.details.image.width,
                height: img.fields.file.details.image.height
              })),
          };
          
          // Additional fields if present
          if (item.fields.specifications) {
            machine.specifications = item.fields.specifications;
          }
          
          if (item.fields.technicalDetails) {
            machine.technicalDetails = item.fields.technicalDetails;
          }
          
          return machine;
        } catch (err) {
          console.error(`[contentfulMachineAdapter] Error mapping machine with ID ${item.sys.id}:`, err);
          // Return a minimal valid machine object
          return {
            id: item.sys.id,
            name: item.fields?.name || 'Error Loading Machine',
            slug: item.fields?.slug || 'error',
            description: 'Error loading complete machine data',
            shortDescription: 'Error loading data',
            featured: false,
            machineType: 'unknown',
            dimensions: { height: 0, width: 0, depth: 0 },
            weight: 0,
            capacity: 0,
            priceRange: { low: 0, high: 0 },
            features: [],
            compatibleProducts: [],
            image: 'https://placehold.co/600x400?text=Error+Loading+Machine',
            gallery: []
          };
        }
      });
    } catch (error) {
      console.error('[contentfulMachineAdapter] Error fetching machines:', error);
      return [];
    }
  },
  
  /**
   * Get a machine by slug
   */
  getBySlug: async (slug: string): Promise<Machine | null> => {
    try {
      console.log(`[contentfulMachineAdapter] Fetching machine with slug: ${slug}`);
      const client = await getContentfulClient();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Failed to initialize Contentful client');
        return null;
      }
      
      const response = await client.getEntries({
        content_type: 'machine',
        'fields.slug': slug,
        limit: 1
      });
      
      if (response.items.length === 0) {
        console.log(`[contentfulMachineAdapter] No machine found with slug: ${slug}`);
        return null;
      }
      
      const item = response.items[0];
      console.log(`[contentfulMachineAdapter] Found machine: ${item.fields.name}`);
      
      return {
        id: item.sys.id,
        name: item.fields.name || 'Unnamed Machine',
        slug: item.fields.slug || '',
        description: item.fields.description || '',
        shortDescription: item.fields.shortDescription || '',
        featured: !!item.fields.featured,
        machineType: item.fields.machineType || 'standard',
        dimensions: {
          height: item.fields.heightInches || 0,
          width: item.fields.widthInches || 0,
          depth: item.fields.depthInches || 0
        },
        weight: item.fields.weightPounds || 0,
        capacity: item.fields.capacity || 0,
        priceRange: {
          low: item.fields.priceLow || 0,
          high: item.fields.priceHigh || 0
        },
        features: item.fields.features || [],
        compatibleProducts: item.fields.compatibleProducts || [],
        image: item.fields.image?.fields?.file?.url ? 
          `https:${item.fields.image.fields.file.url}` : 
          'https://placehold.co/600x400?text=Machine',
        gallery: (item.fields.gallery || [])
          .filter((img: any) => img.fields?.file?.url)
          .map((img: any) => ({
            url: `https:${img.fields.file.url}`,
            alt: img.fields.title || 'Machine Image',
            width: img.fields.file.details.image.width,
            height: img.fields.file.details.image.height
          })),
        specifications: item.fields.specifications || [],
        technicalDetails: item.fields.technicalDetails || []
      };
    } catch (error) {
      console.error(`[contentfulMachineAdapter] Error fetching machine with slug "${slug}":`, error);
      return null;
    }
  },
  
  /**
   * Get a machine by ID
   */
  getById: async (id: string): Promise<Machine | null> => {
    try {
      console.log(`[contentfulMachineAdapter] Fetching machine with ID: ${id}`);
      const client = await getContentfulClient();
      
      if (!client) {
        console.error('[contentfulMachineAdapter] Failed to initialize Contentful client');
        return null;
      }
      
      const item = await client.getEntry(id);
      
      return {
        id: item.sys.id,
        name: item.fields.name || 'Unnamed Machine',
        slug: item.fields.slug || '',
        description: item.fields.description || '',
        shortDescription: item.fields.shortDescription || '',
        featured: !!item.fields.featured,
        machineType: item.fields.machineType || 'standard',
        dimensions: {
          height: item.fields.heightInches || 0,
          width: item.fields.widthInches || 0,
          depth: item.fields.depthInches || 0
        },
        weight: item.fields.weightPounds || 0,
        capacity: item.fields.capacity || 0,
        priceRange: {
          low: item.fields.priceLow || 0,
          high: item.fields.priceHigh || 0
        },
        features: item.fields.features || [],
        compatibleProducts: item.fields.compatibleProducts || [],
        image: item.fields.image?.fields?.file?.url ? 
          `https:${item.fields.image.fields.file.url}` : 
          'https://placehold.co/600x400?text=Machine',
        gallery: (item.fields.gallery || [])
          .filter((img: any) => img.fields?.file?.url)
          .map((img: any) => ({
            url: `https:${img.fields.file.url}`,
            alt: img.fields.title || 'Machine Image',
            width: img.fields.file.details.image.width,
            height: img.fields.file.details.image.height
          })),
      };
    } catch (error) {
      console.error(`[contentfulMachineAdapter] Error fetching machine with ID "${id}":`, error);
      
      // If entry doesn't exist, return null instead of throwing
      if ((error as Error).message?.includes('not found')) {
        return null;
      }
      
      throw error;
    }
  },
  
  /**
   * @deprecated Use Contentful directly for content creation
   * Create a new machine
   */
  create: async (): Promise<Machine> => {
    logDeprecation('machineAdapter.create', 'Creating machines through the adapter is deprecated', 
      'Use the Contentful web interface directly');
    throwDeprecatedOperationError('create', 'machine');
    return {} as Machine; // This will never actually be reached
  },
  
  /**
   * @deprecated Use Contentful directly for content updates
   * Update a machine
   */
  update: async (): Promise<Machine> => {
    logDeprecation('machineAdapter.update', 'Updating machines through the adapter is deprecated',
      'Use the Contentful web interface directly');
    throwDeprecatedOperationError('update', 'machine');
    return {} as Machine; // This will never actually be reached
  },
  
  /**
   * @deprecated Use Contentful directly for content deletion
   * Delete a machine
   */
  delete: async (): Promise<boolean> => {
    logDeprecation('machineAdapter.delete', 'Deleting machines through the adapter is deprecated',
      'Use the Contentful web interface directly');
    throwDeprecatedOperationError('delete', 'machine'); 
    return false; // This will never actually be reached
  }
};
