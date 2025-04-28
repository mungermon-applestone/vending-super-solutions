
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useToast } from '@/hooks/use-toast';

export interface TechnologyPageContent {
  introTitle: string;
  introDescription?: string;
}

export function useContentfulTechnologyPageContent() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['contentful', 'technologyPageContent'],
    queryFn: async () => {
      try {
        console.log('[useContentfulTechnologyPageContent] Fetching page content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'technologyPageContent',
          limit: 1
        });

        console.log('[useContentfulTechnologyPageContent] Raw response:', entries);
        
        if (!entries.items.length) {
          console.warn('[useContentfulTechnologyPageContent] No content found');
          return null;
        }

        const fields = entries.items[0].fields as any;
        return {
          introTitle: fields.introTitle || '',
          introDescription: fields.introDescription || '',
        };
      } catch (error) {
        console.error('[useContentfulTechnologyPageContent] Error:', error);
        toast({
          title: "Error loading page content",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2
  });
}
