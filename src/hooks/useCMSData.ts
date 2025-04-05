
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';

export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
  });
}

export function useMachine(type: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, id],
    queryFn: () => cmsService.getMachineBySlug(type || '', id || ''),
    enabled: !!type && !!id,
  });
}

export function useProductTypes() {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: cmsService.getProductTypes,
  });
}

export function useProductType(slug: string | undefined) {
  return useQuery({
    queryKey: ['productType', slug],
    queryFn: () => cmsService.getProductTypeBySlug(slug || ''),
    enabled: !!slug,
    retry: false, // Don't retry if the product type doesn't exist
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsService.getTestimonials,
  });
}

export function useBusinessGoals() {
  return useQuery({
    queryKey: ['businessGoals'],
    queryFn: cmsService.getBusinessGoals,
  });
}

export function useBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['businessGoal', slug],
    queryFn: () => cmsService.getBusinessGoalBySlug(slug || ''),
    enabled: !!slug,
  });
}
