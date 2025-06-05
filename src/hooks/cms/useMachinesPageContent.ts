
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

interface MachinesPageContent {
  introTitle: string;
  introDescription: string;
  machineTypesTitle: string;
  machineTypesDescription: string;
  customMachineCtaTitle?: string;
  customMachineCtaDescription?: string;
  customMachineButtonText?: string;
  customMachineButtonUrl?: string;
  navigationLinkText: string;
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

export function useMachinesPageContent() {
  return useQuery({
    queryKey: ['contentful', 'machinesPageContent'],
    queryFn: async () => {
      try {
        console.log('[useMachinesPageContent] Fetching page content');
        const client = await getContentfulClient();
        const entries = await client.getEntries({
          content_type: 'machinesPageContent',
          limit: 1
        });
        
        if (!entries.items[0]) {
          return null;
        }

        const fields = entries.items[0].fields;
        console.log('[useMachinesPageContent] Content fields:', fields);
        
        return {
          introTitle: fields.introTitle as string,
          introDescription: fields.introDescription as string,
          machineTypesTitle: fields.machineTypesTitle as string,
          machineTypesDescription: fields.machineTypesDescription as string,
          customMachineCtaTitle: fields.customMachineCtaTitle as string,
          customMachineCtaDescription: fields.customMachineCtaDescription as string,
          customMachineButtonText: fields.customMachineButtonText as string,
          customMachineButtonUrl: fields.customMachineButtonUrl as string,
          navigationLinkText: fields.navigationLinkText as string,
          // Extract hero-related fields
          heroTitle: fields.heroTitle as string,
          heroDescription: fields.heroDescription as string,
          heroImage: fields.heroImage,
          heroPrimaryButtonText: fields.heroPrimaryButtonText as string,
          heroPrimaryButtonUrl: fields.heroPrimaryButtonUrl as string,
          heroSecondaryButtonText: fields.heroSecondaryButtonText as string,
          heroSecondaryButtonUrl: fields.heroSecondaryButtonUrl as string,
        } as MachinesPageContent;
      } catch (error) {
        console.error('[useMachinesPageContent] Error:', error);
        return null;
      }
    }
  });
}

export type { MachinesPageContent };
