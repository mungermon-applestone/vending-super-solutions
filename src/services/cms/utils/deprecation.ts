
/**
 * Mapping of already logged deprecation warnings to prevent spamming the console
 */
const loggedDeprecations: Record<string, boolean> = {};

/**
 * Log a deprecation warning for a feature or API
 * 
 * @param deprecated The deprecated function or feature name
 * @param replacement The recommended replacement
 * @param message Optional additional guidance
 */
export function logDeprecation(
  deprecated: string,
  replacement: string,
  message?: string
): void {
  // Create a unique key for this deprecation warning
  const key = `${deprecated}-${replacement}`;
  
  // Only log each deprecation once per session
  if (loggedDeprecations[key]) {
    return;
  }
  
  // Mark as logged
  loggedDeprecations[key] = true;
  
  // Log to console
  console.warn(
    `[DEPRECATED] "${deprecated}" is deprecated and will be removed in a future version. ` + 
    `Please use "${replacement}" instead.` +
    (message ? ` ${message}` : '')
  );
}
