
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { CMSTechnology } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

export const contentfulTechnologyAdapter: TechnologyAdapter = {
  async getAll() {
    try {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'technology',
        include: 2
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
      throw handleCMSError(error, 'fetch', 'technologies');
    }
  },

  async getBySlug(slug: string) {
    try {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'technology',
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
        sections: [],
        visible: entry.fields.visible as boolean ?? true
      };
    } catch (error) {
      throw handleCMSError(error, 'fetch', 'technology', slug);
    }
  },

  async getById(id: string) {
    try {
      const client = await getContentfulClient();
      const entry = await client.getEntry(id);

      return {
        id: entry.sys.id,
        title: entry.fields.title as string,
        slug: entry.fields.slug as string,
        description: entry.fields.description as string,
        sections: [],
        visible: entry.fields.visible as boolean ?? true
      };
    } catch (error) {
      throw handleCMSError(error, 'fetch', 'technology', id);
    }
  },

  async create(data: TechnologyCreateInput) {
    try {
      const client = await getContentfulClient();
      const entry = await client.createEntry('technology', {
        fields: {
          title: { 'en-US': data.title },
          slug: { 'en-US': data.slug },
          description: { 'en-US': data.description },
          visible: { 'en-US': data.visible ?? true }
        }
      });

      return {
        id: entry.sys.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        sections: [],
        visible: data.visible ?? true
      };
    } catch (error) {
      throw handleCMSError(error, 'create', 'technology');
    }
  },

  async update(id: string, data: TechnologyUpdateInput) {
    try {
      const client = await getContentfulClient();
      const entry = await client.getEntry(id);

      if (data.title) entry.fields.title = { 'en-US': data.title };
      if (data.slug) entry.fields.slug = { 'en-US': data.slug };
      if (data.description) entry.fields.description = { 'en-US': data.description };
      if (typeof data.visible === 'boolean') entry.fields.visible = { 'en-US': data.visible };

      const updatedEntry = await client.updateEntry(entry);

      return {
        id: updatedEntry.sys.id,
        title: updatedEntry.fields.title['en-US'] as string,
        slug: updatedEntry.fields.slug['en-US'] as string,
        description: updatedEntry.fields.description['en-US'] as string,
        sections: [],
        visible: updatedEntry.fields.visible ? updatedEntry.fields.visible['en-US'] as boolean : true
      };
    } catch (error) {
      throw handleCMSError(error, 'update', 'technology', id);
    }
  },

  async delete(id: string) {
    try {
      const client = await getContentfulClient();
      await client.deleteEntry(id);
      return true;
    } catch (error) {
      throw handleCMSError(error, 'delete', 'technology', id);
    }
  }
};
