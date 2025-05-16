
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/contentful/client';
import { ContentfulHomepage } from '@/types/contentful';

export function useHomePageContent() {
  return useQuery({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      try {
        console.log('Fetching home page content from Contentful');
        
        const homepageResponse = await fetchContentfulEntries('homepage', {
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
        
        return {
          headline: homepage?.fields?.headline || 'Innovative Vending Machine Solutions',
          subheading: homepage?.fields?.subheading || 'Smart vending machines and software to grow your business',
          imageUrl: homepage?.fields?.heroImage?.fields?.file?.url 
            ? `https:${homepage.fields.heroImage.fields.file.url}`
            : '/images/home-hero.webp',
          imageAlt: homepage?.fields?.heroImage?.fields?.title || 'Vending machines',
          featuredMachines,
          businessGoals,
          ctaTitle: homepage?.fields?.ctaTitle || 'Ready to Modernize Your Vending Business?',
          ctaText: homepage?.fields?.ctaText || 'Get in touch with our team to learn how our solutions can help you grow.',
          ctaButtonText: homepage?.fields?.ctaButtonText || 'Contact Us',
          ctaButtonUrl: homepage?.fields?.ctaButtonUrl || '/contact',
        };
      } catch (error) {
        console.error('Error fetching home page content:', error);
        return null;
      }
    },
  });
}

export default useHomePageContent;
