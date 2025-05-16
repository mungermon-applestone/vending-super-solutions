
import { mockDeleteBusinessGoal } from './mockAdapter';
import { showDeprecationToast, throwDeprecatedOperationError } from '@/services/cms/utils/deprecationToastUtils';

/**
 * Delete a business goal from the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function deleteBusinessGoal(id: string): Promise<boolean> {
  console.warn('[deleteBusinessGoal] ⚠️ DEPRECATED: Please use Contentful for content management.');
  
  // Show toast notification
  showDeprecationToast(
    'Business goal deletion is deprecated',
    'Deleting business goals is no longer supported. Please use Contentful directly.'
  );
  
  try {
    // This will throw an error as the mock implementation is designed to prevent deletion
    return await mockDeleteBusinessGoal(id);
  } catch (error) {
    console.error('[deleteBusinessGoal] Error:', error);
    throw error;
  }
}
