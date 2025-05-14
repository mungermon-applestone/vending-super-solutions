
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';
import { transformMachineFromContentful } from '@/utils/cms/transformers/machineTransformer';
import { toast } from 'sonner';

/**
 * Type for raw Contentful entry before transformation
 */
interface ContentfulRawEntry {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: Record<string, any>;
}

/**
 * Hook for fetching Contentful machines
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const response = await fetchContentfulEntries('machine');
        console.log('[useContentfulMachines] Fetched entries:', response);
        
        if (!response || response.length === 0) {
          console.log('[useContentfulMachines] No machines found in Contentful');
          return [];
        }
        
        // Transform each machine entry
        const machines = response.map(entry => {
          try {
            return transformMachineFromContentful(entry as any);
          } catch (transformError) {
            console.error('[useContentfulMachines] Error transforming machine:', transformError);
            return null;
          }
        }).filter(Boolean) as CMSMachine[];
        
        console.log('[useContentfulMachines] Transformed machines:', machines);
        return machines;
        
      } catch (error) {
        console.error('[CRITICAL] Machine fetch failed', {
          error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    }
  });
}

/**
 * Hook for fetching a single Contentful machine
 */
export function useContentfulMachine(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'machine', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        console.log('[useContentfulMachine] No ID or slug provided');
        return null;
      }
      
      console.log('[useContentfulMachine] Fetching machine with idOrSlug:', idOrSlug);
      
      try {
        // Try fetching by ID first if it looks like an ID
        if (idOrSlug.length > 10) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry(idOrSlug);
            if (entry) {
              return transformMachineFromContentful(entry as any);
            }
          } catch (idError) {
            console.log('[useContentfulMachine] Could not fetch by ID:', idError);
          }
        }
        
        // Then try by slug
        console.log('[useContentfulMachine] Fetching by slug field:', idOrSlug);
        const entries = await fetchContentfulEntries('machine', {
          'fields.slug': idOrSlug
        });
        
        if (entries.length === 0) {
          console.log(`[useContentfulMachine] No machine found with slug: ${idOrSlug}`);
          return null;
        }
        
        return transformMachineFromContentful(entries[0] as any);
        
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine: ${idOrSlug}`, error);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}
