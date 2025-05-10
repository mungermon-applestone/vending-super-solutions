
import { mockDeleteMachine } from './mockAdapter';

/**
 * Delete a machine from the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function deleteMachine(id: string): Promise<boolean> {
  console.warn('[deleteMachine] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockDeleteMachine(id);
  } catch (error) {
    console.error(`[deleteMachine] Error:`, error);
    throw error;
  }
}
