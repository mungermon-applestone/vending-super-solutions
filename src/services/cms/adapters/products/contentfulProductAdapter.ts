
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
        
        // Log recommended machines data if present
        if (fields.recommendedMachines) {
          console.log(`[contentfulProductAdapter] Product ${fields.title} has ${(fields.recommendedMachines as any[]).length} recommended machines`);
          
          // Enhanced debugging for recommended machines' thumbnails
          (fields.recommendedMachines as any[]).forEach((machine, index) => {
            const machineFields = machine.fields;
            console.log(`[contentfulProductAdapter] Machine #${index + 1}: ${machineFields.title}`, {
              hasThumbnail: !!machineFields.thumbnail,
              thumbnailFields: machineFields.thumbnail ? {
                hasFields: !!machineFields.thumbnail.fields,
                hasFile: machineFields.thumbnail.fields ? !!machineFields.thumbnail.fields.file : false,
                hasUrl: machineFields.thumbnail.fields && machineFields.thumbnail.fields.file ? !!machineFields.thumbnail.fields.file.url : false,
                url: machineFields.thumbnail.fields && machineFields.thumbnail.fields.file ? machineFields.thumbnail.fields.file.url : 'no url',
              } : 'no thumbnail',
              hasImage: !!machineFields.image || (!!machineFields.images && machineFields.images.length > 0)
            });
          });
        }
        
        const processedProduct: CMSProductType = {
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
          // Add video support
          video: fields.video ? {
            title: fields.videoTitle as string || 'Product Demo',
            description: fields.videoDescription as string || 'See our solution in action',
            thumbnailImage: fields.videoThumbnail ? {
              id: (fields.videoThumbnail as any).sys.id,
              url: `https:${(fields.videoThumbnail as any).fields.file.url}`,
              alt: (fields.videoThumbnail as any).fields.title || 'Video thumbnail',
            } : {
              id: 'default-thumbnail',
              url: fields.image ? `https:${(fields.image as any).fields.file.url}` : '/placeholder.svg',
              alt: 'Video thumbnail',
            },
            url: fields.video.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
            youtubeId: fields.youtubeVideoId as string || undefined
          } : undefined
        };

        // Process recommended machines with extra care for thumbnails
        if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
          processedProduct.recommendedMachines = (fields.recommendedMachines as any[])
            .filter(machine => !!machine && !!machine.fields)
            .map((machine, index) => {
              const machineFields = machine.fields;
              
              // Extra debug logging for each machine's thumbnail
              const hasThumbnail = !!machineFields.thumbnail;
              const hasValidThumbnail = hasThumbnail && 
                !!machineFields.thumbnail.fields && 
                !!machineFields.thumbnail.fields.file && 
                !!machineFields.thumbnail.fields.file.url;
              
              // Log detailed thumbnail info for debugging
              console.log(`[contentfulProductAdapter] Processing machine #${index + 1}: ${machineFields.title}`, {
                hasThumbnail,
                hasValidThumbnail,
                thumbnailUrl: hasValidThumbnail ? `https:${machineFields.thumbnail.fields.file.url}` : 'INVALID URL',
                thumbnailStructure: hasThumbnail ? {
                  fields: !!machineFields.thumbnail.fields,
                  file: machineFields.thumbnail.fields ? !!machineFields.thumbnail.fields.file : false,
                  url: machineFields.thumbnail.fields && machineFields.thumbnail.fields.file ? machineFields.thumbnail.fields.file.url : 'missing'
                } : 'NO THUMBNAIL'
              });

              // Handle main image (from images array or image field)
              let mainImage;
              if (machineFields.image && machineFields.image.fields && machineFields.image.fields.file) {
                mainImage = {
                  url: `https:${machineFields.image.fields.file.url}`,
                  alt: machineFields.image.fields.title || machineFields.title
                };
              } else if (machineFields.images && machineFields.images.length > 0 && 
                        machineFields.images[0].fields && machineFields.images[0].fields.file) {
                mainImage = {
                  url: `https:${machineFields.images[0].fields.file.url}`,
                  alt: machineFields.images[0].fields.title || machineFields.title
                };
              }
              
              // Create the machine object with careful thumbnail handling
              return {
                id: machine.sys.id,
                title: machineFields.title,
                slug: machineFields.slug,
                description: machineFields.description,
                image: mainImage,
                thumbnail: hasValidThumbnail ? {
                  url: `https:${machineFields.thumbnail.fields.file.url}`,
                  alt: machineFields.thumbnail.fields.title || machineFields.title
                } : undefined
              };
            });
        } else {
          processedProduct.recommendedMachines = [];
        }
        
        return processedProduct;
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
      
      // Enhanced debugging for recommended machines
      if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
        console.log(`[contentfulProductAdapter:getById] Product ${fields.title} has ${(fields.recommendedMachines as any[]).length} recommended machines`);
        
        // Log each machine's thumbnail data in detail
        (fields.recommendedMachines as any[]).forEach((machine, index) => {
          if (!machine || !machine.fields) {
            console.warn(`[contentfulProductAdapter:getById] Invalid machine at index ${index}`);
            return;
          }
          
          const hasThumbnail = !!machine.fields.thumbnail;
          console.log(`[contentfulProductAdapter:getById] Machine #${index + 1}: ${machine.fields.title}`, {
            hasThumbnail,
            thumbnailDetails: hasThumbnail ? {
              hasFields: !!machine.fields.thumbnail.fields,
              hasFile: machine.fields.thumbnail.fields ? !!machine.fields.thumbnail.fields.file : false,
              hasUrl: machine.fields.thumbnail.fields && machine.fields.thumbnail.fields.file 
                ? !!machine.fields.thumbnail.fields.file.url : false,
              fullUrl: machine.fields.thumbnail.fields && machine.fields.thumbnail.fields.file && machine.fields.thumbnail.fields.file.url
                ? `https:${machine.fields.thumbnail.fields.file.url}` : 'NO URL'
            } : 'NO THUMBNAIL'
          });
        });
      }
      
      // Create product object
      const processedProduct: CMSProductType = {
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
        // Add video support to getById method
        video: fields.video ? {
          title: fields.videoTitle as string || 'Product Demo',
          description: fields.videoDescription as string || 'See our solution in action',
          thumbnailImage: fields.videoThumbnail ? {
            id: (fields.videoThumbnail as any).sys.id,
            url: `https:${(fields.videoThumbnail as any).fields.file.url}`,
            alt: (fields.videoThumbnail as any).fields.title || 'Video thumbnail',
          } : {
            id: 'default-thumbnail',
            url: fields.image ? `https:${(fields.image as any).fields.file.url}` : '/placeholder.svg',
            alt: 'Video thumbnail',
          },
          url: fields.video.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
          youtubeId: fields.youtubeVideoId as string || undefined
        } : undefined
      };

      // Process recommended machines with extra care for thumbnails
      if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
        processedProduct.recommendedMachines = (fields.recommendedMachines as any[])
          .filter(machine => !!machine && !!machine.fields)
          .map((machine, index) => {
            const machineFields = machine.fields;
            
            // Extra debug logging for each machine's thumbnail
            const hasThumbnail = !!machineFields.thumbnail;
            const hasValidThumbnail = hasThumbnail && 
              !!machineFields.thumbnail.fields && 
              !!machineFields.thumbnail.fields.file && 
              !!machineFields.thumbnail.fields.file.url;
            
            // Log detailed thumbnail info for debugging
            console.log(`[contentfulProductAdapter:getById] Processing machine #${index + 1}: ${machineFields.title}`, {
              hasThumbnail,
              hasValidThumbnail,
              thumbnailUrl: hasValidThumbnail ? `https:${machineFields.thumbnail.fields.file.url}` : 'INVALID URL',
              thumbnailStructure: hasThumbnail ? {
                fields: !!machineFields.thumbnail.fields,
                file: machineFields.thumbnail.fields ? !!machineFields.thumbnail.fields.file : false,
                url: machineFields.thumbnail.fields && machineFields.thumbnail.fields.file ? machineFields.thumbnail.fields.file.url : 'missing'
              } : 'NO THUMBNAIL'
            });

            // Handle main image (from images array or image field)
            let mainImage;
            if (machineFields.image && machineFields.image.fields && machineFields.image.fields.file) {
              mainImage = {
                url: `https:${machineFields.image.fields.file.url}`,
                alt: machineFields.image.fields.title || machineFields.title
              };
            } else if (machineFields.images && machineFields.images.length > 0 && 
                      machineFields.images[0].fields && machineFields.images[0].fields.file) {
              mainImage = {
                url: `https:${machineFields.images[0].fields.file.url}`,
                alt: machineFields.images[0].fields.title || machineFields.title
              };
            }
            
            // Create the machine object with careful thumbnail handling
            return {
              id: machine.sys.id,
              title: machineFields.title,
              slug: machineFields.slug,
              description: machineFields.description,
              image: mainImage,
              thumbnail: hasValidThumbnail ? {
                url: `https:${machineFields.thumbnail.fields.file.url}`,
                alt: machineFields.thumbnail.fields.title || machineFields.title
              } : undefined
            };
          });
      } else {
        processedProduct.recommendedMachines = [];
      }
      
      // Final logging before returning the product
      console.log(`[contentfulProductAdapter:getById] Successfully processed product ${processedProduct.title}:`, {
        recommendedMachinesCount: processedProduct.recommendedMachines?.length || 0,
        machinesWithThumbnails: processedProduct.recommendedMachines?.filter(m => m.thumbnail).length || 0
      });
      
      return processedProduct;
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
