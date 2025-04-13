
import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from '../types';
import { buildBusinessGoalEndpoint, buildStrapiFilters, fetchFromStrapi } from './helpers';
import { transformStrapiDataToBusinessGoal, transformInputToStrapiFormat } from './transformers';

/**
 * Implementation of the Business Goal Adapter for Strapi CMS
 */
export const strapiBusinessGoalAdapter: BusinessGoalAdapter = {
  getAll: async (): Promise<CMSBusinessGoal[]> => {
    console.log('[strapiBusinessGoalAdapter] Fetching all business goals from Strapi');
    
    try {
      // Build the URL with query parameters
      let url = buildBusinessGoalEndpoint();
      const queryParams = buildStrapiFilters();
      
      // Add the query string to the URL
      if (queryParams.toString()) {
        url = `${url}?${queryParams.toString()}`;
      }
      
      // Make the request to Strapi
      const data = await fetchFromStrapi<any>(url);
      
      // Transform Strapi response to our internal format
      return data.data.map((item: any) => transformStrapiDataToBusinessGoal(item));
    } catch (error) {
      console.error('[strapiBusinessGoalAdapter] Error fetching business goals:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[strapiBusinessGoalAdapter] Fetching business goal with slug: ${slug}`);
    
    try {
      const url = buildBusinessGoalEndpoint(`?filters[slug][$eq]=${encodeURIComponent(slug)}`);
      
      // Add populate parameters
      const queryParams = buildStrapiFilters();
      const fullUrl = `${url}&${queryParams.toString()}`;
      
      const data = await fetchFromStrapi<any>(fullUrl);
      
      // Check if any results were found
      if (!data.data || data.data.length === 0) {
        return null;
      }
      
      // Transform the first result from Strapi format to our internal format
      return transformStrapiDataToBusinessGoal(data.data[0]);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error fetching business goal by slug "${slug}":`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[strapiBusinessGoalAdapter] Fetching business goal with ID: ${id}`);
    
    try {
      const url = buildBusinessGoalEndpoint(id);
      
      // Add populate parameters
      const queryParams = buildStrapiFilters();
      const fullUrl = `${url}?${queryParams.toString()}`;
      
      const data = await fetchFromStrapi<any>(fullUrl).catch(error => {
        if (error.message.includes('404')) {
          return null;
        }
        throw error;
      });
      
      if (!data) {
        return null;
      }
      
      // Transform from Strapi format to our internal format
      return transformStrapiDataToBusinessGoal(data.data);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error fetching business goal by ID "${id}":`, error);
      throw error;
    }
  },
  
  create: async (data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> => {
    console.log('[strapiBusinessGoalAdapter] Creating new business goal:', data);
    
    try {
      // Transform our data format to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      const url = buildBusinessGoalEndpoint();
      
      const responseData = await fetchFromStrapi<any>(url, 'POST', strapiData);
      
      // Return the created business goal
      return transformStrapiDataToBusinessGoal(responseData.data);
    } catch (error) {
      console.error('[strapiBusinessGoalAdapter] Error creating business goal:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    console.log(`[strapiBusinessGoalAdapter] Updating business goal with ID: ${id}`, data);
    
    try {
      // Transform our data format to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      const url = buildBusinessGoalEndpoint(id);
      
      const responseData = await fetchFromStrapi<any>(url, 'PUT', strapiData);
      
      // Return the updated business goal
      return transformStrapiDataToBusinessGoal(responseData.data);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error updating business goal "${id}":`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiBusinessGoalAdapter] Deleting business goal with ID: ${id}`);
    
    try {
      const url = buildBusinessGoalEndpoint(id);
      
      await fetchFromStrapi<boolean>(url, 'DELETE');
      
      return true;
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error deleting business goal "${id}":`, error);
      throw error;
    }
  },
  
  clone: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[strapiBusinessGoalAdapter] Cloning business goal with ID: ${id}`);
    
    try {
      // First get the business goal to clone
      const sourceGoal = await strapiBusinessGoalAdapter.getById(id);
      
      if (!sourceGoal) {
        throw new Error(`Business goal with ID "${id}" not found`);
      }
      
      // Create a new slug with "-copy" suffix
      const newSlug = `${sourceGoal.slug}-copy`;
      
      // Create a copy with modified title and slug
      const cloneData: BusinessGoalCreateInput = {
        title: `${sourceGoal.title} (Copy)`,
        slug: newSlug,
        description: sourceGoal.description,
        visible: sourceGoal.visible,
        icon: sourceGoal.icon,
        image: sourceGoal.image ? {
          url: sourceGoal.image_url || '',
          alt: sourceGoal.image_alt || '',
        } : undefined,
        benefits: sourceGoal.benefits,
        features: sourceGoal.features?.map(feature => ({
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          screenshot: feature.screenshot ? {
            url: feature.screenshot.url,
            alt: feature.screenshot.alt,
          } : undefined
        }))
      };
      
      // Create the clone
      return await strapiBusinessGoalAdapter.create(cloneData);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error cloning business goal "${id}":`, error);
      throw error;
    }
  }
};
