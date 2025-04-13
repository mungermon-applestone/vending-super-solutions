
import { CMSTechnology } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { cloneTechnology } from '../../contentTypes/technologies/cloneTechnology';

/**
 * Implementation of the Technology Adapter for Supabase
 */
export const supabseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (): Promise<CMSTechnology[]> => {
    console.log('[supabseTechnologyAdapter] Fetching all technologies');
    
    // Use the existing technology service
    const { fetchTechnologies } = await import('../../contentTypes/technologies');
    return await fetchTechnologies();
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Fetching technology with slug: ${slug}`);
    
    // Use the existing technology service
    const { fetchTechnologyBySlug } = await import('../../contentTypes/technologies');
    return await fetchTechnologyBySlug(slug);
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Fetching technology with ID: ${id}`);
    
    // Get all technologies and filter by ID
    const technologies = await supabseTechnologyAdapter.getAll();
    return technologies.find(tech => tech.id === id) || null;
  },
  
  create: async (data: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log('[supabseTechnologyAdapter] Creating new technology:', data);
    
    // Transform input data to match CreateTechnologyData format
    const transformedData = transformTechnologyInput(data);
    
    // Use the existing technology service
    const { createTechnology } = await import('../../contentTypes/technologies');
    return await createTechnology(transformedData);
  },
  
  update: async (id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[supabseTechnologyAdapter] Updating technology with ID: ${id}`, data);
    
    // Transform input data to match CreateTechnologyData format
    const transformedData = transformTechnologyInput(data);
    
    // Use the existing technology service
    const { updateTechnology } = await import('../../contentTypes/technologies');
    return await updateTechnology(id, transformedData);
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabseTechnologyAdapter] Deleting technology with ID: ${id}`);
    
    // First need to find the technology to get its slug
    const tech = await supabseTechnologyAdapter.getById(id);
    if (!tech) {
      throw new Error(`Technology with ID "${id}" not found`);
    }
    
    // Use the existing technology service
    const { deleteTechnology } = await import('../../contentTypes/technologies');
    return await deleteTechnology(tech.slug);
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Cloning technology with ID: ${id}`);
    
    return await cloneTechnology(id);
  }
};

/**
 * Helper function to transform TechnologyCreateInput/UpdateInput to the format
 * expected by the createTechnology/updateTechnology functions
 */
function transformTechnologyInput(data: TechnologyCreateInput | TechnologyUpdateInput) {
  // Create base transformed data
  const transformedData = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    image_url: data.image?.url,
    image_alt: data.image?.alt,
    visible: data.visible
  };
  
  // Transform sections if they exist
  if (data.sections && Array.isArray(data.sections)) {
    const sections = data.sections.map((section, index) => {
      // Create base section
      const transformedSection = {
        title: section.title,
        description: section.description,
        section_type: section.type || 'feature',
        display_order: index, // Use index as display_order
      };
      
      // Transform features if they exist
      if (section.features && Array.isArray(section.features)) {
        const features = section.features.map((feature, featureIndex) => {
          // Create base feature
          const transformedFeature = {
            title: feature.title || '',
            description: feature.description,
            icon: feature.icon,
            display_order: featureIndex, // Use index as display_order
          };
          
          // Transform items if they exist
          if (feature.items && Array.isArray(feature.items)) {
            const items = feature.items.map((item, itemIndex) => {
              return {
                text: item,
                display_order: itemIndex, // Use index as display_order
              };
            });
            
            return { ...transformedFeature, items };
          }
          
          return transformedFeature;
        });
        
        return { ...transformedSection, features };
      }
      
      return transformedSection;
    });
    
    return { ...transformedData, sections };
  }
  
  return transformedData;
}
