
import { useQuery } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import { createQueryOptions } from './useQueryDefaults';

/**
 * Hook to fetch machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: () => cmsService.getMachines(filters),
    ...createQueryOptions<CMSMachine[]>()
  });
}

/**
 * Hook to fetch a specific machine by type and ID
 */
export function useMachine(type: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, id],
    queryFn: () => cmsService.getMachineBySlug(type || '', id || ''),
    enabled: !!type && !!id,
    ...createQueryOptions<CMSMachine | null>()
  });
}
