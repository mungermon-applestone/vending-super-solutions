
/**
 * Utility functions for showing consistent deprecated feature toasts
 */

import { toast } from '@/hooks/use-toast';
import { logDeprecationWarning } from './deprecationLogger';

/**
 * Shows a standardized toast notification for deprecated CMS features
 * 
 * @param feature The name of the deprecated feature
 * @param alternativeAction What the user should do instead
 */
export function showDeprecationToast(feature: string, alternativeAction: string = 'Use Contentful directly'): void {
  // Log the deprecation first
  logDeprecationWarning(feature, `${feature} is deprecated.`, alternativeAction);
  
  // Show toast notification
  toast({
    title: "Deprecated Feature",
    description: `${feature} is deprecated. ${alternativeAction} for content management.`,
    variant: "destructive",
  });
}

/**
 * Common function to handle throwing standardized errors for disabled operations
 * 
 * @param operation Name of the operation being attempted
 * @param entityType Type of entity being operated on
 * @throws Error with standardized message
 */
export function throwDeprecatedOperationError(operation: string, entityType: string): never {
  throw new Error(`${entityType} ${operation} is disabled. Please use Contentful directly.`);
}
