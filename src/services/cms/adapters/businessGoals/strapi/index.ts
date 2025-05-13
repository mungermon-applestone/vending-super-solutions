
import { strapiBusinessGoalAdapter } from './adapter';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Log a deprecation warning when this module is imported
 */
logDeprecation(
  'strapiBusinessGoalAdapter',
  'The Strapi Business Goal adapter is deprecated and will be removed in a future release.',
  'Use the Contentful Business Goal adapter instead'
);

/**
 * Re-export the adapter implementation with deprecation tracking
 */
export { strapiBusinessGoalAdapter };
