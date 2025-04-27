
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

/**
 * Adapter for Contentful technology content type
 */
export const contentfulTechnologyAdapter: TechnologyAdapter = {
  async getAll(options = {}) {
    try {
      console.log('[contentfulTechnologyAdapter] Fetching all technologies');
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'technology',
        include: 2,
        ...options
      });

      return entries.items.map(entry => ({
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        sections: entry.fields.sections ? (entry.fields.sections as any[]).map(section => ({
          id: section.sys.id,
          technology_id: entry.sys.id,
          title: section.fields.title as string,
          description: section.fields.description as string,
          section_type: section.fields.sectionType as string,
          display_order: section.fields.displayOrder as number || 0,
          features: section.fields.features ? section.fields.features.map((feature: any) => ({
            id: feature.sys.id,
            section_id: section.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon,
            display_order: feature.fields.displayOrder || 0
          })) : []
        })) : [],
        visible: entry.fields.visible as boolean ?? true,
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      }));
    } catch (error) {
      console.error('[contentfulTechnologyAdapter] Error fetching all technologies:', error);
      throw handleCMSError(error, 'fetch', 'technologies');
    }
  },

  async getBySlug(slug: string) {
    try {
      console.log(`[contentfulTechnologyAdapter] Fetching technology with slug: "${slug}"`);
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'technology',
        'fields.slug': slug,
        include: 2,
        limit: 1
      });

      if (!entries.items.length) {
        console.warn(`[contentfulTechnologyAdapter] No technology found with slug: "${slug}"`);
        return null;
      }

      const entry = entries.items[0];
      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        sections: entry.fields.sections ? (entry.fields.sections as any[]).map(section => ({
          id: section.sys.id,
          technology_id: entry.sys.id,
          title: section.fields.title as string,
          description: section.fields.description as string,
          section_type: section.fields.sectionType as string,
          display_order: section.fields.displayOrder as number || 0,
          features: section.fields.features ? section.fields.features.map((feature: any) => ({
            id: feature.sys.id,
            section_id: section.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon,
            display_order: feature.fields.displayOrder || 0
          })) : []
        })) : [],
        visible: entry.fields.visible as boolean ?? true,
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      };
    } catch (error) {
      console.error(`[contentfulTechnologyAdapter] Error fetching technology by slug "${slug}":`, error);
      throw handleCMSError(error, 'fetch', 'technology', slug);
    }
  },

  async getById(id: string) {
    try {
      console.log(`[contentfulTechnologyAdapter] Fetching technology with ID: "${id}"`);
      const client = await getContentfulClient();
      const entry = await client.getEntry(id);

      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        sections: entry.fields.sections ? (entry.fields.sections as any[]).map(section => ({
          id: section.sys.id,
          technology_id: entry.sys.id,
          title: section.fields.title as string,
          description: section.fields.description as string,
          section_type: section.fields.sectionType as string,
          display_order: section.fields.displayOrder as number || 0,
          features: section.fields.features ? section.fields.features.map((feature: any) => ({
            id: feature.sys.id,
            section_id: section.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon,
            display_order: feature.fields.displayOrder || 0
          })) : []
        })) : [],
        visible: entry.fields.visible as boolean ?? true,
        image: entry.fields.image ? {
          id: (entry.fields.image as any).sys.id,
          url: `https:${(entry.fields.image as any).fields.file.url}`,
          alt: (entry.fields.image as any).fields.title
        } : undefined
      };
    } catch (error) {
      console.error(`[contentfulTechnologyAdapter] Error fetching technology by ID "${id}":`, error);
      throw handleCMSError(error, 'fetch', 'technology', id);
    }
  },

  // These methods are stubs since we're only using the Delivery API that doesn't support write operations
  // If needed, they can be properly implemented using the Contentful Management API later
  async create(data: TechnologyCreateInput) {
    console.error('[contentfulTechnologyAdapter] Create operation not supported with Delivery API');
    throw new Error('Creating technologies is not supported with the current Contentful setup. Please use the Contentful web interface.');
  },

  async update(id: string, data: TechnologyUpdateInput) {
    console.error('[contentfulTechnologyAdapter] Update operation not supported with Delivery API');
    throw new Error('Updating technologies is not supported with the current Contentful setup. Please use the Contentful web interface.');
  },

  async delete(id: string) {
    console.error('[contentfulTechnologyAdapter] Delete operation not supported with Delivery API');
    throw new Error('Deleting technologies is not supported with the current Contentful setup. Please use the Contentful web interface.');
  },

  async clone(id: string) {
    console.error('[contentfulTechnologyAdapter] Clone operation not supported with Delivery API');
    throw new Error('Cloning technologies is not supported with the current Contentful setup. Please use the Contentful web interface.');
  }
};
