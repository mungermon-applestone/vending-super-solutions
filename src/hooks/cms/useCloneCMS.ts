
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cloneProductType } from '@/services/cms/contentTypes/productTypes/cloneProductType';
import { cloneBusinessGoal } from '@/services/cms/contentTypes/businessGoals/cloneBusinessGoal';
import { cloneTechnology } from '@/services/cms/contentTypes/technologies/cloneTechnology';
import { cloneMachine } from '@/services/cms/contentTypes/machines/cloneMachine';
import { CMSProductType, CMSBusinessGoal, CMSTechnology, CMSMachine } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for cloning a product type
 */
export const useCloneProductType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => cloneProductType(id),
    onSuccess: (clonedProductType: CMSProductType | null) => {
      if (clonedProductType) {
        queryClient.invalidateQueries({ queryKey: ['productTypes'] });
        toast({
          title: 'Product Type Cloned',
          description: `${clonedProductType.title} has been created.`
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Clone Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

/**
 * Hook for cloning a business goal
 */
export const useCloneBusinessGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => cloneBusinessGoal(id),
    onSuccess: (clonedBusinessGoal: CMSBusinessGoal | null) => {
      if (clonedBusinessGoal) {
        queryClient.invalidateQueries({ queryKey: ['businessGoals'] });
        toast({
          title: 'Business Goal Cloned',
          description: `${clonedBusinessGoal.title} has been created.`
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Clone Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

/**
 * Hook for cloning a technology
 */
export const useCloneTechnology = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => cloneTechnology(id),
    onSuccess: (clonedTechnology: CMSTechnology | null) => {
      if (clonedTechnology) {
        queryClient.invalidateQueries({ queryKey: ['technologies'] });
        toast({
          title: 'Technology Cloned',
          description: `${clonedTechnology.title} has been created.`
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Clone Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

/**
 * Hook for cloning a machine
 */
export const useCloneMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => cloneMachine(id),
    onSuccess: (clonedMachine: CMSMachine | null) => {
      if (clonedMachine) {
        queryClient.invalidateQueries({ queryKey: ['machines'] });
        toast({
          title: 'Machine Cloned',
          description: `${clonedMachine.title} has been created.`
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Clone Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
