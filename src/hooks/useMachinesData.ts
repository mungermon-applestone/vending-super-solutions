
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMachines, deleteMachine } from '@/services/cms/contentTypes/machines';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch machines data
 */
export const useMachines = () => {
  return useQuery({
    queryKey: ['machines'],
    queryFn: getMachines,
  });
};

/**
 * Hook to delete a machine
 */
export const useDeleteMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: deleteMachine,
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
