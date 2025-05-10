
import { CMSTechnology } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTechnologyData {
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: Array<{
    title: string;
    description?: string;
    section_type?: string;
    display_order: number;
    features?: Array<{
      title: string;
      description?: string;
      icon?: string;
      display_order: number;
      items?: Array<{
        text: string;
        display_order: number;
      }>;
    }>;
  }>;
}

/**
 * Creates a new technology entry in the database
 * @param data Technology data to create
 * @returns The created technology as a CMSTechnology object
 */
export const createTechnology = async (data: CreateTechnologyData): Promise<CMSTechnology> => {
  console.log('[createTechnology] Creating new technology (MOCK):', data.title);
  
  try {
    // Mock implementation that doesn't touch Supabase
    const mockId = uuidv4();
    
    // Transform sections to ensure they have the required properties
    const processedSections = data.sections ? 
      data.sections.map((section, index) => {
        const sectionId = uuidv4();
        return {
          id: sectionId,
          technology_id: mockId,
          title: section.title,
          description: section.description || '',
          section_type: section.section_type || 'feature',
          display_order: section.display_order || index,
          features: section.features ? section.features.map((feature, fIndex) => {
            const featureId = uuidv4();
            return {
              id: featureId,
              section_id: sectionId,
              title: feature.title,
              description: feature.description || '',
              icon: feature.icon || 'check',
              display_order: feature.display_order || fIndex,
              items: feature.items ? feature.items.map((item, iIndex) => ({
                id: uuidv4(),
                feature_id: featureId,
                text: item.text,
                display_order: item.display_order || iIndex,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })) : [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }) : [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      })
      : [];
    
    // Create a full CMSTechnology object
    const newTechnology: CMSTechnology = {
      id: mockId,
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      visible: data.visible || false,
      image_url: data.image_url,
      image_alt: data.image_alt,
      sections: processedSections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log(`[createTechnology] Created mock technology with ID: ${mockId}`);
    
    return newTechnology;
    
  } catch (error) {
    console.error('[createTechnology] Error:', error);
    throw error;
  }
};

/**
 * Helper function to fetch a technology with all its relations - mock implementation
 */
export const fetchTechnologyWithRelations = async (id: string): Promise<CMSTechnology> => {
  return {
    id: id,
    title: 'Mock Technology',
    slug: 'mock-technology',
    description: 'This is a mock technology created for testing',
    visible: true,
    sections: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
