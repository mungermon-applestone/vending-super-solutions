
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
      const businessGoal = this.transformEntry(businessGoalEntry);
      
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
      return this.transformEntry(entry);
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

    // Transform recommended machines by processing reference data directly
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
        
        // Process machine data directly from reference fields
        const transformedMachine = {
          id: machineEntry.sys?.id || '',
          slug: machineFields.slug || '',
          title: machineFields.title || '',
          description: machineFields.description || '',
          type: machineFields.type || 'vending',
          temperature: machineFields.temperature || 'ambient',
          features: machineFields.features || [],
          images: [],
          specs: {}
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
