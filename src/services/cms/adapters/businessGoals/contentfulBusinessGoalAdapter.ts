import { EntrySkeletonType, createClient } from 'contentful';
import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { getContentfulClient } from '../../utils/contentfulClient';

export class ContentfulBusinessGoalAdapter implements BusinessGoalAdapter {
  async getAll(options?: Record<string, any>): Promise<CMSBusinessGoal[]> {
    console.log('[contentfulBusinessGoalAdapter] Fetching all business goals with options:', options);
    
    try {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        include: 2, // Include linked entries like features
        limit: 1000,
        ...options
      });

      console.log(`[contentfulBusinessGoalAdapter] Found ${entries.items.length} business goals`);
      
      return entries.items.map(entry => this.transformEntry(entry));
    } catch (error) {
      console.error('[contentfulBusinessGoalAdapter] Error fetching business goals:', error);
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<CMSBusinessGoal | null> {
    console.log('[contentfulBusinessGoalAdapter] Fetching business goal with slug:', JSON.stringify(slug));
    
    try {
      const client = await getContentfulClient();
      
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        include: 2, // Use standard include level
        limit: 1
      });

      console.log('[contentfulBusinessGoalAdapter] Business goal response:', JSON.stringify(entries, null, 2));

      if (entries.items.length === 0) {
        console.log('[contentfulBusinessGoalAdapter] No business goal found with slug:', slug);
        return null;
      }

      const businessGoalEntry = entries.items[0];
      const businessGoal = await this.transformEntryWithFullMachineData(businessGoalEntry);
      
      console.log('[contentfulBusinessGoalAdapter] Found business goal:', businessGoal.title);
      console.log('[contentfulBusinessGoalAdapter] Recommended machines:', businessGoal.recommendedMachines);
      
      return businessGoal;
    } catch (error) {
      console.error('[contentfulBusinessGoalAdapter] Error fetching business goal by slug:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<CMSBusinessGoal | null> {
    try {
      const client = await getContentfulClient();
      const entry = await client.getEntry(id, { include: 2 });
      return await this.transformEntryWithFullMachineData(entry);
    } catch (error) {
      console.error('[contentfulBusinessGoalAdapter] Error fetching business goal by ID:', error);
      return null;
    }
  }

  async create(data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> {
    throw new Error('Create operation not implemented for read-only Contentful adapter');
  }

  async update(id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> {
    throw new Error('Update operation not implemented for read-only Contentful adapter');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Delete operation not implemented for read-only Contentful adapter');
  }

  /**
   * Fetch complete machine data for recommended machines
   */
  private async fetchCompleteMachineData(machineId: string): Promise<any | null> {
    try {
      const client = await getContentfulClient();
      console.log(`[contentfulBusinessGoalAdapter] Fetching complete machine data for ID: ${machineId}`);
      
      const machineEntry = await client.getEntry(machineId, { 
        include: 2 // Get full machine data with images
      });
      
      console.log(`[contentfulBusinessGoalAdapter] Complete machine data fetched:`, machineEntry.fields);
      return machineEntry;
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching machine ${machineId}:`, error);
      return null;
    }
  }

  /**
   * Transform entry with complete machine data by making separate API calls
   */
  private async transformEntryWithFullMachineData(entry: any): Promise<CMSBusinessGoal> {
    const fields = entry.fields || {};
    
    console.log(`[contentfulBusinessGoalAdapter] Transforming entry with full machine data for: ${fields.title}`);
    
    // Process features first (unchanged logic)
    let features = undefined;
    if (fields.features && Array.isArray(fields.features)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.features.length} feature entries`);
      
      features = fields.features.map((featureEntry: any, index: number) => {
        console.log(`[contentfulBusinessGoalAdapter] Processing feature ${index}:`, featureEntry);
        
        if (!featureEntry || !featureEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Feature ${index} has no fields`);
          return null;
        }
        
        const featureFields = featureEntry.fields;
        
        const transformedFeature = {
          id: featureEntry.sys?.id || Math.random().toString(36).substring(2, 9),
          title: featureFields.title || '',
          description: featureFields.description || '',
          icon: featureFields.icon,
          screenshot: featureFields.screenshot ? {
            id: featureFields.screenshot.sys?.id || 'screenshot',
            url: featureFields.screenshot.fields?.file?.url || '',
            alt: featureFields.screenshot.fields?.description || featureFields.title || 'Feature screenshot'
          } : undefined
        };
        
        console.log(`[contentfulBusinessGoalAdapter] Transformed feature ${index}:`, transformedFeature);
        return transformedFeature;
      }).filter(Boolean);
      
      console.log(`[contentfulBusinessGoalAdapter] Final features array:`, features);
    }

    // Process recommended machines with separate API calls for complete data
    let recommendedMachines = [];
    if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.recommendedMachines.length} recommended machines with separate API calls`);
      
      // Fetch complete data for each machine
      const machinePromises = fields.recommendedMachines.map(async (machineRef: any, index: number) => {
        if (!machineRef || !machineRef.sys?.id) {
          console.warn(`[contentfulBusinessGoalAdapter] Machine reference ${index} has no ID`);
          return null;
        }
        
        const machineId = machineRef.sys.id;
        console.log(`[contentfulBusinessGoalAdapter] Fetching complete data for machine ${index} (ID: ${machineId})`);
        
        const completeMachineEntry = await this.fetchCompleteMachineData(machineId);
        if (!completeMachineEntry || !completeMachineEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Could not fetch complete data for machine ${machineId}`);
          return null;
        }
        
        return this.transformCompleteMachineEntry(completeMachineEntry, index);
      });
      
      // Wait for all machine data to be fetched
      const resolvedMachines = await Promise.all(machinePromises);
      recommendedMachines = resolvedMachines.filter(Boolean);
      
      console.log(`[contentfulBusinessGoalAdapter] Successfully processed ${recommendedMachines.length} machines with complete data`);
    }

    return {
      id: entry.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      description: fields.description || '',
      image: fields.image ? {
        id: fields.image.sys?.id || 'image',
        url: fields.image.fields?.file?.url || '',
        alt: fields.image.fields?.description || fields.title || 'Business goal image'
      } : undefined,
      icon: fields.icon,
      benefits: fields.benefits || [],
      features: features,
      visible: fields.visible !== false,
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
      video: fields.video ? {
        id: fields.video.sys?.id || 'video',
        url: fields.video.fields?.file?.url || null,
        title: fields.video.fields?.title || fields.title
      } : undefined,
      recommendedMachines: recommendedMachines,
      displayOrder: fields.displayOrder || 0,
      showOnHomepage: fields.showOnHomepage || false,
      homepageOrder: fields.homepageOrder || 0
    };
  }

  /**
   * Transform a complete machine entry with all image data
   */
  private transformCompleteMachineEntry(machineEntry: any, index: number): any {
    const machineFields = machineEntry.fields;
    
    console.log(`[contentfulBusinessGoalAdapter] Transforming complete machine ${index}:`, {
      title: machineFields.title,
      hasFields: !!machineFields,
      fieldKeys: Object.keys(machineFields || {})
    });
    
    // Create base machine object
    const transformedMachine = {
      id: machineEntry.sys?.id || '',
      slug: machineFields.slug || '',
      title: machineFields.title || '',
      description: machineFields.description || '',
      type: machineFields.type || 'vending',
      temperature: machineFields.temperature || 'ambient',
      features: machineFields.features || [],
      images: [] as any[],
      specs: {},
      machineThumbnail: undefined as any,
      thumbnail: undefined as any,
      image: undefined as any
    };

    // Process machineThumbnail with complete data
    if (machineFields.machineThumbnail && machineFields.machineThumbnail.fields) {
      const thumbFields = machineFields.machineThumbnail.fields;
      let thumbUrl = thumbFields.file?.url || '';
      if (thumbUrl && !thumbUrl.startsWith('http')) {
        thumbUrl = `https:${thumbUrl}`;
      }
      
      transformedMachine.machineThumbnail = {
        id: machineFields.machineThumbnail.sys?.id || 'machineThumbnail',
        url: thumbUrl,
        alt: thumbFields.description || thumbFields.title || transformedMachine.title
      };
      
      console.log(`[contentfulBusinessGoalAdapter] Added machineThumbnail for ${transformedMachine.title}:`, transformedMachine.machineThumbnail);
    }

    // Process thumbnail with complete data
    if (machineFields.thumbnail && machineFields.thumbnail.fields) {
      const thumbFields = machineFields.thumbnail.fields;
      let thumbUrl = thumbFields.file?.url || '';
      if (thumbUrl && !thumbUrl.startsWith('http')) {
        thumbUrl = `https:${thumbUrl}`;
      }
      
      transformedMachine.thumbnail = {
        id: machineFields.thumbnail.sys?.id || 'thumbnail',
        url: thumbUrl,
        alt: thumbFields.description || thumbFields.title || transformedMachine.title
      };
      
      console.log(`[contentfulBusinessGoalAdapter] Added thumbnail for ${transformedMachine.title}:`, transformedMachine.thumbnail);
    }

    // Process main image with complete data
    if (machineFields.image && machineFields.image.fields) {
      const imageFields = machineFields.image.fields;
      let imageUrl = imageFields.file?.url || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https:${imageUrl}`;
      }
      
      transformedMachine.image = {
        id: machineFields.image.sys?.id || 'image',
        url: imageUrl,
        alt: imageFields.description || imageFields.title || transformedMachine.title
      };
      
      console.log(`[contentfulBusinessGoalAdapter] Added image for ${transformedMachine.title}:`, transformedMachine.image);
    }

    // Process images array if present
    if (machineFields.images && Array.isArray(machineFields.images)) {
      transformedMachine.images = machineFields.images.map((img: any) => {
        if (!img || !img.fields) return null;
        
        let imageUrl = img.fields.file?.url || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https:${imageUrl}`;
        }
        
        return {
          id: img.sys?.id || '',
          url: imageUrl,
          alt: img.fields.description || img.fields.title || transformedMachine.title
        };
      }).filter(Boolean);
    }
    
    console.log(`[contentfulBusinessGoalAdapter] Final transformed machine ${index}:`, {
      title: transformedMachine.title,
      hasMachineThumbnail: !!transformedMachine.machineThumbnail,
      machineThumbnailUrl: transformedMachine.machineThumbnail?.url,
      hasThumbnail: !!transformedMachine.thumbnail,
      thumbnailUrl: transformedMachine.thumbnail?.url,
      hasImage: !!transformedMachine.image,
      imageUrl: transformedMachine.image?.url,
      hasImages: transformedMachine.images.length > 0
    });
    
    return transformedMachine;
  }

  private transformEntry(entry: any): CMSBusinessGoal {
    const fields = entry.fields || {};
    
    console.log(`[contentfulBusinessGoalAdapter] Transforming entry for: ${fields.title}`);
    console.log(`[contentfulBusinessGoalAdapter] Raw features field:`, fields.features);
    console.log(`[contentfulBusinessGoalAdapter] Features is array:`, Array.isArray(fields.features));
    
    // Transform features if they exist
    let features = undefined;
    if (fields.features && Array.isArray(fields.features)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.features.length} feature entries`);
      
      features = fields.features.map((featureEntry: any, index: number) => {
        console.log(`[contentfulBusinessGoalAdapter] Processing feature ${index}:`, featureEntry);
        
        if (!featureEntry || !featureEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Feature ${index} has no fields`);
          return null;
        }
        
        const featureFields = featureEntry.fields;
        
        const transformedFeature = {
          id: featureEntry.sys?.id || Math.random().toString(36).substring(2, 9),
          title: featureFields.title || '',
          description: featureFields.description || '',
          icon: featureFields.icon,
          screenshot: featureFields.screenshot ? {
            id: featureFields.screenshot.sys?.id || 'screenshot',
            url: featureFields.screenshot.fields?.file?.url || '',
            alt: featureFields.screenshot.fields?.description || featureFields.title || 'Feature screenshot'
          } : undefined
        };
        
        console.log(`[contentfulBusinessGoalAdapter] Transformed feature ${index}:`, transformedFeature);
        return transformedFeature;
      }).filter(Boolean); // Remove any null entries
      
      console.log(`[contentfulBusinessGoalAdapter] Final features array:`, features);
    } else {
      console.log(`[contentfulBusinessGoalAdapter] No features found or features is not an array`);
    }

    // Transform recommended machines directly from reference data
    let recommendedMachines = [];
    if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.recommendedMachines.length} recommended machines`);
      
      recommendedMachines = fields.recommendedMachines.map((machineEntry: any, index: number) => {
        console.log(`[contentfulBusinessGoalAdapter] Processing machine ${index}:`, machineEntry);
        
        if (!machineEntry || !machineEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Machine ${index} has no fields`);
          return null;
        }
        
        const machineFields = machineEntry.fields;
        
        // Create base machine object with all required properties
        const transformedMachine = {
          id: machineEntry.sys?.id || '',
          slug: machineFields.slug || '',
          title: machineFields.title || '',
          description: machineFields.description || '',
          type: machineFields.type || 'vending',
          temperature: machineFields.temperature || 'ambient',
          features: machineFields.features || [],
          images: [] as any[],
          specs: {},
          // Add the image properties that were missing
          machineThumbnail: undefined as any,
          thumbnail: undefined as any,
          image: undefined as any
        };

        // Handle machine thumbnail - check for machineThumbnail first
        if (machineFields.machineThumbnail && machineFields.machineThumbnail.fields) {
          const thumbFields = machineFields.machineThumbnail.fields;
          let thumbUrl = thumbFields.file?.url || '';
          if (thumbUrl && !thumbUrl.startsWith('http')) {
            thumbUrl = `https:${thumbUrl}`;
          }
          
          transformedMachine.machineThumbnail = {
            id: machineFields.machineThumbnail.sys?.id || 'machineThumbnail',
            url: thumbUrl,
            alt: thumbFields.description || thumbFields.title || transformedMachine.title
          };
          
          console.log(`[contentfulBusinessGoalAdapter] Added machineThumbnail for ${transformedMachine.title}:`, transformedMachine.machineThumbnail);
        }

        // Handle regular thumbnail
        if (machineFields.thumbnail && machineFields.thumbnail.fields) {
          const thumbFields = machineFields.thumbnail.fields;
          let thumbUrl = thumbFields.file?.url || '';
          if (thumbUrl && !thumbUrl.startsWith('http')) {
            thumbUrl = `https:${thumbUrl}`;
          }
          
          transformedMachine.thumbnail = {
            id: machineFields.thumbnail.sys?.id || 'thumbnail',
            url: thumbUrl,
            alt: thumbFields.description || thumbFields.title || transformedMachine.title
          };
          
          console.log(`[contentfulBusinessGoalAdapter] Added thumbnail for ${transformedMachine.title}:`, transformedMachine.thumbnail);
        }

        // Handle main image as fallback
        if (machineFields.image && machineFields.image.fields) {
          const imageFields = machineFields.image.fields;
          let imageUrl = imageFields.file?.url || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https:${imageUrl}`;
          }
          
          transformedMachine.image = {
            id: machineFields.image.sys?.id || 'image',
            url: imageUrl,
            alt: imageFields.description || imageFields.title || transformedMachine.title
          };
          
          console.log(`[contentfulBusinessGoalAdapter] Added image for ${transformedMachine.title}:`, transformedMachine.image);
        }

        // Handle images array if present
        if (machineFields.images && Array.isArray(machineFields.images)) {
          transformedMachine.images = machineFields.images.map((img: any) => {
            if (!img || !img.fields) return null;
            
            let imageUrl = img.fields.file?.url || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = `https:${imageUrl}`;
            }
            
            return {
              id: img.sys?.id || '',
              url: imageUrl,
              alt: img.fields.description || img.fields.title || transformedMachine.title
            };
          }).filter(Boolean);
        }
        
        console.log(`[contentfulBusinessGoalAdapter] Final transformed machine ${index}:`, {
          title: transformedMachine.title,
          hasMachineThumbnail: !!transformedMachine.machineThumbnail,
          hasThumbnail: !!transformedMachine.thumbnail,
          hasImage: !!transformedMachine.image,
          hasImages: transformedMachine.images.length > 0
        });
        
        return transformedMachine;
      }).filter(Boolean); // Remove any null entries
      
      console.log(`[contentfulBusinessGoalAdapter] Final recommended machines:`, recommendedMachines);
    } else {
      console.log(`[contentfulBusinessGoalAdapter] No recommended machines found or recommendedMachines is not an array`);
    }

    return {
      id: entry.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      description: fields.description || '',
      image: fields.image ? {
        id: fields.image.sys?.id || 'image',
        url: fields.image.fields?.file?.url || '',
        alt: fields.image.fields?.description || fields.title || 'Business goal image'
      } : undefined,
      icon: fields.icon,
      benefits: fields.benefits || [],
      features: features,
      visible: fields.visible !== false,
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
      video: fields.video ? {
        id: fields.video.sys?.id || 'video',
        url: fields.video.fields?.file?.url || null,
        title: fields.video.fields?.title || fields.title
      } : undefined,
      recommendedMachines: recommendedMachines,
      displayOrder: fields.displayOrder || 0,
      showOnHomepage: fields.showOnHomepage || false,
      homepageOrder: fields.homepageOrder || 0
    };
  }
}
