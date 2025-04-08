
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to fetch all machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
  });
}

/**
 * Hook to fetch a specific machine by its ID
 */
export function useMachineById(id: string | undefined) {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: () => cmsService.getMachineById(id || ''),
    enabled: !!id && id.trim() !== '',
  });
}

/**
 * Hook to fetch a specific machine by type and slug
 */
export function useMachineBySlug(type: string | undefined, slug: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, slug],
    queryFn: () => cmsService.getMachineBySlug(type || '', slug || ''),
    enabled: !!type && !!slug,
  });
}

/**
 * Hook to create a new machine
 */
export function useCreateMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (machineData: any) => cmsService.createNewMachine(machineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Machine created",
        description: "The machine was created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error creating machine:', error);
      toast({
        title: "Error",
        description: "Failed to create machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing machine
 */
export function useUpdateMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, machineData }: { id: string, machineData: any }) => 
      cmsService.updateExistingMachine(id, machineData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', variables.id] });
      toast({
        title: "Machine updated",
        description: "The machine was updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error updating machine:', error);
      toast({
        title: "Error",
        description: "Failed to update machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a machine
 */
export function useDeleteMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => cmsService.removeExistingMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Machine deleted",
        description: "The machine was deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error deleting machine:', error);
      toast({
        title: "Error",
        description: "Failed to delete machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}
