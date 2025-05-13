
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

interface HeroContent {
  title: string;
  subtitle: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
}

const defaultHeroContent: HeroContent = {
  title: 'Smart Vending Management Software',
  subtitle: 'Transforming retail operations with cutting-edge vending solutions',
  buttonText: 'Get Started',
  buttonLink: '/contact',
  backgroundColor: 'bg-gradient-to-r from-blue-600 to-indigo-700'
};

/**
 * Hook to fetch hero content from Contentful
 */
export function useHeroContent(contentType: string = 'homepage') {
  return useQuery({
    queryKey: [`hero-content-${contentType}`],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        if (!client) {
          console.warn('Contentful client not available, using fallback hero content');
          return defaultHeroContent;
        }
        
        const entries = await client.getEntries({
          content_type: 'heroSection',
          'fields.pageType': contentType,
          include: 1
        });
        
        if (entries.items.length === 0) {
          console.warn(`No hero content found for ${contentType}, using fallback`);
          return defaultHeroContent;
        }
        
        const heroEntry = entries.items[0];
        const fields = heroEntry.fields as any;
        
        return {
          title: fields.title || defaultHeroContent.title,
          subtitle: fields.subtitle || defaultHeroContent.subtitle,
          image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : undefined,
          buttonText: fields.buttonText || defaultHeroContent.buttonText,
          buttonLink: fields.buttonLink || defaultHeroContent.buttonLink,
          backgroundColor: fields.backgroundColor || defaultHeroContent.backgroundColor
        };
      } catch (error) {
        console.error('Error fetching hero content:', error);
        return defaultHeroContent;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// For direct access to default hero content
export const getDefaultHeroContent = () => defaultHeroContent;
