import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { PromotionalContentFields, ContentfulAsset } from '@/types/contentful';
import { Document } from '@contentful/rich-text-types';

export interface PromotionalPopoverData {
  title: string;
  body: Document;
  imageUrl?: string;
  isActive: boolean;
  targetRoute: string;
}

const TARGET_ROUTE_MAP: Record<string, string> = {
  'Home Page': '/',
  'Product Landing Page': '/products',
  'Machines Landing Page': '/machines',
  'Business Goals Landing Page': '/business-goals',
  'Technology Landing Page': '/technology',
};

const isWithinPopoverPeriod = (startDate?: string, endDate?: string): boolean => {
  if (!startDate || !endDate) return false;
  
  try {
    const now = new Date();
    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));
    
    return isWithinInterval(now, { start, end });
  } catch (error) {
    console.error('[usePromotionalPopover] Date parsing error:', error);
    return false;
  }
};

export function usePromotionalPopover() {
  return useQuery({
    queryKey: ['contentful', 'promotional-popover'],
    queryFn: async (): Promise<PromotionalPopoverData | null> => {
      try {
        console.log('[usePromotionalPopover] Fetching promotional popover content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'promotionalContent',
          limit: 1,
          include: 2 // Include linked assets
        });

        if (!entries.items.length) {
          console.log('[usePromotionalPopover] No promotional content found');
          return null;
        }

        const fields = entries.items[0].fields as PromotionalContentFields;
        const title = fields.popoverTitle;
        const body = fields.popoverBody as Document;
        const popoverImage = fields.popoverImage as ContentfulAsset;
        const startDate = fields.popoverStartDate;
        const endDate = fields.popoverEndDate;
        const target = fields.popoverTarget;

        if (!title || !body) {
          console.log('[usePromotionalPopover] No popover title or body');
          return null;
        }

        if (!target) {
          console.log('[usePromotionalPopover] No popover target specified');
          return null;
        }

        const isActive = isWithinPopoverPeriod(startDate, endDate);
        const targetRoute = TARGET_ROUTE_MAP[target] || '/';
        const imageUrl = popoverImage?.fields?.file?.url 
          ? `https:${popoverImage.fields.file.url}`
          : undefined;

        console.log('[usePromotionalPopover] Popover active:', isActive, { 
          startDate, 
          endDate, 
          target, 
          targetRoute 
        });

        return {
          title,
          body,
          imageUrl,
          isActive,
          targetRoute
        };
      } catch (error) {
        console.error('[usePromotionalPopover] Error:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
}
