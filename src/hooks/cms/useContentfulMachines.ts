
import { useQuery } from '@tanstack/react-query';
import { CMSMachine } from '@/types/cms';
import { fetchMachines, fetchMachineById } from '@/services/cms/contentTypes/machines';
import { logDeprecation } from '@/services/cms/utils/deprecation';
import { fallbackMachineData } from '@/data/fallbacks/machineFallbacks';

/**
 * Hook for fetching multiple machines from Contentful
 * with caching and automatic revalidation
 */
export function useContentfulMachines(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['contentful-machines', filters],
    queryFn: async () => {
      try {
        const machines = await fetchMachines(filters || {});
        console.log('Fetched machines from Contentful:', machines.length);
        
        // If no machines returned and we're in development, use fallbacks
        if (machines.length === 0 && process.env.NODE_ENV === 'development') {
          console.log('Using fallback machine data in development environment');
          return Object.values(fallbackMachineData);
        }
        
        return machines;
      } catch (error) {
        console.error('Error fetching machines from Contentful:', error);
        
        // In development, return fallbacks on error
        if (process.env.NODE_ENV === 'development') {
          console.log('Using fallback machine data due to error');
          return Object.values(fallbackMachineData);
        }
        
        // In production, propagate the error
        throw error;
      }
    }
  });
}

/**
 * Hook for fetching a single machine from Contentful by slug or ID
 * with caching and automatic revalidation
 */
export function useContentfulMachine(identifier?: string) {
  return useQuery({
    queryKey: ['contentful-machine', identifier],
    queryFn: async () => {
      if (!identifier) return null;
      
      try {
        // First try to fetch by slug
        const machinesBySlug = await fetchMachines({ slug: identifier });
        
        if (machinesBySlug && machinesBySlug.length > 0) {
          return machinesBySlug[0];
        }
        
        // If not found by slug, try by ID
        const machineById = await fetchMachineById(identifier);
        
        if (machineById) {
          return machineById;
        }
        
        // If we're in development and the machine wasn't found, use fallback
        if (process.env.NODE_ENV === 'development') {
          logDeprecation(
            'useContentfulMachine-fallback',
            `Machine not found in Contentful, using fallback for: ${identifier}`,
            'Add this machine to Contentful'
          );
          
          // Look for a matching fallback machine
          const fallbackMachine = Object.values(fallbackMachineData).find(
            m => m.slug === identifier || m.id === identifier
          );
          
          if (fallbackMachine) {
            console.log(`Using fallback for machine: ${identifier}`);
            return fallbackMachine;
          }
        }
        
        // If no machine is found anywhere, return null
        return null;
      } catch (error) {
        console.error(`Error fetching machine ${identifier} from Contentful:`, error);
        
        // In development, try to use a fallback on error
        if (process.env.NODE_ENV === 'development') {
          const fallbackMachine = Object.values(fallbackMachineData).find(
            m => m.slug === identifier || m.id === identifier
          );
          
          if (fallbackMachine) {
            console.log(`Using fallback due to error for machine: ${identifier}`);
            return fallbackMachine;
          }
        }
        
        // In production, propagate the error
        throw error;
      }
    },
    enabled: !!identifier
  });
}
