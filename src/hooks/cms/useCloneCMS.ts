import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as productService from '@/services/cms/products';
import { cloneBusinessGoal } from '@/services/cms/contentTypes/businessGoals/cloneBusinessGoal';
import { cloneTechnology } from '@/services/cms/contentTypes/technologies/cloneTechnology';
import { cloneMachine } from '@/services/cms/contentTypes/machines/cloneMachine';

/**
 * Hook to clone a product type
 */
export function useCloneProductType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productService.cloneProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
    },
  });
}

/**
 * Hook to clone a business goal
 */
export function useCloneBusinessGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<CMSBusinessGoal | null> => {
      return await cloneBusinessGoal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessGoals'] });
    }
  });
}

/**
 * Hook to clone a technology
 */
export function useCloneTechnology() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<CMSTechnology | null> => {
      return await cloneTechnology(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
    }
  });
}

/**
 * Hook to clone a machine
 */
export function useCloneMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<CMSMachine | null> => {
      return await cloneMachine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    }
  });
}
