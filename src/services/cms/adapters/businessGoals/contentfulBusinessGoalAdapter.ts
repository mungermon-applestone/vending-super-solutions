
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { logDeprecation, throwDeprecatedOperationError } from '@/services/cms/utils/deprecation';

/**
 * Contentful implementation of the BusinessGoalAdapter
 */
export const contentfulBusinessGoalAdapter: BusinessGoalAdapter = {
  /**
   * Get all business goals
   */
  getAll: async (filters = {}): Promise<CMSBusinessGoal[]> => {
    try {
      const client = await getContentfulClient();
      if (!client) {
        throw new Error('Failed to initialize Contentful client');
      }
      
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
        title: item.fields.title?.toString() || '',
        description: item.fields.description?.toString() || '',
        slug: item.fields.slug?.toString() || '',
        icon: item.fields.icon?.toString() || 'check',
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
      const client = await getContentfulClient();
      if (!client) {
        throw new Error('Failed to initialize Contentful client');
      }
      
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
        title: item.fields.title?.toString() || '',
        description: item.fields.description?.toString() || '',
        slug: item.fields.slug?.toString() || '',
        icon: item.fields.icon?.toString() || 'check',
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
      const client = await getContentfulClient();
      if (!client) {
        throw new Error('Failed to initialize Contentful client');
      }
      
      const response = await client.getEntry(id);
      
      return {
        id: response.sys.id,
        title: response.fields.title?.toString() || '',
        description: response.fields.description?.toString() || '',
        slug: response.fields.slug?.toString() || '',
        icon: response.fields.icon?.toString() || 'check',
        // Add other fields as needed
      };
    } catch (error) {
      console.error(`Error fetching business goal with ID "${id}" from Contentful:`, error);
      
      // If the entry doesn't exist, return null instead of throwing
      if ((error as Error).message?.includes('not found')) {
        return null;
      }
      
      throw error;
    }
  },
  
  /**
   * @deprecated Use Contentful directly for content creation
   * Create a new business goal
   */
  create: async (data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.create',
      'Creating business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    // Make this method throw a consistent error
    throwDeprecatedOperationError('create', 'business goal');
    
    // This will never be reached due to the error above, but satisfies TypeScript
    return Promise.reject(new Error("Creating business goals is not supported")) as Promise<CMSBusinessGoal>;
  },
  
  /**
   * @deprecated Use Contentful directly for content updates
   * Update a business goal
   */
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.update',
      'Updating business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    // Make this method throw a consistent error
    throwDeprecatedOperationError('update', 'business goal');
    
    // This will never be reached due to the error above, but satisfies TypeScript
    return Promise.reject(new Error("Updating business goals is not supported")) as Promise<CMSBusinessGoal>;
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
    
    // Make this method throw a consistent error
    throwDeprecatedOperationError('delete', 'business goal');
    
    // This will never be reached due to the error above, but satisfies TypeScript
    return Promise.reject(new Error("Deleting business goals is not supported"));
  },
  
  /**
   * @deprecated Use Contentful directly for content cloning
   * Clone a business goal
   */
  clone: async (id: string): Promise<CMSBusinessGoal> => {
    // Log the deprecation
    logDeprecation(
      'contentfulBusinessGoalAdapter.clone',
      'Cloning business goals through the adapter is deprecated',
      'Contentful web interface directly'
    );
    
    // Make this method throw a consistent error
    throwDeprecatedOperationError('clone', 'business goal');
    
    // This will never be reached due to the error above, but satisfies TypeScript
    return Promise.reject(new Error("Cloning business goals is not supported")) as Promise<CMSBusinessGoal>;
  }
};
