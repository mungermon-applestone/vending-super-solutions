
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
        const fields = pageEntry.fields;

        // Transform the page entry to a simpler structure
        return {
          id: pageEntry.sys.id,
          key: fields.key,
          title: fields.title,
          introTitle: fields.introTitle || fields.title,
          introDescription: fields.introDescription,
          metaTitle: fields.metaTitle || fields.title,
          metaDescription: fields.metaDescription,
          heroImage: fields.heroImage ? {
            url: `https:${fields.heroImage.fields.file.url}`,
            alt: fields.heroImage.fields.title || fields.title
          } : undefined,
          content: fields.content
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
