
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/contentful/client';
import { HomePageContent } from '@/types/homePageContent';
import { ContentfulHomepage, ContentfulHomepageFields } from '@/types/contentful/homepage';

export function useHomePageContent() {
  return useQuery({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      try {
        console.log('Fetching home page content from Contentful');
        
        const homepageResponse = await fetchContentfulEntries<ContentfulHomepage>('homepage', {
          include: 3, // Include linked entries 3 levels deep
          limit: 1
        });
        
        const items = homepageResponse.items || [];
        if (!items || items.length === 0) {
          console.warn('No homepage entries found in Contentful');
          return null;
        }
        
        const homepage = items[0];
        console.log('Found homepage entry:', homepage);
        
        const fields = homepage?.fields || {};
        
        // Get featured machines
        const featuredMachinesResponse = await fetchContentfulEntries('machine', {
          'fields.featuredOnHomepage': true,
          include: 2
        });
        
        const featuredMachines = featuredMachinesResponse.items || [];
        console.log(`Found ${featuredMachines.length} featured machines`);
        
        // Get featured business goals
        const businessGoalsResponse = await fetchContentfulEntries('businessGoal', {
          'fields.featuredOnHomepage': true,
          include: 2
        });
        
        const businessGoals = businessGoalsResponse.items || [];
        console.log(`Found ${businessGoals.length} business goals`);
        
        // Transform data to match our app's expected format
        return {
          headline: fields.headline || 'Innovative Vending Machine Solutions',
          subheading: fields.subheading || 'Smart vending machines and software to grow your business',
          imageUrl: fields.heroImage?.fields?.file?.url 
            ? `https:${fields.heroImage.fields.file.url}`
            : '/images/home-hero.webp',
          imageAlt: fields.heroImage?.fields?.title || 'Vending machines',
          featuredMachines,
          businessGoals,
          
          // CTA section fields
          ctaTitle: fields.ctaTitle || 'Ready to Modernize Your Vending Business?',
          ctaText: fields.ctaText || 'Get in touch with our team to learn how our solutions can help you grow.',
          ctaButtonText: fields.ctaButtonText || 'Contact Us',
          ctaButtonUrl: fields.ctaButtonUrl || '/contact',
          
          // Additional fields for other sections
          businessGoalsTitle: fields.businessGoalsTitle || 'Business Goals We Help You Achieve',
          businessGoalsDescription: fields.businessGoalsDescription || 'Tailored solutions to meet your specific business objectives.',
          productCategoriesTitle: fields.productCategoriesTitle || 'Product Categories',
          productCategoriesDescription: fields.productCategoriesDescription || 'Explore our range of products designed for various vending applications.',
          availableMachines: fields.availableMachines || 'Available Machines',
          availableMachinesDescription: fields.availableMachinesDescription || 'Explore our range of cutting-edge vending machines compatible with our software solution.',

          // Map the CTA section fields to the expected names
          ctaSectionTitle: fields.ctaSectionTitle || fields.ctaTitle || 'Ready to Transform Your Vending Operations?',
          ctaSectionDescription: fields.ctaSectionDescription || fields.ctaText || 'Get started with our platform today and see the difference in your operations.',
          ctaPrimaryButtonText: fields.ctaPrimaryButtonText || fields.ctaButtonText || 'Request a Demo',
          ctaPrimaryButtonUrl: fields.ctaPrimaryButtonUrl || fields.ctaButtonUrl || '/contact',
          ctaSecondaryButtonText: fields.ctaSecondaryButtonText || 'Learn More',
          ctaSecondaryButtonUrl: fields.ctaSecondaryButtonUrl || '/products',
        };
      } catch (error) {
        console.error('Error fetching home page content:', error);
        return null;
      }
    },
  });
}

export default useHomePageContent;
