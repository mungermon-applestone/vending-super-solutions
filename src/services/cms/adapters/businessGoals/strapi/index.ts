
/**
 * @deprecated This adapter is deprecated. Use Contentful directly.
 * 
 * This is a compatibility layer that redirects all Strapi adapter calls to use
 * the Contentful adapter instead.
 */
import { contentfulBusinessGoalAdapter } from '../contentfulBusinessGoalAdapter';

/**
 * Re-export the Contentful adapter implementation as the Strapi adapter
 * This ensures backward compatibility for any code still using the Strapi adapter
 */
export const strapiBusinessGoalAdapter = contentfulBusinessGoalAdapter;

// Log a warning when this module is imported
console.warn(
  "⚠️ DEPRECATION WARNING: The Strapi business goal adapter is deprecated and will be removed in future versions. " +
  "Please use the Contentful adapter directly."
);
