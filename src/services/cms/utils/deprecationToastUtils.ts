
/**
 * @deprecated This file is being consolidated into deprecationUtils.ts
 * and will be removed in a future version.
 */

import { toast } from '@/hooks/use-toast';
import { logDeprecation, createDeprecationError } from './deprecationUtils';

/**
 * @deprecated Use showDeprecationToast from deprecationUtils.ts
 */
export function showDeprecationToast(feature: string, alternativeAction: string = 'Use Contentful directly'): void {
  // Log the deprecation first
  logDeprecation(feature, `${feature} is deprecated.`, alternativeAction);
  
  // Show toast notification
  toast({
    title: "Deprecated Feature",
    description: `${feature} is deprecated. ${alternativeAction} for content management.`,
    variant: "destructive",
  });
}

/**
 * @deprecated Use createDeprecationError from deprecationUtils.ts
 */
export function throwDeprecatedOperationError(operation: string, entityType: string): never {
  throw createDeprecationError(operation, entityType);
}
