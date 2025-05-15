
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine, CMSImage } from '@/types/cms';
import { ContentfulEntry } from '@/types/contentful/machine';
import { safeStringArray } from '@/services/cms/utils/safeTypeUtilities';

/**
 * Transform Contentful machine data to our application's CMSMachine format
 */
export function transformMachineFromContentful(entry: ContentfulEntry): CMSMachine {
  // Extract fields from either format
  const fields = entry.fields || entry;
  
  // Extract image data if available
  let mainImage: CMSImage | undefined = undefined;
  if (fields.thumbnail) {
    const imageData = fields.thumbnail;
    const imageUrl = imageData.fields?.file?.url;
    if (imageUrl) {
      mainImage = {
        url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
        alt: imageData.fields?.title || fields.title || '',
        width: imageData.fields?.file?.details?.image?.width,
        height: imageData.fields?.file?.details?.image?.height
      };
    }
  }
  
  // Process images array if available
  const images: CMSImage[] = [];
  if (fields.images && Array.isArray(fields.images)) {
    fields.images.forEach(image => {
      const imageUrl = image.fields?.file?.url;
      if (imageUrl) {
        images.push({
          url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
          alt: image.fields?.title || fields.title || '',
          width: image.fields?.file?.details?.image?.width,
          height: image.fields?.file?.details?.image?.height
        });
      }
    });
  }
  
  // Build specs object from individual properties or specs object
  const specs: Record<string, string> = fields.specs || {};
  
  // Add individual spec fields if they exist
  const specFields = ['dimensions', 'weight', 'capacity', 'powerRequirements', 'paymentOptions', 'connectivity', 'manufacturer', 'warranty'];
  specFields.forEach(field => {
    if (fields[field] && typeof fields[field] === 'string') {
      specs[field] = fields[field] as string;
    }
  });

  // Add temperature to specs if not already present
  if (fields.temperature && !specs.temperature) {
    specs.temperature = fields.temperature as string;
  }
  
  // Extract features array safely
  const features = Array.isArray(fields.features) 
    ? safeStringArray(fields.features) 
    : [];
  
  // Build the standardized machine object
  const machine: CMSMachine = {
    id: entry.sys?.id || entry.id || '',
    title: fields.title as string || 'Untitled Machine',
    name: fields.title as string || 'Untitled Machine', // Add name property for backwards compatibility
    slug: fields.slug as string || '',
    type: fields.type as string || '',
    description: fields.description as string || '',
    shortDescription: fields.shortDescription as string || '',
    temperature: fields.temperature as string || '',
    mainImage,
    images,
    features,
    specs,
    visible: fields.visible !== false,
    featured: fields.featured === true,
    displayOrder: typeof fields.displayOrder === 'number' ? fields.displayOrder : 0,
    createdAt: entry.sys?.createdAt || new Date().toISOString(),
    updatedAt: entry.sys?.updatedAt || new Date().toISOString()
  };
  
  return machine;
}

/**
 * Hook to fetch all machines
 */
export function useContentfulMachines(options?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: ['contentful', 'machines', options],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('machine', options);
        return entries.map(transformMachineFromContentful);
      } catch (error) {
        console.error('[useContentfulMachines] Error fetching machines:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single machine by ID or slug
 */
export function useContentfulMachine(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      
      try {
        // Try to fetch by ID first
        let entry = await fetchContentfulEntry('machine', idOrSlug);
        
        // If not found by ID, try by slug
        if (!entry) {
          const entries = await fetchContentfulEntries('machine', {
            'fields.slug': idOrSlug,
            limit: 1
          });
          entry = entries && entries.length > 0 ? entries[0] : null;
        }
        
        return entry ? transformMachineFromContentful(entry) : null;
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine with ID/slug ${idOrSlug}:`, error);
        return null;
      }
    },
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
