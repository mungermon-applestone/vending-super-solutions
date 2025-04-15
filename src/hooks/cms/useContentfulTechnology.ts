
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulTechnology } from '@/types/contentful';
import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature } from '@/types/cms';

export function useContentfulTechnology() {
  return useQuery({
    queryKey: ['contentful', 'technology'],
    queryFn: async () => {
      console.log('[useContentfulTechnology] Fetching technology data');
      try {
        const entries = await fetchContentfulEntries<ContentfulTechnology>('technology');
        
        console.log('[useContentfulTechnology] Raw entries:', entries);
        
        if (!entries || entries.length === 0) {
          console.log('[useContentfulTechnology] No entries found, returning empty array');
          return [];
        }
        
        const mappedEntries = entries.map(entry => ({
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          sections: (entry.fields.sections || []).map((section: any) => ({
            id: section.sys?.id,
            title: section.fields?.title,
            description: section.fields?.description,
            section_type: section.fields?.sectionType,
            display_order: section.fields?.displayOrder || 0,
            technology_id: entry.sys?.id,
            features: (section.fields?.features || []).map((feature: any) => ({
              id: feature.sys?.id,
              section_id: section.sys?.id,
              title: feature.fields?.title,
              description: feature.fields?.description,
              icon: feature.fields?.icon,
              display_order: feature.fields?.displayOrder || 0,
              items: feature.fields?.items ? feature.fields.items.map((item: string) => ({
                text: item,
                display_order: 0
              })) : []
            })) as CMSTechnologyFeature[]
          })) as CMSTechnologySection[]
        })) as CMSTechnology[];
        
        console.log('[useContentfulTechnology] Mapped entries:', mappedEntries);
        
        return mappedEntries;
      } catch (error) {
        console.error('[useContentfulTechnology] Error:', error);
        if (window.location.hostname.includes('lovable')) {
          // Return fallback data in preview environment
          console.log('[useContentfulTechnology] Returning empty array for preview environment');
          return [];
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}

export function useContentfulTechnologyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      console.log(`[useContentfulTechnologyBySlug] Fetching technology with slug: ${slug}`);
      try {
        const entries = await fetchContentfulEntries<ContentfulTechnology>('technology', {
          'fields.slug': slug
        });
        
        if (entries.length === 0) {
          console.log(`[useContentfulTechnologyBySlug] No technology found with slug: ${slug}`);
          return null;
        }

        const entry = entries[0];
        return {
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description,
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          sections: (entry.fields.sections || []).map((section: any) => ({
            id: section.sys?.id,
            title: section.fields?.title,
            description: section.fields?.description,
            section_type: section.fields?.sectionType,
            display_order: section.fields?.displayOrder || 0,
            technology_id: entry.sys?.id,
            features: (section.fields?.features || []).map((feature: any) => ({
              id: feature.sys?.id,
              section_id: section.sys?.id,
              title: feature.fields?.title,
              description: feature.fields?.description,
              icon: feature.fields?.icon,
              display_order: feature.fields?.displayOrder || 0,
              items: feature.fields?.items ? feature.fields.items.map((item: string) => ({
                text: item,
                display_order: 0
              })) : []
            })) as CMSTechnologyFeature[]
          })) as CMSTechnologySection[]
        } as CMSTechnology;
      } catch (error) {
        console.error(`[useContentfulTechnologyBySlug] Error:`, error);
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
}
