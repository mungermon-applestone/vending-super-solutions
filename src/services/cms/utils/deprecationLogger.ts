
/**
 * Utility functions for logging deprecation warnings
 * This helps track which legacy features are being used
 */

const loggedDeprecations = new Set<string>();

/**
 * Log a deprecation warning once per key
 * 
 * @param key - Unique identifier for this deprecation
 * @param message - Warning message
 * @param recommendation - Recommended alternative
 */
export function logDeprecationWarning(key: string, message: string, recommendation?: string) {
  // Only log each deprecation once per session
  if (loggedDeprecations.has(key)) return;
  
  loggedDeprecations.add(key);
  
  console.warn(
    `[DEPRECATED] ${message}` + 
    (recommendation ? `\nRecommendation: ${recommendation}` : '')
  );
}

/**
 * Log usage of deprecated code paths
 * 
 * @param key - Unique identifier for this deprecation
 * @param message - Warning message
 * @param recommendation - Recommended alternative
 */
export function logDeprecation(key: string, message: string, recommendation?: string) {
  if (import.meta.env.DEV) {
    logDeprecationWarning(key, message, recommendation);
  }
}
