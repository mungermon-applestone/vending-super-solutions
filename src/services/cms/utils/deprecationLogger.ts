
import { logDeprecation, getDeprecationStats, resetDeprecationTracker } from './deprecation';

export { logDeprecation as logDeprecationWarning, getDeprecationStats, resetDeprecationTracker };

/**
 * Track deprecated feature usage (alias)
 */
export function trackDeprecatedFeatureUsage(feature: string, details?: string): void {
  logDeprecation(feature, details || `Feature "${feature}" used`);
}

/**
 * Get usage statistics (alias)
 */
export function getDeprecationUsageStats() {
  return getDeprecationStats();
}
