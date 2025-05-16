
/**
 * @deprecated This file is being consolidated into deprecation.ts
 * and will be removed in a future version.
 * 
 * Re-exports from the consolidated deprecation module for backward compatibility.
 */

import {
  trackDeprecatedUsage,
  getDeprecatedUsage,
  resetDeprecationTracker
} from './deprecation';

// Re-export all functions to maintain backward compatibility
export {
  trackDeprecatedUsage,
  getDeprecatedUsage,
  resetDeprecationTracker
};

// Log deprecation warning when this module is imported
console.warn(
  "⚠️ DEPRECATION WARNING: deprecationUsageTracker.ts is deprecated and will be removed in a future update. " +
  "Import directly from the consolidated 'deprecation.ts' module instead."
);
