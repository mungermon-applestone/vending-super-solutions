
/**
 * @deprecated ARCHIVED ADAPTER - Do not use in new development
 * 
 * This adapter is deprecated as we are transitioning to Contentful.
 * This file now simply re-exports the contentful adapter for backward compatibility.
 * It will be removed in a future release.
 */

import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when this module is imported
const warnDeprecation = () => {
  logDeprecationWarning(
    "strapiTechnologyAdapter", 
    "This adapter is deprecated and will be removed in a future release.",
    "Please use contentfulTechnologyAdapter directly."
  );
};

// Re-export the contentful adapter to maintain backward compatibility
export const strapiTechnologyAdapter = contentfulTechnologyAdapter;
