
import { BusinessGoalAdapter } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Adapter for Contentful business goal content type
 */
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

      return entries.items.map(entry => ({
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
        } : undefined
      }));
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
        console.warn(`[contentfulBusinessGoalAdapter] No business goal found with slug: "${slug}"`);
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
        benefits: entry.fields.benefits as string[] || [],
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      };
    } catch (error) {
      console.error(`[contentfulBusinessGoalAdapter] Error fetching business goal by slug "${slug}":`, error);
      throw handleCMSError(error, 'fetch', 'business goal', slug);
    }
  },

  // These methods are stubs since we're only using the Delivery API that doesn't support write operations
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
