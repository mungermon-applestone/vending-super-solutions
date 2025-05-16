
/**
 * Simple monitoring to track usage of deprecated CMS functions
 * This helps identify which deprecated functions are still being called
 * and can be used to prioritize removal
 */

type UsageEvent = {
  function: string;
  timestamp: number;
  caller?: string;
};

class UsageMonitor {
  private usageLog: UsageEvent[] = [];
  private isEnabled: boolean = true;
  
  constructor() {
    // Initialize with environment-based settings
    this.isEnabled = process.env.NODE_ENV !== 'production' || true;
  }

  /**
   * Log usage of a deprecated function
   */
  logUsage(functionName: string) {
    if (!this.isEnabled) return;
    
    // Get stack trace to identify caller
    const stack = new Error().stack;
    const callerLine = stack?.split('\n')[3] || '';
    
    const event: UsageEvent = {
      function: functionName,
      timestamp: Date.now(),
      caller: callerLine.trim()
    };
    
    this.usageLog.push(event);
    
    // Log to console for immediate visibility during development
    console.warn(`[DEPRECATED] Function '${functionName}' was called from: ${callerLine.trim()}`);
    
    // In a real implementation, we might periodically send these logs to a server
    // or save them to local storage
  }
  
  /**
   * Get usage statistics
   */
  getUsageStats() {
    const stats: Record<string, number> = {};
    
    this.usageLog.forEach(event => {
      if (!stats[event.function]) {
        stats[event.function] = 0;
      }
      stats[event.function]++;
    });
    
    return stats;
  }
  
  /**
   * Clear usage log
   */
  clearLog() {
    this.usageLog = [];
  }
}

// Singleton instance
export const usageMonitor = new UsageMonitor();

/**
 * Decorator factory to monitor usage of deprecated functions
 */
export function monitorDeprecated(functionName: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      usageMonitor.logUsage(`${functionName || propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Function wrapper to monitor usage of deprecated functions
 */
export function monitorFunction<T extends (...args: any[]) => any>(
  fn: T,
  functionName: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    usageMonitor.logUsage(functionName);
    return fn(...args);
  }) as T;
}
