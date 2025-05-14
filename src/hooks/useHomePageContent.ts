
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';

export function useHomePageContent() {
  return useQuery({
    queryKey: ['contentful', 'homePage'],
    queryFn: async () => {
      try {
        // Fetch home page content from Contentful
        const entries = await fetchContentfulEntries('homePage');
        
        if (!entries || entries.length === 0) {
          return null;
        }
        
        // Get the first entry
        const homePageEntry = entries[0];
        
        // Transform the content
        return {
          id: homePageEntry.sys.id,
          title: homePageEntry.fields.title || 'Home',
          heroHeadline: homePageEntry.fields.heroHeadline || 'Welcome to our platform',
          heroSubheading: homePageEntry.fields.heroSubheading,
          heroCTAText: homePageEntry.fields.heroCTAText || 'Learn More',
          heroCTALink: homePageEntry.fields.heroCTALink || '/products',
          heroImage: homePageEntry.fields.heroImage?.fields?.file?.url 
            ? `https:${homePageEntry.fields.heroImage.fields.file.url}`
            : undefined,
          featuredProductsTitle: homePageEntry.fields.featuredProductsTitle,
          featuredProductsSubtitle: homePageEntry.fields.featuredProductsSubtitle,
          featuredMachinesTitle: homePageEntry.fields.featuredMachinesTitle,
          featuredMachinesSubtitle: homePageEntry.fields.featuredMachinesSubtitle,
          testimonialsSectionTitle: homePageEntry.fields.testimonialsSectionTitle,
          testimonialsSectionSubtitle: homePageEntry.fields.testimonialsSectionSubtitle
        };
      } catch (error) {
        console.error('Error fetching home page content:', error);
        return null;
      }
    }
  });
}
