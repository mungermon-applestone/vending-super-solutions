
import { useQuery } from '@tanstack/react-query';
import { fetchProductTypes } from '@/services/cms/contentTypes/productTypes/fetchProductTypes';
import { fetchMachines } from '@/services/cms/contentTypes/machines/api';
import { fetchBusinessGoals } from '@/services/cms/contentTypes/businessGoals/fetchBusinessGoals';
import { CMSBusinessGoal, CMSMachine, CMSProductType } from '@/types/cms';

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
      const products = await fetchProductTypes({
        showOnHomepage: true,
        sort: 'fields.homepageOrder'
      });
      
      console.log(`[useHomepageItems] Fetched ${products.length} featured products`);
      return products;
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
      const machines = await fetchMachines({
        showOnHomepage: true,
        sort: 'homepage_order'
      });
      
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
      const goals = await fetchBusinessGoals({
        filters: { showOnHomepage: true },
        sort: 'homepage_order'
      });
      
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
      const products = await fetchProductTypes({
        showOnHomepage: true,
        sort: 'fields.homepageOrder'
      });
      return products;
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
        showOnHomepage: true,
        sort: 'homepage_order'
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
      const goals = await fetchBusinessGoals({
        filters: { showOnHomepage: true },
        sort: 'homepage_order'
      });
      return goals;
    }
  });
}
