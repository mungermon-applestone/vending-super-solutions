
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
          console.log('[useContentfulTechnology] Processing entry:', entry.fields.title);
          
          // Map technology sections with proper field access
          let sections: CMSTechnologySection[] = [];
          
          if (entry.fields.sections && Array.isArray(entry.fields.sections)) {
            console.log('[useContentfulTechnology] Processing sections:', entry.fields.sections.length);
            
            sections = entry.fields.sections.map((sectionEntry: any) => {
              console.log('[useContentfulTechnology] Processing section entry:', sectionEntry);
              
              // Access section fields properly
              const sectionFields = sectionEntry.fields || {};
              const sectionId = sectionEntry.sys?.id || '';
              
              // Process bullet points if they exist
              const bulletPoints = Array.isArray(sectionFields.bulletPoints) ? sectionFields.bulletPoints : [];
              
              // Process the section image
              let sectionImage = null;
              if (sectionFields.sectionImage) {
                console.log('[useContentfulTechnology] Section has image:', sectionFields.sectionImage);
                
                // Handle different image data structures
                if (typeof sectionFields.sectionImage === 'string') {
                  sectionImage = sectionFields.sectionImage;
                } else if (sectionFields.sectionImage.fields) {
                  const imageFields = sectionFields.sectionImage.fields;
                  if (imageFields && imageFields.file && imageFields.file.url) {
                    sectionImage = {
                      url: `https:${imageFields.file.url}`,
                      alt: imageFields.title || sectionFields.title || ''
                    };
                  }
                } else if (sectionFields.sectionImage.url) {
                  sectionImage = sectionFields.sectionImage;
                }
              }
              
              console.log('[useContentfulTechnology] Mapped section:', {
                id: sectionId,
                title: sectionFields.title,
                summary: sectionFields.summary,
                bulletPoints,
                sectionImage
              });
              
              return {
                id: sectionId,
                title: sectionFields.title || '',
                summary: sectionFields.summary || '',
                description: sectionFields.summary || '',
                section_type: 'technology',
                display_order: sectionFields.displayOrder || 0,
                technology_id: entry.sys?.id || '',
                bulletPoints,
                sectionImage,
                features: []
              };
            });
          }
          
          console.log('[useContentfulTechnology] Mapped sections:', sections);
          
          return {
            id: entry.sys?.id || '',
            title: entry.fields.title || '',
            slug: entry.fields.slug || '',
            description: entry.fields.description || '',
            visible: entry.fields.visible ?? true,
            image: entry.fields.image ? {
              id: entry.fields.image.sys?.id || '',
              url: entry.fields.image.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : '',
              alt: entry.fields.image.fields?.title || entry.fields.title || ''
            } : undefined,
            sections
          } as CMSTechnology;
        });
        
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
