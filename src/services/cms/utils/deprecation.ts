
/**
 * Log a deprecation warning to the console
 * @param deprecated The deprecated feature
 * @param message Additional message about the deprecation
 * @param alternative The alternative to use instead
 */
export function logDeprecationWarning(deprecated: string, message: string, alternative?: string): void {
  const warning = `DEPRECATED: ${deprecated} is deprecated. ${message}`;
  const alternativeMessage = alternative ? `\nUse ${alternative} instead.` : '';
  
  console.warn(`${warning}${alternativeMessage}`);
}

/**
 * Log a deprecation message as info
 * @param component Component or feature using deprecated functionality
 * @param message Additional message about the deprecation
 */
export function logDeprecation(component: string, message: string): void {
  console.log(`[${component}] Using deprecated functionality: ${message}`);
}

/**
 * Create a deprecated function that logs a warning when called
 * @param name Name of the deprecated function
 * @param fn Alternative function to call
 * @param reason Reason for deprecation
 */
export function createDeprecatedFunction<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  reason: string
): T {
  return ((...args: any[]) => {
    logDeprecationWarning(name, reason);
    return fn(...args);
  }) as T;
}
