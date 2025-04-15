
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';

// Define fallback data for preview environment
const fallbackMachineData: Record<string, CMSMachine> = {
  'option-4-refrigerated': {
    id: 'fallback-option-4',
    title: 'Option 4 Refrigerated',
    slug: 'option-4-refrigerated',
    type: 'vending',
    description: 'Temperature controlled vending solution.',
    temperature: 'refrigerated',
    features: [
      'Temperature monitoring',
      'Digital display',
      'Remote management'
    ],
    images: [{
      id: 'fallback-image',
      url: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5',
      alt: 'Refrigerated Vending Machine'
    }],
    specs: {
      dimensions: '72" x 39" x 35"',
      weight: '800 lbs',
      capacity: '500+ items'
    }
  },
  'combi-3000': {
    id: 'fallback-combi-3000',
    title: 'Combi 3000',
    slug: 'combi-3000',
    type: 'vending',
    description: 'Combination vending system with multiple product categories and temperature zones.',
    temperature: 'multi',
    features: [
      'Multiple temperature zones',
      'Digital touchscreen interface',
      'Remote inventory management',
      'Multi-product categories'
    ],
    images: [{
      id: 'fallback-combi-image',
      url: 'https://images.unsplash.com/photo-1527256351016-8ad33ff833fc',
      alt: 'Combi 3000 Vending Machine'
    }],
    specs: {
      dimensions: '78"H x 45"W x 38"D',
      weight: '820 lbs',
      capacity: '600+ items',
      powerRequirements: '110V, 10 amps'
    }
  }
};

export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const entries = await fetchContentfulEntries<any>('machine');
        
        return entries.map(entry => ({
          id: entry.id,
          title: entry.title,
          slug: entry.slug,
          type: entry.type || 'vending',
          description: entry.description,
          temperature: entry.temperature || 'ambient',
          features: entry.features || [],
          images: entry.images ? entry.images.map((image: any) => ({
            id: image.sys?.id,
            url: `https:${image.fields?.file?.url}`,
            alt: image.fields?.title || entry.title
          })) : [],
          specs: {
            dimensions: entry.dimensions,
            weight: entry.weight,
            capacity: entry.capacity,
            powerRequirements: entry.powerRequirements,
            paymentOptions: entry.paymentOptions,
            connectivity: entry.connectivity,
            manufacturer: entry.manufacturer,
            warranty: entry.warranty
          }
        })) as CMSMachine[];
      } catch (error) {
        console.error('[useContentfulMachines] Error:', error);
        // In preview environment, return fallback data
        if (window.location.hostname.includes('lovable')) {
          console.log('[useContentfulMachines] Using fallback data in preview');
          return Object.values(fallbackMachineData);
        }
        throw error;
      }
    }
  });
}

export function useContentfulMachine(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log(`[useContentfulMachine] Fetching machine with slug: ${slug}`);
      try {
        const entries = await fetchContentfulEntries<any>('machine', {
          'fields.slug': slug
        });
        
        if (entries.length === 0) {
          console.log(`[useContentfulMachine] No machine found with slug: ${slug}`);
          if (window.location.hostname.includes('lovable') && fallbackMachineData[slug]) {
            console.log(`[useContentfulMachine] Using fallback data for: ${slug}`);
            return fallbackMachineData[slug];
          }
          return null;
        }

        const entry = entries[0];
        return {
          id: entry.id,
          title: entry.title,
          slug: entry.slug,
          type: entry.type || 'vending',
          description: entry.description,
          temperature: entry.temperature || 'ambient',
          features: entry.features || [],
          images: entry.images ? entry.images.map((image: any) => ({
            id: image.sys?.id,
            url: `https:${image.fields?.file?.url}`,
            alt: image.fields?.title || entry.title
          })) : [],
          specs: {
            dimensions: entry.dimensions,
            weight: entry.weight,
            capacity: entry.capacity,
            powerRequirements: entry.powerRequirements,
            paymentOptions: entry.paymentOptions,
            connectivity: entry.connectivity,
            manufacturer: entry.manufacturer,
            warranty: entry.warranty
          }
        } as CMSMachine;
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine:`, error);
        if (window.location.hostname.includes('lovable') && fallbackMachineData[slug]) {
          console.log(`[useContentfulMachine] Using fallback data for: ${slug}`);
          return fallbackMachineData[slug];
        }
        throw error;
      }
    },
    enabled: !!slug
  });
}
