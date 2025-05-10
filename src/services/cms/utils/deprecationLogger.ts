
/**
 * Utility for logging and tracking deprecation warnings consistently
 */

// Store the deprecation warnings that have been logged during this session
const loggedWarnings = new Set<string>();

/**
 * Log a deprecation warning once per session
 * @param feature Name of the deprecated feature
 * @param message Custom message describing the deprecation
 * @param suggestion Suggested alternative
 */
export function logDeprecationWarning(
  feature: string,
  message: string = "This feature is deprecated and will be removed in a future version.",
  suggestion?: string
): void {
  const key = `${feature}:${message}`;
  
  // Only log each warning once to avoid console spam
  if (!loggedWarnings.has(key)) {
    loggedWarnings.add(key);
    
    // Format message with suggestion if provided
    const fullMessage = suggestion 
      ? `${message} ${suggestion}`
      : message;
    
    // Log warning to console
    console.warn(`[DEPRECATED] ${feature}: ${fullMessage}`);
  }
}

/**
 * Mark a function as deprecated and log a warning when it's called
 * @param fn Original function to wrap
 * @param feature Name of the deprecated feature
 * @param suggestion Suggested alternative
 * @returns Wrapped function that logs deprecation warning when called
 */
export function deprecate<T extends (...args: any[]) => any>(
  fn: T,
  feature: string,
  suggestion?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    logDeprecationWarning(
      feature,
      "This function is deprecated and will be removed in a future version.",
      suggestion
    );
    return fn(...args);
  }) as T;
}

/**
 * Get a list of all deprecation warnings logged in this session
 * @returns Array of logged deprecation warning messages
 */
export function getLoggedDeprecationWarnings(): string[] {
  return Array.from(loggedWarnings);
}

/**
 * Clear the logged deprecation warnings
 */
export function clearLoggedDeprecationWarnings(): void {
  loggedWarnings.clear();
}

/**
 * Create a mock implementation of a function that logs deprecation warning
 * @param feature Name of the deprecated feature
 * @param suggestion Suggested alternative
 * @param mockReturnValue Optional mock return value
 * @returns A function that logs deprecation warning and returns the mock value
 */
export function createDeprecatedMock<T>(
  feature: string,
  suggestion?: string,
  mockReturnValue?: T
): () => T {
  return () => {
    logDeprecationWarning(
      feature,
      "This feature is deprecated and has been replaced by mock implementation.",
      suggestion
    );
    return mockReturnValue as T;
  };
}
