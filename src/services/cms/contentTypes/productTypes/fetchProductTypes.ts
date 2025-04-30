
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Fetches all product types from Contentful
 * @param filters Optional filters
 * @returns Array of product types
 */
export async function fetchProductTypes(filters?: any): Promise<CMSProductType[]> {
  try {
    if (!isContentfulConfigured()) {
      console.error('[fetchProductTypes] Contentful is not configured properly');
      toast.error('Contentful configuration is missing or incomplete');
      throw new Error('Contentful is not properly configured');
    }
    
    console.log('[fetchProductTypes] Fetching all product types');
    
    const client = await getContentfulClient();
    
    const query: any = {
      content_type: 'productType',
      include: 2,
      limit: 100
    };
    
    // Apply filters if provided
    if (filters) {
      if (filters.slug) {
        query['fields.slug'] = filters.slug;
      }
      if (filters.visible !== undefined) {
        query['fields.visible'] = filters.visible;
      }
      if (filters.showOnHomepage !== undefined) {
        query['fields.showOnHomepage'] = filters.showOnHomepage;
      }
    }
    
    // Apply sorting if specified or default to displayOrder
    if (filters && filters.sort) {
      query['order'] = filters.sort;
    } else {
      query['order'] = 'fields.displayOrder,fields.title';
    }
    
    console.log('[fetchProductTypes] Query:', query);
    
    const entries = await client.getEntries(query);
    
    console.log(`[fetchProductTypes] Found ${entries.items.length} product types`);
    
    return entries.items.map(entry => {
      // Log the entry structure to help with debugging
      console.log(`[fetchProductTypes] Processing entry:`, {
        id: entry.sys.id,
        title: entry.fields?.title,
        hasSlug: !!entry.fields?.slug,
        hasImage: !!entry.fields?.image,
        hasThumbnail: !!entry.fields?.thumbnail,
        hasRecommendedMachines: Array.isArray(entry.fields?.recommendedMachines),
        recommendedMachineCount: Array.isArray(entry.fields?.recommendedMachines) ? entry.fields.recommendedMachines.length : 0
      });

      // Safely process the entry with null checks
      const processedEntry: CMSProductType = {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
        // Process main image if available
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title || entry.fields.title,
        } : undefined,
        // Process thumbnail if available
        thumbnail: entry.fields.thumbnail ? {
          id: (entry.fields.thumbnail as any).sys.id,
          url: `https:${(entry.fields.thumbnail as any).fields.file.url}`,
          alt: (entry.fields.thumbnail as any).fields.title || entry.fields.title,
        } : undefined,
        features: entry.fields.features ? (entry.fields.features as any[]).map(feature => ({
          id: feature.sys.id,
          title: feature.fields.title,
          description: feature.fields.description,
          icon: feature.fields.icon || undefined
        })) : [],
        visible: !!entry.fields.visible,
        displayOrder: entry.fields.displayOrder ? Number(entry.fields.displayOrder) : undefined,
        showOnHomepage: !!entry.fields.showOnHomepage,
        homepageOrder: entry.fields.homepageOrder ? Number(entry.fields.homepageOrder) : undefined,
      };
      
      // Process recommended machines if available
      if (entry.fields.recommendedMachines && Array.isArray(entry.fields.recommendedMachines)) {
        processedEntry.recommendedMachines = (entry.fields.recommendedMachines as any[])
          .map(machine => {
            if (!machine || !machine.fields) {
              console.warn('[fetchProductTypes] Invalid machine in recommendedMachines', machine);
              return null;
            }
            
            return {
              id: machine.sys.id,
              slug: machine.fields.slug,
              title: machine.fields.title,
              description: machine.fields.description,
              // Include main image if available
              image: machine.fields.images && machine.fields.images[0] ? {
                url: `https:${machine.fields.images[0].fields.file.url}`,
                alt: machine.fields.images[0].fields.title || machine.fields.title
              } : undefined,
              // Include thumbnail if available
              thumbnail: machine.fields.thumbnail ? {
                url: `https:${machine.fields.thumbnail.fields.file.url}`,
                alt: machine.fields.thumbnail.fields.title || machine.fields.title
              } : undefined
            };
          })
          .filter(Boolean); // Filter out any null values
      } else {
        processedEntry.recommendedMachines = [];
      }
      
      return processedEntry;
    });
  } catch (error) {
    console.error('[fetchProductTypes] Error fetching product types:', error);
    toast.error(`Error loading products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}
