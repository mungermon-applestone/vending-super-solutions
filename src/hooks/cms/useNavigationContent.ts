
import { useBusinessGoalsPageContent } from './useBusinessGoalsPageContent';
import { useMachinesPageContent } from './useMachinesPageContent';
import { useProductsPageContent } from './useProductsPageContent';
import { useContentfulTechnologyPageContent } from './useContentfulTechnologyPageContent';
import { useContactPageContent } from './useContactPageContent';
import { useBlogPageContent } from './useBlogPageContent';
import { useAboutPageContent } from './useAboutPageContent';

export interface NavigationContent {
  products: string;
  machines: string;
  businessGoals: string;
  technology: string;
  blog: string;
  about: string;
  contact: string;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Central hook that aggregates navigation link text from all page content types
 * Provides fallback text if any content fails to load
 */
export function useNavigationContent(): NavigationContent {
  const { data: businessGoalsData, isLoading: businessGoalsLoading } = useBusinessGoalsPageContent();
  const { data: machinesData, isLoading: machinesLoading } = useMachinesPageContent();
  const { data: productsData, isLoading: productsLoading } = useProductsPageContent();
  const { data: technologyData, isLoading: technologyLoading } = useContentfulTechnologyPageContent();
  const { data: contactData, isLoading: contactLoading } = useContactPageContent();
  const { data: blogData, isLoading: blogLoading } = useBlogPageContent();
  const { data: aboutData, isLoading: aboutLoading } = useAboutPageContent();

  const isLoading = businessGoalsLoading || machinesLoading || productsLoading || 
                   technologyLoading || contactLoading || blogLoading || aboutLoading;

  const hasError = !businessGoalsData && !machinesData && !productsData && 
                   !technologyData && !contactData && !blogData && !aboutData;

  return {
    products: productsData?.navigationLinkText || 'Sell Any Product',
    machines: machinesData?.navigationLinkText || 'Machines and Lockers',
    businessGoals: businessGoalsData?.navigationLinkText || 'Business Goals',
    technology: technologyData?.navigationLinkText || 'Technology',
    blog: blogData?.navigationLinkText || 'Updates',
    about: aboutData?.navigationLinkText || 'About',
    contact: contactData?.navigationLinkText || 'Contact',
    isLoading,
    hasError
  };
}
