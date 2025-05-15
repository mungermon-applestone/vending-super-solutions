
// This file is kept as a placeholder to prevent import errors
// The actual implementation has been replaced by Contentful

import { logDeprecation } from '@/services/cms/utils/deprecation';

export const strapiTechnologyAdapter = {
  // Placeholder methods that log deprecation warnings
  getAll: () => {
    logDeprecation('strapiTechnologyAdapter.getAll', 'Use Contentful instead');
    return Promise.resolve([]);
  },
  
  getBySlug: () => {
    logDeprecation('strapiTechnologyAdapter.getBySlug', 'Use Contentful instead');
    return Promise.resolve(null);
  },
  
  // Add other methods as needed to prevent runtime errors
};
