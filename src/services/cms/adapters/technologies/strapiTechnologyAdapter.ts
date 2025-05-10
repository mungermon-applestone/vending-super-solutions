
/**
 * @deprecated This adapter is deprecated as we are transitioning to Contentful.
 * This file now simply re-exports the contentful adapter to maintain compatibility.
 */

import { contentfulTechnologyAdapter } from './contentfulTechnologyAdapter';
import { TechnologyAdapter } from './types';

// Log deprecation warning when this module is imported
console.warn('strapiTechnologyAdapter is deprecated and will be removed in a future release. Please use contentfulTechnologyAdapter instead.');

// Re-export the contentful adapter to avoid breaking changes
export const strapiTechnologyAdapter: TechnologyAdapter = contentfulTechnologyAdapter;
