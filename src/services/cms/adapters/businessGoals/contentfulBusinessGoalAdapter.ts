
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

/**
 * Adapter for Contentful business goals
 */
export const contentfulBusinessGoalAdapter: BusinessGoalAdapter = {
  /**
   * Get all business goals
   */
  async getAll(options = {}) {
    try {
      console.log('[contentfulBusinessGoalAdapter] Fetching all business goals');
      const client = getContentfulClient();
      if (!client) {
        console.error('[contentfulBusinessGoalAdapter] Contentful client unavailable');
        return [];
      }
      
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        include: 2,
        ...options
      });

      return entries.items.map(entry => ({
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        visible: entry.fields.visible as boolean ?? true,
        icon: entry.fields.icon as string,
        benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      }));
    } catch (error) {
      console.error('[contentfulBusinessGoalAdapter] Error fetching all business goals:', error);
      return [];
    }
  },

  /**
   * Get a business goal by slug
   */
  async getBySlug(slug: string) {
    try {
      console.log(`[contentfulBusinessGoalAdapter] Fetching business goal with slug: "${slug}"`);
      const client = getContentfulClient();
      if (!client) {
        console.error('[contentfulBusinessGoalAdapter] Contentful client unavailable');
        return null;
      }
      
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
      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        visible: entry.fields.visible as boolean ?? true,
        icon: entry.fields.icon as string,
        benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      };
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching business goal by slug "${slug}":`, error);
      return null;
    }
  },

  /**
   * Get a business goal by ID
   */
  async getById(id: string) {
    try {
      console.log(`[contentfulBusinessGoalAdapter] Fetching business goal with ID: "${id}"`);
      const client = getContentfulClient();
      if (!client) {
        console.error('[contentfulBusinessGoalAdapter] Contentful client unavailable');
        return null;
      }
      
      const entry = await client.getEntry(id, { include: 2 });

      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        visible: entry.fields.visible as boolean ?? true,
        icon: entry.fields.icon as string,
        benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      };
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching business goal by ID "${id}":`, error);
      return null;
    }
  },

  /**
   * Create a business goal
   * Note: This operation requires the Management API, which isn't available in this setup.
   */
  async create(data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> {
    console.error('[contentfulBusinessGoalAdapter] Create operation not supported with Delivery API');
    throw new Error('Creating business goals is not supported with the current Contentful setup.');
  },

  /**
   * Update a business goal
   * Note: This operation requires the Management API, which isn't available in this setup.
   */
  async update(id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> {
    console.error('[contentfulBusinessGoalAdapter] Update operation not supported with Delivery API');
    throw new Error('Updating business goals is not supported with the current Contentful setup.');
  },

  /**
   * Delete a business goal
   * Note: This operation requires the Management API, which isn't available in this setup.
   */
  async delete(id: string): Promise<boolean> {
    console.error('[contentfulBusinessGoalAdapter] Delete operation not supported with Delivery API');
    throw new Error('Deleting business goals is not supported with the current Contentful setup.');
  }
};
