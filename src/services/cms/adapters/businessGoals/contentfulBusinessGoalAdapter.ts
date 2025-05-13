
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Contentful implementation of the BusinessGoalAdapter
 */
export const contentfulBusinessGoalAdapter: BusinessGoalAdapter = {
  /**
   * Get all business goals
   */
  getAll: async (filters = {}): Promise<CMSBusinessGoal[]> => {
    try {
      const client = getContentfulClient();
      const query: any = {
        content_type: 'businessGoal',
        order: 'fields.title',
      };
      
      // Apply any filters
      if (filters && Object.keys(filters).length > 0) {
        // Handle common filtering patterns
        if (filters.slug) {
          query['fields.slug'] = filters.slug;
        }
      }
      
      const response = await client.getEntries(query);
      
      // Map the response to our CMSBusinessGoal interface
      return response.items.map((item: any) => ({
        id: item.sys.id,
        title: item.fields.title,
        description: item.fields.description,
        slug: item.fields.slug,
        icon: item.fields.icon || 'check',
        // Add other fields as needed
      }));
    } catch (error) {
      console.error('Error fetching business goals from Contentful:', error);
      throw error;
    }
  },
  
  /**
   * Get a business goal by slug
   */
  getBySlug: async (slug: string): Promise<CMSBusinessGoal | null> => {
    try {
      const client = getContentfulClient();
      const response = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        limit: 1,
      });
      
      if (response.items.length === 0) {
        return null;
      }
      
      const item = response.items[0];
      return {
        id: item.sys.id,
        title: item.fields.title,
        description: item.fields.description,
        slug: item.fields.slug,
        icon: item.fields.icon || 'check',
        // Add other fields as needed
      };
    } catch (error) {
      console.error(`Error fetching business goal with slug "${slug}" from Contentful:`, error);
      throw error;
    }
  },
  
  /**
   * Get a business goal by ID
   */
  getById: async (id: string): Promise<CMSBusinessGoal | null> => {
    try {
      const client = getContentfulClient();
      const response = await client.getEntry(id);
      
      return {
        id: response.sys.id,
        title: response.fields.title,
        description: response.fields.description,
        slug: response.fields.slug,
        icon: response.fields.icon || 'check',
        // Add other fields as needed
      };
    } catch (error) {
      console.error(`Error fetching business goal with ID "${id}" from Contentful:`, error);
      
      // If the entry doesn't exist, return null instead of throwing
      if (error.message?.includes('not found')) {
        return null;
      }
      
      throw error;
    }
  },
  
  /**
   * @deprecated Use Contentful directly for content creation
   * Create a new business goal
   */
  create: async (data: BusinessGoalCreateInput): Promise<string> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.create',
      'Creating business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    throw new Error(
      "Creating business goals through the adapter is deprecated. " +
      "Please use the Contentful web interface directly."
    );
  },
  
  /**
   * @deprecated Use Contentful directly for content updates
   * Update a business goal
   */
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<boolean> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.update',
      'Updating business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    throw new Error(
      "Updating business goals through the adapter is deprecated. " +
      "Please use the Contentful web interface directly."
    );
  },
  
  /**
   * @deprecated Use Contentful directly for content deletion
   * Delete a business goal
   */
  delete: async (id: string): Promise<boolean> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.delete',
      'Deleting business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    throw new Error(
      "Deleting business goals through the adapter is deprecated. " +
      "Please use the Contentful web interface directly."
    );
  },
  
  /**
   * @deprecated Use Contentful directly for content cloning
   * Clone a business goal
   */
  clone: async (id: string): Promise<string> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.clone',
      'Cloning business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    throw new Error(
      "Cloning business goals through the adapter is deprecated. " +
      "Please use the Contentful web interface directly."
    );
  }
};
