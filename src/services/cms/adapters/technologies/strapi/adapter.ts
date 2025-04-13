
import { CMSTechnology } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from '../types';
import { buildTechnologyEndpoint, buildStrapiFilters, fetchFromStrapi } from './helpers';
import { transformStrapiDataToTechnology, transformInputToStrapiFormat } from './transformers';

/**
 * Implementation of the Technology Adapter for Strapi CMS
 */
export const strapiTechnologyAdapter: TechnologyAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSTechnology[]> => {
    console.log('[strapiTechnologyAdapter] Fetching all technologies from Strapi');
    
    try {
      // Build the URL with query parameters if filters are provided
      let url = buildTechnologyEndpoint();
      const queryParams = buildStrapiFilters(filters);
      
      // Add the query string to the URL
      if (queryParams.toString()) {
        url = `${url}?${queryParams.toString()}`;
      }
      
      // Make the request to Strapi
      const data = await fetchFromStrapi<any>(url);
      
      // Transform Strapi response to our internal format
      return data.data.map((item: any) => transformStrapiDataToTechnology(item));
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error fetching technologies:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with slug: ${slug}`);
    
    try {
      const url = buildTechnologyEndpoint(`?filters[slug][$eq]=${encodeURIComponent(slug)}`);
      
      const data = await fetchFromStrapi<any>(url);
      
      // Check if any results were found
      if (!data.data || data.data.length === 0) {
        return null;
      }
      
      // Transform the first result from Strapi format to our internal format
      return transformStrapiDataToTechnology(data.data[0]);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by slug "${slug}":`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with ID: ${id}`);
    
    try {
      const url = buildTechnologyEndpoint(id);
      
      const data = await fetchFromStrapi<any>(url).catch(error => {
        if (error.message.includes('404')) {
          return null;
        }
        throw error;
      });
      
      if (!data) {
        return null;
      }
      
      // Transform from Strapi format to our internal format
      return transformStrapiDataToTechnology(data.data);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by ID "${id}":`, error);
      throw error;
    }
  },
  
  create: async (data: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log('[strapiTechnologyAdapter] Creating new technology:', data);
    
    try {
      // Transform our data format to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      const url = buildTechnologyEndpoint();
      
      const responseData = await fetchFromStrapi<any>(url, 'POST', strapiData);
      
      // Immediately fetch the complete technology we just created
      return await strapiTechnologyAdapter.getById(responseData.data.id);
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error creating technology:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[strapiTechnologyAdapter] Updating technology with ID: ${id}`, data);
    
    try {
      // Transform our data format to Strapi format
      const strapiData = transformInputToStrapiFormat(data);
      
      const url = buildTechnologyEndpoint(id);
      
      await fetchFromStrapi<any>(url, 'PUT', strapiData);
      
      // Immediately fetch the complete updated technology
      return await strapiTechnologyAdapter.getById(id);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error updating technology "${id}":`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiTechnologyAdapter] Deleting technology with ID: ${id}`);
    
    try {
      const url = buildTechnologyEndpoint(id);
      
      await fetchFromStrapi<boolean>(url, 'DELETE');
      
      return true;
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error deleting technology "${id}":`, error);
      throw error;
    }
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Cloning technology with ID: ${id}`);
    
    try {
      // First get the technology to clone
      const sourceTechnology = await strapiTechnologyAdapter.getById(id);
      
      if (!sourceTechnology) {
        throw new Error(`Technology with ID "${id}" not found`);
      }
      
      // Create a new slug with "-copy" suffix
      const newSlug = `${sourceTechnology.slug}-copy`;
      
      // Create a copy with modified title and slug
      const cloneData: TechnologyCreateInput = {
        title: `${sourceTechnology.title} (Copy)`,
        slug: newSlug,
        description: sourceTechnology.description,
        visible: sourceTechnology.visible,
        image: sourceTechnology.image_url ? {
          url: sourceTechnology.image_url,
          alt: sourceTechnology.image_alt || '',
        } : undefined,
        sections: sourceTechnology.sections ? sourceTechnology.sections.map((section) => ({
          title: section.title,
          description: section.description || undefined,
          type: section.section_type,
          display_order: section.display_order,
          features: section.features ? section.features.map((feature) => ({
            title: feature.title || undefined,
            description: feature.description || undefined,
            icon: feature.icon || undefined,
            display_order: feature.display_order,
            items: feature.items ? feature.items.map(item => item.text) : undefined
          })) : undefined
        })) : undefined
      };
      
      // Create the clone
      return await strapiTechnologyAdapter.create(cloneData);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error cloning technology "${id}":`, error);
      throw error;
    }
  }
};
