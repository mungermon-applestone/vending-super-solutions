
// Import the data directly from our existing business goals data
import { businessGoalsData } from '@/data/businessGoalsData';

// Export the default business goals data - this will be used as a fallback when Contentful is not available
export { businessGoalsData };

// Define the BusinessGoal type to match our CMS Business Goal
export interface BusinessGoal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  benefits?: string[];
  visible?: boolean;
  image?: {
    url: string;
    alt?: string;
  };
}
