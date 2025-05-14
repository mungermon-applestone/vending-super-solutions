
/**
 * Utility to track and manage deprecated feature usage
 */

// Define the type for deprecation stats
export interface DeprecationStat {
  feature: string;
  count: number;
  lastUsed: string;
  alternatives?: string;
}

// Local storage key for tracking deprecated features
const STORAGE_KEY = 'deprecated_feature_usage';

/**
 * Log deprecation warning for a feature
 * 
 * @param feature Name of the deprecated feature
 * @param details Optional details about the deprecation
 * @param alternative Optional alternative solution to recommend
 */
export function logDeprecation(
  feature: string,
  details?: string,
  alternative?: string
): void {
  // Log to console
  console.warn(
    `[DEPRECATED] ${feature} is deprecated.${details ? ' ' + details : ''}${
      alternative ? '\nRecommendation: ' + alternative : ''
    }`
  );

  // Track usage in localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Get existing stats
      const existingData = localStorage.getItem(STORAGE_KEY);
      const stats: Record<string, DeprecationStat> = existingData
        ? JSON.parse(existingData)
        : {};

      // Update stats for this feature
      const existingStat = stats[feature] || {
        feature,
        count: 0,
        lastUsed: '',
        alternatives: alternative,
      };

      stats[feature] = {
        ...existingStat,
        count: existingStat.count + 1,
        lastUsed: new Date().toISOString(),
        alternatives: alternative || existingStat.alternatives,
      };

      // Save updated stats
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      // Fail silently if localStorage is not available
      console.debug('[Deprecation] Failed to track usage:', e);
    }
  }
}

// Alias for backward compatibility
export const logDeprecationWarning = logDeprecation;

/**
 * Get statistics about deprecated feature usage
 * 
 * @returns Array of deprecation statistics
 */
export function getDeprecationStats(): DeprecationStat[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const statsData = localStorage.getItem(STORAGE_KEY);
    if (!statsData) {
      return [];
    }

    const stats: Record<string, DeprecationStat> = JSON.parse(statsData);
    
    // Convert to array and sort by frequency (most used first)
    return Object.values(stats).sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error('[Deprecation] Failed to retrieve usage stats:', e);
    return [];
  }
}

/**
 * Reset the deprecation tracker
 */
export function resetDeprecationTracker(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('[Deprecation] Failed to reset tracker:', e);
    }
  }
}

/**
 * Generate a URL for Contentful
 */
export function getContentfulRedirectUrl(
  contentType?: string,
  contentId?: string,
  spaceId?: string,
  environmentId: string = 'master'
): string {
  const effectiveSpaceId = spaceId || import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  
  if (!effectiveSpaceId) {
    return 'https://app.contentful.com/';
  }

  const baseUrl = `https://app.contentful.com/spaces/${effectiveSpaceId}/environments/${environmentId}`;

  if (contentId) {
    return `${baseUrl}/entries/${contentId}`;
  }

  if (contentType) {
    return `${baseUrl}/entries?contentTypeId=${contentType}`;
  }

  return baseUrl;
}

