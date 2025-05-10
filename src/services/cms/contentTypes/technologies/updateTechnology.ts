
import { CMSTechnology } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';
import { CreateTechnologyData } from './createTechnology';

export interface UpdateTechnologyData extends CreateTechnologyData {
  id?: string;
}

/**
 * Updates an existing technology entry in the database
 * @param slug The slug of the technology to update
 * @param data Technology data to update
 * @returns The updated technology object
 */
export const updateTechnology = async (
  slug: string, 
  data: Omit<CreateTechnologyData, 'id'>
): Promise<CMSTechnology> => {
  console.log(`[updateTechnology] Mock: Updating technology with slug: ${slug}`);
  
  try {
    // Generate a mock ID if none was provided
    const mockId = uuidv4();
    
    // Create a mock updated technology
    const updatedTechnology: CMSTechnology = {
      id: mockId,
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      visible: data.visible || false,
      image_url: data.image_url,
      image_alt: data.image_alt,
      sections: data.sections ? transformSections(data.sections, mockId) : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('[updateTechnology] Mock: Technology updated successfully');
    
    return updatedTechnology;
  } catch (error) {
    console.error('[updateTechnology] Error:', error);
    throw error;
  }
};

/**
 * Helper function to transform sections into the correct format with the required fields
 */
function transformSections(sections: any[], technologyId: string) {
  return sections.map((section, index) => {
    // Ensure each section has an id and technology_id
    const sectionId = section.id || uuidv4();
    
    return {
      id: sectionId,
      technology_id: technologyId,
      title: section.title,
      description: section.description || '',
      section_type: section.section_type || 'feature',
      display_order: section.display_order || index,
      features: transformFeatures(section.features || [], sectionId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}

/**
 * Helper function to transform features into the correct format
 */
function transformFeatures(features: any[], sectionId: string) {
  return features.map((feature, index) => {
    // Ensure each feature has an id
    const featureId = feature.id || uuidv4();
    
    return {
      id: featureId,
      section_id: sectionId,
      title: feature.title || '',
      description: feature.description || '',
      icon: feature.icon || 'check',
      display_order: feature.display_order || index,
      items: transformItems(feature.items || [], featureId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}

/**
 * Helper function to transform items into the correct format
 */
function transformItems(items: any[], featureId: string) {
  return items.map((item, index) => {
    return {
      id: item.id || uuidv4(),
      feature_id: featureId,
      text: item.text || '',
      display_order: item.display_order || index,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}
