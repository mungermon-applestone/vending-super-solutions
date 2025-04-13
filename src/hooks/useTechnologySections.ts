
import { useQuery } from '@tanstack/react-query';
import { getCMSProviderConfig, ContentProviderType } from '@/services/cms/providerConfig';
import { fetchTechnologies } from '@/services/cms/technology';
import { CMSTechnology } from '@/types/cms';
import { initCMS } from '@/services/cms/cmsInit';

// Make sure we initialize CMS to use Strapi
initCMS();

export function useTechnologySections() {
  // Query to fetch all technologies
  const { data: technologies = [], isLoading, error } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      console.log('[useTechnologySections] Fetching technologies from CMS');
      try {
        const data = await fetchTechnologies();
        console.log('[useTechnologySections] Fetched technologies:', data);
        return data || [];
      } catch (err) {
        console.error('[useTechnologySections] Error fetching technologies:', err);
        return [];
      }
    }
  });

  return { technologies, isLoading, error };
}

// Hook to fetch a specific technology by slug
export function useTechnologyBySlug(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['technology', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const { fetchTechnologyBySlug } = await import('@/services/cms/technology');
        const technology = await fetchTechnologyBySlug(slug);
        console.log(`[useTechnologyBySlug] Fetched technology with slug "${slug}":`, technology);
        return technology;
      } catch (err) {
        console.error(`[useTechnologyBySlug] Error fetching technology with slug ${slug}:`, err);
        return null;
      }
    },
    enabled: !!slug
  });

  return { technology: data, isLoading, error };
}
