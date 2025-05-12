
import { mockUpdateBusinessGoal } from './mockAdapter';
import { showDeprecationToast, throwDeprecatedOperationError } from '@/services/cms/utils/deprecationToastUtils';

/**
 * Update an existing business goal in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function updateBusinessGoal(id: string, data: any): Promise<boolean> {
  console.warn('[updateBusinessGoal] ⚠️ DEPRECATED: Please use Contentful for content management.');
  
  // Show toast notification
  showDeprecationToast('Business goal updates are deprecated',
    'Updating business goals is no longer supported. Please use Contentful directly.');
  
  try {
    // This will throw an error as the mock implementation is designed to prevent updates
    return await mockUpdateBusinessGoal(id, data);
  } catch (error) {
    console.error('[updateBusinessGoal] Error:', error);
    throw error;
  }
}
