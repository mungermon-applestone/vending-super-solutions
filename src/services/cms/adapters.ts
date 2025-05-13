
/**
 * Adapters utility module
 * 
 * This module provides utilities for working with different CMS adapters
 * and facilitates the transition between different CMS providers.
 */

import { logDeprecation } from './utils/deprecation';
import { contentfulBusinessGoalAdapter } from './adapters/businessGoals/contentfulBusinessGoalAdapter';
import { ContentProviderType } from './adapters/types';
import { createReadOnlyAdapter } from './utils/deprecation';

/**
 * Get the appropriate adapter based on the provider type
 */
export function getAdapter(contentType: string, providerType: ContentProviderType = ContentProviderType.CONTENTFUL) {
  // Log the usage of this function
  logDeprecation(
    'getAdapter',
    `Getting adapter for ${contentType} with provider ${providerType}`,
    'direct imports from content type modules'
  );
  
  // Always return Contentful adapters as we are phasing out other providers
  switch (contentType) {
    case 'businessGoal':
      return contentfulBusinessGoalAdapter;
    // Add cases for other content types as needed
    default:
      throw new Error(`No adapter found for content type: ${contentType}`);
  }
}

/**
 * Get a combined adapter that includes all content types
 */
export function getCombinedAdapter() {
  // Log the usage of this function
  logDeprecation(
    'getCombinedAdapter',
    'Using the combined adapter',
    'dedicated content type operations from cms/index.ts'
  );
  
  return {
    businessGoals: contentfulBusinessGoalAdapter,
    // Add other adapters as needed
  };
}

/**
 * Create a read-only version of an adapter
 * This is a convenience re-export from the deprecation module
 */
export { createReadOnlyAdapter };
