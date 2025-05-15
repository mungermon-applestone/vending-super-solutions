
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/services/contentful/client';
import { CMSTechnology } from '@/types/cms';

/**
 * Transform a Contentful technology entry to our application's CMSTechnology type
 */
function transformContentfulTechnology(entry: any): CMSTechnology {
  const imageUrl = entry.fields.image?.fields?.file?.url 
    ? `https:${entry.fields.image.fields.file.url}` 
    : undefined;
  
  return {
    id: entry.sys.id,
    title: entry.fields.title || 'Untitled Technology',
    slug: entry.fields.slug || '',
    description: entry.fields.description || '',
    image_url: imageUrl,
    image_alt: entry.fields.imageAlt || entry.fields.title || '',
    visible: entry.fields.visible !== false, // Default to visible if not specified
  };
}

/**
 * Hook to fetch technologies from Contentful
 */
export function useContentfulTechnologies() {
  return useQuery({
    queryKey: ['contentful', 'technologies'],
    queryFn: async (): Promise<CMSTechnology[]> => {
      try {
        console.log('[useContentfulTechnologies] Fetching technologies');
        const response = await contentfulClient.getEntries({
          content_type: 'technology',
          order: ['fields.title'],
        });
        
        console.log(`[useContentfulTechnologies] Found ${response.items.length} technologies`);
        return response.items.map(transformContentfulTechnology);
      } catch (error) {
        console.error('[useContentfulTechnologies] Error fetching technologies:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch a single technology by slug from Contentful
 */
export function useContentfulTechnologyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'technology', slug],
    queryFn: async (): Promise<CMSTechnology | null> => {
      if (!slug) return null;
      
      try {
        console.log(`[useContentfulTechnologyBySlug] Fetching technology with slug: ${slug}`);
        const response = await contentfulClient.getEntries({
          content_type: 'technology',
          'fields.slug': slug,
          limit: 1,
        });
        
        if (response.items.length === 0) {
          console.warn(`[useContentfulTechnologyBySlug] No technology found with slug: ${slug}`);
          return null;
        }
        
        console.log(`[useContentfulTechnologyBySlug] Found technology with slug: ${slug}`);
        return transformContentfulTechnology(response.items[0]);
      } catch (error) {
        console.error(`[useContentfulTechnologyBySlug] Error fetching technology with slug "${slug}":`, error);
        return null;
      }
    },
    enabled: !!slug,
  });
}
