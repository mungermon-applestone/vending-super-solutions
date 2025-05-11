
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMachines, fetchMachineById } from '@/services/cms/contentTypes/machines';
import { useToast } from '@/hooks/use-toast';
import { CMSMachine } from '@/types/cms';
import { createMachine } from '@/services/cms/contentTypes/machines/create';
import { updateMachine } from '@/services/cms/contentTypes/machines/update';
import { deleteMachine } from '@/services/cms/contentTypes/machines/delete';
import { MachineFormValues } from '@/utils/machineMigration/types';
import { useContentfulMachines, useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

/**
 * Hook to fetch machines data
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

  return useQuery({
    queryKey: ['machine', machineSlug],
    queryFn: async () => {
      if (!machineSlug) return null;
      
      // For now, we'll use the existing machines function and filter by slug
      const machines = await fetchMachines({ slug: machineSlug });
      
      if (machines.length > 0) {
        // Log machine data to help diagnose thumbnail issues
        console.log('[useMachineBySlug] Found machine:', {
          id: machines[0].id,
          title: machines[0].title,
          hasThumbnail: !!machines[0].thumbnail,
          thumbnailUrl: machines[0].thumbnail?.url || 'none'
        });
        
        return machines[0];
      }
      
      // If not found by slug, try by ID
      try {
        return await fetchMachineById(machineSlug);
      } catch (error) {
        console.error(`[useMachineBySlug] Error fetching machine by ID ${machineSlug}:`, error);
        return null;
      }
    },
    enabled: !!machineSlug,
  });
};

/**
 * Hook to create a new machine
 */
export const useCreateMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (machineData: MachineFormValues) => {
      return createMachine(machineData);
    },
    onSuccess: () => {
      toast({
        title: "Machine created",
        description: "Machine has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create machine. Please try again."
      });
    }
  });
};

/**
 * Hook to update an existing machine
 */
export const useUpdateMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, machineData }: { id: string, machineData: MachineFormValues }) => {
      return updateMachine(id, machineData);
    },
    onSuccess: () => {
      toast({
        title: "Machine updated",
        description: "Machine has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update machine. Please try again."
      });
    }
  });
};

/**
 * Hook to delete a machine
 */
export const useDeleteMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteMachine(id);
    },
    onSuccess: () => {
      toast({
        title: "Machine deleted",
        description: "Machine has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error) => {
      console.error('[useDeleteMachine] Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete machine. Please try again."
      });
    }
  });
};
