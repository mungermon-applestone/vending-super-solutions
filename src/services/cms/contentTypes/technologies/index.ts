
import { createReadOnlyContentTypeOperations } from '@/services/cms/utils/deprecation';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';
import { fetchTechnologyBySlug as getTechnologyBySlug } from './fetchTechnologyBySlug';
import { fetchTechnologies as getTechnologies } from './fetchTechnologies';
import { createTechnology } from './createTechnology';
import { updateTechnology } from './updateTechnology';
import { deleteTechnology } from './deleteTechnology';
import { cloneTechnology } from './cloneTechnology';

// Base technology operations
const baseTechnologyOperations = {
  // Read operations
  getAll: getTechnologies,
  getBySlug: getTechnologyBySlug,
  // Create, update, delete, clone operations are deprecated
};

/**
 * Technology content type operations
 */
export const technologyOperations: ContentTypeOperations<any> = createReadOnlyContentTypeOperations(
  'technology', 
  'technology',
  baseTechnologyOperations
);

// Export the operations with both new and legacy naming
export {
  getTechnologyBySlug as fetchTechnologyBySlug,
  getTechnologies as fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
