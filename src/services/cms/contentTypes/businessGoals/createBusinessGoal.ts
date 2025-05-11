
import { mockCreateBusinessGoal } from './mockAdapter';
import { showDeprecationToast, throwDeprecatedOperationError } from '@/services/cms/utils/deprecationToastUtils';

/**
 * Create a new business goal in the CMS
 * @deprecated This method is deprecated and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function createBusinessGoal(data: any): Promise<string> {
  console.warn('[createBusinessGoal] ⚠️ DEPRECATED: Please use Contentful for content management.');
  
  // Show toast notification
  showDeprecationToast('Business goal creation');
  
  try {
    // This will throw an error as the mock implementation is designed to prevent creation
    return await mockCreateBusinessGoal(data);
  } catch (error) {
    console.error('[createBusinessGoal] Error:', error);
    throw error;
  }
}
