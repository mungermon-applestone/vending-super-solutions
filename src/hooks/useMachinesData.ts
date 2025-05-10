
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchMachines,
  fetchMachineBySlug,
  fetchMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  cloneMachine as cloneMachineApi
} from '@/services/cms/contentTypes/machines';
import { CMSMachine } from '@/types/cms';
import { useToast } from './use-toast';

// Hook for fetching all machines
export const useMachines = (filters?: { 
  type?: string;
  temperature?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: async () => fetchMachines(filters || {}),
  });
};

// Hook for fetching a single machine by slug
export const useMachineBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['machine', slug],
    queryFn: async () => slug ? fetchMachineBySlug(slug) : null,
    enabled: !!slug,
  });
};

// Hook for fetching a single machine by ID
export const useMachineById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: async () => id ? fetchMachineById(id) : null,
    enabled: !!id,
  });
};

// Hook for creating a machine
export const useCreateMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (machineData: Partial<CMSMachine>) => createMachine(machineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Success",
        description: "Machine created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create machine: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};

// Hook for updating a machine
export const useUpdateMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CMSMachine> }) => 
      updateMachine(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', data.id] });
      queryClient.invalidateQueries({ queryKey: ['machine', data.slug] });
      toast({
        title: "Success",
        description: "Machine updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update machine: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};

// Hook for deleting a machine
export const useDeleteMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Success",
        description: "Machine deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete machine: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};

// Hook for cloning a machine
export const useCloneMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => cloneMachineApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Success",
        description: "Machine cloned successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to clone machine: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
};
