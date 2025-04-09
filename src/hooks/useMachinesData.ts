
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to fetch all machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: async () => {
      console.log("[useMachines] Fetching machines with filters:", filters);
      try {
        const machines = await cmsService.getMachines(filters);
        console.log("[useMachines] Fetched machines:", machines);
        console.log(`[useMachines] Total machines fetched: ${machines.length}`);
        
        // Log each machine for debugging
        machines.forEach((machine, index) => {
          console.log(`[useMachines] Machine ${index + 1}:`, {
            id: machine.id,
            title: machine.title,
            type: machine.type,
            slug: machine.slug
          });
        });
        
        // Apply filters if specified
        if (filters.featured === true) {
          const featuredMachines = machines.slice(0, filters.limit || 3);
          return featuredMachines;
        }
        
        if (filters.type) {
          return machines.filter(machine => machine.type === filters.type);
        }
        
        return machines;
      } catch (error) {
        console.error("[useMachines] Error fetching machines:", error);
        // Return empty array on error
        console.log("[useMachines] Returning empty array due to error");
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a specific machine by its ID
 */
export function useMachineById(id: string | undefined) {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: async () => {
      console.log("[useMachineById] Fetching machine with ID:", id);
      try {
        const machine = await cmsService.getMachineById(id || '');
        console.log("[useMachineById] Fetched machine:", machine);
        return machine;
      } catch (error) {
        console.error("[useMachineById] Error fetching machine by ID:", error);
        throw error;
      }
    },
    enabled: !!id && id.trim() !== '',
  });
}

/**
 * Hook to fetch a specific machine by type and slug
 */
export function useMachineBySlug(type: string | undefined, slug: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, slug],
    queryFn: async () => {
      console.log("[useMachineBySlug] Fetching machine with type/slug:", type, slug);
      try {
        const machine = await cmsService.getMachineBySlug(type || '', slug || '');
        
        if (machine) {
          console.log("[useMachineBySlug] Fetched machine from database:", machine);
          return machine;
        }
        
        console.log(`[useMachineBySlug] Machine not found: ${type}/${slug}`);
        return null;
      } catch (error) {
        console.error("[useMachineBySlug] Error fetching machine by slug:", error);
        throw error;
      }
    },
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
