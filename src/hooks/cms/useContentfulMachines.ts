
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';
import { isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';
import { safeString, safeArrayField, safeAssetToImage } from '@/services/cms/utils/safeTypeUtilities';

/**
 * Transform a Contentful machine entry into our app's CMSMachine format
 */
export function transformMachineFromContentful(entry: any): CMSMachine {
  if (!isContentfulEntry(entry)) {
    throw new Error('Invalid Contentful entry provided to transformer');
  }
  
  console.log('[transformMachineFromContentful] Transforming machine:', entry.sys.id);
  
  // Extract images from the entry
  const images = safeArrayField(entry.fields, 'images')
    .map((image: any) => {
      if (isContentfulAsset(image)) {
        return {
          id: image.sys?.id || '',
          url: `https:${image.fields?.file?.url || ''}`,
          alt: safeString(image.fields?.title || entry.fields.title || ''),
          width: image.fields?.file?.details?.image?.width,
          height: image.fields?.file?.details?.image?.height
        };
      }
      return null;
    })
    .filter(Boolean) || [];
  
  // Get the main image (first image or undefined)
  const mainImage = images.length > 0 ? images[0] : undefined;
  
  // Get or create a thumbnail
  let thumbnail = undefined;
  if (entry.fields.thumbnail && isContentfulAsset(entry.fields.thumbnail)) {
    thumbnail = {
      id: entry.fields.thumbnail.sys?.id || '',
      url: `https:${entry.fields.thumbnail.fields?.file?.url || ''}`,
      alt: safeString(entry.fields.thumbnail.fields?.title || entry.fields.title || ''),
      width: entry.fields.thumbnail.fields?.file?.details?.image?.width,
      height: entry.fields.thumbnail.fields?.file?.details?.image?.height
    };
  } else {
    thumbnail = mainImage;
  }
  
  // Extract features
  const features = safeArrayField(entry.fields, 'features')
    .map((feature: any) => safeString(feature))
    .filter(Boolean);
  
  // Extract specs as a record
  const specs: Record<string, string> = {};
  if (entry.fields.specs && typeof entry.fields.specs === 'object') {
    Object.entries(entry.fields.specs).forEach(([key, value]) => {
      specs[key] = safeString(value);
    });
  }
  
  // Extract machine type with validation
  let machineType: "vending" | "locker" = "vending"; // Default value
  if (entry.fields.type) {
    const typeStr = safeString(entry.fields.type).toLowerCase();
    if (typeStr === "locker") {
      machineType = "locker";
    }
  }
  
  // Transform to our app's machine format
  return {
    id: entry.sys.id,
    title: safeString(entry.fields.title || 'Untitled Machine'),
    slug: safeString(entry.fields.slug || entry.sys.id),
    description: safeString(entry.fields.description || ''),
    shortDescription: safeString(entry.fields.shortDescription || ''),
    type: machineType,
    mainImage,
    thumbnail,
    images,
    features,
    specs,
    temperature: safeString(entry.fields.temperature || 'ambient') as any,
    featured: Boolean(entry.fields.featured) || false,
    displayOrder: Number(entry.fields.displayOrder) || 0,
    created_at: entry.sys.createdAt,
    updated_at: entry.sys.updatedAt,
    createdAt: entry.sys.createdAt, // Compatibility field
    updatedAt: entry.sys.updatedAt, // Compatibility field
    name: safeString(entry.fields.title || 'Untitled Machine'), // Compatibility field
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
            if (!isContentfulEntry(entry)) {
              console.error('[useContentfulMachines] Invalid entry format:', entry);
              return null;
            }
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
            if (entry && isContentfulEntry(entry)) {
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
        
        if (!entries || entries.length === 0) {
          console.log(`[useContentfulMachine] No machine found with slug: ${idOrSlug}`);
          return null;
        }
        
        if (!isContentfulEntry(entries[0])) {
          console.error('[useContentfulMachine] Invalid entry format:', entries[0]);
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
