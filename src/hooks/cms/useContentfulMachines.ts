import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';
import { toast } from 'sonner';

/**
 * !!!!! CRITICAL DESIGN NOTES !!!!!
 * 
 * DO NOT MODIFY THIS FILE WITHOUT CAREFUL CONSIDERATION:
 * 
 * This hook is MISSION CRITICAL for machine data retrieval from Contentful.
 * Any changes MUST preserve the following key behaviors:
 * 
 * 1. Fallback mechanism for preview and production environments
 * 2. Graceful error handling
 * 3. Consistent data transformation 
 * 4. Type safety for CMSMachine interface
 * 
 * Potential breaking changes to avoid:
 * - Removing fallback data mechanism
 * - Altering the core data transformation logic
 * - Changing the core query structure
 * - Modifying the error handling strategy
 * 
 * ALWAYS test thoroughly after any modifications!
 */

// Define an interface for Contentful entry structure 
interface ContentfulEntry {
  sys?: {
    id: string;
  };
  id?: string;
  title?: string;
  slug?: string;
  type?: string;
  description?: string;
  temperature?: string;
  features?: string[];
  fields?: {
    title?: string;
    slug?: string;
    type?: string;
    description?: string;
    temperature?: string;
    features?: string[];
    images?: Array<{
      sys?: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
        };
        title?: string;
      };
    }>;
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    paymentOptions?: string;
    connectivity?: string;
    manufacturer?: string;
    warranty?: string;
    specs?: {
      dimensions?: string;
      weight?: string;
      capacity?: string;
      powerRequirements?: string;
      paymentOptions?: string;
      connectivity?: string;
      manufacturer?: string;
      warranty?: string;
      temperature?: string;
      [key: string]: string | undefined;
    };
  };
  images?: Array<{
    sys?: {
      id: string;
    };
    fields?: {
      file?: {
        url?: string;
      };
      title?: string;
    };
  }>;
  dimensions?: string;
  weight?: string;
  capacity?: string;
  powerRequirements?: string;
  paymentOptions?: string;
  connectivity?: string;
  manufacturer?: string;
  warranty?: string;
  specs?: {
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    paymentOptions?: string;
    connectivity?: string;
    manufacturer?: string;
    warranty?: string;
    temperature?: string;
    [key: string]: string | undefined;
  };
}

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
  'option-2-wall-mount': {
    id: 'option2wallmount',
    title: 'Option 2 Wall Mount',
    slug: 'option-2-wall-mount',
    type: 'vending',
    description: "Compact wall-mounted vending solution ideal for offices, break rooms, and small spaces.",
    temperature: 'ambient',
    features: [
      "Space-efficient design",
      "Easy wall mounting",
      "Digital touch interface",
      "Cashless payment system",
      "Remote inventory management"
    ],
    images: [{
      id: 'fallback-option2',
      url: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980',
      alt: 'Option 2 Wall Mount - Front View'
    }],
    specs: {
      dimensions: "32\"H x 28\"W x 18\"D",
      weight: "180 lbs (empty)",
      capacity: "Up to 120 items",
      powerRequirements: "110V, 5 amps",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, NFC",
      manufacturer: "VendTech Solutions",
      warranty: "2 years standard"
    }
  },
  'locker-10-cell': {
    id: 'locker10cell',
    title: 'Locker 10-Cell',
    slug: 'locker-10-cell',
    type: 'locker',
    description: "Modular smart locker system with 10 compartments for secure package delivery and pickup.",
    temperature: 'ambient',
    features: [
      "10 secure compartments",
      "Digital access control",
      "Notification system",
      "Administrative dashboard",
      "Expandable design"
    ],
    images: [{
      id: 'fallback-locker10',
      url: 'https://images.unsplash.com/photo-1606161290795-aa2093b87798',
      alt: 'Locker 10-Cell'
    }],
    specs: {
      dimensions: "72\"H x 36\"W x 24\"D",
      weight: "350 lbs (empty)",
      capacity: "10 compartments of varying sizes",
      powerRequirements: "110V, 3 amps",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      manufacturer: "VendTech Solutions",
      warranty: "3 years standard"
    }
  }
};

/**
 * Transforms a Contentful entry into a consistent CMSMachine format
 * 
 * @param entry - The raw Contentful entry to transform
 * @returns A standardized CMSMachine object
 * 
 * !!!!! TRANSFORMATION RULES !!!!!
 * - Always provide fallback values
 * - Ensure type safety
 * - Handle nested and flat entry structures
 * - Log any unexpected data structures
 */
const transformContentfulEntry = (entry: ContentfulEntry): CMSMachine => {
  console.log('Transforming entry:', entry);
  
  // Handle nested Contentful structure - fields may be at top level or in fields property
  const fields = entry.fields || entry;
  const title = fields.title || '';
  const slug = fields.slug || '';
  
  // Ensure type is strictly "vending" or "locker"
  const type = fields.type === 'locker' ? 'locker' : 'vending';
  
  const description = fields.description || '';
  const temperature = fields.temperature || 'ambient';
  const features = fields.features || [];
  
  // Handle images, which can be complex in Contentful
  let images = [];
  if (fields.images && Array.isArray(fields.images)) {
    images = fields.images.map((image) => {
      const imageFields = image.fields || {};
      const url = imageFields.file?.url ? `https:${imageFields.file.url}` : '';
      const alt = imageFields.title || title || '';
      return {
        id: image.sys?.id || '',
        url: url,
        alt: alt
      };
    });
    
    // Log first image for debugging
    if (images.length > 0) {
      console.log(`First image for ${title}:`, images[0]);
    }
  } else {
    console.log(`No images found for ${title}`);
  }
  
  // Safe access to specs with proper fallbacks
  const specs = {
    dimensions: fields.dimensions || (fields.specs?.dimensions) || '',
    weight: fields.weight || (fields.specs?.weight) || '',
    capacity: fields.capacity || (fields.specs?.capacity) || '',
    powerRequirements: fields.powerRequirements || (fields.specs?.powerRequirements) || '',
    paymentOptions: fields.paymentOptions || (fields.specs?.paymentOptions) || '',
    connectivity: fields.connectivity || (fields.specs?.connectivity) || '',
    manufacturer: fields.manufacturer || (fields.specs?.manufacturer) || '',
    warranty: fields.warranty || (fields.specs?.warranty) || '',
    temperature: fields.temperature || (fields.specs?.temperature) || ''
  };
  
  // Construct the final object
  const machineData: CMSMachine = {
    id: entry.sys?.id || entry.id || '',
    title: title,
    slug: slug,
    type: type, 
    description: description,
    temperature: temperature,
    features: features,
    images: images,
    specs: specs
  };
  
  console.log(`Transformed ${title} (${type}):`, machineData);
  return machineData;
};

/**
 * Hook for fetching Contentful machines
 * 
 * !!!!! DO NOT REMOVE OR FUNDAMENTALLY ALTER !!!!
 * Core requirements:
 * - Fetch all machines
 * - Provide fallback in preview/error scenarios
 * - Consistent error logging
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const entries = await fetchContentfulEntries<ContentfulEntry>('machine');
        console.log('[useContentfulMachines] Fetched entries:', entries);
        
        if (!entries || entries.length === 0) {
          console.log('[useContentfulMachines] No machines found in Contentful');
          
          // If in preview environment and no entries were found, return fallback data
          if (window.location.hostname.includes('lovable')) {
            console.log('[useContentfulMachines] Using fallback data in preview');
            toast.info('Using fallback machine data in preview environment');
            return Object.values(fallbackMachineData);
          }
          
          return [];
        }
        
        // Transform entries
        const machines = entries.map(transformContentfulEntry);
        console.log('[useContentfulMachines] Transformed machines:', machines);
        return machines;
        
      } catch (error) {
        console.error('[CRITICAL] Machine fetch failed', {
          error,
          timestamp: new Date().toISOString()
        });
        
        // In preview environment, return fallback data
        if (window.location.hostname.includes('lovable')) {
          console.log('[useContentfulMachines] Using fallback data after error in preview');
          toast.info('Using fallback machine data in preview environment');
          return Object.values(fallbackMachineData);
        }
        throw error;
      }
    }
  });
}

/**
 * Hook for fetching a single Contentful machine
 * 
 * !!!!! DO NOT REMOVE OR FUNDAMENTALLY ALTER !!!!
 * Core requirements:
 * - Fetch machine by ID or slug
 * - Handle special cases (e.g., divi-wp)
 * - Provide fallback in preview/error scenarios
 */
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
        // Special handling for divi-wp
        if (idOrSlug === 'divi-wp') {
          console.log('[useContentfulMachine] Special case: directly fetching divi-wp with ID: 1omUbnEhB6OeBFpwPFj1Ww');
          
          // First try with the direct ID
          try {
            const entry = await fetchContentfulEntry<ContentfulEntry>('1omUbnEhB6OeBFpwPFj1Ww');
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched divi-wp entry by ID:', entry);
              return transformContentfulEntry(entry);
            }
          } catch (diviError) {
            console.error('[useContentfulMachine] Error fetching divi-wp by ID:', diviError);
          }
          
          // If direct ID fails or in preview environment, use fallback data
          if (window.location.hostname.includes('lovable')) {
            console.log('[useContentfulMachine] Using fallback data for divi-wp in preview');
            toast.info('Using fallback data for DIVI-WP in preview environment');
            return fallbackMachineData['divi-wp'];
          }
          
          // Try by slug as last resort
          try {
            const entriesBySlug = await fetchContentfulEntries<ContentfulEntry>('machine', {
              'fields.slug': 'divi-wp'
            });
            
            if (entriesBySlug.length > 0) {
              console.log('[useContentfulMachine] Found divi-wp by slug query:', entriesBySlug[0]);
              return transformContentfulEntry(entriesBySlug[0]);
            }
          } catch (slugError) {
            console.error('[useContentfulMachine] Error fetching divi-wp by slug:', slugError);
          }
          
          // If all fetching attempts fail but we're in preview, still use fallback
          if (window.location.hostname.includes('lovable')) {
            console.log('[useContentfulMachine] All fetching attempts failed, using fallback');
            return fallbackMachineData['divi-wp'];
          }
          
          return null;
        }
        
        // For all other machines, try fetching by ID first if it looks like an ID 
        if (idOrSlug.length > 10) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry<ContentfulEntry>(idOrSlug);
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched by ID:', entry);
              return transformContentfulEntry(entry);
            }
          } catch (idError) {
            console.log('[useContentfulMachine] Could not fetch by ID:', idError);
          }
        }
        
        // Then try by slug
        console.log('[useContentfulMachine] Fetching by slug field:', idOrSlug);
        const entries = await fetchContentfulEntries<ContentfulEntry>('machine', {
          'fields.slug': idOrSlug
        });
        
        if (entries.length === 0) {
          console.warn('[useContentfulMachine] No machine found with slug:', idOrSlug);
          
          // If in preview environment and we have fallback data, use it
          if (window.location.hostname.includes('lovable') && fallbackMachineData[idOrSlug]) {
            console.log('[useContentfulMachine] Using fallback data for:', idOrSlug);
            return fallbackMachineData[idOrSlug];
          }
          
          return null;
        }
        
        const entry = entries[0];
        console.log('[useContentfulMachine] Found machine by slug:', entry);
        
        return transformContentfulEntry(entry);
      } catch (error) {
        console.error(`[useContentfulMachine] Error:`, error);
        
        // If in preview environment and we have fallback data, use it
        if (window.location.hostname.includes('lovable') && fallbackMachineData[idOrSlug]) {
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

export default { useContentfulMachines, useContentfulMachine };
