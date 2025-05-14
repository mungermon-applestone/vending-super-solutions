
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';

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

// Helper function to safely convert values to strings
function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
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

        // Extract heroImage URL with proper type checking
        let heroImageUrl = '';
        if (fields.heroImage && isContentfulAsset(fields.heroImage)) {
          heroImageUrl = `https:${fields.heroImage.fields.file.url}`;
        }

        // Convert Contentful data to our expected format with safe string conversions
        const content: HomePageContent = {
          id: entry.sys.id,
          title: safeString(fields.title) || 'Home',
          heroHeadline: safeString(fields.heroHeadline) || 'Smart Vending Solutions',
          heroSubheading: safeString(fields.heroSubheading) || 'Discover our advanced vending technology',
          heroCTAText: safeString(fields.heroCTAText) || 'Get Started',
          heroCTALink: safeString(fields.heroCTALink) || '/contact',
          heroImage: heroImageUrl,
          featuredProductsTitle: safeString(fields.featuredProductsTitle) || 'Our Products',
          featuredProductsSubtitle: safeString(fields.featuredProductsSubtitle) || 'Discover our product categories',
          featuredMachinesTitle: safeString(fields.featuredMachinesTitle) || 'Our Machines',
          featuredMachinesSubtitle: safeString(fields.featuredMachinesSubtitle) || 'Explore our vending machines',
          testimonialsSectionTitle: safeString(fields.testimonialsSectionTitle) || 'What Our Customers Say',
          testimonialsSectionSubtitle: safeString(fields.testimonialsSectionSubtitle) || 'Hear from our satisfied clients',
          businessGoalsTitle: safeString(fields.businessGoalsTitle) || 'Business Goals',
          businessGoalsDescription: safeString(fields.businessGoalsDescription) || 'How we can help you achieve your business goals',
          ctaSectionTitle: safeString(fields.ctaSectionTitle) || 'Ready to Get Started?',
          ctaSectionDescription: safeString(fields.ctaSectionDescription) || 'Contact us today to learn more about our solutions',
          ctaPrimaryButtonText: safeString(fields.ctaPrimaryButtonText) || 'Contact Us',
          ctaPrimaryButtonUrl: safeString(fields.ctaPrimaryButtonUrl) || '/contact',
          ctaSecondaryButtonText: safeString(fields.ctaSecondaryButtonText) || 'Learn More',
          ctaSecondaryButtonUrl: safeString(fields.ctaSecondaryButtonUrl) || '/about',
          availableMachines: safeString(fields.availableMachines) || 'Available Machines',
          availableMachinesDescription: safeString(fields.availableMachinesDescription) || 'Explore our range of vending machines'
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
