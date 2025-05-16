
/**
 * @deprecated ARCHIVED ADAPTER - Do not use in new development
 * 
 * This adapter is deprecated as we are transitioning to Contentful.
 * This file now simply re-exports the contentful adapter for backward compatibility.
 */

import { contentfulBusinessGoalAdapter } from '../contentfulBusinessGoalAdapter';
import { logDeprecationWarning } from '@/services/cms/utils/deprecation';

// Log deprecation warning when this module is imported
logDeprecationWarning(
  "strapiBusinessGoalAdapter (adapter.ts)", 
  "This adapter is deprecated and will be removed in a future release.",
  "Please use contentfulBusinessGoalAdapter directly."
);

// Export the contentful adapter as the strapi business goal adapter
export const strapiBusinessGoalAdapter = contentfulBusinessGoalAdapter;
