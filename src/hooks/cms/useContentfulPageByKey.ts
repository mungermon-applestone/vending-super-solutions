
import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/lib/contentful";

/**
 * Hook for fetching a page by key from Contentful
 * 
 * @param key - The unique key for the page
 * @param options - Query options
 * @returns Query result with page content
 */
export const useContentfulPageByKey = (key: string, options?: {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
}) => {
  return useQuery({
    queryKey: ["contentful", "page", key],
    queryFn: async () => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'page',
          'fields.key': key,
          include: 2
        });

        if (response.items.length === 0) {
          return null;
        }

        const pageEntry = response.items[0];
        const fields = pageEntry.fields as Record<string, any>;

        // Transform the page entry to a simpler structure
        return {
          id: pageEntry.sys.id,
          key: fields.key as string || '',
          title: fields.title as string || '',
          introTitle: fields.introTitle as string || fields.title as string || '',
          introDescription: fields.introDescription as string || '',
          metaTitle: fields.metaTitle as string || fields.title as string || '',
          metaDescription: fields.metaDescription as string || '',
          heroImage: fields.heroImage ? {
            url: `https:${(fields.heroImage as any).fields.file.url}`,
            alt: (fields.heroImage as any).fields.title || fields.title || ''
          } : undefined,
          content: fields.content || null
        };
      } catch (error) {
        console.error(`[useContentfulPageByKey] Error fetching page with key "${key}":`, error);
        throw new Error(`Failed to fetch page with key "${key}"`);
      }
    },
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime || 1000 * 60 * 5, // 5 minutes
    refetchInterval: options?.refetchInterval || false,
  });
};
