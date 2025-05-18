
import { BusinessGoalAdapter } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

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
            
            // Extract image data with fallbacks
            const machineImage = machine.fields.image || 
                                machine.fields.thumbnail ||
                                machine.fields.machineThumbnail;
                                
            // Enhanced logging for machine image discovery
            console.log(`[contentfulBusinessGoalAdapter] Machine "${machine.fields.title}" image processing:`, {
              hasImage: !!machine.fields.image,
              hasThumbnail: !!machine.fields.thumbnail,
              hasMachineThumbnail: !!machine.fields.machineThumbnail,
              selectedSource: machineImage === machine.fields.machineThumbnail ? 'machineThumbnail' : 
                             (machineImage === machine.fields.thumbnail ? 'thumbnail' : 'image')
            });
                                
            const imageUrl = machineImage?.fields?.file?.url ? `https:${machineImage.fields.file.url}` : null;
            
            // Return the machine with image data mapped to both specific and generic properties
            return {
              id: machine.sys.id,
              title: machine.fields.title,
              slug: machine.fields.slug || machine.sys.id,
              description: machine.fields.description || '',
              // Map to both specific properties AND generic image property
              machineThumbnail: imageUrl ? {
                url: imageUrl,
                alt: machineImage.fields?.title || machine.fields.title
              } : undefined,
              thumbnail: imageUrl ? {
                url: imageUrl,
                alt: machineImage.fields?.title || machine.fields.title
              } : undefined,
              image: imageUrl ? {
                url: imageUrl,
                alt: machineImage.fields?.title || machine.fields.title
              } : undefined
            };
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
          
          // Extract image data with fallbacks
          const machineImage = machine.fields.image || 
                              machine.fields.thumbnail ||
                              machine.fields.machineThumbnail;
                              
          // Enhanced logging for image discovery
          console.log(`[contentfulBusinessGoalAdapter] Machine "${machine.fields.title}" image processing:`, {
            hasImage: !!machine.fields.image,
            hasThumbnail: !!machine.fields.thumbnail,
            hasMachineThumbnail: !!machine.fields.machineThumbnail,
            selectedSource: machineImage === machine.fields.machineThumbnail ? 'machineThumbnail' : 
                          (machineImage === machine.fields.thumbnail ? 'thumbnail' : 'image')
          });
                              
          const imageUrl = machineImage?.fields?.file?.url ? `https:${machineImage.fields.file.url}` : null;
          
          // Return the machine with image data mapped to both specific and generic properties
          return {
            id: machine.sys.id,
            title: machine.fields.title,
            slug: machine.fields.slug || machine.sys.id,
            description: machine.fields.description || '',
            // Map to both specific properties AND generic image property
            machineThumbnail: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined,
            thumbnail: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined,
            image: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined
          };
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
          // Extract image data with fallbacks
          const machineImage = machine.fields.image || 
                              machine.fields.thumbnail ||
                              machine.fields.machineThumbnail;
                              
          const imageUrl = machineImage?.fields?.file?.url ? `https:${machineImage.fields.file.url}` : null;
          
          return {
            id: machine.sys.id,
            title: machine.fields.title,
            slug: machine.fields.slug || machine.sys.id,
            description: machine.fields.description || '',
            // Map to both specific properties AND generic image property
            machineThumbnail: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined,
            thumbnail: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined,
            image: imageUrl ? {
              url: imageUrl,
              alt: machineImage.fields?.title || machine.fields.title
            } : undefined
          };
        });
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
