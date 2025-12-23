import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { PromotionalContentFields } from '@/types/contentful';

export interface PromotionalStripData {
  text: string;
  isActive: boolean;
}

const isWithinPromotionalPeriod = (startDate?: string, endDate?: string): boolean => {
  if (!startDate || !endDate) return false;
  
  try {
    const now = new Date();
    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate)); // End of day for inclusive end date
    
    return isWithinInterval(now, { start, end });
  } catch (error) {
    console.error('[usePromotionalStrip] Date parsing error:', error);
    return false;
  }
};

export function usePromotionalStrip() {
  return useQuery({
    queryKey: ['contentful', 'promotional-strip'],
    queryFn: async (): Promise<PromotionalStripData | null> => {
      try {
        console.log('[usePromotionalStrip] Fetching promotional content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'promotionalContent',
          limit: 1
        });

        if (!entries.items.length) {
          console.log('[usePromotionalStrip] No promotional content found');
          return null;
        }

        const fields = entries.items[0].fields as PromotionalContentFields;
        const text = fields.promotionalStrip;
        const startDate = fields.promotionalStripStartDate;
        const endDate = fields.promotionalStripEndDate;

        if (!text) {
          console.log('[usePromotionalStrip] No promotional strip text');
          return null;
        }

        const isActive = isWithinPromotionalPeriod(startDate, endDate);
        console.log('[usePromotionalStrip] Promo active:', isActive, { startDate, endDate });

        return {
          text,
          isActive
        };
      } catch (error) {
        console.error('[usePromotionalStrip] Error:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}
