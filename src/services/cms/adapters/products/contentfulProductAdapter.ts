
import { CMSProductType } from "@/types/cms";
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from "./types";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { transformContentfulEntry } from "@/utils/cms/transformers/machineTransformer";

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
        
        // Determine video orientation based on video asset metadata (if available)
        let videoOrientation: 'vertical' | 'horizontal' = 'horizontal';
        if (fields.video && fields.video.fields?.file?.details?.image) {
          const videoDetails = fields.video.fields.file.details.image;
          if (videoDetails.width && videoDetails.height) {
            // If height is greater than width, it's a vertical video
            videoOrientation = videoDetails.height > videoDetails.width ? 'vertical' : 'horizontal';
            console.log(`[contentfulProductAdapter] Detected video orientation for ${fields.title}: ${videoOrientation}`);
          }
        } else if (fields.videoOrientation) {
          // If orientation is explicitly set in the content model, use that
          videoOrientation = fields.videoOrientation as 'vertical' | 'horizontal';
        }
        
        // Process recommended machines with enhanced error handling, transformers and debugging
        let recommendedMachines: any[] = [];
        
        if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
          console.log(`[contentfulProductAdapter] Processing ${fields.recommendedMachines.length} recommended machines for product ${fields.title}`);
          
          recommendedMachines = fields.recommendedMachines
            .filter(machine => {
              if (!machine || !machine.fields) {
                console.warn(`[contentfulProductAdapter] Invalid machine in recommendedMachines for product ${fields.title || 'unknown'}:`, machine);
                return false;
              }
              return true;
            })
            .map(machine => {
              // Use the dedicated machine transformer to ensure consistent handling
              // and apply the same fallback logic used in BusinessGoals pages
              try {
                // First create a basic machine object that will be enhanced by the transformer
                const basicMachineData = {
                  id: machine.sys.id,
                  slug: machine.fields.slug,
                  title: machine.fields.title,
                  description: machine.fields.description || '',
                  sys: machine.sys,
                  fields: machine.fields
                };
                
                // Log machine data to help with debugging
                console.log(`[contentfulProductAdapter] Processing machine ${machine.fields?.title || 'unknown'}:`, {
                  id: machine.sys.id,
                  hasImage: !!machine.fields?.image,
                  hasMachineThumbnail: !!machine.fields?.machineThumbnail
                });
                
                // First try to create a more complete machine object with our standard fields
                const machineData = {
                  id: machine.sys.id,
                  slug: machine.fields.slug,
                  title: machine.fields.title,
                  description: machine.fields.description || '',
                  // Process image with fallbacks to ensure we have something to display
                  image: machine.fields.image ? {
                    url: `https:${machine.fields.image.fields.file.url}`,
                    alt: machine.fields.image.fields.title || machine.fields.title
                  } : undefined,
                  // Process thumbnails with proper priority handling
                  thumbnail: machine.fields.thumbnail ? {
                    url: `https:${machine.fields.thumbnail.fields.file.url}`,
                    alt: machine.fields.thumbnail.fields.title || machine.fields.title
                  } : undefined,
                  machineThumbnail: machine.fields.machineThumbnail ? {
                    url: `https:${machine.fields.machineThumbnail.fields.file.url}`,
                    alt: machine.fields.machineThumbnail.fields.title || machine.fields.title
                  } : undefined
                };
                
                console.log(`[contentfulProductAdapter] Processed machine data:`, {
                  id: machineData.id,
                  title: machineData.title,
                  hasImage: !!machineData.image,
                  hasThumbnail: !!machineData.thumbnail,
                  hasMachineThumbnail: !!machineData.machineThumbnail,
                  imageUrl: machineData.image?.url,
                  thumbnailUrl: machineData.thumbnail?.url,
                  machineThumbnailUrl: machineData.machineThumbnail?.url
                });
                
                return machineData;
              } catch (err) {
                console.error(`[contentfulProductAdapter] Error processing recommended machine ${machine.fields?.title || 'unknown'}:`, err);
                // Return a minimal valid machine object to avoid breaking the UI
                return {
                  id: machine.sys?.id || `fallback-${Date.now()}`,
                  slug: machine.fields?.slug || 'machine',
                  title: machine.fields?.title || 'Machine',
                  description: machine.fields?.description || 'No description available'
                };
              }
            });
          
          console.log(`[contentfulProductAdapter] Successfully processed ${recommendedMachines.length} recommended machines`);
        } else {
          console.log(`[contentfulProductAdapter] No recommended machines for product ${fields.title}`);
        }
        
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
          recommendedMachines,
          // Add video support with orientation information
          video: fields.video ? {
            title: fields.videoTitle as string || 'Product Demo',
            description: fields.videoDescription as string || 'See our solution in action',
            orientation: videoOrientation,
            thumbnailImage: fields.videoPreviewImage ? {
              id: (fields.videoPreviewImage as any).sys.id,
              url: `https:${(fields.videoPreviewImage as any).fields.file.url}`,
              alt: (fields.videoPreviewImage as any).fields.title || 'Video thumbnail',
            } : fields.image ? {
              id: 'default-thumbnail',
              url: `https:${(fields.image as any).fields.file.url}`,
              alt: 'Video thumbnail',
            } : undefined,
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
    console.log(`[contentfulProductAdapter] Fetching product by slug: "${slug}"`);
    
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
      
      // Determine video orientation based on video asset metadata (if available)
      let videoOrientation: 'vertical' | 'horizontal' = 'horizontal';
      if (fields.video && fields.video.fields?.file?.details?.image) {
        const videoDetails = fields.video.fields.file.details.image;
        if (videoDetails.width && videoDetails.height) {
          // If height is greater than width, it's a vertical video
          videoOrientation = videoDetails.height > videoDetails.width ? 'vertical' : 'horizontal';
          console.log(`[contentfulProductAdapter] Detected video orientation for ${fields.title}: ${videoOrientation}`);
        }
      } else if (fields.videoOrientation) {
        // If orientation is explicitly set in the content model, use that
        videoOrientation = fields.videoOrientation as 'vertical' | 'horizontal';
      }
      
      // Process recommended machines with enhanced error handling and debugging
      let recommendedMachines: any[] = [];
      if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
        console.log(`[contentfulProductAdapter] Processing ${fields.recommendedMachines.length} recommended machines in getById`);
        
        recommendedMachines = fields.recommendedMachines
          .filter(machine => {
            if (!machine || !machine.fields) {
              console.warn(`[contentfulProductAdapter] Invalid machine in getById:`, machine);
              return false;
            }
            return true;
          })
          .map(machine => {
            try {
              // Log machine data for debugging
              console.log(`[contentfulProductAdapter] Processing machine ${machine.fields?.title || 'unknown'} in getById:`, {
                hasImage: !!machine.fields?.image,
                hasMachineThumbnail: !!machine.fields?.machineThumbnail
              });
              
              // Create machine data with proper image handling
              return {
                id: machine.sys.id,
                title: machine.fields.title,
                slug: machine.fields.slug,
                description: machine.fields.description || '',
                // Process image with fallbacks
                image: machine.fields.image ? {
                  url: `https:${machine.fields.image.fields.file.url}`,
                  alt: machine.fields.image.fields.title || machine.fields.title
                } : undefined,
                // Process thumbnails with proper priority handling
                thumbnail: machine.fields.thumbnail ? {
                  url: `https:${machine.fields.thumbnail.fields.file.url}`,
                  alt: machine.fields.thumbnail.fields.title || machine.fields.title
                } : undefined,
                machineThumbnail: machine.fields.machineThumbnail ? {
                  url: `https:${machine.fields.machineThumbnail.fields.file.url}`,
                  alt: machine.fields.machineThumbnail.fields.title || machine.fields.title
                } : undefined
              };
            } catch (err) {
              console.error(`[contentfulProductAdapter] Error processing machine in getById:`, err);
              // Return minimal valid data on error
              return {
                id: machine.sys?.id || `fallback-${Date.now()}`,
                slug: machine.fields?.slug || 'machine',
                title: machine.fields?.title || 'Machine',
                description: machine.fields?.description || 'No description available'
              };
            }
          });
        
        console.log(`[contentfulProductAdapter] Successfully processed ${recommendedMachines.length} machines in getById`);
      }
      
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
        recommendedMachines,
        // Add video support with orientation information
        video: fields.video ? {
          title: fields.videoTitle as string || 'Product Demo',
          description: fields.videoDescription as string || 'See our solution in action',
          orientation: videoOrientation,
          thumbnailImage: fields.videoPreviewImage ? {
            id: (fields.videoPreviewImage as any).sys.id,
            url: `https:${(fields.videoPreviewImage as any).fields.file.url}`,
            alt: (fields.videoPreviewImage as any).fields.title || 'Video thumbnail',
          } : fields.image ? {
            id: 'default-thumbnail',
            url: `https:${(fields.image as any).fields.file.url}`,
            alt: 'Video thumbnail',
          } : undefined,
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
