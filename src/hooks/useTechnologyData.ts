
import { useQuery } from '@tanstack/react-query';
import { fetchTechnologyBySlug, fetchTechnologies } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';

/**
 * Hook to fetch all technologies
 */
export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: fetchTechnologies,
  });
}

/**
 * Hook to fetch a specific technology by slug
 */
export function useTechnology(slug: string | undefined) {
  return useQuery({
    queryKey: ['technology', slug],
    queryFn: () => fetchTechnologyBySlug(slug || 'enterprise-platform'),
    enabled: !!slug || true, // Always fetch the default technology if no slug provided
  });
}
