
/**
 * Simple navigation service to abstract navigation logic
 * and avoid circular dependencies
 */

/**
 * Navigate to a new URL
 * @param path The path to navigate to
 */
export function navigate(path: string): void {
  window.location.href = path;
}

/**
 * Navigate to a new URL using history API if available
 * @param path The path to navigate to
 */
export function navigateWithHistory(path: string): void {
  if (window.history) {
    window.history.pushState({}, '', path);
  } else {
    navigate(path);
  }
}

