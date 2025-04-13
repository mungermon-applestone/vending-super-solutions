import { TechnologyAdapter } from '../types';
import { CMSTechnology, CMSTechnologySection, QueryOptions } from '@/types/cms';
import { buildTechnologyEndpoint, buildStrapiFilters, fetchFromStrapi } from './helpers';

/**
 * Adapter for interacting with Strapi's Technology content type
 */
export const strapiTechnologyAdapter: TechnologyAdapter = {
  /**
   * Fetches all technologies from Strapi
   */
  getAllTechnologies: async (options?: QueryOptions): Promise<CMSTechnology[]> => {
    try {
      console.log('[strapiTechnologyAdapter] Fetching all technologies from Strapi');
      const queryParams = options ? buildStrapiFilters(options) : new URLSearchParams();
      const endpoint = buildTechnologyEndpoint(`?${queryParams.toString()}`);
      
      const response = await fetchFromStrapi<any>(endpoint);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('[strapiTechnologyAdapter] Unexpected response format:', response);
        return [];
      }
      
      return response.data.map(transformStrapiTechnology);
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error fetching technologies:', error);
      throw error;
    }
  },
  
  /**
   * Fetches a technology by its slug
   */
  getTechnologyBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    try {
      console.log(`[strapiTechnologyAdapter] Fetching technology with slug: ${slug}`);
      const queryParams = new URLSearchParams();
      queryParams.append('filters[slug][$eq]', slug);
      
      const endpoint = buildTechnologyEndpoint(`?${queryParams.toString()}`);
      const response = await fetchFromStrapi<any>(endpoint);
      
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.warn(`[strapiTechnologyAdapter] No technology found with slug: ${slug}`);
        return null;
      }
      
      return transformStrapiTechnology(response.data[0]);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology with slug ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Creates a new technology in Strapi
   */
  createTechnology: async (technology: Partial<CMSTechnology>): Promise<string> => {
    try {
      console.log('[strapiTechnologyAdapter] Creating new technology:', technology.title);
      
      // Transform to Strapi format
      const strapiTechnology = {
        title: technology.title,
        slug: technology.slug,
        description: technology.description,
        visible: technology.visible ?? true,
        // Other properties would be added here as needed
      };
      
      const endpoint = buildTechnologyEndpoint();
      const response = await fetchFromStrapi<any>(endpoint, 'POST', strapiTechnology);
      
      if (!response.data || !response.data.id) {
        throw new Error('Failed to create technology: Invalid response from Strapi');
      }
      
      return response.data.id;
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error creating technology:', error);
      throw error;
    }
  },
  
  /**
   * Updates an existing technology in Strapi
   */
  updateTechnology: async (id: string, technology: Partial<CMSTechnology>): Promise<boolean> => {
    try {
      console.log(`[strapiTechnologyAdapter] Updating technology with id: ${id}`);
      
      // Transform to Strapi format
      const strapiTechnology = {
        title: technology.title,
        slug: technology.slug,
        description: technology.description,
        visible: technology.visible,
        // Other properties would be added here as needed
      };
      
      const endpoint = buildTechnologyEndpoint(id);
      await fetchFromStrapi<any>(endpoint, 'PUT', strapiTechnology);
      
      return true;
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error updating technology ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Deletes a technology from Strapi
   */
  deleteTechnology: async (id: string): Promise<boolean> => {
    try {
      console.log(`[strapiTechnologyAdapter] Deleting technology with id: ${id}`);
      
      const endpoint = buildTechnologyEndpoint(id);
      await fetchFromStrapi<any>(endpoint, 'DELETE');
      
      return true;
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error deleting technology ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Transforms a Strapi technology response to our CMS technology format
 */
function transformStrapiTechnology(strapiTechnology: any): CMSTechnology {
  // Extract the base data
  const baseData = strapiTechnology.attributes || strapiTechnology;
  
  // Transform sections data if available
  let sections: CMSTechnologySection[] = [];
  if (baseData.sections && Array.isArray(baseData.sections.data)) {
    sections = baseData.sections.data.map((section: any) => {
      const sectionData = section.attributes || section;
      return {
        id: section.id,
        technology_id: strapiTechnology.id,
        section_type: sectionData.section_type,
        title: sectionData.title,
        description: sectionData.description,
        display_order: sectionData.display_order,
        features: [], // Would need to transform features similarly
        images: []    // Would need to transform images similarly
      };
    });
  }
  
  return {
    id: strapiTechnology.id,
    slug: baseData.slug,
    title: baseData.title,
    description: baseData.description,
    image_url: baseData.image_url || null,
    image_alt: baseData.image_alt || null,
    visible: baseData.visible ?? true,
    created_at: baseData.createdAt || baseData.created_at,
    updated_at: baseData.updatedAt || baseData.updated_at,
    sections: sections
  };
}

/**
 * Re-export the adapter for easier imports
 */
export { strapiTechnologyAdapter as default };
