
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
 * @remarks
 * !!!!! CRITICAL PATH - DO NOT MODIFY WITHOUT EXTENSIVE TESTING !!!!!
 * Core requirements:
 * - Fetch all machines
 * - Provide fallback in preview/error scenarios
 * - Consistent error logging
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines', Date.now()], // Cache bust to force fresh data
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
        
        // Debug: Show machine data before sorting
        machines.forEach(machine => {
          console.log(`📋 [SORTING] Machine "${machine.title}" has displayOrder: ${machine.displayOrder}`);
        });

        // Sort machines by display order, then by title
        const sortedMachines = machines.sort((a, b) => {
          const orderA = a.displayOrder ?? 999;
          const orderB = b.displayOrder ?? 999;
          
          console.log(`🔀 [SORTING] Comparing "${a.title}" (${orderA}) vs "${b.title}" (${orderB})`);
          
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          
          return a.title.localeCompare(b.title);
        });
        
        console.log('🎯 [SORTING] Final sorted order:', sortedMachines.map(m => `${m.title} (${m.displayOrder})`));
        return sortedMachines;
        
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
 * Helper function to check if a string looks like a Contentful entry ID
 * @param idOrSlug The string to check
 * @returns true if it looks like an ID, false if it's likely a slug
 */
function looksLikeContentfulId(idOrSlug: string): boolean {
  // Contentful IDs are typically 22 characters long and contain alphanumeric + underscores
  return idOrSlug.length > 15 && /^[a-zA-Z0-9_-]+$/.test(idOrSlug) && !/^[a-z-]+$/.test(idOrSlug);
}

/**
 * Hook for fetching a single Contentful machine
 * 
 * @remarks
 * !!!!! CRITICAL PATH - DO NOT MODIFY WITHOUT EXTENSIVE TESTING !!!!!
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
            const entry = await fetchContentfulEntry<ContentfulEntry>('1omUbnEhB6OeBFpwPFj1Ww', {}, false);
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
        
        // Try fetching by ID first if it looks like an ID (improved detection)
        if (looksLikeContentfulId(idOrSlug)) {
          try {
            console.log('[useContentfulMachine] Trying direct ID fetch:', idOrSlug);
            const entry = await fetchContentfulEntry<ContentfulEntry>(idOrSlug, {}, false); // Don't show toast for ID attempts
            if (entry) {
              console.log('[useContentfulMachine] Successfully fetched by ID:', entry);
              return transformContentfulEntry(entry);
            }
          } catch (idError) {
            console.log('[useContentfulMachine] Could not fetch by ID (this is normal for slugs):', idError.message);
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
          
          // Only show error toast when all attempts have failed
          toast.error(`Machine not found: ${idOrSlug}`);
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
        
        // Only show error toast for unexpected errors, not for "not found" cases
        if (!error.message?.includes('not found')) {
          toast.error(`Failed to load machine data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        throw error;
      }
    },
    enabled: !!idOrSlug
  });
}

export default { useContentfulMachines, useContentfulMachine };
