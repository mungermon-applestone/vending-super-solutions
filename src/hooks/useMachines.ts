
import { useContentfulMachines, useContentfulMachine } from '@/hooks/cms/useContentfulMachines';

/**
 * Hook for fetching all machines
 */
export function useMachines() {
  const contentfulResult = useContentfulMachines();
  
  return {
    ...contentfulResult,
    // Add a simplified machines property for easy access
    machines: contentfulResult.data || []
  };
}

/**
 * Hook for fetching a single machine by slug or ID
 */
export function useMachine(slugOrId?: string) {
  const contentfulResult = useContentfulMachine(slugOrId);
  
  return {
    ...contentfulResult,
    // Add a simplified machine property for easy access
    machine: contentfulResult.data
  };
}
