
import { CMSMachine } from '@/types/cms';
import { fetchFromCMS } from './fetchFromCMS';
import { 
  fetchMachineById, 
  createMachine, 
  updateMachine, 
  deleteMachine 
} from './contentTypes/machines';

/**
 * Get all machines with optional filters
 */
export async function getMachines(filters: Record<string, any> = {}): Promise<CMSMachine[]> {
  return await fetchFromCMS<CMSMachine>('machines', filters);
}

/**
 * Get a machine by type and slug
 */
export async function getMachineBySlug(type: string, id: string): Promise<CMSMachine | null> {
  const machines = await fetchFromCMS<CMSMachine>('machines', { 
    slug: id,
    type: type
  });
  
  return machines.length > 0 ? machines[0] : null;
}

/**
 * Get a machine by ID
 */
export async function getMachineById(id: string): Promise<CMSMachine | null> {
  return await fetchMachineById(id);
}

/**
 * Create a new machine
 */
export async function createNewMachine(machineData: any): Promise<string> {
  const result = await createMachine(machineData);
  // Extract the ID from the result or return a placeholder ID for deprecated functionality
  return result?.id || 'deprecated-operation';
}

/**
 * Update an existing machine
 */
export async function updateExistingMachine(id: string, machineData: any): Promise<boolean> {
  try {
    await updateMachine(id, machineData);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete a machine
 */
export async function removeExistingMachine(id: string): Promise<boolean> {
  return await deleteMachine(id);
}
