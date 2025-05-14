
/**
 * Simplified utility for tracking deprecated features
 */

export interface DeprecationStat {
  component: string;
  count: number;
  lastUsed: Date;
  messages: string[];
}

// In-memory store for deprecation stats (resets on page refresh)
const deprecationStats: Record<string, DeprecationStat> = {};

/**
 * Log a deprecation warning
 */
export function logDeprecation(component: string, message: string, alternative?: string): void {
  console.warn(`[DEPRECATED] ${component}: ${message}${alternative ? `. Use ${alternative} instead.` : ''}`);
  
  // Track usage
  if (!deprecationStats[component]) {
    deprecationStats[component] = {
      component,
      count: 0,
      lastUsed: new Date(),
      messages: []
    };
  }
  
  deprecationStats[component].count++;
  deprecationStats[component].lastUsed = new Date();
  deprecationStats[component].messages.push(message);
}

/**
 * Get statistics about deprecated feature usage
 */
export function getDeprecationStats(): DeprecationStat[] {
  return Object.values(deprecationStats)
    .sort((a, b) => b.count - a.count);
}

/**
 * Reset the deprecation tracker
 */
export function resetDeprecationTracker(): void {
  Object.keys(deprecationStats).forEach(key => {
    delete deprecationStats[key];
  });
}

/**
 * Alias for backward compatibility
 */
export const trackDeprecatedFeatureUsage = (component: string, message: string) => {
  logDeprecation(component, message);
};

/**
 * Alias for backward compatibility
 */
export const getDeprecationUsageStats = getDeprecationStats;

/**
 * Create read-only operations for deprecated content types
 */
export function createReadOnlyContentTypeOperations(contentType: string) {
  return {
    fetchAll: async () => {
      logDeprecation(`${contentType}.fetchAll`, `This content type is read-only`);
      return [];
    },
    fetchBySlug: async () => {
      logDeprecation(`${contentType}.fetchBySlug`, `This content type is read-only`);
      return null;
    },
    fetchById: async () => {
      logDeprecation(`${contentType}.fetchById`, `This content type is read-only`);
      return null;
    },
    create: async () => {
      logDeprecation(`${contentType}.create`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    },
    update: async () => {
      logDeprecation(`${contentType}.update`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    },
    delete: async () => {
      logDeprecation(`${contentType}.delete`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    }
  };
}

/**
 * Create a deprecated write operation wrapper
 */
export function createDeprecatedWriteOperation(operation: string, contentType: string) {
  return async () => {
    logDeprecation(`${contentType}.${operation}`, `This operation is deprecated`);
    throw new Error(`${contentType}.${operation} is deprecated`);
  };
}
