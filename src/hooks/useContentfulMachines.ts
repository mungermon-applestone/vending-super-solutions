
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '../services/cms/utils/contentfulClient';
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
export const mapContentfulMachine = (machine: ContentfulMachine) => {
  // Process images to match our expected format
  const processedImages = machine.images?.map(image => ({
    url: `https:${image.fields.file.url}`,
    alt: image.fields.title || machine.title
  })) || [];

  // Process specifications into a consolidated object
  const specs: Record<string, string> = {
    ...(machine.dimensions ? { dimensions: machine.dimensions } : {}),
    ...(machine.weight ? { weight: machine.weight } : {}),
    ...(machine.powerRequirements ? { powerRequirements: machine.powerRequirements } : {}),
    ...(machine.capacity ? { capacity: machine.capacity } : {}),
    ...(machine.paymentOptions ? { paymentOptions: machine.paymentOptions } : {}),
    ...(machine.connectivity ? { connectivity: machine.connectivity } : {}),
    ...(machine.manufacturer ? { manufacturer: machine.manufacturer } : {}),
    ...(machine.warranty ? { warranty: machine.warranty } : {}),
    ...(machine.specs || {})
  };

  return {
    id: machine.id,
    title: machine.title,
    slug: machine.slug,
    type: machine.type,
    temperature: machine.temperature || 'ambient',
    description: machine.description,
    features: machine.features || [],
    images: processedImages,
    specs: specs,
    visible: machine.visible !== false, // Default to true if not specified
  };
};

// Hook to fetch all machines
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      try {
        const machines = await fetchContentfulEntries<ContentfulMachine>('machine');
        console.log('Fetched machines from Contentful:', machines);
        return machines.map(mapContentfulMachine);
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
            const machine = await fetchContentfulEntry<ContentfulMachine>(idOrSlug);
            if (machine) {
              console.log('Found machine by ID:', machine);
              return mapContentfulMachine(machine);
            }
          } catch (idError) {
            console.log('Could not fetch by direct ID, will try by slug next');
          }
        }
        
        // Then try by slug
        console.log('Trying to fetch by slug field:', idOrSlug);
        const machines = await fetchContentfulEntries<ContentfulMachine>('machine', {
          'fields.slug': idOrSlug
        });
        
        if (machines.length === 0) {
          // Special case for divi-wp with known ID
          if (idOrSlug === 'divi-wp') {
            try {
              console.log('Special case: Trying to fetch divi-wp with known ID');
              const diviWpMachine = await fetchContentfulEntry<ContentfulMachine>('1omUbnEhB6OeBFpwPFj1Ww');
              if (diviWpMachine) {
                console.log('Found divi-wp with known ID:', diviWpMachine);
                return mapContentfulMachine(diviWpMachine);
              }
            } catch (knownIdError) {
              console.error('Could not fetch divi-wp with known ID:', knownIdError);
            }
          }
          
          console.warn('No machine found with slug:', idOrSlug);
          return null;
        }
        
        console.log('Found machine by slug:', machines[0]);
        return mapContentfulMachine(machines[0]);
      } catch (error) {
        console.error(`Error fetching machine with slug or ID ${idOrSlug}:`, error);
        toast.error(`Failed to load machine data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}
