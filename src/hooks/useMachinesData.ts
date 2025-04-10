
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMachines, fetchMachineById } from '@/services/cms/contentTypes/machines';
import { useToast } from '@/hooks/use-toast';
import { CMSMachine } from '@/types/cms';

// Define the MachineFormValues interface if it doesn't exist in types
interface MachineFormValues {
  title: string;
  slug: string;
  type: string;
  temperature: string;
  description?: string;
  images?: Array<{ url: string; alt?: string; width?: number; height?: number }>;
  specs?: Array<{ key: string; value: string }>;
  features?: Array<{ text: string }>;
}

/**
 * Hook to fetch machines data
 */
export const useMachines = () => {
  return useQuery({
    queryKey: ['machines'],
    queryFn: fetchMachines,
  });
};

/**
 * Hook to fetch a specific machine by ID
 */
export const useMachineById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: () => fetchMachineById(id || ''),
    enabled: !!id && id !== 'new',
  });
};

/**
 * Hook to fetch a machine by slug
 */
export const useMachineBySlug = (type: string | undefined, slug: string | undefined) => {
  return useQuery({
    queryKey: ['machine', type, slug],
    queryFn: async () => {
      // For now, we'll use the existing machines function and filter by type and slug
      const machines = await fetchMachines({ type, slug });
      return machines.length > 0 ? machines[0] : null;
    },
    enabled: !!type && !!slug,
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
      const { createMachine } = require('@/services/cms/contentTypes/machines');
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
      const { updateMachine } = require('@/services/cms/contentTypes/machines');
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
    mutationFn: (id: string) => {
      const { deleteMachine } = require('@/services/cms/contentTypes/machines');
      return deleteMachine(id);
    },
    onSuccess: () => {
      toast({
        title: "Machine deleted",
        description: "Machine has been deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete machine. Please try again."
      });
    }
  });
};
