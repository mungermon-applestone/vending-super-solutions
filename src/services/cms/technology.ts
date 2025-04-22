
import { CMSTechnology } from '@/types/cms';
import { fetchTechnologyBySlug } from './contentTypes/technologies/fetchTechnologyBySlug';

export const cloneTechnology = async (id: string): Promise<CMSTechnology | null> => {
  console.log('Cloning technology:', id);
  return null;
};

export const deleteTechnology = async (id: string): Promise<boolean> => {
  console.log('Deleting technology:', id);
  return true;
};

export { fetchTechnologyBySlug };
