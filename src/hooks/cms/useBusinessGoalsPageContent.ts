
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { Entry, EntryCollection } from 'contentful';

interface BusinessGoalsPageContent {
  introTitle: string;
  introDescription: string;
  customSolutionTitle?: string;
  customSolutionDescription?: string;
  customSolutionButtonText?: string;
  customSolutionButtonUrl?: string;
  goalsSectionTitle?: string;
  goalsSectionDescription?: string;
  keyBenefitsTitle?: string;
  keyBenefitsDescription?: string;
  keyBenefits?: string[];
  testimonialsSectionTitle?: string;
  testimonialsSectionDescription?: string;
  inquiryBulletPoints?: string[];
  // New hero-related fields
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: {
    fields: {
      file: {
        url: string;
      };
      title?: string;
      description?: string;
    };
  };
  heroPrimaryButtonText?: string;
  heroPrimaryButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonUrl?: string;
}

export function useBusinessGoalsPageContent(contentId?: string) {
  return useQuery({
    queryKey: ['contentful', 'businessGoalsPageContent', contentId],
    queryFn: async () => {
      try {
        console.log('[useBusinessGoalsPageContent] Fetching content');
        const client = await getContentfulClient();
        
        let entry;
        if (contentId) {
          entry = await client.getEntry(contentId);
        } else {
          const response = await client.getEntries({
            content_type: 'businessGoalsPageContent',
            limit: 1
          });
          entry = response.items[0];
        }
        
        if (!entry) {
          console.warn('[useBusinessGoalsPageContent] No content found');
          return null;
        }

        const fields = entry.fields;
        
        console.log('[useBusinessGoalsPageContent] Content retrieved:', fields);
        
        return {
          introTitle: fields.introTitle as string,
          introDescription: fields.introDescription as string,
          customSolutionTitle: fields.customSolutionTitle as string,
          customSolutionDescription: fields.customSolutionDescription as string,
          customSolutionButtonText: fields.customSolutionButtonText as string,
          customSolutionButtonUrl: fields.customSolutionButtonUrl as string,
          goalsSectionTitle: fields.goalsSectionTitle as string,
          goalsSectionDescription: fields.goalsSectionDescription as string,
          keyBenefitsTitle: fields.keyBenefitsTitle as string,
          keyBenefitsDescription: fields.keyBenefitsDescription as string,
          keyBenefits: fields.keyBenefits as string[],
          testimonialsSectionTitle: fields.testimonialsSectionTitle as string,
          testimonialsSectionDescription: fields.testimonialsSectionDescription as string,
          inquiryBulletPoints: fields.inquiryBulletPoints as string[],
          // Extract hero-related fields
          heroTitle: fields.heroTitle as string,
          heroDescription: fields.heroDescription as string,
          heroImage: fields.heroImage,
          heroPrimaryButtonText: fields.heroPrimaryButtonText as string,
          heroPrimaryButtonUrl: fields.heroPrimaryButtonUrl as string,
          heroSecondaryButtonText: fields.heroSecondaryButtonText as string,
          heroSecondaryButtonUrl: fields.heroSecondaryButtonUrl as string
        } as BusinessGoalsPageContent;
      } catch (error) {
        console.error('[useBusinessGoalsPageContent] Error:', error);
        return null;
      }
    },
    enabled: true
  });
}

export type { BusinessGoalsPageContent };
