
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMSBusinessGoal } from '@/types/cms';
import { ContentfulBusinessGoal, ContentfulFeature } from '@/types/contentful';

export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ['contentful', 'businessGoals'],
    queryFn: async () => {
      console.log('[useContentfulBusinessGoals] Fetching all business goals');
      try {
        const entries = await fetchContentfulEntries<ContentfulBusinessGoal>('businessGoal');
        
        return entries.map(entry => ({
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
          benefits: entry.fields.benefits || [],
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
      } catch (error) {
        console.error('[useContentfulBusinessGoals] Error:', error);
        if (window.location.hostname.includes('lovable')) {
          // Return fallback data in preview environment
          return [];
        }
        throw error;
      }
    }
  });
}

export function useContentfulBusinessGoal(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'businessGoal', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log(`[useContentfulBusinessGoal] Fetching business goal with slug: ${slug}`);
      try {
        const entries = await fetchContentfulEntries<ContentfulBusinessGoal>('businessGoal', {
          'fields.slug': slug
        });
        
        if (entries.length === 0) {
          console.log(`[useContentfulBusinessGoal] No business goal found with slug: ${slug}`);
          return null;
        }

        const entry = entries[0];
        return {
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
          benefits: entry.fields.benefits || [],
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
      } catch (error) {
        console.error(`[useContentfulBusinessGoal] Error:`, error);
        return null;
      }
    },
    enabled: !!slug
  });
}
