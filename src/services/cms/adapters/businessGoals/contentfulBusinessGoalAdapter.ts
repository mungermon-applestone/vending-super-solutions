
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

    // Transform recommended machines using the proven transformer
    let recommendedMachines = [];
    if (fields.recommendedMachines && Array.isArray(fields.recommendedMachines)) {
      console.log(`[contentfulBusinessGoalAdapter] Processing ${fields.recommendedMachines.length} recommended machines`);
      
      recommendedMachines = fields.recommendedMachines.map((machineEntry: any, index: number) => {
        console.log(`[contentfulBusinessGoalAdapter] Processing machine ${index}:`, machineEntry);
        
        if (!machineEntry || !machineEntry.fields) {
          console.warn(`[contentfulBusinessGoalAdapter] Machine ${index} has no fields`);
          return null;
        }
        
        try {
          // Use the proven transformer to get consistent image handling
          const transformedMachine = transformContentfulEntry(machineEntry);
          console.log(`[contentfulBusinessGoalAdapter] Transformed machine ${index}:`, transformedMachine);
          return transformedMachine;
        } catch (error) {
          console.error(`[contentfulBusinessGoalAdapter] Error transforming machine ${index}:`, error);
          // Fallback to basic transformation if the proven transformer fails
          return {
            id: machineEntry.sys?.id || '',
            slug: machineEntry.fields?.slug || '',
            title: machineEntry.fields?.title || '',
            description: machineEntry.fields?.description || '',
            type: machineEntry.fields?.type || 'vending',
            temperature: machineEntry.fields?.temperature || 'ambient',
            features: machineEntry.fields?.features || [],
            images: [],
            specs: {}
          };
        }
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
