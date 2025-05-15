
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
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
    content: entry.fields.content || '',
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
        const response = await contentfulClient.getEntries({
          content_type: 'technology',
          order: ['fields.title'],
        });
        
        return response.items.map(transformContentfulTechnology);
      } catch (error) {
        console.error('Error fetching technologies from Contentful:', error);
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
        const response = await contentfulClient.getEntries({
          content_type: 'technology',
          'fields.slug': slug,
          limit: 1,
        });
        
        if (response.items.length === 0) {
          return null;
        }
        
        return transformContentfulTechnology(response.items[0]);
      } catch (error) {
        console.error(`Error fetching technology with slug "${slug}" from Contentful:`, error);
        return null;
      }
    },
    enabled: !!slug,
  });
}
