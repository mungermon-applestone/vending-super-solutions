
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/contentful/client';
import { toast } from 'sonner';

// Define types for machine content from Contentful
export interface ContentfulMachine {
  id: string;
  title: string;
  slug: string;
  type: 'vending' | 'locker';
  temperature?: string;
  description: string;
  features?: string[];
  images?: Array<{
    fields: {
      file: {
        url: string;
      };
      title?: string;
      description?: string;
    };
  }>;
  dimensions?: string;
  weight?: string;
  powerRequirements?: string;
  capacity?: string;
  paymentOptions?: string;
  connectivity?: string;
  manufacturer?: string;
  warranty?: string;
  specs?: Record<string, string>;
  visible?: boolean;
}

// Map Contentful machine to our app's machine format
export const mapContentfulMachine = (machine: any): ContentfulMachine => {
  const fields = machine.fields || {};
  
  // Process images to match our expected format
  const processedImages = fields.images?.map((image: any) => ({
    fields: {
      file: {
        url: image.fields?.file?.url || ''
      },
      title: image.fields?.title || fields.title || 'Machine image',
      description: image.fields?.description || ''
    }
  })) || [];

  // Process specifications into a consolidated object
  const specs: Record<string, string> = {
    ...(fields.dimensions ? { dimensions: fields.dimensions } : {}),
    ...(fields.weight ? { weight: fields.weight } : {}),
    ...(fields.powerRequirements ? { powerRequirements: fields.powerRequirements } : {}),
    ...(fields.capacity ? { capacity: fields.capacity } : {}),
    ...(fields.paymentOptions ? { paymentOptions: fields.paymentOptions } : {}),
    ...(fields.connectivity ? { connectivity: fields.connectivity } : {}),
    ...(fields.manufacturer ? { manufacturer: fields.manufacturer } : {}),
    ...(fields.warranty ? { warranty: fields.warranty } : {}),
    ...(fields.specs || {})
  };

  return {
    id: machine.sys?.id || 'unknown-id',
    title: fields.title || 'Untitled Machine',
    slug: fields.slug || 'untitled-machine',
    type: fields.type || 'vending',
    temperature: fields.temperature || 'ambient',
    description: fields.description || '',
    features: Array.isArray(fields.features) ? fields.features : [],
    images: processedImages,
    specs: specs,
    visible: fields.visible !== false,
    ...specs
  };
};

// Hook to fetch all machines
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      try {
        const response = await fetchContentfulEntries('machine', {});
        console.log('Fetched machines from Contentful:', response);
        return response.items.map(mapContentfulMachine);
      } catch (error) {
        console.error('Error fetching machines from Contentful:', error);
        toast.error('Failed to fetch machines');
        throw error;
      }
    }
  });
}

// Hook to fetch a single machine by ID or slug
export function useContentfulMachine(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      
      console.log('Fetching Contentful machine with idOrSlug:', idOrSlug);
      
      try {
        // First try as direct ID (for entry IDs like 1omUbnEhB6OeBFpwPFj1Ww)
        if (idOrSlug.length > 10) {
          try {
            console.log('Trying to fetch by direct ID:', idOrSlug);
            const response = await fetchContentfulEntry('machine', idOrSlug);
            if (response) {
              console.log('Found machine by ID:', response);
              return mapContentfulMachine(response);
            }
          } catch (idError) {
            console.log('Could not fetch by direct ID, will try by slug next');
          }
        }
        
        // Then try by slug
        console.log('Trying to fetch by slug field:', idOrSlug);
        const response = await fetchContentfulEntries('machine', {
          'fields.slug': idOrSlug
        });
        
        if (response.items.length === 0) {
          // Special case for divi-wp with known ID
          if (idOrSlug === 'divi-wp') {
            try {
              console.log('Special case: Trying to fetch divi-wp with known ID');
              const response = await fetchContentfulEntry('machine', '1omUbnEhB6OeBFpwPFj1Ww');
              if (response) {
                console.log('Found divi-wp with known ID:', response);
                return mapContentfulMachine(response);
              }
            } catch (knownIdError) {
              console.error('Could not fetch divi-wp with known ID:', knownIdError);
            }
          }
          
          console.warn('No machine found with slug:', idOrSlug);
          return null;
        }
        
        console.log('Found machine by slug:', response.items[0]);
        return mapContentfulMachine(response.items[0]);
      } catch (error) {
        console.error(`Error fetching machine with slug or ID ${idOrSlug}:`, error);
        toast.error(`Failed to load machine data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}
