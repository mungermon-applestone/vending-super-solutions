
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';

/**
 * Transform a Contentful machine entry into our app's CMSMachine format
 */
function transformMachineFromContentful(entry: any): CMSMachine {
  console.log('[transformMachineFromContentful] Transforming machine:', entry.sys.id);
  
  // Extract images from the entry
  const images = entry.fields.images?.map((image: any) => ({
    id: image.sys?.id,
    url: `https:${image.fields?.file?.url}`,
    alt: image.fields?.title || entry.fields.title,
    width: image.fields?.file?.details?.image?.width,
    height: image.fields?.file?.details?.image?.height
  })) || [];
  
  // Get the main image (first image or undefined)
  const mainImage = images.length > 0 ? images[0] : undefined;
  
  // Get or create a thumbnail
  const thumbnail = entry.fields.thumbnail
    ? {
        id: entry.fields.thumbnail.sys?.id,
        url: `https:${entry.fields.thumbnail.fields?.file?.url}`,
        alt: entry.fields.thumbnail.fields?.title || entry.fields.title,
        width: entry.fields.thumbnail.fields?.file?.details?.image?.width,
        height: entry.fields.thumbnail.fields?.file?.details?.image?.height
      }
    : mainImage;
  
  // Extract features
  const features = entry.fields.features?.map((feature: string) => feature) || [];
  
  // Extract specs
  const specs = entry.fields.specs || {};
  
  // Transform to our app's machine format
  return {
    id: entry.sys.id,
    title: entry.fields.title || 'Untitled Machine',
    slug: entry.fields.slug || entry.sys.id,
    description: entry.fields.description || '',
    shortDescription: entry.fields.shortDescription,
    type: entry.fields.type || 'vending',
    mainImage,
    thumbnail,
    images,
    features,
    specs,
    temperature: entry.fields.temperature || 'ambient',
    featured: entry.fields.featured || false,
    displayOrder: entry.fields.displayOrder || 0,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    visible: entry.fields.visible !== false // Default to true if not specified
  };
}

/**
 * Hook for fetching Contentful machines
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const response = await fetchContentfulEntries('machine');
        console.log('[useContentfulMachines] Fetched entries:', response);
        
        if (!response || response.length === 0) {
          console.log('[useContentfulMachines] No machines found in Contentful');
          return [];
        }
        
        // Transform each machine entry
        const machines = response.map(entry => {
          try {
            return transformMachineFromContentful(entry);
          } catch (transformError) {
            console.error('[useContentfulMachines] Error transforming machine:', transformError);
            return null;
          }
        }).filter(Boolean) as CMSMachine[];
        
        console.log('[useContentfulMachines] Transformed machines:', machines);
        return machines;
        
      } catch (error) {
        console.error('[CRITICAL] Machine fetch failed', {
          error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    }
  });
}

/**
 * Hook for fetching a single Contentful machine
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
        // Try fetching by ID first if it looks like an ID
        if (idOrSlug.length > 10) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry(idOrSlug);
            if (entry) {
              return transformMachineFromContentful(entry);
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
          console.log(`[useContentfulMachine] No machine found with slug: ${idOrSlug}`);
          return null;
        }
        
        return transformMachineFromContentful(entries[0]);
        
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine: ${idOrSlug}`, error);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}

// Export the transformer function to be used elsewhere
export { transformMachineFromContentful };
