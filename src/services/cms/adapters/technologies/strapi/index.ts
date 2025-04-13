
import { CMSTechnology } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from '../types';
import { getStrapiApiKey, getStrapiBaseUrl } from '../../../utils/strapiConfig';
import { transformStrapiTechnologyToInternal, transformInputToStrapiFormat } from './transformers';

/**
 * Strapi Technology Adapter Implementation
 */
export const strapiTechnologyAdapter: TechnologyAdapter = {
  getAll: async (): Promise<CMSTechnology[]> => {
    console.log('[strapiTechnologyAdapter] Fetching all technologies');
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    try {
      // Build up the URL with query parameters to populate all related entities
      const url = `${baseUrl}/technologies?populate=sections.features.items,sections.images`;
      
      const response = await fetch(url, {
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch technologies from Strapi: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform Strapi response to our internal format
      return data.data.map((item: any) => transformStrapiTechnologyToInternal(item));
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error fetching technologies:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with slug: ${slug}`);
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    try {
      // Build the URL with filters and population
      const url = `${baseUrl}/technologies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=sections.features.items,sections.images`;
      
      const response = await fetch(url, {
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch technology with slug "${slug}" from Strapi: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if any items were found
      if (!data.data || data.data.length === 0) {
        return null;
      }
      
      // Transform the first result to our internal format
      return transformStrapiTechnologyToInternal(data.data[0]);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by slug "${slug}":`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with ID: ${id}`);
    
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    if (!baseUrl) {
      throw new Error('Strapi API URL not configured');
    }
    
    try {
      // Build the URL with the ID and population
      const url = `${baseUrl}/technologies/${id}?populate=sections.features.items,sections.images`;
      
      const response = await fetch(url, {
        headers: {
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch technology with ID "${id}" from Strapi: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform to our internal format
      return transformStrapiTechnologyToInternal(data.data);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by ID "${id}":`, error);
      throw error;
    }
  },
  
  create: async (data: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log('[strapiTechnologyAdapter] Creating new technology:', data);
    
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
      
      // Send the POST request to create the technology
      const response = await fetch(`${baseUrl}/technologies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ data: strapiData })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create technology in Strapi: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Get the ID of the newly created technology
      const newId = responseData.data.id;
      
      // Fetch the complete technology with all populated relations
      return await strapiTechnologyAdapter.getById(newId);
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error creating technology:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[strapiTechnologyAdapter] Updating technology with ID: ${id}`, data);
    
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
      
      // Send the PUT request to update the technology
      const response = await fetch(`${baseUrl}/technologies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({ data: strapiData })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update technology in Strapi: ${response.statusText}`);
      }
      
      // Fetch the updated technology with all populated relations
      return await strapiTechnologyAdapter.getById(id);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error updating technology with ID "${id}":`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiTechnologyAdapter] Deleting technology with ID: ${id}`);
    
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
      const response = await fetch(`${baseUrl}/technologies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete technology in Strapi: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error deleting technology with ID "${id}":`, error);
      throw error;
    }
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Cloning technology with ID: ${id}`);
    
    try {
      // First, get the technology to clone
      const technology = await strapiTechnologyAdapter.getById(id);
      if (!technology) {
        throw new Error(`Technology with ID "${id}" not found`);
      }
      
      // Create a new technology based on the existing one
      const clonedTechnology: TechnologyCreateInput = {
        title: `${technology.title} (Copy)`,
        slug: `${technology.slug}-copy-${Math.floor(Date.now() / 1000)}`,
        description: technology.description,
        visible: technology.visible,
        image: technology.image_url ? {
          url: technology.image_url,
          alt: technology.image_alt || `${technology.title} image`
        } : undefined,
        sections: technology.sections?.map(section => ({
          title: section.title,
          description: section.description,
          type: section.section_type,
          features: section.features?.map(feature => ({
            title: feature.title || '',
            description: feature.description,
            icon: feature.icon,
            items: feature.items?.map(item => item.text)
          }))
        }))
      };
      
      // Create the cloned technology
      return await strapiTechnologyAdapter.create(clonedTechnology);
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error cloning technology with ID "${id}":`, error);
      throw error;
    }
  }
};
