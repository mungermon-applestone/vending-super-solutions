
/**
 * Utility for consistent deprecation warning messages
 */

import { trackDeprecatedUsage } from './deprecationUsageTracker';

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

