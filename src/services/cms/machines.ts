
import { CMSMachine } from '@/types/cms';
import { fetchFromCMS } from './fetchFromCMS';
import { 
  fetchMachineById, 
  createMachine, 
  updateMachine, 
  deleteMachine,
  machineOperations
} from './contentTypes/machines';
import { logDeprecation } from './utils/deprecation';

/**
 * Get all machines with optional filters
 */
export async function getMachines(filters: Record<string, any> = {}): Promise<CMSMachine[]> {
  // Log deprecated usage of this function
  logDeprecation(
    'getMachines',
    'Using legacy getMachines() function',
    'Use machineOperations.fetchAll() directly'
  );
  
  return await fetchFromCMS<CMSMachine>('machines', filters);
}

/**
 * Get a machine by type and slug
 */
export async function getMachineBySlug(type: string, id: string): Promise<CMSMachine | null> {
  // Log deprecated usage of this function
  logDeprecation(
    'getMachineBySlug',
    'Using legacy getMachineBySlug() function',
    'Use machineOperations.fetchBySlug() directly'
  );
  
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
  // Log deprecated usage of this function
  logDeprecation(
    'getMachineById',
    'Using legacy getMachineById() function',
    'Use machineOperations.fetchById() directly'
  );
  
  return await fetchMachineById(id);
}

/**
 * @deprecated Use Contentful directly for machine creation
 * Create a new machine
 */
export async function createNewMachine(machineData: any): Promise<string> {
  logDeprecation(
    'createNewMachine',
    'Using legacy createNewMachine() function',
    'Use Contentful directly for content management'
  );
  
  return await createMachine(machineData);
}

/**
 * @deprecated Use Contentful directly for machine updates
 * Update an existing machine
 */
export async function updateExistingMachine(id: string, machineData: any): Promise<boolean> {
  logDeprecation(
    'updateExistingMachine',
    'Using legacy updateExistingMachine() function',
    'Use Contentful directly for content management'
  );
  
  return await updateMachine(id, machineData);
}

/**
 * @deprecated Use Contentful directly for machine deletion
 * Delete a machine
 */
export async function removeExistingMachine(id: string): Promise<boolean> {
  logDeprecation(
    'removeExistingMachine',
    'Using legacy removeExistingMachine() function',
    'Use Contentful directly for content management'
  );
  
  return await deleteMachine(id);
}

// Export machine operations for direct use
export const machines = machineOperations;
