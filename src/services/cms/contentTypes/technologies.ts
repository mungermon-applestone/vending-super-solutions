
// This file is a re-export of the modularized technologies files
import { technologyOperations } from './technologies/index';
import {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology
} from './technologies/index';

export {
  technologyOperations,
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology
};
