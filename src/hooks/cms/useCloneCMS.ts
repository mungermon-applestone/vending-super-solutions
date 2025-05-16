
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { businessGoalOperations } from '@/services/cms/contentTypes/businessGoals';
import { cloneMachine } from '@/services/cms/contentTypes/machines/cloneMachine';
import { CMSProductType, CMSBusinessGoal, CMSTechnology, CMSMachine } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';

// Mock functions for cloning product types and technologies
const mockCloneProductType = async (id: string): Promise<CMSProductType | null> => {
  console.log('[mockCloneProductType] Would clone product type:', id);
  return {
    id: `cloned-${Date.now()}`,
    title: 'Cloned Product Type',
    slug: 'cloned-product-type',
    description: 'This is a cloned product type',
    visible: true
  };
};

const mockCloneTechnology = async (id: string): Promise<CMSTechnology | null> => {
  console.log('[mockCloneTechnology] Would clone technology:', id);
  return {
    id: `cloned-${Date.now()}`,
    title: 'Cloned Technology',
    slug: 'cloned-technology',
    description: 'This is a cloned technology',
    visible: true
  };
};

/**
 * Hook for cloning a product type
 */
export const useCloneProductType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => mockCloneProductType(id),
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
    mutationFn: (id: string) => businessGoalOperations.clone(id),
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
    mutationFn: (id: string) => mockCloneTechnology(id),
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
