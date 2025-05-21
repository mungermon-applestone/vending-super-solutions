
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  slideOrder: number;
  image: {
    url: string;
    alt: string;
  };
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
  slideTransitionEffect?: string;
  slideDuration?: number;
}

export function useHeroSlides(sliderId: string = 'home-slider') {
  return useQuery({
    queryKey: ['contentful', 'hero-slides', sliderId],
    queryFn: async () => {
      console.log(`[useHeroSlides] Fetching slides for slider: ${sliderId}`);
      
      if (!isContentfulConfigured()) {
        console.error(`[useHeroSlides] Contentful is not configured properly`);
        toast.error('Failed to load hero slides - check Contentful configuration');
        throw new Error('CONTENTFUL_CONFIG_MISSING');
      }
      
      try {
        const client = await getContentfulClient(true);
        
        if (!client) {
          console.error(`[useHeroSlides] Failed to get Contentful client`);
          throw new Error('Failed to initialize Contentful client');
        }
        
        console.log(`[useHeroSlides] Querying entries with slider ID: ${sliderId}`);
        
        const entries = await client.getEntries({
          content_type: 'heroContent',
          'fields.pageKey': sliderId,
          include: 2,
          order: 'fields.slideOrder'
        });
        
        console.log(`[useHeroSlides] Query results for slider ${sliderId}:`, {
          total: entries.total,
          hasItems: entries.items.length > 0
        });
        
        if (entries.items.length === 0) {
          console.warn(`[useHeroSlides] No slides found for slider ID: ${sliderId}`);
          return [];
        }
        
        const slides = entries.items.map(entry => {
          const image = entry.fields.image;
          const imageUrl = image && (image as any).fields && (image as any).fields.file 
            ? `https:${(image as any).fields.file.url}`
            : null;
          
          return {
            id: entry.sys.id,
            title: entry.fields.title as string,
            subtitle: entry.fields.subtitle as string,
            slideOrder: entry.fields.slideOrder as number || 0,
            image: {
              url: imageUrl,
              alt: entry.fields.imageAlt as string || entry.fields.title as string
            },
            primaryButtonText: entry.fields.primaryButtonText as string,
            primaryButtonUrl: entry.fields.primaryButtonUrl as string,
            secondaryButtonText: entry.fields.secondaryButtonText as string,
            secondaryButtonUrl: entry.fields.secondaryButtonUrl as string,
            backgroundClass: entry.fields.backgroundClass as string,
            slideTransitionEffect: entry.fields.slideTransitionEffect as string,
            slideDuration: entry.fields.slideDuration as number || 5
          } as HeroSlide;
        });
        
        // Sort by slideOrder explicitly (just in case the API sorting doesn't work)
        const sortedSlides = slides.sort((a, b) => a.slideOrder - b.slideOrder);
        
        console.log(`[useHeroSlides] Returning ${sortedSlides.length} slides`);
        return sortedSlides;
      } catch (error) {
        console.error(`[useHeroSlides] Error fetching hero slides:`, error);
        toast.error('Failed to load hero slides from Contentful');
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default useHeroSlides;
