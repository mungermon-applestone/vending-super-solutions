
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { CMSMachine } from '@/types/cms';
import { ContentfulEntry } from '@/types/contentful/machine';
import { transformContentfulEntry } from '@/utils/cms/transformers/machineTransformer';
import { fallbackMachineData } from '@/data/fallbacks/machineFallbacks';
import { toast } from 'sonner';

/**
 * Hook for fetching Contentful machines
 * 
 * !!!!! DO NOT REMOVE OR FUNDAMENTALLY ALTER !!!!
 * Core requirements:
 * - Fetch all machines
 * - Provide fallback in preview/error scenarios
 * - Consistent error logging
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      console.log('[useContentfulMachines] Fetching all machines');
      try {
        const entries = await fetchContentfulEntries<ContentfulEntry>('machine');
        console.log('[useContentfulMachines] Fetched entries:', entries);
        
        if (!entries || entries.length === 0) {
          console.log('[useContentfulMachines] No machines found in Contentful');
          
          if (window.location.hostname.includes('lovable')) {
            console.log('[useContentfulMachines] Using fallback data in preview');
            toast.info('Using fallback machine data in preview environment');
            return Object.values(fallbackMachineData);
          }
          
          return [];
        }
        
        const machines = entries.map(transformContentfulEntry);
        console.log('[useContentfulMachines] Transformed machines:', machines);
        return machines;
        
      } catch (error) {
        console.error('[CRITICAL] Machine fetch failed', {
          error,
          timestamp: new Date().toISOString()
        });
        
        if (window.location.hostname.includes('lovable')) {
          console.log('[useContentfulMachines] Using fallback data after error in preview');
          toast.info('Using fallback machine data in preview environment');
          return Object.values(fallbackMachineData);
        }
        throw error;
      }
    }
  });
}

/**
 * Hook for fetching a single Contentful machine
 * 
 * !!!!! DO NOT REMOVE OR FUNDAMENTALLY ALTER !!!!
 * Core requirements:
 * - Fetch machine by ID or slug
 * - Handle special cases (e.g., divi-wp)
 * - Provide fallback in preview/error scenarios
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
        // Special handling for divi-wp
        if (idOrSlug === 'divi-wp') {
          console.log('[useContentfulMachine] Special case: directly fetching divi-wp with ID: 1omUbnEhB6OeBFpwPFj1Ww');
          
          try {
            const entry = await fetchContentfulEntry<ContentfulEntry>('1omUbnEhB6OeBFpwPFj1Ww');
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched divi-wp entry by ID:', entry);
              return transformContentfulEntry(entry);
            }
          } catch (diviError) {
            console.error('[useContentfulMachine] Error fetching divi-wp by ID:', diviError);
          }
          
          if (window.location.hostname.includes('lovable')) {
            console.log('[useContentfulMachine] Using fallback data for divi-wp in preview');
            toast.info('Using fallback data for DIVI-WP in preview environment');
            return fallbackMachineData['divi-wp'];
          }
        }
        
        // Try fetching by ID first if it looks like an ID
        if (idOrSlug.length > 10) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry<ContentfulEntry>(idOrSlug);
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched by ID:', entry);
              return transformContentfulEntry(entry);
            }
          } catch (idError) {
            console.log('[useContentfulMachine] Could not fetch by ID:', idError);
          }
        }
        
        // Then try by slug
        console.log('[useContentfulMachine] Fetching by slug field:', idOrSlug);
        const entries = await fetchContentfulEntries<ContentfulEntry>('machine', {
          'fields.slug': idOrSlug
        });
        
        if (entries.length === 0) {
          console.warn('[useContentfulMachine] No machine found with slug:', idOrSlug);
          
          if (window.location.hostname.includes('lovable') && fallbackMachineData[idOrSlug]) {
            console.log('[useContentfulMachine] Using fallback data for:', idOrSlug);
            return fallbackMachineData[idOrSlug];
          }
          
          return null;
        }
        
        console.log('[useContentfulMachine] Found machine by slug:', entries[0]);
        return transformContentfulEntry(entries[0]);
        
      } catch (error) {
        console.error(`[useContentfulMachine] Error:`, error);
        
        if (window.location.hostname.includes('lovable') && fallbackMachineData[idOrSlug]) {
          console.log('[useContentfulMachine] Using fallback data for:', idOrSlug);
          return fallbackMachineData[idOrSlug];
        }
        
        toast.error(`Failed to load machine data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}

export default { useContentfulMachines, useContentfulMachine };

