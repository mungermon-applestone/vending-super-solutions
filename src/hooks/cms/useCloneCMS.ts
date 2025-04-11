
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSProductType, CMSBusinessGoal, CMSTechnology, CMSMachine } from '@/types/cms';

/**
 * Hook to clone a product type
 */
export function useCloneProductType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<CMSProductType | null> => {
      return await cmsService.cloneProductType(id);
    },
    onSuccess: () => {
      // Invalidate queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['productTypes'] });
    }
  });
}

/**
 * Hook to clone a business goal
 */
export function useCloneBusinessGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<CMSBusinessGoal | null> => {
      return await cmsService.cloneBusinessGoal(id);
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
      return await cmsService.cloneTechnology(id);
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
      return await cmsService.cloneMachine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    }
  });
}
