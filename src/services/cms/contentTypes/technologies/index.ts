
import { CMSTechnology } from '@/types/cms';

export const fetchTechnologies = async (): Promise<CMSTechnology[]> => {
  return [];
};

export const fetchTechnologyBySlug = async (): Promise<CMSTechnology | null> => {
  return null;
};

export const createTechnology = async (data: any): Promise<CMSTechnology> => {
  return {
    id: 'mock-id',
    title: data.title || 'New Technology',
    slug: data.slug || 'new-technology',
    description: data.description || '',
    visible: true
  };
};

export const updateTechnology = async (slug: string, data: any): Promise<CMSTechnology> => {
  return {
    id: 'mock-id',
    title: data.title || 'Updated Technology',
    slug: data.slug || slug,
    description: data.description || '',
    visible: true
  };
};

export const deleteTechnology = async (slug: string): Promise<boolean> => {
  console.log(`Deleting technology with slug: ${slug}`);
  return true;
};

export const cloneTechnology = async (slug: string): Promise<CMSTechnology> => {
  return {
    id: 'cloned-id',
    title: 'Cloned Technology',
    slug: `${slug}-clone`,
    description: 'This is a cloned technology',
    visible: true
  };
};
