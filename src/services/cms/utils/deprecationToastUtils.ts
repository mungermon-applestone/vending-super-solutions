
/**
 * @deprecated This file is being consolidated into deprecation.ts
 * and will be removed in a future version.
 * 
 * Re-exports from the consolidated deprecation module for backward compatibility.
 */

import { 
  showDeprecationToast, 
  throwDeprecatedOperationError
} from './deprecation';

export {
  showDeprecationToast,
  throwDeprecatedOperationError
};

// Log deprecation warning when this file is imported
console.warn(
  "⚠️ DEPRECATION WARNING: deprecationToastUtils.ts is deprecated and will be removed in a future update. " +
  "Import directly from the consolidated 'deprecation.ts' module instead."
);
