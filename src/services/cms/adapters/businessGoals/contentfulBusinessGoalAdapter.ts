
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
        include: 2, // Include linked entries like features
        limit: 1
      });

      if (entries.items.length === 0) {
        console.log('[contentfulBusinessGoalAdapter] No business goal found with slug:', slug);
        return null;
      }

      const businessGoal = this.transformEntry(entries.items[0]);
      console.log('[contentfulBusinessGoalAdapter] Found business goal:', businessGoal.title);
      console.log('[contentfulBusinessGoalAdapter] Features data:', businessGoal.features);
      
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
    
    // Transform features if they exist
    const features = fields.features ? fields.features.map((featureEntry: any) => {
      const featureFields = featureEntry.fields || {};
      
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
    }) : undefined;

    console.log(`[contentfulBusinessGoalAdapter] Transforming business goal: ${fields.title}`);
    console.log(`[contentfulBusinessGoalAdapter] Raw features data:`, fields.features);
    console.log(`[contentfulBusinessGoalAdapter] Transformed features:`, features);

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
      recommendedMachines: fields.recommendedMachines ? fields.recommendedMachines.map((machine: any) => ({
        id: machine.sys?.id || '',
        slug: machine.fields?.slug || '',
        title: machine.fields?.title || '',
        description: machine.fields?.description || '',
        image: machine.fields?.image ? {
          url: machine.fields.image.fields?.file?.url || '',
          alt: machine.fields.image.fields?.description || machine.fields?.title || 'Machine image'
        } : undefined,
        thumbnail: machine.fields?.thumbnail ? {
          url: machine.fields.thumbnail.fields?.file?.url || '',
          alt: machine.fields.thumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
        } : undefined,
        machineThumbnail: machine.fields?.machineThumbnail ? {
          url: machine.fields.machineThumbnail.fields?.file?.url || '',
          alt: machine.fields.machineThumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
        } : undefined
      })) : [],
      displayOrder: fields.displayOrder || 0,
      showOnHomepage: fields.showOnHomepage || false,
      homepageOrder: fields.homepageOrder || 0
    };
  }
}
