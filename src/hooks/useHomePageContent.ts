
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

export interface HomePageContent {
  id: string;
  title: string;
  heroHeadline: string;
  heroSubheading: string;
  heroCTAText: string;
  heroCTALink: string;
  heroImage: string;
  featuredProductsTitle: string;
  featuredProductsSubtitle: string;
  featuredMachinesTitle: string;
  featuredMachinesSubtitle: string;
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  businessGoalsTitle: string;
  businessGoalsDescription: string;
  ctaSectionTitle: string;
  ctaSectionDescription: string;
  ctaPrimaryButtonText: string;
  ctaPrimaryButtonUrl: string;
  ctaSecondaryButtonText: string;
  ctaSecondaryButtonUrl: string;
  availableMachines: string;
  availableMachinesDescription: string;
}

export function useHomePageContent() {
  return useQuery({
    queryKey: ['contentful', 'homePageContent'],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        const entries = await client.getEntries({
          content_type: 'homePage',
          limit: 1
        });

        if (entries.items.length === 0) {
          console.warn('[useHomePageContent] No home page content found');
          // Return default values as fallback
          return getDefaultHomePageContent();
        }

        const entry = entries.items[0];
        const fields = entry.fields;

        // Convert Contentful data to our expected format
        const content: HomePageContent = {
          id: entry.sys.id,
          title: fields.title || 'Home',
          heroHeadline: fields.heroHeadline || 'Smart Vending Solutions',
          heroSubheading: fields.heroSubheading || 'Discover our advanced vending technology',
          heroCTAText: fields.heroCTAText || 'Get Started',
          heroCTALink: fields.heroCTALink || '/contact',
          heroImage: fields.heroImage?.fields?.file?.url ? `https:${fields.heroImage.fields.file.url}` : '',
          featuredProductsTitle: fields.featuredProductsTitle || 'Our Products',
          featuredProductsSubtitle: fields.featuredProductsSubtitle || 'Discover our product categories',
          featuredMachinesTitle: fields.featuredMachinesTitle || 'Our Machines',
          featuredMachinesSubtitle: fields.featuredMachinesSubtitle || 'Explore our vending machines',
          testimonialsSectionTitle: fields.testimonialsSectionTitle || 'What Our Customers Say',
          testimonialsSectionSubtitle: fields.testimonialsSectionSubtitle || 'Hear from our satisfied clients',
          businessGoalsTitle: fields.businessGoalsTitle || 'Business Goals',
          businessGoalsDescription: fields.businessGoalsDescription || 'How we can help you achieve your business goals',
          ctaSectionTitle: fields.ctaSectionTitle || 'Ready to Get Started?',
          ctaSectionDescription: fields.ctaSectionDescription || 'Contact us today to learn more about our solutions',
          ctaPrimaryButtonText: fields.ctaPrimaryButtonText || 'Contact Us',
          ctaPrimaryButtonUrl: fields.ctaPrimaryButtonUrl || '/contact',
          ctaSecondaryButtonText: fields.ctaSecondaryButtonText || 'Learn More',
          ctaSecondaryButtonUrl: fields.ctaSecondaryButtonUrl || '/about',
          availableMachines: fields.availableMachines || 'Available Machines',
          availableMachinesDescription: fields.availableMachinesDescription || 'Explore our range of vending machines'
        };

        return content;
      } catch (error) {
        console.error('[useHomePageContent] Error fetching home page content:', error);
        toast.error('Failed to load home page content');
        
        // Return default values as fallback
        return getDefaultHomePageContent();
      }
    },
  });
}

function getDefaultHomePageContent(): HomePageContent {
  return {
    id: 'default',
    title: 'Home',
    heroHeadline: 'Smart Vending Solutions',
    heroSubheading: 'Discover our advanced vending technology',
    heroCTAText: 'Get Started',
    heroCTALink: '/contact',
    heroImage: '',
    featuredProductsTitle: 'Our Products',
    featuredProductsSubtitle: 'Discover our product categories',
    featuredMachinesTitle: 'Our Machines',
    featuredMachinesSubtitle: 'Explore our vending machines',
    testimonialsSectionTitle: 'What Our Customers Say',
    testimonialsSectionSubtitle: 'Hear from our satisfied clients',
    businessGoalsTitle: 'Business Goals',
    businessGoalsDescription: 'How we can help you achieve your business goals',
    ctaSectionTitle: 'Ready to Get Started?',
    ctaSectionDescription: 'Contact us today to learn more about our solutions',
    ctaPrimaryButtonText: 'Contact Us',
    ctaPrimaryButtonUrl: '/contact',
    ctaSecondaryButtonText: 'Learn More',
    ctaSecondaryButtonUrl: '/about',
    availableMachines: 'Available Machines',
    availableMachinesDescription: 'Explore our range of vending machines'
  };
}
