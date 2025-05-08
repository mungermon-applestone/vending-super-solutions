
import { CMSProductType } from "@/types/cms";
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from "./types";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";

/**
 * Contentful implementation of the Product adapter
 */
export const contentfulProductAdapter: ProductAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSProductType[]> => {
    console.log('[contentfulProductAdapter] Fetching all products', filters);
    
    try {
      const client = await getContentfulClient();
      
      // Build query parameters
      const queryParams: any = {
        content_type: 'productType',
        include: 2,
        limit: 100
      };
      
      // Apply additional filters if provided
      if (filters) {
        if (filters.slug) {
          queryParams['fields.slug'] = filters.slug;
        }
      }
      
      const entries = await client.getEntries(queryParams);
      
      console.log(`[contentfulProductAdapter] Found ${entries.items.length} products`);
      
      // Transform Contentful entries to CMSProductType
      return entries.items.map(entry => {
        const fields = entry.fields;
        return {
          id: entry.sys.id,
          title: fields.title as string,
          slug: fields.slug as string,
          description: fields.description as string,
          benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
          image: fields.image ? {
            id: (fields.image as any).sys.id,
            url: `https:${(fields.image as any).fields.file.url}`,
            alt: (fields.image as any).fields.title || fields.title,
          } : undefined,
          features: fields.features ? (fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon || undefined
          })) : [],
          recommendedMachines: fields.recommendedMachines ? (fields.recommendedMachines as any[]).map(machine => {
            // Log machine data to help with debugging
            console.log(`[contentfulProductAdapter] Processing machine ${machine.fields?.title || 'unknown'}:`, {
              hasImage: !!machine.fields?.image,
              hasMachineThumbnail: !!machine.fields?.machineThumbnail
            });
            
            return {
              id: machine.sys.id,
              title: machine.fields.title,
              slug: machine.fields.slug,
              description: machine.fields.description,
              image: machine.fields.image ? {
                url: `https:${machine.fields.image.fields.file.url}`,
                alt: machine.fields.image.fields.title || machine.fields.title
              } : undefined,
              // Use machineThumbnail instead of thumbnail
              thumbnail: machine.fields.machineThumbnail ? {
                url: `https:${machine.fields.machineThumbnail.fields.file.url}`,
                alt: machine.fields.machineThumbnail.fields.title || machine.fields.title
              } : undefined
            };
          }) : [],
          // Add video support - now using videoPreviewImage instead of videoThumbnail
          video: fields.video ? {
            title: fields.videoTitle as string || 'Product Demo',
            description: fields.videoDescription as string || 'See our solution in action',
            thumbnailImage: fields.videoPreviewImage ? {
              id: (fields.videoPreviewImage as any).sys.id,
              url: `https:${(fields.videoPreviewImage as any).fields.file.url}`,
              alt: (fields.videoPreviewImage as any).fields.title || 'Video thumbnail',
            } : {
              id: 'default-thumbnail',
              url: fields.image ? `https:${(fields.image as any).fields.file.url}` : '/placeholder.svg',
              alt: 'Video thumbnail',
            },
            url: fields.video.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
            youtubeId: fields.youtubeVideoId as string || undefined
          } : undefined
        } as CMSProductType;
      });
    } catch (error) {
      console.error('[contentfulProductAdapter] Error in getAll:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    console.log(`[contentfulProductAdapter] Fetching product by slug: ${slug}`);
    
    if (!slug) {
      console.warn("[contentfulProductAdapter] Empty slug passed to getBySlug");
      return null;
    }
    
    try {
      const products = await contentfulProductAdapter.getAll({ slug });
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error(`[contentfulProductAdapter] Error getting product by slug ${slug}:`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSProductType | null> => {
    console.log(`[contentfulProductAdapter] Fetching product by ID: ${id}`);
    
    if (!id) {
      console.warn("[contentfulProductAdapter] Empty ID passed to getById");
      return null;
    }
    
    try {
      const client = await getContentfulClient();
      const entry = await client.getEntry(id, { include: 2 });
      
      if (!entry || !entry.fields) {
        return null;
      }
      
      const fields = entry.fields;
      
      return {
        id: entry.sys.id,
        title: fields.title as string,
        slug: fields.slug as string,
        description: fields.description as string,
        benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
        image: fields.image ? {
          id: (fields.image as any).sys.id,
          url: `https:${(fields.image as any).fields.file.url}`,
          alt: (fields.image as any).fields.title || fields.title,
        } : undefined,
        features: fields.features ? (fields.features as any[]).map(feature => ({
          id: feature.sys.id,
          title: feature.fields.title,
          description: feature.fields.description,
          icon: feature.fields.icon || undefined
        })) : [],
        recommendedMachines: fields.recommendedMachines ? (fields.recommendedMachines as any[]).map(machine => {
          // Log machine data for debugging
          console.log(`[contentfulProductAdapter] Processing machine ${machine.fields?.title || 'unknown'} in getById:`, {
            hasImage: !!machine.fields?.image,
            hasMachineThumbnail: !!machine.fields?.machineThumbnail
          });
          
          return {
            id: machine.sys.id,
            title: machine.fields.title,
            slug: machine.fields.slug,
            description: machine.fields.description,
            image: machine.fields.image ? {
              url: `https:${machine.fields.image.fields.file.url}`,
              alt: machine.fields.image.fields.title || machine.fields.title
            } : undefined,
            // Use machineThumbnail instead of thumbnail
            thumbnail: machine.fields.machineThumbnail ? {
              url: `https:${machine.fields.machineThumbnail.fields.file.url}`,
              alt: machine.fields.machineThumbnail.fields.title || machine.fields.title
            } : undefined
          };
        }) : [],
        // Add video support to getById method - use videoPreviewImage instead of videoThumbnail
        video: fields.video ? {
          title: fields.videoTitle as string || 'Product Demo',
          description: fields.videoDescription as string || 'See our solution in action',
          thumbnailImage: fields.videoPreviewImage ? {
            id: (fields.videoPreviewImage as any).sys.id,
            url: `https:${(fields.videoPreviewImage as any).fields.file.url}`,
            alt: (fields.videoPreviewImage as any).fields.title || 'Video thumbnail',
          } : {
            id: 'default-thumbnail',
            url: fields.image ? `https:${(fields.image as any).fields.file.url}` : '/placeholder.svg',
            alt: 'Video thumbnail',
          },
          url: fields.video.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
          youtubeId: fields.youtubeVideoId as string || undefined
        } : undefined
      } as CMSProductType;
    } catch (error) {
      console.error(`[contentfulProductAdapter] Error in getById for ID ${id}:`, error);
      throw error;
    }
  },
  
  // These operations are not typically performed directly in Contentful via API
  // They would require using the Contentful Management API, not the Delivery API
  create: async (data: ProductCreateInput): Promise<CMSProductType> => {
    throw new Error("Creating products directly in Contentful is not supported via this adapter");
  },
  
  update: async (id: string, data: ProductUpdateInput): Promise<CMSProductType> => {
    throw new Error("Updating products directly in Contentful is not supported via this adapter");
  },
  
  delete: async (id: string): Promise<boolean> => {
    throw new Error("Deleting products directly in Contentful is not supported via this adapter");
  },
  
  clone: async (id: string): Promise<CMSProductType> => {
    throw new Error("Cloning products directly in Contentful is not supported via this adapter");
  }
};
