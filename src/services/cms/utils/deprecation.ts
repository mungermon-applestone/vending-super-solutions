
/**
 * Log a deprecation warning for a function
 * @param oldName The name of the deprecated function
 * @param newName The name of the new function to use instead
 */
export function logDeprecation(oldName: string, newName: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[DEPRECATED] ${oldName} is deprecated. Use ${newName} instead.`);
  }
}
