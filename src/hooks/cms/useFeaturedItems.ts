
import { useQuery } from '@tanstack/react-query';
import { businessGoalOperations } from '@/services/cms/contentTypes/businessGoals';
import { fetchMachines } from '@/services/cms/contentTypes/machines/api';
import { CMSBusinessGoal, CMSMachine } from '@/types/cms';

/**
 * Hook to fetch items for homepage display
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
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['homepage', 'products'],
    queryFn: async () => {
      console.log('[useFeaturedProducts] Mock: Would fetch featured products');
      // Return empty array for mock implementation
      return [];
    },
    staleTime: 60000, // 1 minute before refetching
    meta: {
      onError: (error: Error) => {
        console.error('[useFeaturedProducts] Error fetching featured products:', error);
      }
    }
  });
}

/**
 * Hook to fetch featured machines for homepage
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
