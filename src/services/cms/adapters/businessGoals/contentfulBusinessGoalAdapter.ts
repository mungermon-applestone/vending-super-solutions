
import { BusinessGoalAdapter } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { handleCMSError } from '@/services/cms/utils/errorHandling';
import { transformContentfulEntry } from '@/utils/cms/transformers/machineTransformer';

export const contentfulBusinessGoalAdapter: BusinessGoalAdapter = {
  async getAll(options = {}) {
    try {
      console.log('[contentfulBusinessGoalAdapter] Fetching all business goals');
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        include: 2,
        ...options
      });

      return entries.items.map(entry => {
        console.log(`[contentfulBusinessGoalAdapter] Processing business goal: ${entry.fields.title}`);
        
        // Process video if exists
        const videoField = entry.fields.video as any;
        let videoData = null;
        if (videoField) {
          console.log(`[contentfulBusinessGoalAdapter] Business goal has video: ${entry.fields.title}`);
          videoData = {
            url: videoField.fields?.file?.url ? `https:${videoField.fields.file.url}` : null,
            title: videoField.fields?.title || entry.fields.title,
            id: videoField.sys?.id
          };
        }
        
        // Process recommended machines if exist
        const recommendedMachinesField = entry.fields.recommendedMachines as any[];
        let recommendedMachines = [];
        if (recommendedMachinesField && Array.isArray(recommendedMachinesField)) {
          console.log(`[contentfulBusinessGoalAdapter] Business goal has ${recommendedMachinesField.length} recommended machines: ${entry.fields.title}`);
          
          recommendedMachines = recommendedMachinesField.map(machine => {
            // Check if machine has proper structure
            if (!machine.fields) {
              console.error('[contentfulBusinessGoalAdapter] Machine entry is missing fields:', machine);
              return null;
            }
            
            // Process the machine entry using the same transformer as used on the machines page
            // This ensures consistent handling of image data
            const machineEntry = {
              sys: machine.sys,
              fields: machine.fields
            };
            
            try {
              // Use the same transformer that works for the machines page
              const transformedMachine = transformContentfulEntry(machineEntry);
              
              // Log the transformed machine data for debugging
              console.log(`[contentfulBusinessGoalAdapter] Transformed machine "${machine.fields.title}":`, {
                hasThumbnail: !!transformedMachine.thumbnail,
                thumbnailUrl: transformedMachine.thumbnail?.url,
                hasImage: transformedMachine.images && transformedMachine.images.length > 0,
                imageUrl: transformedMachine.images?.[0]?.url
              });
              
              // Return a format compatible with the business goal machine references
              // ensuring we have image data in the expected fields
              return {
                id: transformedMachine.id,
                title: transformedMachine.title || 'Unnamed Machine',
                slug: transformedMachine.slug || transformedMachine.id,
                description: transformedMachine.description || '',
                // Map to all image properties for maximum compatibility
                machineThumbnail: transformedMachine.thumbnail || 
                  (transformedMachine.images && transformedMachine.images.length > 0 
                    ? {
                        url: transformedMachine.images[0].url,
                        alt: transformedMachine.images[0].alt
                      } 
                    : undefined),
                thumbnail: transformedMachine.thumbnail || 
                  (transformedMachine.images && transformedMachine.images.length > 0 
                    ? {
                        url: transformedMachine.images[0].url,
                        alt: transformedMachine.images[0].alt
                      } 
                    : undefined),
                image: transformedMachine.images && transformedMachine.images.length > 0 
                  ? {
                      url: transformedMachine.images[0].url,
                      alt: transformedMachine.images[0].alt
                    } 
                  : transformedMachine.thumbnail
              };
            } catch (error) {
              console.error(`[contentfulBusinessGoalAdapter] Error transforming machine "${machine.fields?.title || 'unknown'}":`, error);
              
              // Fallback to original logic for this machine if transformation fails
              // Extract all possible image sources
              let imageSource = null;
              let imageSourceName = '';
              
              if (machine.fields.machineThumbnail) {
                imageSource = machine.fields.machineThumbnail;
                imageSourceName = 'machineThumbnail';
              } else if (machine.fields.thumbnail) {
                imageSource = machine.fields.thumbnail;
                imageSourceName = 'thumbnail';
              } else if (machine.fields.image) {
                imageSource = machine.fields.image;
                imageSourceName = 'image';
              }
              
              // Handle the case where imageSource is a Contentful asset reference
              let imageUrl = null;
              let imageAlt = '';
              
              if (imageSource) {
                // Different ways the image URL might be structured in Contentful
                if (imageSource.fields && imageSource.fields.file && imageSource.fields.file.url) {
                  // Standard Contentful asset
                  imageUrl = imageSource.fields.file.url;
                  imageAlt = imageSource.fields.title || machine.fields.title;
                } else if (imageSource.url) {
                  // Direct URL in the object
                  imageUrl = imageSource.url;
                  imageAlt = imageSource.alt || machine.fields.title;
                }
                
                // Ensure the URL has proper https prefix
                if (imageUrl) {
                  if (imageUrl.startsWith('//')) {
                    imageUrl = `https:${imageUrl}`;
                  } else if (!imageUrl.startsWith('http')) {
                    imageUrl = `https://${imageUrl}`;
                  }
                }
              }
              
              return {
                id: machine.sys.id,
                title: machine.fields.title || 'Unnamed Machine',
                slug: machine.fields.slug || machine.sys.id,
                description: machine.fields.description || '',
                machineThumbnail: imageUrl ? {
                  url: imageUrl,
                  alt: imageAlt
                } : undefined,
                thumbnail: imageUrl ? {
                  url: imageUrl,
                  alt: imageAlt
                } : undefined,
                image: imageUrl ? {
                  url: imageUrl,
                  alt: imageAlt
                } : undefined
              };
            }
          }).filter(Boolean); // Remove any null values
        }
        
        return {
          id: entry.sys.id,
          title: entry.fields.title as string,
          slug: entry.fields.slug as string,
          description: entry.fields.description as string,
          visible: entry.fields.visible as boolean ?? true,
          icon: entry.fields.icon as string,
          benefits: entry.fields.benefits as string[] || [],
          image: entry.fields.image ? {
            id: (entry.fields.image as any).sys.id,
            url: `https:${(entry.fields.image as any).fields.file.url}`,
            alt: (entry.fields.image as any).fields.title
          } : undefined,
          video: videoData,
          recommendedMachines
        };
      });
    } catch (error) {
      console.error('[contentfulBusinessGoalAdapter] Error fetching all business goals:', error);
      throw handleCMSError(error, 'fetch', 'business goals');
    }
  },

  async getBySlug(slug: string) {
    try {
      console.log(`[contentfulBusinessGoalAdapter] Fetching business goal with slug: "${slug}"`);
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        include: 2,
        limit: 1
      });

      if (!entries.items.length) {
        return null;
      }

      const entry = entries.items[0];
      
      console.log(`[contentfulBusinessGoalAdapter] Found business goal: ${entry.fields.title}`);
      
      // Process video if exists
      const videoField = entry.fields.video as any;
      let videoData = null;
      if (videoField) {
        console.log(`[contentfulBusinessGoalAdapter] Business goal has video: ${entry.fields.title}`);
        videoData = {
          url: videoField.fields?.file?.url ? `https:${videoField.fields.file.url}` : null,
          title: videoField.fields?.title || entry.fields.title,
          id: videoField.sys?.id
        };
      }
      
      // Process recommended machines if exist
      const recommendedMachinesField = entry.fields.recommendedMachines as any[];
      let recommendedMachines = [];
      if (recommendedMachinesField && Array.isArray(recommendedMachinesField)) {
        console.log(`[contentfulBusinessGoalAdapter] Business goal has ${recommendedMachinesField.length} recommended machines: ${entry.fields.title}`);
        
        recommendedMachines = recommendedMachinesField.map(machine => {
          // Check if machine has proper structure
          if (!machine.fields) {
            console.error('[contentfulBusinessGoalAdapter] Machine entry is missing fields:', machine);
            return null;
          }
          
          // Process the machine entry using the same transformer as used on the machines page
          const machineEntry = {
            sys: machine.sys,
            fields: machine.fields
          };
          
          try {
            // Use the same transformer that works for the machines page
            const transformedMachine = transformContentfulEntry(machineEntry);
            
            // Log the transformed machine data for debugging
            console.log(`[contentfulBusinessGoalAdapter] Transformed machine "${machine.fields.title}":`, {
              hasThumbnail: !!transformedMachine.thumbnail,
              thumbnailUrl: transformedMachine.thumbnail?.url,
              hasImage: transformedMachine.images && transformedMachine.images.length > 0,
              imageUrl: transformedMachine.images?.[0]?.url
            });
            
            // Return a format compatible with the business goal machine references
            return {
              id: transformedMachine.id,
              title: transformedMachine.title || 'Unnamed Machine',
              slug: transformedMachine.slug || transformedMachine.id,
              description: transformedMachine.description || '',
              // Map to all image properties for maximum compatibility
              machineThumbnail: transformedMachine.thumbnail || 
                (transformedMachine.images && transformedMachine.images.length > 0 
                  ? {
                      url: transformedMachine.images[0].url,
                      alt: transformedMachine.images[0].alt
                    } 
                  : undefined),
              thumbnail: transformedMachine.thumbnail || 
                (transformedMachine.images && transformedMachine.images.length > 0 
                  ? {
                      url: transformedMachine.images[0].url,
                      alt: transformedMachine.images[0].alt
                    } 
                  : undefined),
              image: transformedMachine.images && transformedMachine.images.length > 0 
                ? {
                    url: transformedMachine.images[0].url,
                    alt: transformedMachine.images[0].alt
                  } 
                : transformedMachine.thumbnail
            };
          } catch (error) {
            console.error(`[contentfulBusinessGoalAdapter] Error transforming machine "${machine.fields?.title || 'unknown'}":`, error);
            
            // Fallback to original logic for this machine if transformation fails
            // Extract all possible image sources
            let imageSource = null;
            let imageSourceName = '';
            
            if (machine.fields.machineThumbnail) {
              imageSource = machine.fields.machineThumbnail;
              imageSourceName = 'machineThumbnail';
            } else if (machine.fields.thumbnail) {
              imageSource = machine.fields.thumbnail;
              imageSourceName = 'thumbnail';
            } else if (machine.fields.image) {
              imageSource = machine.fields.image;
              imageSourceName = 'image';
            }
            
            // Handle the case where imageSource is a Contentful asset reference
            let imageUrl = null;
            let imageAlt = '';
            
            if (imageSource) {
              // Different ways the image URL might be structured in Contentful
              if (imageSource.fields && imageSource.fields.file && imageSource.fields.file.url) {
                // Standard Contentful asset
                imageUrl = imageSource.fields.file.url;
                imageAlt = imageSource.fields.title || machine.fields.title;
              } else if (imageSource.url) {
                // Direct URL in the object
                imageUrl = imageSource.url;
                imageAlt = imageSource.alt || machine.fields.title;
              }
              
              // Ensure the URL has proper https prefix
              if (imageUrl) {
                if (imageUrl.startsWith('//')) {
                  imageUrl = `https:${imageUrl}`;
                } else if (!imageUrl.startsWith('http')) {
                  imageUrl = `https://${imageUrl}`;
                }
              }
            }
            
            return {
              id: machine.sys.id,
              title: machine.fields.title || 'Unnamed Machine',
              slug: machine.fields.slug || machine.sys.id,
              description: machine.fields.description || '',
              // Map to all image properties for maximum compatibility
              machineThumbnail: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined,
              thumbnail: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined,
              image: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined
            };
          }
        }).filter(Boolean); // Remove any null values
      }
      
      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        visible: entry.fields.visible as boolean ?? true,
        icon: entry.fields.icon as string,
        benefits: entry.fields.benefits as string[] || [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined,
        video: videoData,
        recommendedMachines
      };
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching business goal by slug "${slug}":`, error);
      throw handleCMSError(error, 'fetch', 'business goal', slug);
    }
  },

  async getById(id: string) {
    try {
      console.log(`[contentfulBusinessGoalAdapter] Fetching business goal with ID: "${id}"`);
      const client = await getContentfulClient();
      const entry = await client.getEntry(id, { include: 2 });

      // Process video if exists
      const videoField = entry.fields.video as any;
      let videoData = null;
      if (videoField) {
        console.log(`[contentfulBusinessGoalAdapter] Business goal has video: ${entry.fields.title}`);
        videoData = {
          url: videoField.fields?.file?.url ? `https:${videoField.fields.file.url}` : null,
          title: videoField.fields?.title || entry.fields.title,
          id: videoField.sys?.id
        };
      }
      
      // Process recommended machines if exist
      const recommendedMachinesField = entry.fields.recommendedMachines as any[];
      let recommendedMachines = [];
      if (recommendedMachinesField && Array.isArray(recommendedMachinesField)) {
        console.log(`[contentfulBusinessGoalAdapter] Business goal has ${recommendedMachinesField.length} recommended machines: ${entry.fields.title}`);
        
        recommendedMachines = recommendedMachinesField.map(machine => {
          // Check if machine has proper structure
          if (!machine.fields) {
            console.error('[contentfulBusinessGoalAdapter] Machine entry is missing fields:', machine);
            return null;
          }
          
          // Process the machine entry using the same transformer as used on the machines page
          const machineEntry = {
            sys: machine.sys,
            fields: machine.fields
          };
          
          try {
            // Use the same transformer that works for the machines page
            const transformedMachine = transformContentfulEntry(machineEntry);
            
            // Return a format compatible with the business goal machine references
            return {
              id: transformedMachine.id,
              title: transformedMachine.title || 'Unnamed Machine',
              slug: transformedMachine.slug || transformedMachine.id,
              description: transformedMachine.description || '',
              // Map to all image properties for maximum compatibility
              machineThumbnail: transformedMachine.thumbnail || 
                (transformedMachine.images && transformedMachine.images.length > 0 
                  ? {
                      url: transformedMachine.images[0].url,
                      alt: transformedMachine.images[0].alt
                    } 
                  : undefined),
              thumbnail: transformedMachine.thumbnail || 
                (transformedMachine.images && transformedMachine.images.length > 0 
                  ? {
                      url: transformedMachine.images[0].url,
                      alt: transformedMachine.images[0].alt
                    } 
                  : undefined),
              image: transformedMachine.images && transformedMachine.images.length > 0 
                ? {
                    url: transformedMachine.images[0].url,
                    alt: transformedMachine.images[0].alt
                  } 
                : transformedMachine.thumbnail
            };
          } catch (error) {
            console.error(`[contentfulBusinessGoalAdapter] Error transforming machine "${machine.fields?.title || 'unknown'}":`, error);
            
            // Fallback to original logic for this machine if transformation fails
            // Extract all possible image sources
            let imageSource = null;
            let imageSourceName = '';
            
            if (machine.fields.machineThumbnail) {
              imageSource = machine.fields.machineThumbnail;
              imageSourceName = 'machineThumbnail';
            } else if (machine.fields.thumbnail) {
              imageSource = machine.fields.thumbnail;
              imageSourceName = 'thumbnail';
            } else if (machine.fields.image) {
              imageSource = machine.fields.image;
              imageSourceName = 'image';
            }
            
            // Handle the case where imageSource is a Contentful asset reference
            let imageUrl = null;
            let imageAlt = '';
            
            if (imageSource) {
              // Different ways the image URL might be structured in Contentful
              if (imageSource.fields && imageSource.fields.file && imageSource.fields.file.url) {
                // Standard Contentful asset
                imageUrl = imageSource.fields.file.url;
                imageAlt = imageSource.fields.title || machine.fields.title;
              } else if (imageSource.url) {
                // Direct URL in the object
                imageUrl = imageSource.url;
                imageAlt = imageSource.alt || machine.fields.title;
              }
              
              // Ensure the URL has proper https prefix
              if (imageUrl) {
                if (imageUrl.startsWith('//')) {
                  imageUrl = `https:${imageUrl}`;
                } else if (!imageUrl.startsWith('http')) {
                  imageUrl = `https://${imageUrl}`;
                }
              }
            }
            
            return {
              id: machine.sys.id,
              title: machine.fields.title || 'Unnamed Machine',
              slug: machine.fields.slug || machine.sys.id,
              description: machine.fields.description || '',
              // Map to all image properties for maximum compatibility
              machineThumbnail: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined,
              thumbnail: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined,
              image: imageUrl ? {
                url: imageUrl,
                alt: imageAlt
              } : undefined
            };
          }
        }).filter(Boolean); // Remove any null values
      }

      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        visible: entry.fields.visible as boolean ?? true,
        icon: entry.fields.icon as string,
        benefits: entry.fields.benefits as string[] || [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined,
        video: videoData,
        recommendedMachines
      };
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching business goal by ID "${id}":`, error);
      throw handleCMSError(error, 'fetch', 'business goal', id);
    }
  },

  async create(data) {
    console.error('[contentfulBusinessGoalAdapter] Create operation not supported with Delivery API');
    throw new Error('Creating business goals is not supported with the current Contentful setup.');
  },

  async update(id, data) {
    console.error('[contentfulBusinessGoalAdapter] Update operation not supported with Delivery API');
    throw new Error('Updating business goals is not supported with the current Contentful setup.');
  },

  async delete(id) {
    console.error('[contentfulBusinessGoalAdapter] Delete operation not supported with Delivery API');
    throw new Error('Deleting business goals is not supported with the current Contentful setup.');
  }
};
