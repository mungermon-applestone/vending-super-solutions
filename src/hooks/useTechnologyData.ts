
import { useQuery } from '@tanstack/react-query';
import { getTechnologyBySlug } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';

export const useTechnologyData = (slug: string) => {
  const {
    data: technology,
    isLoading,
    isError,
    error
  } = useQuery<CMSTechnology | null, Error>({
    queryKey: ['technology', slug],
    queryFn: () => getTechnologyBySlug(slug),
    enabled: !!slug && slug.trim() !== '',
  });

  return {
    technology,
    isLoading: isLoading && !!slug && slug.trim() !== '',
    isError,
    error,
  };
};
