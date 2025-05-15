
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
      console.log('[useFeaturedProducts] Fetching featured products for homepage');
      
      const products = await fetchProductTypes({
        showOnHomepage: true,
        sort: 'fields.homepageOrder'
      });
      
      // Sort products by homepageOrder if available
      const sortedProducts = [...products].sort((a, b) => {
        const orderA = a.homepageOrder !== undefined ? a.homepageOrder : 999;
        const orderB = b.homepageOrder !== undefined ? b.homepageOrder : 999;
        return orderA - orderB;
      });
      
      console.log(`[useFeaturedProducts] Fetched ${sortedProducts.length} products for homepage`);
      
      if (sortedProducts.length > 0) {
        console.log('[useFeaturedProducts] First product:', {
          title: sortedProducts[0]?.title,
          slug: sortedProducts[0]?.slug,
          homepageOrder: sortedProducts[0]?.homepageOrder
        });
      } else {
        console.log('[useFeaturedProducts] No featured products found');
      }
      
      return sortedProducts;
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
