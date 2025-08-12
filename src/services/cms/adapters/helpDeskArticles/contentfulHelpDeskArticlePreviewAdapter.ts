/**
 * Contentful Help Desk Article Preview Adapter
 * For accessing draft Help Desk Article content via Preview API
 */

import { contentfulPreviewClient } from '@/services/cms/utils/contentfulPreviewClient';

export interface HelpDeskArticleFields {
  articleTitle: string;
  articleContent: any; // Rich text content
  sectionCategory?: string;
  headingCategory?: string;
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
   * Get Help Desk Article by title slug (preview)
   */
  async getBySlug(slug: string): Promise<ContentfulHelpDeskArticle | null> {
    try {
      // Convert slug back to a title format for searching
      const titleFromSlug = slug.replace(/-/g, ' ');
      
      const response = await contentfulPreviewClient.getEntries({
        content_type: 'helpDeskArticle',
        include: 2,
      });

      // Find article by matching title converted to slug
      const article = response.items.find((item: any) => {
        const title = item.fields.articleTitle;
        if (!title) return false;
        const articleSlug = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        return articleSlug === slug;
      });

      return article ? article as unknown as ContentfulHelpDeskArticle : null;
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