
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useContentfulMachines, useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

/**
 * Hook to fetch machines data
 * 
 * @remarks
 * CRITICAL PATH: This hook powers machine listings throughout the application.
 */
export const useMachines = () => {
  // Use the Contentful machines hook to ensure consistent data source
  const contentfulMachines = useContentfulMachines();
  
  console.log('[useMachines] Contentful machines data:', {
    count: contentfulMachines.data?.length || 0,
    machinesWithThumbnails: contentfulMachines.data?.filter(m => !!m.thumbnail).length || 0
  });
  
  return {
    ...contentfulMachines,
    data: contentfulMachines.data || []
  };
};

/**
 * Hook to fetch a specific machine by ID
 * 
 * @remarks
 * CRITICAL PATH: This hook is used by machine detail pages.
 */
export const useMachineById = (id: string | undefined) => {
  // Use the Contentful machine hook to ensure consistent data source
  const contentfulMachine = useContentfulMachine(id);
  
  return {
    ...contentfulMachine,
    data: contentfulMachine.data
  };
};

/**
 * Hook to fetch a machine by slug
 * 
 * @remarks
 * CRITICAL PATH: This hook is used by ALL machine detail pages.
 * The implementation must handle both the legacy two-parameter and new one-parameter calls.
 * Modifications to this hook will affect all individual machine pages.
 * 
 * @param typeOrSlug Machine type (legacy) or slug
 * @param idOrSlug Machine ID or slug (legacy second parameter)
 * @deprecated This function signature will be changing to accept a single parameter (slug/ID) in future versions.
 * Use useContentfulMachine(slug) for future compatibility.
 */
export const useMachineBySlug = (typeOrSlug: string | undefined, idOrSlug?: string | undefined) => {
  // Handle both original two-parameter and new one-parameter calls
  let machineSlug: string | undefined;
  
  if (idOrSlug) {
    // Legacy two-parameter call: useMachineBySlug('vending', 'machine-slug')
    machineSlug = idOrSlug;
  } else {
    // New one-parameter call: useMachineBySlug('machine-slug')
    logDeprecationWarning(
      'useMachineBySlug single parameter',
      'The single parameter version of useMachineBySlug is deprecated.',
      'Use useContentfulMachine(slug) from @/hooks/cms/useContentfulMachines instead.'
    );
    machineSlug = typeOrSlug;
  }

  // Use the Contentful machine hook directly
  const contentfulMachine = useContentfulMachine(machineSlug);
  
  return contentfulMachine;
};

/**
 * @deprecated These operations are no longer supported through this API.
 * Please use Contentful directly for content management.
 */
export const useCreateMachine = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (machineData: any) => {
      toast({
        variant: "destructive",
        title: "Operation not supported",
        description: "Creating machines is no longer supported through this API. Please use Contentful directly."
      });
      return Promise.reject("Operation not supported");
    }
  });
};

/**
 * @deprecated These operations are no longer supported through this API.
 * Please use Contentful directly for content management.
 */
export const useUpdateMachine = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, machineData }: { id: string, machineData: any }) => {
      toast({
        variant: "destructive",
        title: "Operation not supported",
        description: "Updating machines is no longer supported through this API. Please use Contentful directly."
      });
      return Promise.reject("Operation not supported");
    }
  });
};

/**
 * @deprecated These operations are no longer supported through this API.
 * Please use Contentful directly for content management.
 */
export const useDeleteMachine = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      toast({
        variant: "destructive",
        title: "Operation not supported",
        description: "Deleting machines is no longer supported through this API. Please use Contentful directly."
      });
      return Promise.reject("Operation not supported");
    }
  });
};
