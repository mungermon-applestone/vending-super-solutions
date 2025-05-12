
/**
 * @deprecated This file is being consolidated into deprecation.ts
 * and will be removed in a future version.
 * 
 * Re-exports from the consolidated deprecation module for backward compatibility.
 */

import {
  logDeprecation,
  throwDeprecatedOperationError as throwDeprecatedError
} from './deprecation';
import { toast } from '@/hooks/use-toast';

// Define a showDeprecationToast function that uses the toast hook
export const showDeprecationToast = (title: string, description: string) => {
  // Log the deprecation first
  logDeprecation('DeprecationToast', `${title}: ${description}`);
  
  // Show the toast notification
  toast({
    title,
    description,
    variant: "destructive",
  });
};

// Export throwDeprecatedOperationError with a compatible signature
export const throwDeprecatedOperationError = throwDeprecatedError;

// Log deprecation warning when this module is imported
console.warn(
  "⚠️ DEPRECATION WARNING: deprecationToastUtils.ts is deprecated and will be removed in a future update. " +
  "Import directly from the consolidated 'deprecation.ts' module instead."
);
