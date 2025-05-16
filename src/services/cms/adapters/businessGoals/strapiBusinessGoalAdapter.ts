
/**
 * @deprecated This adapter is deprecated as we are transitioning to Contentful.
 * This file now simply re-exports the contentful adapter to maintain compatibility.
 */

// Import the contentful adapter instead
import { contentfulBusinessGoalAdapter } from './contentfulBusinessGoalAdapter';

console.warn('strapiBusinessGoalAdapter is deprecated and will be removed in a future release. Please use contentfulBusinessGoalAdapter instead.');

/**
 * Re-export the Contentful business goal adapter implementation to maintain compatibility
 */
export const strapiBusinessGoalAdapter = contentfulBusinessGoalAdapter;
