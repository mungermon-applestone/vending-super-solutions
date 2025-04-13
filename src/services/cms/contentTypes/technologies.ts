
// This file is a re-export of the modularized technologies files
import { technologyOperations } from './technologies/index';
import {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
} from './technologies/index';

// Also export with alternate names for backward compatibility
const getTechnologyBySlug = fetchTechnologyBySlug;
const getTechnologies = fetchTechnologies;

export {
  technologyOperations,
  fetchTechnologyBySlug,
  getTechnologyBySlug,
  fetchTechnologies,
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
