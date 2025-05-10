
import { MachineFormValues } from '@/utils/machineMigration/types';
import { mockUpdateMachine } from './mockAdapter';

/**
 * Update an existing machine in the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function updateMachine(id: string, machineData: MachineFormValues): Promise<boolean> {
  console.warn('[updateMachine] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Check if the ID is valid
    if (!id) {
      console.error('[updateMachine] Invalid machine ID provided');
      throw new Error('Invalid machine ID');
    }
    
    // Validate required fields
    if (!machineData.title || !machineData.slug || !machineData.type || !machineData.temperature) {
      console.error('[updateMachine] Missing required fields');
      throw new Error('Missing required machine fields');
    }
    
    // Use the mock implementation
    return await mockUpdateMachine(id, machineData);
  } catch (error) {
    console.error(`[updateMachine] Error updating machine ${id}:`, error);
    throw error;
  }
}
