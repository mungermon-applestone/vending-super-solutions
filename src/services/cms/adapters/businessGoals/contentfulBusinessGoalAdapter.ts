
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
      
      // Phase 1: Fetch business goal with reduced include level to avoid depth limits
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        include: 2, // Reduced from 3 to avoid depth limits
        limit: 1
      });

      console.log('[contentfulBusinessGoalAdapter] Phase 1 - Business goal response:', JSON.stringify(entries, null, 2));

      if (entries.items.length === 0) {
        console.log('[contentfulBusinessGoalAdapter] No business goal found with slug:', slug);
        return null;
      }

      const businessGoalEntry = entries.items[0];
      
      // Phase 2: If there are recommended machines, fetch them separately with full image data
      let enrichedRecommendedMachines = [];
      if (businessGoalEntry.fields.recommendedMachines && Array.isArray(businessGoalEntry.fields.recommendedMachines)) {
        console.log('[contentfulBusinessGoalAdapter] Phase 2 - Fetching recommended machines separately');
        
        // Extract machine IDs from the business goal
        const machineIds = businessGoalEntry.fields.recommendedMachines
          .map((machine: any) => machine.sys?.id)
          .filter(Boolean);
        
        console.log('[contentfulBusinessGoalAdapter] Machine IDs to fetch:', machineIds);
        
        if (machineIds.length > 0) {
          // Fetch machines separately with proper include level for images
          const machinesResponse = await client.getEntries({
            content_type: 'machine',
            'sys.id[in]': machineIds.join(','),
            include: 2 // This should be enough for machine -> image data
          });
          
          console.log('[contentfulBusinessGoalAdapter] Phase 2 - Machines response:', JSON.stringify(machinesResponse, null, 2));
          
          // Transform the machines with full image data
          enrichedRecommendedMachines = machinesResponse.items.map((machine: any) => ({
            id: machine.sys?.id || '',
            slug: machine.fields?.slug || '',
            title: machine.fields?.title || '',
            description: machine.fields?.description || '',
            image: machine.fields?.image ? {
              url: `https:${machine.fields.image.fields?.file?.url || ''}`,
              alt: machine.fields.image.fields?.description || machine.fields?.title || 'Machine image'
            } : undefined,
            thumbnail: machine.fields?.thumbnail ? {
              url: `https:${machine.fields.thumbnail.fields?.file?.url || ''}`,
              alt: machine.fields.thumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
            } : undefined,
            machineThumbnail: machine.fields?.machineThumbnail ? {
              url: `https:${machine.fields.machineThumbnail.fields?.file?.url || ''}`,
              alt: machine.fields.machineThumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
            } : undefined
          }));
          
          console.log('[contentfulBusinessGoalAdapter] Phase 2 - Enriched machines:', enrichedRecommendedMachines);
        }
      }

      // Transform the business goal entry and attach the enriched machines
      const businessGoal = this.transformEntry(businessGoalEntry, enrichedRecommendedMachines);
      
      console.log('[contentfulBusinessGoalAdapter] Found business goal:', businessGoal.title);
      console.log('[contentfulBusinessGoalAdapter] Final recommended machines:', businessGoal.recommendedMachines);
      
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

  private transformEntry(entry: any, enrichedRecommendedMachines?: any[]): CMSBusinessGoal {
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
      // Use enriched machines if provided, otherwise fall back to original transformation
      recommendedMachines: enrichedRecommendedMachines || (fields.recommendedMachines ? fields.recommendedMachines.map((machine: any) => ({
        id: machine.sys?.id || '',
        slug: machine.fields?.slug || '',
        title: machine.fields?.title || '',
        description: machine.fields?.description || '',
        image: machine.fields?.image ? {
          url: `https:${machine.fields.image.fields?.file?.url || ''}`,
          alt: machine.fields.image.fields?.description || machine.fields?.title || 'Machine image'
        } : undefined,
        thumbnail: machine.fields?.thumbnail ? {
          url: `https:${machine.fields.thumbnail.fields?.file?.url || ''}`,
          alt: machine.fields.thumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
        } : undefined,
        machineThumbnail: machine.fields?.machineThumbnail ? {
          url: `https:${machine.fields.machineThumbnail.fields?.file?.url || ''}`,
          alt: machine.fields.machineThumbnail.fields?.description || machine.fields?.title || 'Machine thumbnail'
        } : undefined
      })) : []),
      displayOrder: fields.displayOrder || 0,
      showOnHomepage: fields.showOnHomepage || false,
      homepageOrder: fields.homepageOrder || 0
    };
  }
}
