
import { CMSTechnology } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { buildStrapiUrl, createStrapiHeaders } from '../../utils/strapiConfig';
import { STRAPI_CONFIG } from '@/config/cms';

/**
 * Implementation of the Technology Adapter for Strapi CMS
 */
export const strapiTechnologyAdapter: TechnologyAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSTechnology[]> => {
    console.log('[strapiTechnologyAdapter] Fetching all technologies from Strapi');
    
    try {
      // Build the URL with query parameters if filters are provided
      let url = buildStrapiUrl(STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES);
      
      if (filters && Object.keys(filters).length > 0) {
        // Convert filters to Strapi query format
        const queryParams = new URLSearchParams();
        
        // Handle common filters
        if (filters.visible !== undefined) {
          queryParams.append('filters[visible][$eq]', filters.visible.toString());
        }
        
        if (filters.search) {
          queryParams.append('filters[$or][0][title][$containsi]', filters.search);
          queryParams.append('filters[$or][1][description][$containsi]', filters.search);
        }
        
        // Add the query string to the URL
        if (queryParams.toString()) {
          url = `${url}?${queryParams.toString()}`;
        }
      }
      
      // Make the request to Strapi
      const response = await fetch(url, {
        method: 'GET',
        headers: createStrapiHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform Strapi response to our internal format
      // This is placeholder code and will need to be adjusted based on actual Strapi response format
      return data.data.map((item: any) => ({
        id: item.id,
        title: item.attributes.title,
        slug: item.attributes.slug,
        description: item.attributes.description,
        image_url: item.attributes.image?.data?.attributes?.url,
        image_alt: item.attributes.image?.data?.attributes?.alternativeText,
        visible: item.attributes.visible,
        created_at: item.attributes.createdAt,
        updated_at: item.attributes.updatedAt,
        // Transform sections if they exist
        sections: item.attributes.sections?.data?.map((section: any) => ({
          id: section.id,
          title: section.attributes.title,
          description: section.attributes.description,
          section_type: section.attributes.sectionType,
          display_order: section.attributes.displayOrder,
          // Add other section fields as needed
        }))
      }));
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error fetching technologies:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with slug: ${slug}`);
    
    try {
      const url = buildStrapiUrl(`${STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES}?filters[slug][$eq]=${encodeURIComponent(slug)}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createStrapiHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if any results were found
      if (!data.data || data.data.length === 0) {
        return null;
      }
      
      // Transform the first result from Strapi format to our internal format
      const item = data.data[0];
      return {
        id: item.id,
        title: item.attributes.title,
        slug: item.attributes.slug,
        description: item.attributes.description,
        image_url: item.attributes.image?.data?.attributes?.url,
        image_alt: item.attributes.image?.data?.attributes?.alternativeText,
        visible: item.attributes.visible,
        created_at: item.attributes.createdAt,
        updated_at: item.attributes.updatedAt,
        // Transform sections if they exist
        sections: item.attributes.sections?.data?.map((section: any) => ({
          id: section.id,
          title: section.attributes.title,
          description: section.attributes.description,
          section_type: section.attributes.sectionType,
          display_order: section.attributes.displayOrder,
          // Add other section fields as needed
        }))
      };
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by slug "${slug}":`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[strapiTechnologyAdapter] Fetching technology with ID: ${id}`);
    
    try {
      const url = buildStrapiUrl(`${STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES}/${id}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: createStrapiHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform from Strapi format to our internal format
      const item = data.data;
      return {
        id: item.id,
        title: item.attributes.title,
        slug: item.attributes.slug,
        description: item.attributes.description,
        image_url: item.attributes.image?.data?.attributes?.url,
        image_alt: item.attributes.image?.data?.attributes?.alternativeText,
        visible: item.attributes.visible,
        created_at: item.attributes.createdAt,
        updated_at: item.attributes.updatedAt,
        // Transform sections if they exist
        sections: item.attributes.sections?.data?.map((section: any) => ({
          id: section.id,
          title: section.attributes.title,
          description: section.attributes.description,
          section_type: section.attributes.sectionType,
          display_order: section.attributes.displayOrder,
          // Add other section fields as needed
        }))
      };
    } catch (error) {
      console.error(`[strapiTechnologyAdapter] Error fetching technology by ID "${id}":`, error);
      throw error;
    }
  },
  
  create: async (data: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log('[strapiTechnologyAdapter] Creating new technology:', data);
    
    try {
      // Transform our data format to Strapi format
      const strapiData = {
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          visible: data.visible,
          // Handle image if present
          // This is placeholder and will need to be adjusted based on Strapi media handling
          image: data.image ? { url: data.image.url, alt: data.image.alt } : undefined,
          // Transform sections if they exist
          sections: data.sections ? data.sections.map(section => ({
            title: section.title,
            description: section.description || undefined,
            sectionType: section.type,
            displayOrder: section.display_order || 0,
            // Transform features if they exist
            features: section.features ? section.features.map((feature, index) => ({
              title: feature.title || undefined,
              description: feature.description || undefined,
              icon: feature.icon || undefined,
              displayOrder: feature.display_order || index,
              // Transform items if they exist
              items: feature.items ? 
                (Array.isArray(feature.items) ? 
                  feature.items.map((item, itemIndex) => {
                    if (typeof item === 'string') {
                      return {
                        text: item,
                        displayOrder: itemIndex
                      };
                    } else {
                      return {
                        text: item.text,
                        displayOrder: item.display_order || itemIndex
                      };
                    }
                  }) 
                : undefined)
            })) : undefined
          })) : undefined
        }
      };
      
      const url = buildStrapiUrl(STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: createStrapiHeaders(),
        body: JSON.stringify(strapiData)
      });
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Immediately fetch the complete technology we just created
      return await strapiTechnologyAdapter.getById(responseData.data.id);
    } catch (error) {
      console.error('[strapiTechnologyAdapter] Error creating technology:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[strapiTechnologyAdapter] Updating technology with ID: ${id}`, data);
    
    // Similar implementation to create, but using PUT method
    try {
      // Transform our data format to Strapi format
      const strapiData = {
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          visible: data.visible,
          // Handle image if present
          image: data.image ? { url: data.image.url, alt: data.image.alt } : undefined,
          // Transform sections if they exist
          sections: data.sections ? data.sections.map((section, index) => ({
            title: section.title,
            description: section.description,
            sectionType: section.type,
            displayOrder: section.display_order || index,
            // Transform features if they exist
            features: section.features ? section.features.map((feature, featureIndex) => ({
              title: feature.title || '',
              description: feature.description,
              icon: feature.icon,
              displayOrder: feature.display_order || featureIndex,
              // Transform items if they exist
              items: feature.items ? 
                (Array.isArray(feature.items) ? 
                  feature.items.map((item, itemIndex) => {
                    if (typeof item === 'string') {
                      return {
                        text: item,
                        displayOrder: itemIndex
                      };
                    } else {
                      return {
                        text: item.text,
                        displayOrder: item.display_order || itemIndex
                      };
                    }
                  })
                : undefined)
            })) : undefined
          })) : undefined
        }
      };
      
      const url = buildStrapiUrl(`${STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES}/${id}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: createStrapiHeaders(),
        body: JSON.stringify(strapiData)
      });
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
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
      const url = buildStrapiUrl(`${STRAPI_CONFIG.ENDPOINTS.TECHNOLOGIES}/${id}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: createStrapiHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }
      
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
        // Transform sections if they exist
        sections: sourceTechnology.sections ? sourceTechnology.sections.map((section, index) => ({
          title: section.title,
          description: section.description || undefined,
          type: section.section_type,
          display_order: section.display_order,
          // Transform features if they exist
          features: section.features ? section.features.map((feature, featureIndex) => ({
            title: feature.title || undefined,
            description: feature.description || undefined,
            icon: feature.icon || undefined,
            display_order: feature.display_order,
            // Transform items if they exist
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
