import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulTechnology } from '@/types/contentful';
import { CMSTechnology, CMSTechnologySection, CMSTechnologyFeature, CMSImage } from '@/types/cms';

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
            console.log('[useContentfulTechnology] Processing sections. Count:', entry.fields.sections.length);
            
            sections = entry.fields.sections.map((sectionRef: any) => {
              // For linked entries, we need to access their fields
              if (sectionRef.sys && sectionRef.sys.type === 'Link') {
                console.error('[useContentfulTechnology] Section is a Link reference but not resolved:', sectionRef);
                return null;
              }
              
              // If properly resolved by Contentful SDK, we can access the fields directly
              const sectionFields = sectionRef.fields || {};
              const sectionId = sectionRef.sys?.id || '';
              
              console.log('[useContentfulTechnology] Processing section:', sectionId, sectionFields);
              
              // Process bullet points if they exist
              const bulletPoints = Array.isArray(sectionFields.bulletPoints) ? sectionFields.bulletPoints : [];
              
              // Process the section image - simplified approach
              let imageUrl = '';
              let sectionImage = null;
              
              if (sectionFields.sectionImage) {
                // Check if this is a resolved asset or a link
                if (sectionFields.sectionImage.fields && sectionFields.sectionImage.fields.file) {
                  // This is a properly resolved asset
                  imageUrl = `https:${sectionFields.sectionImage.fields.file.url}`;
                  sectionImage = {
                    id: sectionFields.sectionImage.sys?.id || '',
                    url: imageUrl,
                    alt: sectionFields.sectionImage.fields.title || sectionFields.title || 'Section image'
                  };
                } else if (sectionFields.sectionImage.sys && sectionFields.sectionImage.sys.type === 'Link') {
                  console.warn('[useContentfulTechnology] Section image is a Link reference but not resolved:', sectionFields.sectionImage);
                }
              }
              
              console.log('[useContentfulTechnology] Processed section image:', sectionImage);
              
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
                image: sectionImage, // Adding both formats for compatibility
                features: []
              };
            }).filter(Boolean) as CMSTechnologySection[];
          }
          
          console.log('[useContentfulTechnology] Mapped sections:', sections);
          
          // Process the main technology image
          let mainImage: CMSImage | undefined;
          if (entry.fields.image) {
            if (entry.fields.image.fields && entry.fields.image.fields.file) {
              mainImage = {
                id: entry.fields.image.sys?.id || '',
                url: `https:${entry.fields.image.fields.file.url}`,
                alt: entry.fields.image.fields.title || entry.fields.title || 'Technology image'
              };
            }
          }
          
          // Create the technology object with guaranteed sections
          const technology: CMSTechnology = {
            id: entry.sys?.id || '',
            title: entry.fields.title || '',
            slug: entry.fields.slug || '',
            description: entry.fields.description || '',
            visible: entry.fields.visible ?? true,
            image: mainImage,
            sections: sections
          };
          
          console.log('[useContentfulTechnology] Created technology object:', technology);
          return technology;
        });
        
        console.log('[useContentfulTechnology] Final mapped entries:', mappedEntries);
        
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
