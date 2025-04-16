
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
        
        const mappedEntries = entries.map(entry => {
          console.log('[useContentfulTechnology] Processing entry:', entry.fields);
          
          // Make sure we log the description field specifically to verify it exists
          console.log(`[useContentfulTechnology] Entry '${entry.fields.title}' description:`, {
            hasDescription: !!entry.fields.description,
            descriptionValue: entry.fields.description,
            descriptionType: typeof entry.fields.description,
            descriptionLength: entry.fields.description?.length
          });
          
          return {
            id: entry.sys?.id,
            title: entry.fields.title,
            slug: entry.fields.slug,
            description: entry.fields.description, // Ensure description is properly mapped
            visible: entry.fields.visible ?? true,
            image: entry.fields.image ? {
              id: entry.fields.image.sys?.id,
              url: `https:${entry.fields.image.fields?.file?.url}`,
              alt: entry.fields.image.fields?.title || entry.fields.title
            } : undefined,
            sections: (entry.fields.sections || []).map((section: any) => {
              // Log each section's summary and description fields
              console.log(`[useContentfulTechnology] Section '${section.fields?.title}':`, {
                hasSummary: !!section.fields?.summary,
                summaryValue: section.fields?.summary,
                summaryType: typeof section.fields?.summary,
                summaryLength: section.fields?.summary?.length || 0,
                hasDescription: !!section.fields?.description,
                descriptionValue: section.fields?.description,
              });
              
              return {
                id: section.sys?.id,
                title: section.fields?.title,
                summary: section.fields?.summary, // Make sure to map the summary field
                description: section.fields?.description,
                section_type: section.fields?.sectionType,
                display_order: section.fields?.displayOrder || 0,
                technology_id: entry.sys?.id,
                bulletPoints: section.fields?.bulletPoints || [],
                sectionImage: section.fields?.sectionImage ? {
                  url: `https:${section.fields.sectionImage.fields?.file?.url}`,
                  alt: section.fields.sectionImage.fields?.title || section.fields?.title || '',
                } : undefined,
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
              };
            }) as CMSTechnologySection[]
          };
        }) as CMSTechnology[];
        
        console.log('[useContentfulTechnology] Mapped entries with descriptions:', 
          mappedEntries.map(entry => ({ 
            title: entry.title, 
            description: entry.description,
            descriptionLength: entry.description?.length || 0,
            hasSections: entry.sections && entry.sections.length > 0,
            firstSectionSummary: entry.sections?.[0]?.summary,
            firstSectionSummaryLength: entry.sections?.[0]?.summary?.length || 0
          }))
        );
        
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
        console.log(`[useContentfulTechnologyBySlug] Found entry with title: ${entry.fields.title}`, {
          description: entry.fields.description,
          descriptionLength: entry.fields.description?.length || 0
        });
        
        return {
          id: entry.sys?.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          description: entry.fields.description, // Ensure description is mapped correctly
          visible: entry.fields.visible ?? true,
          image: entry.fields.image ? {
            id: entry.fields.image.sys?.id,
            url: `https:${entry.fields.image.fields?.file?.url}`,
            alt: entry.fields.image.fields?.title || entry.fields.title
          } : undefined,
          sections: (entry.fields.sections || []).map((section: any) => {
            // Log each section's summary and description fields
            console.log(`[useContentfulTechnologyBySlug] Section '${section.fields?.title}':`, {
              hasSummary: !!section.fields?.summary,
              summaryValue: section.fields?.summary,
              summaryType: typeof section.fields?.summary,
              summaryLength: section.fields?.summary?.length || 0
            });
            
            return {
              id: section.sys?.id,
              title: section.fields?.title,
              summary: section.fields?.summary, // Make sure to map the summary field
              description: section.fields?.description,
              section_type: section.fields?.sectionType,
              display_order: section.fields?.displayOrder || 0,
              technology_id: entry.sys?.id,
              bulletPoints: section.fields?.bulletPoints || [],
              sectionImage: section.fields?.sectionImage ? {
                url: `https:${section.fields.sectionImage.fields?.file?.url}`,
                alt: section.fields.sectionImage.fields?.title || section.fields?.title || '',
              } : undefined,
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
            };
          }) as CMSTechnologySection[]
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
