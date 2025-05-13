
import { createReadOnlyContentTypeAdapter } from '../../adapters/contentTypeAdapterFactory';
import { contentfulMachineAdapter } from '../../adapters/machines/contentfulMachineAdapter';
import { CMSMachine } from '@/types/cms';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';
import { createReadOnlyContentTypeOperations } from '@/services/cms/utils/deprecation';

/**
 * Machine content type operations
 * Read-only adapter for machine content type
 */
export const machineOperations: ContentTypeOperations<CMSMachine> = createReadOnlyContentTypeOperations(
  'machine',
  'machine',
  {
    getAll: contentfulMachineAdapter.getAll,
    getBySlug: contentfulMachineAdapter.getBySlug,
    getById: contentfulMachineAdapter.getById
  }
);

/**
 * Fetch machines with optional filters
 */
export const fetchMachines = async <T = CMSMachine>(filters: Record<string, any> = {}): Promise<T[]> => {
  return machineOperations.fetchAll(filters) as Promise<T[]>;
};

/**
 * Fetch a machine by ID
 */
export const fetchMachineById = async <T = CMSMachine>(id: string): Promise<T | null> => {
  return machineOperations.fetchById(id) as Promise<T | null>;
};

/**
 * @deprecated Use Contentful directly for machine creation
 */
export const createMachine = machineOperations.create;

/**
 * @deprecated Use Contentful directly for machine updates
 */
export const updateMachine = machineOperations.update;

/**
 * @deprecated Use Contentful directly for machine deletion
 */
export const deleteMachine = machineOperations.delete;

/**
 * @deprecated Use Contentful directly for machine cloning
 */
export const cloneMachine = machineOperations.clone;
