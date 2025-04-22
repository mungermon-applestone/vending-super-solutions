import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';
import { toast } from 'sonner';

// Define fallback data for preview environment - particularly useful for divi-wp
const fallbackMachineData: Record<string, CMSMachine> = {
  'divi-wp': {
    id: '1omUbnEhB6OeBFpwPFj1Ww',
    title: 'DIVI-WP',
    slug: 'divi-wp',
    type: 'vending',
    description: "Weather-protected vending system for outdoor installations with sealed compartments and climate resistance. Perfect for parks, transit stations, and other exposed locations.",
    temperature: 'ambient',
    features: [
      "Weather-resistant construction",
      "Anti-vandal reinforcements",
      "Internal climate control system",
      "Sunlight-readable display",
      "Remote monitoring and diagnostics",
      "Solar power options available",
      "Ruggedized payment systems",
      "High-security locking system with tamper alerts"
    ],
    images: [{
      id: 'fallback-image-divi-wp',
      url: 'https://images.unsplash.com/photo-1557034362-4ec717153f8f',
      alt: 'DIVI-WP - Front View'
    }],
    specs: {
      dimensions: "76\"H x 42\"W x 36\"D",
      weight: "750 lbs (empty)",
      capacity: "Up to 350 items depending on configuration",
      powerRequirements: "110V, 8 amps",
      temperature: "Operating range: -10°F to 110°F with internal climate control",
      connectivity: "WiFi, Ethernet, Cellular (included)",
      paymentOptions: "Credit card, mobile payment, NFC",
      manufacturer: "VendTech Solutions",
      warranty: "3 years standard"
    }
  },
  // ... keep existing fallback data for other machines
};

export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const entries = await fetchContentfulEntries<any>('machine');
        
        return entries.map(entry => {
          // Ensure machine type is one of the allowed values
          const machineType = entry.type === 'locker' ? 'locker' : 'vending';
          
          return {
            id: entry.id,
            title: entry.title,
            slug: entry.slug,
            type: machineType,
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
          };
        }) as CMSMachine[];
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

export function useContentfulMachine(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        console.log('[useContentfulMachine] No ID or slug provided');
        return null;
      }
      
      console.log('[useContentfulMachine] Fetching machine with idOrSlug:', idOrSlug);
      
      try {
        // Special handling for divi-wp to directly fetch by known ID
        if (idOrSlug === 'divi-wp') {
          console.log('[useContentfulMachine] Special case: directly fetching divi-wp with ID: 1omUbnEhB6OeBFpwPFj1Ww');
          try {
            const entry = await fetchContentfulEntry('1omUbnEhB6OeBFpwPFj1Ww');
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched divi-wp entry by ID:', entry);
              // Transform the entry to our expected format
              const machineType = entry.type === 'locker' ? 'locker' : 'vending';
              
              return {
                id: entry.sys?.id || '1omUbnEhB6OeBFpwPFj1Ww',
                title: entry.title || 'DIVI-WP',
                slug: entry.slug || 'divi-wp',
                type: machineType,
                description: entry.description || '',
                temperature: entry.temperature || 'ambient',
                features: entry.features || [],
                images: entry.images ? entry.images.map((image: any) => ({
                  id: image.sys?.id,
                  url: `https:${image.fields?.file?.url}`,
                  alt: image.fields?.title || entry.title
                })) : [],
                specs: {
                  dimensions: entry.dimensions || entry.specs?.dimensions,
                  weight: entry.weight || entry.specs?.weight,
                  capacity: entry.capacity || entry.specs?.capacity,
                  powerRequirements: entry.powerRequirements || entry.specs?.powerRequirements,
                  paymentOptions: entry.paymentOptions || entry.specs?.paymentOptions,
                  connectivity: entry.connectivity || entry.specs?.connectivity,
                  manufacturer: entry.manufacturer || entry.specs?.manufacturer,
                  warranty: entry.warranty || entry.specs?.warranty,
                  temperature: entry.temperature || entry.specs?.temperature
                }
              } as CMSMachine;
            }
          } catch (diviError) {
            console.error('[useContentfulMachine] Error fetching divi-wp by ID:', diviError);
          }
        }
        
        // If not a special case or if special case failed, try fetching by ID first 
        if (idOrSlug.length > 10) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry(idOrSlug);
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched by ID:', entry);
              const machineType = entry.type === 'locker' ? 'locker' : 'vending';
              
              return {
                id: entry.sys?.id || idOrSlug,
                title: entry.title || '',
                slug: entry.slug || idOrSlug,
                type: machineType,
                description: entry.description || '',
                temperature: entry.temperature || 'ambient',
                features: entry.features || [],
                images: entry.images ? entry.images.map((image: any) => ({
                  id: image.sys?.id,
                  url: `https:${image.fields?.file?.url}`,
                  alt: image.fields?.title || entry.title
                })) : [],
                specs: {
                  dimensions: entry.dimensions || entry.specs?.dimensions,
                  weight: entry.weight || entry.specs?.weight,
                  capacity: entry.capacity || entry.specs?.capacity,
                  powerRequirements: entry.powerRequirements || entry.specs?.powerRequirements,
                  paymentOptions: entry.paymentOptions || entry.specs?.paymentOptions,
                  connectivity: entry.connectivity || entry.specs?.connectivity,
                  manufacturer: entry.manufacturer || entry.specs?.manufacturer,
                  warranty: entry.warranty || entry.specs?.warranty,
                  temperature: entry.temperature || entry.specs?.temperature
                }
              } as CMSMachine;
            }
          } catch (idError) {
            console.log('[useContentfulMachine] Could not fetch by ID:', idError);
          }
        }
        
        // Then try by slug
        console.log('[useContentfulMachine] Fetching by slug field:', idOrSlug);
        const entries = await fetchContentfulEntries('machine', {
          'fields.slug': idOrSlug
        });
        
        if (entries.length === 0) {
          console.warn('[useContentfulMachine] No machine found with slug:', idOrSlug);
          
          // If in preview environment and we have fallback data, use it
          if (window.location.hostname.includes('lovable.app') && fallbackMachineData[idOrSlug]) {
            console.log('[useContentfulMachine] Using fallback data for:', idOrSlug);
            return fallbackMachineData[idOrSlug];
          }
          
          return null;
        }
        
        const entry = entries[0];
        console.log('[useContentfulMachine] Found machine by slug:', entry);
        
        // Ensure machine type is one of the allowed values
        const machineType = entry.type === 'locker' ? 'locker' : 'vending';
        
        return {
          id: entry.sys?.id || '',
          title: entry.title || '',
          slug: entry.slug || idOrSlug,
          type: machineType,
          description: entry.description || '',
          temperature: entry.temperature || 'ambient',
          features: entry.features || [],
          images: entry.images ? entry.images.map((image: any) => ({
            id: image.sys?.id,
            url: `https:${image.fields?.file?.url}`,
            alt: image.fields?.title || entry.title
          })) : [],
          specs: {
            dimensions: entry.dimensions || entry.specs?.dimensions,
            weight: entry.weight || entry.specs?.weight,
            capacity: entry.capacity || entry.specs?.capacity,
            powerRequirements: entry.powerRequirements || entry.specs?.powerRequirements,
            paymentOptions: entry.paymentOptions || entry.specs?.paymentOptions,
            connectivity: entry.connectivity || entry.specs?.connectivity,
            manufacturer: entry.manufacturer || entry.specs?.manufacturer,
            warranty: entry.warranty || entry.specs?.warranty,
            temperature: entry.temperature || entry.specs?.temperature
          }
        } as CMSMachine;
      } catch (error) {
        console.error(`[useContentfulMachine] Error:`, error);
        
        // If in preview environment and we have fallback data, use it
        if (window.location.hostname.includes('lovable.app') && fallbackMachineData[idOrSlug]) {
          console.log('[useContentfulMachine] Using fallback data for:', idOrSlug);
          return fallbackMachineData[idOrSlug];
        }
        
        toast.error(`Failed to load machine data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}
