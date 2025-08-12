/**
 * Contentful Help Desk Article Preview Adapter
 * For accessing draft Help Desk Article content via Preview API
 */

import { contentfulPreviewClient } from '@/services/cms/utils/contentfulPreviewClient';

export interface HelpDeskArticleFields {
  articleTitle: string;
  slug: string;
  content: any; // Rich text content
  category?: string;
  tags?: string[];
  lastModified?: string;
  status?: string;
}

export interface ContentfulHelpDeskArticle {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: HelpDeskArticleFields;
  includes?: {
    Asset?: any[];
    Entry?: any[];
  };
}

export const contentfulHelpDeskArticlePreviewAdapter = {
  /**
   * Get all Help Desk Articles (preview)
   */
  async getAll(): Promise<ContentfulHelpDeskArticle[]> {
    try {
      const response = await contentfulPreviewClient.getEntries({
        content_type: 'helpDeskArticle',
        include: 2,
      });
      
      return response.items as unknown as ContentfulHelpDeskArticle[];
    } catch (error) {
      console.error('[Help Desk Article Preview] Error fetching all articles:', error);
      throw error;
    }
  },

  /**
   * Get Help Desk Article by slug (preview)
   */
  async getBySlug(slug: string): Promise<ContentfulHelpDeskArticle | null> {
    try {
      const response = await contentfulPreviewClient.getEntries({
        content_type: 'helpDeskArticle',
        'fields.slug': slug,
        include: 2,
        limit: 1,
      });

      return response.items.length > 0 ? response.items[0] as unknown as ContentfulHelpDeskArticle : null;
    } catch (error) {
      console.error('[Help Desk Article Preview] Error fetching article by slug:', error);
      throw error;
    }
  },

  /**
   * Get Help Desk Article by ID (preview)
   */
  async getById(id: string): Promise<ContentfulHelpDeskArticle | null> {
    try {
      const response = await contentfulPreviewClient.getEntry(id, {
        include: 2,
      });

      return response as unknown as ContentfulHelpDeskArticle;
    } catch (error) {
      console.error('[Help Desk Article Preview] Error fetching article by ID:', error);
      throw error;
    }
  },
};