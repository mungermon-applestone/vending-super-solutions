
/**
 * Technology service
 */

import { CMSTechnology } from '@/types/cms';
import { 
  fetchTechnologies, 
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology 
} from './contentTypes/technologies/index';

export {
  fetchTechnologies,
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};

export const getTechnologyBySlug = async (slug: string): Promise<CMSTechnology | null> => {
  return await fetchTechnologyBySlug();
};

export const getTechnologies = async (): Promise<CMSTechnology[]> => {
  return await fetchTechnologies();
};
