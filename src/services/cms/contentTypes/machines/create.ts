
import { MachineFormValues } from '@/utils/machineMigration/types';
import { mockCreateMachine } from './mockAdapter';

/**
 * Create a new machine in the CMS
 * @deprecated This method uses a mock implementation and will be removed in future versions.
 * Please use Contentful directly for machine content management.
 */
export async function createMachine(machineData: MachineFormValues): Promise<string> {
  console.warn('[createMachine] ⚠️ DEPRECATED: This method uses a mock implementation. Use Contentful for production data.');
  try {
    // Use the mock implementation
    return await mockCreateMachine(machineData);
  } catch (error) {
    console.error('[createMachine] Error:', error);
    throw error;
  }
}
