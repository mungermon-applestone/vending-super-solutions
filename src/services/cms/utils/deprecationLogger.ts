
/**
 * Utility for consistent deprecation warning messages
 */

import { trackDeprecatedUsage, getDeprecatedUsage, resetDeprecationTracker } from './deprecationUsageTracker';

// Interface for usage statistics data
export interface DeprecationStat {
  feature: string;
  count: number;
  lastUsed: number;
}

/**
 * Log a deprecation warning message consistently
 * @param feature The name of the feature that is deprecated
 * @param message The deprecation message
 * @param replacement Optional recommendation for replacement
 */
export function logDeprecationWarning(
  feature: string, 
  message: string, 
  replacement?: string
): void {
  // Get stack trace to find calling file
  const stack = new Error().stack || '';
  const stackLines = stack.split('\n');
  const callerLine = stackLines.length > 2 ? stackLines[2] : '';
  const callerMatch = callerLine.match(/at\s+(.+)\s+\((.+)\)/);
  const callerFile = callerMatch ? callerMatch[2] : 'unknown';
  
  // Track this usage for deprecation metrics
  trackDeprecatedUsage(feature, callerFile);
  
  // Log the warning
  const baseMessage = `⚠️ DEPRECATED: ${message}`;
  const replacementMessage = replacement ? `\n👉 RECOMMENDED: ${replacement}` : '';
  
  console.warn(`${baseMessage}${replacementMessage}`);
}

/**
 * Alternative name for trackDeprecatedUsage to maintain compatibility
 * @deprecated Use trackDeprecatedUsage instead
 */
export function trackDeprecatedFeatureUsage(feature: string, details?: string): void {
  // Forward to the standard tracking function
  trackDeprecatedUsage(feature, details);
}

/**
 * Get formatted statistics about deprecated feature usage
 * @returns Array of statistics objects with feature name, count, and last usage time
 */
export function getDeprecationUsageStats(): DeprecationStat[] {
  const usageEntries = getDeprecatedUsage();
  const stats: Record<string, DeprecationStat> = {};
  
  // Process the raw usage data into statistics
  usageEntries.forEach(entry => {
    const [feature] = entry.split(':');
    
    if (!stats[feature]) {
      stats[feature] = {
        feature,
        count: 0,
        lastUsed: Date.now()
      };
    }
    
    stats[feature].count++;
  });
  
  return Object.values(stats).sort((a, b) => b.count - a.count);
}

/**
 * Reset all deprecation usage statistics
 */
export function resetUsageStats(): void {
  resetDeprecationTracker();
}
