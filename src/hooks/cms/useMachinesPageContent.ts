
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
}

export function useMachinesPageContent() {
  return useQuery({
    queryKey: ['contentful', 'machinesPageContent'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entries = await client.getEntries({
        content_type: 'machinesPageContent',
        limit: 1
      });
      
      if (!entries.items[0]) {
        return null;
      }

      const fields = entries.items[0].fields;
      
      return {
        introTitle: fields.introTitle as string,
        introDescription: fields.introDescription as string,
        machineTypesTitle: fields.machineTypesTitle as string,
        machineTypesDescription: fields.machineTypesDescription as string,
        customMachineCtaTitle: fields.customMachineCtaTitle as string,
        customMachineCtaDescription: fields.customMachineCtaDescription as string,
        customMachineButtonText: fields.customMachineButtonText as string,
        customMachineButtonUrl: fields.customMachineButtonUrl as string,
      } as MachinesPageContent;
    }
  });
}
