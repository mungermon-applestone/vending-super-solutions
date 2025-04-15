
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '../services/cms/utils/contentfulClient';

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
      const machines = await fetchContentfulEntries<ContentfulMachine>('machine');
      return machines.map(mapContentfulMachine);
    }
  });
}

// Hook to fetch a single machine by slug
export function useContentfulMachineBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const machines = await fetchContentfulEntries<ContentfulMachine>('machine', {
        'fields.slug': slug
      });
      
      if (machines.length === 0) return null;
      return mapContentfulMachine(machines[0]);
    },
    enabled: !!slug
  });
}
