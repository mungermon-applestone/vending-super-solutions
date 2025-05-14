
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '../services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { CMSMachine } from '@/types/cms';
import { 
  useContentfulMachines as useNewContentfulMachines, 
  useContentfulMachine as useNewContentfulMachine,
  transformMachineFromContentful
} from '@/hooks/cms/useContentfulMachines';

// For backward compatibility, re-export the new implementation
export { transformMachineFromContentful };

/**
 * DEPRECATED: Use hooks/cms/useContentfulMachines.ts instead
 * This is kept for backward compatibility
 */
export function useContentfulMachines() {
  console.warn('[DEPRECATED] useContentfulMachines from src/hooks/useContentfulMachines.ts is deprecated. Use src/hooks/cms/useContentfulMachines.ts instead.');
  return useNewContentfulMachines();
}

/**
 * DEPRECATED: Use hooks/cms/useContentfulMachine instead
 * This is kept for backward compatibility
 */
export function useContentfulMachine(idOrSlug: string | undefined) {
  console.warn('[DEPRECATED] useContentfulMachine from src/hooks/useContentfulMachines.ts is deprecated. Use src/hooks/cms/useContentfulMachine.ts instead.');
  return useNewContentfulMachine(idOrSlug);
}
