import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

export interface HeroContentImage {
  url: string;
  alt: string;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
  image?: HeroContentImage;
  ctaType?: string;
}

// Fallback data for when Contentful is not available
const fallbackHeroContent: Record<string, HeroContent> = {
  home: {
    id: 'fallback-home',
    title: 'Vend Anything You Sell',
    subtitle: 'Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.',
    primaryButtonText: 'Request a Demo',
    primaryButtonUrl: '/contact',
    secondaryButtonText: 'Explore Solutions',
    secondaryButtonUrl: '/products',
    image: {
      url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      alt: 'Advanced Vending Machine Interface'
    }
  },
  machines: {
    id: 'fallback-machines',
    title: 'Advanced Vending Machines',
    subtitle: 'Our machines combine cutting-edge technology with reliable performance to meet your business needs.',
    primaryButtonText: 'Request Info',
    primaryButtonUrl: '/contact',
    secondaryButtonText: 'View All',
    secondaryButtonUrl: '/machines',
    image: {
      url: 'https://images.unsplash.com/photo-1562184552-997c461abbe6',
      alt: 'Modern Vending Machine'
    }
  }
};

export const useHeroContent = (key: string) => {
  return useQuery({
    queryKey: ['heroContent', key],
    queryFn: async () => {
      try {
        console.log(`[useHeroContent] Fetching hero content for key: ${key}`);
        
        // Check if key is a direct content ID
        if (key && key.length > 10) {
          console.log(`[useHeroContent] Key appears to be an entry ID: ${key}`);
          const client = getContentfulClient();
          
          if (!client) {
            throw new Error('Could not initialize Contentful client');
          }
          
          // Fetch entry by ID
          const entry = await client.getEntry(key);
          
          if (!entry || !entry.fields) {
            throw new Error('HERO_CONTENT_NOT_FOUND');
          }
          
          const heroContent: HeroContent = {
            id: entry.sys.id,
            title: entry.fields.title?.toString() || '',
            subtitle: entry.fields.subtitle?.toString() || '',
            primaryButtonText: entry.fields.primaryButtonText?.toString(),
            primaryButtonUrl: entry.fields.primaryButtonUrl?.toString(),
            secondaryButtonText: entry.fields.secondaryButtonText?.toString(),
            secondaryButtonUrl: entry.fields.secondaryButtonUrl?.toString(),
            backgroundClass: entry.fields.backgroundClass?.toString()
          };
          
          // Get image if available
          if (entry.fields.image) {
            const imageEntry = entry.fields.image;
            if (imageEntry.fields && imageEntry.fields.file) {
              heroContent.image = {
                url: `https:${imageEntry.fields.file.url}`,
                alt: imageEntry.fields.title || heroContent.title || 'Hero Image'
              };
            }
          }
          
          return heroContent;
        }
        
        // For all other cases, fall back to using the predefined content
        return fallbackHeroContent[key] || {
          id: 'fallback-generic',
          title: 'Welcome to Our Platform',
          subtitle: 'Discover our innovative solutions designed to help your business grow.',
          image: {
            url: 'https://images.unsplash.com/photo-1562184552-997c461abbe6',
            alt: 'Platform Overview'
          }
        };
      } catch (error) {
        console.error(`[useHeroContent] Error fetching hero content for key "${key}":`, error);
        
        // If this is a known fallback key, use it
        if (fallbackHeroContent[key]) {
          console.log(`[useHeroContent] Using fallback content for key: ${key}`);
          return fallbackHeroContent[key];
        }
        
        // Otherwise re-throw for handling up the chain
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useHeroContent;
