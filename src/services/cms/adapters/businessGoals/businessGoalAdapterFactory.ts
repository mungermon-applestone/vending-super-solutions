
import { CMSBusinessGoal } from '@/types/cms';

// Define BusinessGoalAdapter interface
export interface BusinessGoalAdapter {
  getAll: () => Promise<CMSBusinessGoal[]>;
  getBySlug: (slug: string) => Promise<CMSBusinessGoal | null>;
}

/**
 * Factory function to create a business goal adapter
 */
export const createBusinessGoalAdapter = (): BusinessGoalAdapter => {
  // Return a simple adapter with mock data
  return {
    getAll: async () => {
      console.log("Getting all business goals");
      return [];
    },
    getBySlug: async (slug: string) => {
      console.log(`Getting business goal by slug: ${slug}`);
      return null;
    }
  };
};
