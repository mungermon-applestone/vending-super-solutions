
import { CMSTechnology } from '@/types/cms';
import { 
  fetchTechnologies, 
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
} from './technologies/index';

export {
  fetchTechnologies,
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};

// Export default for consistent module structure
export default {
  fetchTechnologies,
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
