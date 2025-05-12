
import { useQuery } from '@tanstack/react-query';
import { businessGoalOperations } from '@/services/cms/contentTypes/businessGoals';
import { fetchMachines } from '@/services/cms/contentTypes/machines/api';
import { CMSBusinessGoal, CMSMachine } from '@/types/cms';
import { useContentfulProducts } from './useContentfulProducts';

/**
 * Hook to fetch items for homepage display
 * 
 * @remarks
 * CRITICAL PATH: This hook powers the homepage content display.
 * Modifications can cause homepage sections to break.
 */
export function useHomepageItems() {
  // Fetch featured products
  const { 
    data: featuredProducts, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useQuery({
    queryKey: ['homepage', 'products'],
    queryFn: async () => {
      // For mock implementation, just return an empty array
      console.log(`[useHomepageItems] Mock: Would fetch featured products`);
      return [];
    }
  });
  
  // Fetch featured machines
  const { 
    data: featuredMachines, 
    isLoading: isLoadingMachines, 
    error: machinesError 
  } = useQuery({
    queryKey: ['homepage', 'machines'],
    queryFn: async () => {
      const machines = await fetchMachines();
      
      console.log(`[useHomepageItems] Fetched ${machines.length} featured machines`);
      return machines as CMSMachine[];
    }
  });
  
  // Fetch featured business goals
  const { 
    data: featuredGoals, 
    isLoading: isLoadingGoals, 
    error: goalsError 
  } = useQuery({
    queryKey: ['homepage', 'businessGoals'],
    queryFn: async () => {
      const goals = await businessGoalOperations.fetchAll();
      
      console.log(`[useHomepageItems] Fetched ${goals.length} featured business goals`);
      return goals;
    }
  });
  
  return {
    featuredProducts: featuredProducts || [],
    featuredMachines: featuredMachines || [],
    featuredGoals: featuredGoals || [],
    isLoading: isLoadingProducts || isLoadingMachines || isLoadingGoals,
    error: productsError || machinesError || goalsError
  };
}

/**
 * Hook to fetch featured products for homepage
 * 
 * @remarks
 * CRITICAL PATH: This hook is used by the homepage to display product cards.
 * The implementation must return properly formatted product data with valid links.
 * 
 * Previously returned an empty array, which broke product cards on homepage.
 * Now uses useContentfulProducts() to ensure consistent data.
 */
export function useFeaturedProducts() {
  // Use the Contentful products hook instead of returning an empty array
  // This will fetch real data from Contentful and ensure proper links
  return useContentfulProducts();
}

/**
 * Hook to fetch featured machines for homepage
 * 
 * @remarks
 * CRITICAL PATH: This hook is used by the homepage to display machine cards.
 */
export function useFeaturedMachines() {
  return useQuery({
    queryKey: ['homepage', 'machines'],
    queryFn: async () => {
      const machines = await fetchMachines({
        // We would filter by showOnHomepage in a real implementation
      });
      return machines as CMSMachine[];
    }
  });
}

/**
 * Hook to fetch featured business goals for homepage
 * 
 * @remarks
 * CRITICAL PATH: This hook is used by the homepage to display business goal cards.
 */
export function useFeaturedBusinessGoals() {
  return useQuery({
    queryKey: ['homepage', 'businessGoals'],
    queryFn: async () => {
      const goals = await businessGoalOperations.fetchAll();
      return goals;
    }
  });
}
