
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

interface BusinessGoalsPageContent {
  introTitle: string;
  introDescription: string;
  customSolutionTitle?: string;
  customSolutionDescription?: string;
  customSolutionButtonText?: string;
  customSolutionButtonUrl?: string;
}

export function useBusinessGoalsPageContent() {
  return useQuery({
    queryKey: ['contentful', 'businessGoalsPageContent'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'businessGoalsPageContent',
        limit: 1
      });
      
      if (!entries.items[0]) {
        return null;
      }

      const fields = entries.items[0].fields;
      
      return {
        introTitle: fields.introTitle as string,
        introDescription: fields.introDescription as string,
        customSolutionTitle: fields.customSolutionTitle as string,
        customSolutionDescription: fields.customSolutionDescription as string,
        customSolutionButtonText: fields.customSolutionButtonText as string,
        customSolutionButtonUrl: fields.customSolutionButtonUrl as string,
      } as BusinessGoalsPageContent;
    }
  });
}
