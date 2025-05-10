
import { mockDeleteBusinessGoal } from './mockAdapter';

/**
 * Delete a business goal from the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function deleteBusinessGoal(id: string): Promise<boolean> {
  console.warn('[deleteBusinessGoal] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockDeleteBusinessGoal(id);
  } catch (error) {
    console.error('[deleteBusinessGoal] Error:', error);
    throw error;
  }
}
