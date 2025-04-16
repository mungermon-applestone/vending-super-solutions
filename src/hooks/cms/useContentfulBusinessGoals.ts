
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntryBySlug } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';
import { ContentfulBusinessGoal } from '@/types/contentful';
import { normalizeSlug } from '@/services/cms/utils/slugMatching';

export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ['contentful', 'businessGoals'],
    queryFn: async () => {
      console.log('[useContentfulBusinessGoals] Fetching all business goals');
      try {
        const entries = await fetchContentfulEntries<ContentfulBusinessGoal>('businessGoal');
        
        console.log('[useContentfulBusinessGoals] Raw entries:', entries);
        
        if (!entries || entries.length === 0) {
          console.log('[useContentfulBusinessGoals] No entries found, returning empty array');
          return [];
        }
        
        const mappedEntries = entries.map(entry => ({
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          icon: entry.fields.icon,
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          benefits: (entry.fields.benefits || []).map(benefit => String(benefit)),
          features: (entry.fields.features || []).map((feature: any) => ({
            id: feature.sys?.id,
            title: feature.fields?.title,
            description: feature.fields?.description,
            icon: feature.fields?.icon,
            screenshot: feature.fields?.screenshot ? {
              id: feature.fields.screenshot.sys?.id,
              url: `https:${feature.fields.screenshot.fields?.file?.url}`,
              alt: feature.fields.screenshot.fields?.title
            } : undefined
          }))
        })) as CMSBusinessGoal[];
        
        console.log('[useContentfulBusinessGoals] Mapped entries:', mappedEntries);
        
        return mappedEntries;
      } catch (error) {
        console.error('[useContentfulBusinessGoals] Error:', error);
        if (window.location.hostname.includes('lovable')) {
          // Return fallback data in preview environment
          console.log('[useContentfulBusinessGoals] Returning empty array for preview environment');
          return [];
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}

export function useContentfulBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'businessGoal', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log(`[useContentfulBusinessGoal] Fetching business goal with slug: ${slug}`);
      try {
        // Use direct slug lookup method for better debugging
        const entry = await fetchContentfulEntryBySlug<ContentfulBusinessGoal>('businessGoal', slug);
        
        if (!entry) {
          console.log(`[useContentfulBusinessGoal] No business goal found with slug: ${slug}`);
          
          // Try with normalized slug
          const normalizedSlug = normalizeSlug(slug);
          if (normalizedSlug !== slug) {
            console.log(`[useContentfulBusinessGoal] Trying with normalized slug: ${normalizedSlug}`);
            const normalizedEntry = await fetchContentfulEntryBySlug<ContentfulBusinessGoal>('businessGoal', normalizedSlug);
            
            if (!normalizedEntry) {
              console.log(`[useContentfulBusinessGoal] No business goal found with normalized slug: ${normalizedSlug}`);
              return null;
            }
            
            console.log(`[useContentfulBusinessGoal] Found business goal with normalized slug: ${normalizedSlug}`);
            entry = normalizedEntry;
          } else {
            return null;
          }
        }

        // Map the Contentful entry to our CMS model
        const mappedBusinessGoal = {
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          icon: entry.fields.icon,
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          benefits: (entry.fields.benefits || []).map(benefit => String(benefit)),
          features: (entry.fields.features || []).map((feature: any) => ({
            id: feature.sys?.id,
            title: feature.fields?.title,
            description: feature.fields?.description,
            icon: feature.fields?.icon,
            screenshot: feature.fields?.screenshot ? {
              id: feature.fields.screenshot.sys?.id,
              url: `https:${feature.fields.screenshot.fields?.file?.url}`,
              alt: feature.fields.screenshot.fields?.title
            } : undefined
          }))
        } as CMSBusinessGoal;
        
        console.log(`[useContentfulBusinessGoal] Mapped business goal:`, mappedBusinessGoal);
        return mappedBusinessGoal;
      } catch (error) {
        console.error(`[useContentfulBusinessGoal] Error:`, error);
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}
