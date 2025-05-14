
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry, isContentfulAsset } from '@/utils/contentfulTypeGuards';
import { CMSMachine, CMSImage } from '@/types/cms';
import { safeString } from '@/services/cms/utils/safeTypeUtilities';

/**
 * Transform a Contentful machine entry to our CMSMachine format
 */
export function transformMachineFromContentful(entry: any): CMSMachine {
  if (!isContentfulEntry(entry)) {
    throw new Error('Invalid Contentful entry provided');
  }
  
  // Get main image URL if it exists
  let mainImage: CMSImage | undefined = undefined;
  
  if (entry.fields.mainImage && isContentfulAsset(entry.fields.mainImage)) {
    const imageUrl = entry.fields.mainImage.fields.file.url;
    mainImage = {
      id: entry.fields.mainImage.sys?.id,
      url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
      alt: safeString(entry.fields.mainImage.fields.title || entry.fields.title || ''),
      width: entry.fields.mainImage.fields.file.details?.image?.width,
      height: entry.fields.mainImage.fields.file.details?.image?.height
    };
  }
  
  // Transform gallery images if they exist
  const galleryImages: CMSImage[] = [];
  if (Array.isArray(entry.fields.gallery)) {
    for (const asset of entry.fields.gallery) {
      if (isContentfulAsset(asset) && asset.fields && asset.fields.file) {
        const imageUrl = asset.fields.file.url;
        galleryImages.push({
          id: asset.sys?.id,
          url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
          alt: safeString(asset.fields.title || ''),
          width: asset.fields.file.details?.image?.width,
          height: asset.fields.file.details?.image?.height
        });
      }
    }
  }
  
  // Handle features
  const features = Array.isArray(entry.fields.features)
    ? entry.fields.features.map((feature: any) => safeString(feature))
    : [];
  
  // Handle specifications
  const specs: Record<string, string> = {};
  if (entry.fields.specifications && Array.isArray(entry.fields.specifications)) {
    entry.fields.specifications.forEach((spec: any) => {
      if (spec.fields && spec.fields.name && spec.fields.value) {
        specs[safeString(spec.fields.name)] = safeString(spec.fields.value);
      }
    });
  }
  
  // Create the machine object with proper type casting
  return {
    id: entry.sys.id,
    title: safeString(entry.fields.title),
    name: safeString(entry.fields.title), // For backwards compatibility
    slug: safeString(entry.fields.slug),
    type: safeString(entry.fields.type || 'vending') as any, // Cast to satisfy TypeScript
    description: safeString(entry.fields.description),
    shortDescription: safeString(entry.fields.shortDescription || entry.fields.description),
    temperature: safeString(entry.fields.temperature || 'ambient'),
    mainImage,
    thumbnail: mainImage, // Use same image as thumbnail for simplicity
    images: galleryImages.length > 0 ? galleryImages : undefined,
    features,
    specs,
    visible: entry.fields.visible !== false, // Default to true if not specified
    featured: !!entry.fields.featured,
    displayOrder: Number(entry.fields.displayOrder || 0),
    createdAt: safeString(entry.sys.createdAt),
    updatedAt: safeString(entry.sys.updatedAt),
    // Include legacy naming convention
    created_at: safeString(entry.sys.createdAt),
    updated_at: safeString(entry.sys.updatedAt),
    showOnHomepage: !!entry.fields.showOnHomepage,
    homepageOrder: entry.fields.homepageOrder ? Number(entry.fields.homepageOrder) : null
  };
}

/**
 * Hook to fetch all machines from Contentful
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('machine');
        
        return entries
          .filter(entry => entry && entry.sys && entry.fields)
          .map((entry: any) => {
            try {
              return transformMachineFromContentful(entry);
            } catch (error) {
              console.error('[useContentfulMachines] Error transforming machine:', error);
              return null;
            }
          }).filter(Boolean) as CMSMachine[];
      } catch (error) {
        console.error('[useContentfulMachines] Error fetching machines:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a specific machine by ID or slug from Contentful
 */
export function useContentfulMachine(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        return null;
      }
      
      try {
        // Try first by matching the slug
        const entriesBySlug = await fetchContentfulEntries('machine', {
          'fields.slug': idOrSlug,
          limit: 1
        });
        
        if (entriesBySlug && entriesBySlug.length > 0) {
          return transformMachineFromContentful(entriesBySlug[0]);
        }
        
        // If no match by slug, try by ID
        try {
          const entryById = await fetchContentfulEntry(idOrSlug);
          if (entryById && entryById.sys && entryById.sys.contentType && 
              entryById.sys.contentType.sys.id === 'machine') {
            return transformMachineFromContentful(entryById);
          }
        } catch (idError) {
          console.log(`[useContentfulMachine] Machine with ID ${idOrSlug} not found`);
        }
        
        console.warn(`[useContentfulMachine] No machine found with slug or ID: ${idOrSlug}`);
        return null;
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine: ${idOrSlug}`, error);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}
