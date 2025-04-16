
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulHeroContent, HeroContentData } from '@/types/contentfulHero';

/**
 * Transforms the Contentful Hero Content to a more usable format
 */
export const transformHeroContent = (entry: ContentfulHeroContent): HeroContentData => {
  return {
    id: entry.sys.id,
    title: entry.fields.title,
    subtitle: entry.fields.subtitle,
    pageKey: entry.fields.pageKey,
    image: {
      url: entry.fields.image?.fields?.file?.url 
        ? `https:${entry.fields.image.fields.file.url}`
        : '',
      alt: entry.fields.imageAlt || entry.fields.title
    },
    primaryButtonText: entry.fields.primaryButtonText,
    primaryButtonUrl: entry.fields.primaryButtonUrl,
    secondaryButtonText: entry.fields.secondaryButtonText,
    secondaryButtonUrl: entry.fields.secondaryButtonUrl,
    backgroundClass: entry.fields.backgroundClass
  };
};

/**
 * Hook to fetch all hero content entries from Contentful
 */
export const useContentfulHeroes = () => {
  return useQuery({
    queryKey: ['contentful', 'heroes'],
    queryFn: async () => {
      const entries = await fetchContentfulEntries<ContentfulHeroContent>('heroContent');
      
      return entries.map(transformHeroContent);
    }
  });
};

/**
 * Hook to fetch hero content for a specific page from Contentful
 */
export const useContentfulHeroByKey = (pageKey: string) => {
  return useQuery({
    queryKey: ['contentful', 'hero', pageKey],
    queryFn: async () => {
      const entries = await fetchContentfulEntries<ContentfulHeroContent>('heroContent', {
        'fields.pageKey': pageKey
      });
      
      if (entries.length === 0) {
        return null;
      }
      
      return transformHeroContent(entries[0]);
    }
  });
};
