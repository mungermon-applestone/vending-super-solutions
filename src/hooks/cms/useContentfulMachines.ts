
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry, isContentfulAsset } from '@/utils/contentfulTypeGuards';
import { CMSMachine } from '@/types/cms';

/**
 * Transform a Contentful machine entry to our CMSMachine format
 */
export function transformMachineFromContentful(entry: any): CMSMachine {
  if (!isContentfulEntry(entry)) {
    throw new Error('Invalid Contentful entry provided');
  }
  
  // Get main image URL if it exists
  let mainImageUrl = '';
  let mainImageAlt = '';
  
  if (entry.fields.mainImage && isContentfulAsset(entry.fields.mainImage)) {
    mainImageUrl = `https:${entry.fields.mainImage.fields.file.url}`;
    mainImageAlt = entry.fields.mainImage.fields.title || entry.fields.title || '';
  }
  
  // Transform gallery images if they exist
  const galleryImages = Array.isArray(entry.fields.gallery) 
    ? entry.fields.gallery
      .filter(isContentfulAsset)
      .map(asset => ({
        url: `https:${asset.fields.file.url}`,
        alt: asset.fields.title || '',
        width: asset.fields.file.details?.image?.width,
        height: asset.fields.file.details?.image?.height
      }))
    : [];
  
  // Handle features
  const features = Array.isArray(entry.fields.features)
    ? entry.fields.features.map((feature: any) => feature.toString())
    : [];
  
  // Handle specifications
  const specs: Record<string, string> = {};
  if (entry.fields.specifications && Array.isArray(entry.fields.specifications)) {
    entry.fields.specifications.forEach((spec: any) => {
      if (spec.fields && spec.fields.name && spec.fields.value) {
        specs[spec.fields.name] = spec.fields.value.toString();
      }
    });
  }
  
  return {
    id: entry.sys.id,
    title: entry.fields.title || '',
    name: entry.fields.title || '', // For backwards compatibility
    slug: entry.fields.slug || '',
    type: entry.fields.type || 'vending',
    description: entry.fields.description || '',
    // Use description as shortDescription if not provided
    description: entry.fields.description || '',
    temperature: entry.fields.temperature || 'ambient',
    mainImage: mainImageUrl ? {
      url: mainImageUrl,
      alt: mainImageAlt
    } : undefined,
    images: galleryImages.length > 0 ? galleryImages : undefined,
    features,
    specs,
    visible: entry.fields.visible !== false, // Default to true if not specified
    featured: !!entry.fields.featured,
    displayOrder: entry.fields.displayOrder || 0,
    createdAt: entry.sys.createdAt || '',
    updatedAt: entry.sys.updatedAt || '',
    // Include legacy naming convention
    created_at: entry.sys.createdAt || '',
    updated_at: entry.sys.updatedAt || '',
    showOnHomepage: !!entry.fields.showOnHomepage,
    homepageOrder: entry.fields.homepageOrder || null
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
        
        return entries.map((entry: any) => {
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
          if (entryById && entryById.sys.contentType.sys.id === 'machine') {
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
