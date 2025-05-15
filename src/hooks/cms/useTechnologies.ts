
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { CMSTechnology } from '@/types/cms';

// Contentful client setup
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_API_KEY || '',
});

// Transform Contentful technology entry to our CMSTechnology type
const transformTechnology = (entry: any): CMSTechnology => {
  return {
    id: entry.sys.id,
    title: entry.fields.title || 'Untitled Technology',
    slug: entry.fields.slug || '',
    description: entry.fields.description || '',
    image_url: entry.fields.image?.fields?.file?.url 
      ? `https:${entry.fields.image.fields.file.url}` 
      : undefined,
    image_alt: entry.fields.imageAlt || '',
    // You can add more fields as needed
  };
};

/**
 * Hook to fetch all technologies
 */
export function useContentfulTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      try {
        const entries = await client.getEntries({
          content_type: 'technology',
          order: ['fields.title'],
        });
        
        return entries.items.map(transformTechnology);
      } catch (error) {
        console.error('Failed to fetch technologies:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a technology by slug
 */
export function useContentfulTechnologyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      try {
        const entries = await client.getEntries({
          content_type: 'technology',
          'fields.slug': slug,
          limit: 1,
        });
        
        if (!entries.items.length) {
          return null;
        }
        
        return transformTechnology(entries.items[0]);
      } catch (error) {
        console.error(`Failed to fetch technology with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}
