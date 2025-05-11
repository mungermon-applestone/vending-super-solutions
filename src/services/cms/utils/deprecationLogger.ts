
/**
 * Utility for logging and tracking deprecation warnings consistently
 */

// Store the deprecation warnings that have been logged during this session
const loggedWarnings = new Set<string>();

// Store critical path warnings that have been logged
const loggedCriticalPathWarnings = new Set<string>();

// Track usage of deprecated functions (with timestamps)
interface DeprecationUsage {
  feature: string;
  message: string;
  count: number;
  lastUsed: Date;
}

// Map to store usage statistics
const usageStats = new Map<string, DeprecationUsage>();

/**
 * Log a deprecation warning once per session
 * @param feature Name of the deprecated feature
 * @param message Custom message describing the deprecation
 * @param suggestion Suggested alternative
 * @param trackUsage Whether to track usage statistics for this warning
 */
export function logDeprecationWarning(
  feature: string,
  message: string = "This feature is deprecated and will be removed in a future version.",
  suggestion?: string,
  trackUsage = true
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
  
  // Track usage statistics if enabled
  if (trackUsage) {
    trackDeprecatedFeatureUsage(feature, message);
  }
}

/**
 * Track usage of deprecated features
 * @param feature Name of the deprecated feature
 * @param message Associated warning message
 */
export function trackDeprecatedFeatureUsage(feature: string, message: string): void {
  const key = `${feature}:${message}`;
  
  if (usageStats.has(key)) {
    const stats = usageStats.get(key)!;
    stats.count += 1;
    stats.lastUsed = new Date();
  } else {
    usageStats.set(key, {
      feature,
      message,
      count: 1,
      lastUsed: new Date()
    });
  }
}

/**
 * Mark a function or component as a critical path that requires careful testing
 * before modification
 * 
 * @param path Name of the critical path
 * @param message Warning message about the criticality
 * @param usageContext Where this critical path is used
 */
export function markCriticalPath(
  path: string,
  message: string = "This is a critical path in the application. Modification requires thorough testing.",
  usageContext: string = "multiple places"
): void {
  const key = `${path}:${message}`;
  
  // Only log each critical path warning once to avoid console spam
  if (!loggedCriticalPathWarnings.has(key)) {
    loggedCriticalPathWarnings.add(key);
    
    console.warn(`
[CRITICAL PATH] ${path}
${message}
Used in: ${usageContext}
⚠️ Changes may break core application functionality.
    `);
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
      suggestion,
      true // Track usage
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
 * Get a list of all critical path warnings logged in this session
 * @returns Array of logged critical path warning messages
 */
export function getLoggedCriticalPathWarnings(): string[] {
  return Array.from(loggedCriticalPathWarnings);
}

/**
 * Get usage statistics for all deprecated features
 * @returns Array of usage statistics objects
 */
export function getDeprecationUsageStats(): DeprecationUsage[] {
  return Array.from(usageStats.values());
}

/**
 * Clear the logged deprecation warnings
 */
export function clearLoggedDeprecationWarnings(): void {
  loggedWarnings.clear();
}

/**
 * Reset usage statistics tracking
 */
export function resetUsageStats(): void {
  usageStats.clear();
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

/**
 * Create a read-only version of a function that logs deprecation warning
 * and informs that write operations are disabled
 * @param readFn Original read function to preserve
 * @param feature Name of the deprecated feature
 * @param suggestion Suggested alternative
 * @returns Function that can only read, with write operations disabled
 */
export function createReadOnlyFunction<T extends (...args: any[]) => any>(
  readFn: T,
  feature: string,
  suggestion?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    logDeprecationWarning(
      feature,
      "Write operations on this feature are disabled. This is now read-only.",
      suggestion || "Please use Contentful directly for content management."
    );
    return readFn(...args);
  }) as T;
}

