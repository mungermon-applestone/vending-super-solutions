
import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from '../types';
import { buildBusinessGoalEndpoint, buildStrapiFilters, fetchFromStrapi } from './helpers';
import { transformStrapiDataToBusinessGoal, transformInputToStrapiFormat } from './transformers';
import { getStrapiApiKey, getStrapiBaseUrl } from '../../../utils/strapiConfig';

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
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    if (!apiKey) {
      throw new Error('Strapi API key not configured, required for content creation');
    }
    
    try {
      // Transform our input data to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      // Send the POST request to create the business goal
      const response = await fetch(`${baseUrl}/business-goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ data: strapiData })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create business goal in Strapi: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Get the ID of the newly created business goal
      const newId = responseData.data.id;
      
      // Fetch the complete business goal with all populated relations
      return await strapiBusinessGoalAdapter.getById(newId);
    } catch (error) {
      console.error('[strapiBusinessGoalAdapter] Error creating business goal:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    console.log(`[strapiBusinessGoalAdapter] Updating business goal with ID: ${id}`, data);
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    if (!apiKey) {
      throw new Error('Strapi API key not configured, required for content update');
    }
    
    try {
      // Transform our input data to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      // Send the PUT request to update the business goal
      const response = await fetch(`${baseUrl}/business-goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ data: strapiData })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update business goal in Strapi: ${response.statusText}`);
      }
      
      // Fetch the updated business goal with all populated relations
      return await strapiBusinessGoalAdapter.getById(id);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error updating business goal with ID "${id}":`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiBusinessGoalAdapter] Deleting business goal with ID: ${id}`);
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    if (!apiKey) {
      throw new Error('Strapi API key not configured, required for content deletion');
    }
    
    try {
      // Send the DELETE request
      const response = await fetch(`${baseUrl}/business-goals/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete business goal in Strapi: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error deleting business goal with ID "${id}":`, error);
      throw error;
    }
  },
  
  clone: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[strapiBusinessGoalAdapter] Cloning business goal with ID: ${id}`);
    
    try {
      // First, get the business goal to clone
      const businessGoal = await this.getById(id);
      if (!businessGoal) {
        throw new Error(`Business goal with ID "${id}" not found`);
      }
      
      // Create a new business goal based on the existing one
      const clonedBusinessGoal: BusinessGoalCreateInput = {
        title: `${businessGoal.title} (Copy)`,
        slug: `${businessGoal.slug}-copy-${Math.floor(Date.now() / 1000)}`,
        description: businessGoal.description,
        visible: businessGoal.visible,
        icon: businessGoal.icon,
        image: businessGoal.image ? {
          url: businessGoal.image.url,
          alt: businessGoal.image.alt
        } : undefined,
        benefits: businessGoal.benefits,
        features: businessGoal.features?.map(feature => ({
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          screenshot: feature.screenshot ? {
            url: feature.screenshot.url,
            alt: feature.screenshot.alt
          } : undefined
        }))
      };
      
      // Create the cloned business goal
      return await this.create(clonedBusinessGoal);
    } catch (error) {
      console.error(`[strapiBusinessGoalAdapter] Error cloning business goal with ID "${id}":`, error);
      throw error;
    }
  }
};
