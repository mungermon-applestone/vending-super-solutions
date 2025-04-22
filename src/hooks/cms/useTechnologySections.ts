
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSTechnologySection } from '@/types/cms';

interface TechnologySection {
  id: string;
  title: string;
  summary: string;
  bulletPoints: string[];
  sectionImage: {
    url: string;
    alt: string;
  };
  displayOrder: number;
}

export function useTechnologySections() {
  return useQuery({
    queryKey: ['contentful', 'technologySections'],
    queryFn: async () => {
      console.log('[useTechnologySections] Fetching technology sections');
      try {
        const client = await getContentfulClient();
        const entries = await client.getEntries({
          content_type: 'technologySection',
          order: ['fields.displayOrder'] // This is the correct format for ordering
        });
        
        return entries.items.map(entry => {
          const sectionImage = entry.fields.sectionImage as any;
          return {
            id: entry.sys.id,
            title: entry.fields.title as string,
            summary: entry.fields.summary as string,
            bulletPoints: entry.fields.bulletPoints as string[] || [],
            sectionImage: {
              url: sectionImage?.fields?.file?.url ? `https:${sectionImage.fields.file.url}` : '',
              alt: entry.fields.title as string
            },
            displayOrder: entry.fields.displayOrder as number || 0
          } as TechnologySection;
        });
      } catch (error) {
        console.error('[useTechnologySections] Error fetching technology sections:', error);
        return [];
      }
    }
  });
}
