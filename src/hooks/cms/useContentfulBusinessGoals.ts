
import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/integrations/contentful/client";
import { CMSBusinessGoal } from "@/types/cms";

/**
 * Hook to fetch all business goals from Contentful
 */
export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ["contentful", "businessGoals"],
    queryFn: async (): Promise<CMSBusinessGoal[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: "businessGoal",
          order: ["fields.displayOrder"]
        });

        // Transform Contentful entries to our internal format
        return response.items.map((entry) => {
          const fields = entry.fields;
          
          return {
            id: entry.sys.id,
            title: fields.title || '',
            slug: fields.slug || '',
            description: fields.description || '',
            icon: fields.icon || '',
            image: fields.image ? {
              id: (fields.image as any).sys.id,
              url: `https:${(fields.image as any).fields.file.url}`,
              alt: (fields.image as any).fields.title || '',
            } : undefined,
            benefits: fields.benefits || [],
            features: fields.features ? (fields.features as any[]).map(feature => ({
              id: feature.sys.id,
              title: feature.fields.title || '',
              description: feature.fields.description || '',
              icon: feature.fields.icon || ''
            })) : [],
            visible: fields.visible !== false,
          };
        });
      } catch (error) {
        console.error("Error fetching business goals from Contentful:", error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a single business goal by slug from Contentful
 */
export function useContentfulBusinessGoalBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["contentful", "businessGoal", slug],
    queryFn: async (): Promise<CMSBusinessGoal | null> => {
      if (!slug) return null;

      try {
        const response = await contentfulClient.getEntries({
          content_type: "businessGoal",
          "fields.slug": slug,
          limit: 1,
        });

        if (response.items.length === 0) {
          return null;
        }

        // Transform the entry to our internal format
        const entry = response.items[0];
        const fields = entry.fields;
        
        return {
          id: entry.sys.id,
          title: fields.title || '',
          slug: fields.slug || '',
          description: fields.description || '',
          icon: fields.icon || '',
          image: fields.image ? {
            id: (fields.image as any).sys.id,
            url: `https:${(fields.image as any).fields.file.url}`,
            alt: (fields.image as any).fields.title || '',
          } : undefined,
          benefits: fields.benefits || [],
          features: fields.features ? (fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title || '',
            description: feature.fields.description || '',
            icon: feature.fields.icon || ''
          })) : [],
          visible: fields.visible !== false,
        };
      } catch (error) {
        console.error(`Error fetching business goal with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}
