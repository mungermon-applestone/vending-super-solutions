
import { mockCreateBusinessGoal } from './mockAdapter';

/**
 * Create a new business goal in the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for business goal content management.
 */
export async function createBusinessGoal(data: any): Promise<string> {
  console.warn('[createBusinessGoal] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockCreateBusinessGoal(data);
  } catch (error) {
    console.error('[createBusinessGoal] Error:', error);
    throw error;
  }
}
