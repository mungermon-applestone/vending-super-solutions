
import { mockUpdateBusinessGoal } from './mockAdapter';

/**
 * Update an existing business goal in the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function updateBusinessGoal(id: string, data: any): Promise<boolean> {
  console.warn('[updateBusinessGoal] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockUpdateBusinessGoal(id, data);
  } catch (error) {
    console.error('[updateBusinessGoal] Error:', error);
    return false;
  }
}
