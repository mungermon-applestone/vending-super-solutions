
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useToast } from '@/hooks/use-toast';
import { CMSTechnologySection } from '@/types/cms';

export function useContentfulTechnologySections() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['contentful', 'technologySections'],
    queryFn: async () => {
      try {
        console.log('[useContentfulTechnologySections] Fetching sections');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'technologySection',
          order: 'fields.displayOrder'
        });

        console.log('[useContentfulTechnologySections] Raw response:', entries);

        if (!entries.items.length) {
          console.warn('[useContentfulTechnologySections] No sections found');
          return [];
        }

        return entries.items.map(entry => {
          const fields = entry.fields as any;
          return {
            id: entry.sys.id,
            title: fields.title,
            summary: fields.summary,
            bulletPoints: fields.bulletPoints || [],
            sectionImage: fields.sectionImage ? {
              url: `https:${fields.sectionImage.fields.file.url}`,
              alt: fields.title
            } : undefined,
            display_order: fields.displayOrder || 0
          } as CMSTechnologySection;
        });
      } catch (error) {
        console.error('[useContentfulTechnologySections] Error:', error);
        toast({
          title: "Error loading technology sections",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2
  });
}
