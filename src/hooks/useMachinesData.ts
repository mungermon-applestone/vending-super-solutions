
import { useContentfulMachine, useContentfulMachines } from './cms/useContentfulMachines';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CMSMachine } from '@/types/cms';
import { createMachine, updateMachine, deleteMachine } from '@/services/cms/contentTypes/machines';
import { toast } from 'sonner';

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

/**
 * @deprecated Compatibility hook for MachineEditor
 * Legacy hook for fetching machine by ID - uses Contentful under the hood
 */
export function useMachineById(id?: string) {
  logDeprecation(
    'useMachineById',
    'Using deprecated useMachineById() hook',
    'Switch to useContentfulMachine() instead'
  );
  
  return useContentfulMachine(id);
}

/**
 * @deprecated Use Contentful directly for machine creation
 * Hook for creating a machine - will be removed in future
 */
export function useCreateMachine() {
  return useMutation({
    mutationFn: async (machineData: any) => {
      logDeprecation(
        'useCreateMachine',
        'Using deprecated machine creation in app',
        'Use Contentful directly for content management'
      );
      
      try {
        const id = await createMachine(machineData);
        toast.success('Machine created');
        return id;
      } catch (error) {
        console.error('Error creating machine:', error);
        toast.error('Failed to create machine');
        throw error;
      }
    }
  });
}

/**
 * @deprecated Use Contentful directly for machine updates 
 * Hook for updating a machine - will be removed in future
 */
export function useUpdateMachine() {
  return useMutation({
    mutationFn: async ({ id, machineData }: { id: string, machineData: any }) => {
      logDeprecation(
        'useUpdateMachine',
        'Using deprecated machine update in app',
        'Use Contentful directly for content management'
      );
      
      try {
        const success = await updateMachine(id, machineData);
        if (success) {
          toast.success('Machine updated');
        } else {
          toast.error('Failed to update machine');
        }
        return success;
      } catch (error) {
        console.error('Error updating machine:', error);
        toast.error('Failed to update machine');
        throw error;
      }
    }
  });
}

// Re-export the new hooks for convenience
export { useContentfulMachine, useContentfulMachines };
