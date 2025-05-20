
import { toast } from 'sonner';

/**
 * Show a deprecation toast notification
 * @param title Title of the toast
 * @param message Message to display
 */
export const showDeprecationToast = (title: string, message: string) => {
  console.warn(`[DEPRECATED] ${title}: ${message}`);
  toast.warning(title, {
    description: message
  });
};

/**
 * Throw a standard error for deprecated operations
 * @param operation The name of the deprecated operation
 */
export const throwDeprecatedOperationError = (operation: string) => {
  const errorMessage = `Operation "${operation}" is deprecated. Please use Contentful directly.`;
  console.error(`[DEPRECATED] ${errorMessage}`);
  throw new Error(errorMessage);
};
