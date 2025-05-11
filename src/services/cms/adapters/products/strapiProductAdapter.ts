
/**
 * @deprecated ARCHIVED ADAPTER - Do not use in new development
 * 
 * This adapter is deprecated as we are transitioning to Contentful.
 * This file now simply re-exports the contentful adapter for backward compatibility.
 * It will be removed in a future release.
 */

import { contentfulProductAdapter } from './contentfulProductAdapter';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when this module is imported
logDeprecationWarning(
  "strapiProductAdapter",
  "This adapter is deprecated and will be removed in a future release.",
  "Please use contentfulProductAdapter directly."
);

// Re-export the contentful adapter to maintain backward compatibility
export const strapiProductAdapter = contentfulProductAdapter;
