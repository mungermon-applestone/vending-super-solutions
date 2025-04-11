
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSTestimonial } from '@/types/cms';
import { createQueryOptions } from './useQueryDefaults';

/**
 * Hook to fetch all testimonials
 */
export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: cmsService.getTestimonials,
    ...createQueryOptions<CMSTestimonial[]>()
  });
}
