
import { mockCloneBusinessGoal } from './mockAdapter';
import { showDeprecationToast, throwDeprecatedOperationError } from '@/services/cms/utils/deprecationToastUtils';

/**
 * Clone a business goal in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function cloneBusinessGoal(id: string): Promise<string | null> {
  console.warn('[cloneBusinessGoal] ⚠️ DEPRECATED: Please use Contentful for content management.');
  
  // Show toast notification
  showDeprecationToast(
    'Business goal cloning is deprecated', 
    'Cloning business goals is no longer supported. Please use Contentful directly.'
  );
  
  try {
    // This will throw an error as the mock implementation is designed to prevent cloning
    return await mockCloneBusinessGoal(id);
  } catch (error) {
    console.error('[cloneBusinessGoal] Error:', error);
    throw error;
  }
}
