
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
 * @returns The created technology ID
 */
export const createTechnology = async (data: CreateTechnologyData): Promise<string> => {
  console.log('[createTechnology] Creating new technology (MOCK):', data.title);
  
  try {
    // Mock implementation that doesn't touch Supabase
    const mockId = uuidv4();
    
    console.log(`[createTechnology] Created mock technology with ID: ${mockId}`);
    
    return mockId;
    
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
    sections: []
  };
};
