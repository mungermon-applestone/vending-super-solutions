
import { EntrySkeletonType, createClient } from 'contentful';
import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { getContentfulClient } from '../../utils/contentfulClient';
import { transformContentfulEntry } from '@/utils/cms/transformers/machineTransformer';

export class ContentfulBusinessGoalAdapter implements BusinessGoalAdapter {
  async getAll(options?: Record<string, any>): Promise<CMSBusinessGoal[]> {
    console.log('[contentfulBusinessGoalAdapter] Fetching all business goals with options:', options);
    
    try {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        include: 2,
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
    console.log('[contentfulBusinessGoalAdapter] Fetching business goal with slug:', slug);
    
    try {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        include: 2,
        limit: 1
      });

      if (entries.items.length === 0) {
        console.log('[contentfulBusinessGoalAdapter] No business goal found with slug:', slug);
        return null;
      }

      const businessGoal = this.transformEntry(entries.items[0]);
      console.log('[contentfulBusinessGoalAdapter] Found business goal:', businessGoal.title);
      
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
    
    // Transform features if they exist
    let features = undefined;
    if (fields.features && Array.isArray(fields.features)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.features.length} feature entries`);
      
      features = fields.features.map((featureEntry: any, index: number) => {
        if (!featureEntry || !featureEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Feature ${index} has no fields`);
          return null;
        }
        
        const featureFields = featureEntry.fields;
        
        return {
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
      }).filter(Boolean);
    }

    // Transform recommended machines using the proven pattern from product adapter
    let recommendedMachines: any[] = [];
    if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.recommendedMachines.length} recommended machines`);
      
      recommendedMachines = fields.recommendedMachines
        .filter(machine => {
          if (!machine || !machine.fields) {
            console.warn(`[contentfulBusinessGoalAdapter] Invalid machine in recommendedMachines:`, machine);
            return false;
          }
          return true;
        })
        .map(machine => {
          try {
            console.log(`[contentfulBusinessGoalAdapter] Processing machine ${machine.fields?.title || 'unknown'} using transformer`);
            
            // Use the proven machine transformer
            const transformedMachine = transformContentfulEntry(machine);
            
            // Return the exact format expected by RecommendedMachines component
            return {
              id: transformedMachine.id,
              slug: transformedMachine.slug,
              title: transformedMachine.title,
              description: transformedMachine.description || '',
              // Standard image (highest quality, used as fallback)
              image: transformedMachine.images && transformedMachine.images.length > 0 ? {
                url: transformedMachine.images[0].url,
                alt: transformedMachine.images[0].alt || transformedMachine.title
              } : undefined,
              // Regular thumbnail (if available)
              thumbnail: transformedMachine.thumbnail ? {
                url: transformedMachine.thumbnail.url,
                alt: transformedMachine.thumbnail.alt || transformedMachine.title
              } : undefined,
              // Machine-specific thumbnail (highest priority)
              machineThumbnail: machine.fields.machineThumbnail ? {
                url: `https:${machine.fields.machineThumbnail.fields?.file?.url || ''}`,
                alt: machine.fields.machineThumbnail.fields?.title || transformedMachine.title
              } : undefined
            };
          } catch (err) {
            console.error(`[contentfulBusinessGoalAdapter] Error processing recommended machine:`, err);
            return null;
          }
        })
        .filter(Boolean);
    }

    return {
      id: entry.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      description: fields.description || '',
      heroDescription2: fields.heroDescription2 || null,
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
