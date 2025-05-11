
/**
 * Utility for tracking usage of deprecated CMS components to aid 
 * in the removal of legacy code once it's no longer needed.
 */

// Set to store unique deprecation events
const reportedDeprecations = new Set<string>();

/**
 * Tracks usage of deprecated features and logs it only once per feature
 * to avoid console spam
 * 
 * @param feature The name of the deprecated feature being used
 * @param file The file where the usage occurred
 */
export function trackDeprecatedUsage(feature: string, file?: string): void {
  const key = `${feature}:${file || 'unknown'}`;
  
  // Only log each deprecation once
  if (!reportedDeprecations.has(key)) {
    reportedDeprecations.add(key);
    
    // Log to console for development visibility
    console.warn(
      `[Deprecation Tracker] Usage of deprecated feature "${feature}" detected in ${file || 'unknown location'}`
    );
    
    // In a real implementation, this could also send telemetry data
    // to track usage across the application
  }
}

/**
 * Gets a list of all deprecated features that have been used
 * @returns Array of feature:file strings that have been tracked
 */
export function getDeprecatedUsage(): string[] {
  return Array.from(reportedDeprecations);
}

/**
 * Reset the deprecation usage tracker (mainly for testing)
 */
export function resetDeprecationTracker(): void {
  reportedDeprecations.clear();
}

