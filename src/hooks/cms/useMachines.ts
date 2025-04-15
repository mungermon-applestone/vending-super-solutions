
import { useQuery } from '@tanstack/react-query';
import { CMSMachine } from '@/types/cms';
import { fetchMachines } from '@/services/cms/contentTypes/machines';
import { fetchMachineById } from '@/services/cms/contentTypes/machines';

export function useMachines(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: async () => {
      return await fetchMachines<CMSMachine>(filters || {});
    },
  });
}

export function useMachine(slug: string) {
  return useQuery({
    queryKey: ['machine', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      // First try to fetch by slug
      const machines = await fetchMachines<CMSMachine>({ slug });
      
      if (machines.length > 0) {
        return machines[0];
      }
      
      // If not found by slug, try by ID
      try {
        return await fetchMachineById<CMSMachine>(slug);
      } catch (error) {
        console.error(`Error fetching machine by ID ${slug}:`, error);
        return null;
      }
    },
    enabled: !!slug,
  });
}
