
import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/integrations/contentful/client";
import { CMSBusinessGoal, CMSImage, CMSFeature } from "@/types/cms";
import { transformContentfulAsset } from "./transformers/businessGoalTransformer";

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
          const fields = entry.fields as any;
          
          // Helper function to safely convert field values to strings
          const safeString = (value: any): string => {
            return value !== undefined && value !== null ? String(value) : '';
          };
          
          // Helper function to handle image transformation
          const processImage = (imageField: any): CMSImage | undefined => {
            if (!imageField || !imageField.fields || !imageField.fields.file || !imageField.fields.file.url) {
              return undefined;
            }
            
            return {
              id: imageField.sys?.id || '',
              url: `https:${imageField.fields.file.url}`,
              alt: imageField.fields.title || '',
              width: imageField.fields.file.details?.image?.width,
              height: imageField.fields.file.details?.image?.height
            };
          };
          
          // Process features if they exist
          const processFeatures = (featuresField: any[] | undefined): CMSFeature[] => {
            if (!featuresField || !Array.isArray(featuresField)) {
              return [];
            }
            
            return featuresField.map(feature => ({
              id: feature.sys?.id || '',
              title: safeString(feature.fields?.title || ''),
              description: safeString(feature.fields?.description || ''),
              icon: feature.fields?.icon || '',
              display_order: feature.fields?.displayOrder || 0
            }));
          };
          
          return {
            id: entry.sys.id,
            title: safeString(fields.title),
            slug: safeString(fields.slug),
            description: safeString(fields.description),
            icon: safeString(fields.icon || ''),
            image: processImage(fields.image),
            benefits: Array.isArray(fields.benefits) ? fields.benefits.map(safeString) : [],
            features: processFeatures(fields.features),
            visible: fields.visible !== false,
            displayOrder: fields.displayOrder || 0,
            created_at: entry.sys.createdAt || "",
            updated_at: entry.sys.updatedAt || ""
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
        const fields = entry.fields as any;
        
        // Helper function to safely convert field values to strings
        const safeString = (value: any): string => {
          return value !== undefined && value !== null ? String(value) : '';
        };
        
        // Process features if they exist
        const processFeatures = (featuresField: any[] | undefined): CMSFeature[] => {
          if (!featuresField || !Array.isArray(featuresField)) {
            return [];
          }
          
          return featuresField.map(feature => ({
            id: feature.sys?.id || '',
            title: safeString(feature.fields?.title || ''),
            description: safeString(feature.fields?.description || ''),
            icon: feature.fields?.icon || '',
            display_order: feature.fields?.displayOrder || 0
          }));
        };
        
        return {
          id: entry.sys.id,
          title: safeString(fields.title),
          slug: safeString(fields.slug),
          description: safeString(fields.description),
          icon: safeString(fields.icon || ''),
          image: fields.image ? {
            id: fields.image.sys?.id || '',
            url: `https:${fields.image.fields?.file?.url}`,
            alt: fields.image.fields?.title || '',
            width: fields.image.fields?.file?.details?.image?.width,
            height: fields.image.fields?.file?.details?.image?.height,
          } : undefined,
          benefits: Array.isArray(fields.benefits) ? fields.benefits.map(safeString) : [],
          features: processFeatures(fields.features),
          visible: fields.visible !== false,
          displayOrder: fields.displayOrder || 0,
          created_at: entry.sys.createdAt || "",
          updated_at: entry.sys.updatedAt || ""
        };
      } catch (error) {
        console.error(`Error fetching business goal with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}
