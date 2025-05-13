
import { logDeprecationWarning } from './deprecationLogger';

/**
 * Log a deprecation warning once per key
 * Re-export for backward compatibility
 */
export { logDeprecationWarning } from './deprecationLogger';

/**
 * Log usage of deprecated code paths
 */
export function logDeprecation(key: string, message: string, recommendation?: string) {
  logDeprecationWarning(key, message, recommendation);
}
