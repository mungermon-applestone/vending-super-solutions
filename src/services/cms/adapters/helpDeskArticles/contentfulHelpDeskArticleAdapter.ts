/**
 * Contentful Help Desk Article Adapter
 * For accessing published Help Desk Article content via Delivery API
 */

import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

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

export const contentfulHelpDeskArticleAdapter = {
  /**
   * Get all published Help Desk Articles
   */
  async getAll(): Promise<ContentfulHelpDeskArticle[]> {
    try {
      const client = await getContentfulClient();
      const response = await client.getEntries({
        content_type: 'helpDeskArticle',
        include: 2,
        order: 'fields.sectionCategory,fields.articleTitle',
      });
      
      return response.items as unknown as ContentfulHelpDeskArticle[];
    } catch (error) {
      console.error('[Help Desk Article] Error fetching all articles:', error);
      throw error;
    }
  },

  /**
   * Get Help Desk Articles grouped by section category
   */
  async getByCategory(): Promise<Record<string, ContentfulHelpDeskArticle[]>> {
    try {
      const articles = await this.getAll();
      const grouped: Record<string, ContentfulHelpDeskArticle[]> = {};
      
      articles.forEach(article => {
        const category = article.fields.sectionCategory || 'General';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(article);
      });
      
      return grouped;
    } catch (error) {
      console.error('[Help Desk Article] Error grouping articles by category:', error);
      throw error;
    }
  },

  /**
   * Get Help Desk Article by title slug
   */
  async getBySlug(slug: string): Promise<ContentfulHelpDeskArticle | null> {
    try {
      const client = await getContentfulClient();
      const decodedSlug = decodeURIComponent(slug);
      
      const response = await client.getEntries({
        content_type: 'helpDeskArticle',
        include: 2,
      });

      // Find article by matching either exact title or slug-converted title
      const article = response.items.find((item: any) => {
        const title = item.fields.articleTitle;
        if (!title) return false;
        
        // Direct title match
        if (title === decodedSlug) return true;
        
        // Slug format match
        const articleSlug = title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        return articleSlug === decodedSlug.toLowerCase();
      });

      return article ? article as unknown as ContentfulHelpDeskArticle : null;
    } catch (error) {
      console.error('[Help Desk Article] Error fetching article by slug:', error);
      throw error;
    }
  },

  /**
   * Get Help Desk Article by ID
   */
  async getById(id: string): Promise<ContentfulHelpDeskArticle | null> {
    try {
      const client = await getContentfulClient();
      const response = await client.getEntry(id, {
        include: 2,
      });

      return response as unknown as ContentfulHelpDeskArticle;
    } catch (error) {
      console.error('[Help Desk Article] Error fetching article by ID:', error);
      throw error;
    }
  },
};