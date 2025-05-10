
import { mockCloneMachine } from './mockAdapter';

/**
 * Clone an existing machine in the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function cloneMachine(id: string): Promise<string | null> {
  console.warn('[cloneMachine] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockCloneMachine(id);
  } catch (error) {
    console.error(`[cloneMachine] Error:`, error);
    throw null;
  }
}
