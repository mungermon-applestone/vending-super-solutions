
/**
 * Logs deprecation warnings for consistency
 * 
 * @param feature - The deprecated feature/function name
 * @param message - Custom message explaining what to use instead
 * @param suggestion - Optional suggestion for alternatives
 */
export function logDeprecationWarning(
  feature: string,
  message: string = `${feature} is deprecated`,
  suggestion: string = 'Use Contentful directly'
): void {
  console.warn(
    `[DEPRECATED] ${message}. ${suggestion}. ` +
    `This feature will be removed in a future release.`
  );
}

/**
 * Tracks usage of deprecated features
 * 
 * @param feature Name of the feature being used
 * @param details Additional information
 */
export function trackDeprecatedFeatureUsage(
  feature: string, 
  details?: string
): void {
  console.warn(
    `[DEPRECATED FEATURE USED] "${feature}"` + 
    (details ? `: ${details}` : '')
  );
  
  // In future we could implement telemetry here to track usage
}
