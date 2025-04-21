
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

interface HeroContent {
  title: string;
  subtitle: string;
  pageKey: string;
  image: {
    url: string;
    alt: string;
  };
  imageAlt: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}

export function useHeroContent(entryId: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', entryId],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entry = await client.getEntry(entryId);
      
      return {
        title: entry.fields.title as string,
        subtitle: entry.fields.subtitle as string,
        pageKey: entry.fields.pageKey as string,
        image: {
          url: (entry.fields.image as any)?.fields.file.url,
          alt: entry.fields.imageAlt as string
        },
        primaryButtonText: entry.fields.primaryButtonText as string,
        primaryButtonUrl: entry.fields.primaryButtonUrl as string,
        secondaryButtonText: entry.fields.secondaryButtonText as string,
        secondaryButtonUrl: entry.fields.secondaryButtonUrl as string,
        backgroundClass: entry.fields.backgroundClass as string
      } as HeroContent;
    }
  });
}
