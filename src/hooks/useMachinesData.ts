
import { useContentfulMachine, useContentfulMachines } from './cms/useContentfulMachines';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * @deprecated Use useContentfulMachines() instead
 * Legacy hook for fetching multiple machines - now uses Contentful under the hood
 */
export function useMachines(filters?: Record<string, any>) {
  // Log deprecated usage of this hook
  logDeprecation(
    'useMachines',
    'Using deprecated useMachines() hook',
    'Switch to useContentfulMachines() instead'
  );
  
  // Forward to the new implementation
  return useContentfulMachines(filters);
}

/**
 * @deprecated Use useContentfulMachine() instead
 * Legacy hook for fetching a single machine by slug - now uses Contentful under the hood
 */
export function useMachineBySlug(slug?: string) {
  // Log deprecated usage of this hook
  logDeprecation(
    'useMachineBySlug',
    'Using deprecated useMachineBySlug() hook',
    'Switch to useContentfulMachine() instead'
  );
  
  // Forward to the new implementation
  return useContentfulMachine(slug);
}

// Re-export the new hooks for convenience
export { useContentfulMachine, useContentfulMachines };
