
import { useQuery } from "@tanstack/react-query";
import { CMSTechnology } from "@/types/cms";
import { contentfulTechnologyAdapter } from "@/services/cms/adapters/technologies/contentfulTechnologyAdapter";
import { handleCMSError } from "@/services/cms/utils/errorHandling";

/**
 * Hook for fetching all technologies from Contentful
 * 
 * @param options - Query options like filters, pagination, etc.
 * @returns Query result with technologies array
 */
export const useContentfulTechnologies = (options?: {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
}) => {
  return useQuery({
    queryKey: ["contentful", "technologies"],
    queryFn: async () => {
      try {
        const technologies = await contentfulTechnologyAdapter.getAll({});
        return technologies;
      } catch (error) {
        console.error("[useContentfulTechnologies] Error fetching technologies:", error);
        throw handleCMSError(error, "Technologies");
      }
    },
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime || 1000 * 60 * 5, // 5 minutes
    refetchInterval: options?.refetchInterval || false,
  });
};
