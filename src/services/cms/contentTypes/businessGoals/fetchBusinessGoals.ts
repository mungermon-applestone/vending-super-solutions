
import { CMSBusinessGoal } from '@/types/cms';
import { handleCMSError } from '@/services/cms/utils/errorHandling';

// Mock business goal data
const mockBusinessGoals: CMSBusinessGoal[] = [
  {
    id: 'bg-001',
    title: 'Increase Sales',
    slug: 'increase-sales',
    description: 'Boost your revenue with advanced retail solutions',
    icon: 'trending-up',
    features: [
      {
        id: 'feat-001',
        title: 'Smart Inventory Management',
        description: 'Track stock levels in real-time'
      },
      {
        id: 'feat-002',
        title: 'Customer Analytics',
        description: 'Understand buying patterns'
      }
    ],
    benefits: [
      {
        id: 'ben-001',
        title: 'Higher Conversion Rate',
        description: 'Convert more browsers into buyers'
      }
    ]
  },
  {
    id: 'bg-002',
    title: 'Optimize Operations',
    slug: 'optimize-operations',
    description: 'Streamline your business processes',
    icon: 'settings',
    features: [
      {
        id: 'feat-003',
        title: 'Workflow Automation',
        description: 'Reduce manual tasks'
      }
    ],
    benefits: [
      {
        id: 'ben-002',
        title: 'Reduced Costs',
        description: 'Lower operational expenses'
      }
    ]
  }
];

/**
 * Fetch all business goals from the CMS
 * @returns Array of business goal data
 */
export const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
  try {
    console.log('[fetchBusinessGoals] Fetching business goals');
    return mockBusinessGoals;
  } catch (error) {
    console.error('[fetchBusinessGoals] Error fetching business goals:', error);
    throw handleCMSError(error, 'fetch', 'BusinessGoal');
  }
};

/**
 * Fetch a single business goal by slug
 * @param slug The slug of the business goal to fetch
 * @returns The business goal data or null if not found
 */
export const fetchBusinessGoalBySlug = async (slug: string): Promise<CMSBusinessGoal | null> => {
  try {
    console.log('[fetchBusinessGoalBySlug] Fetching business goal with slug:', slug);
    
    const businessGoal = mockBusinessGoals.find(goal => goal.slug === slug || goal.id === slug);
    
    if (!businessGoal) {
      console.log('[fetchBusinessGoalBySlug] Business goal not found');
      return null;
    }
    
    return businessGoal;
  } catch (error) {
    console.error('[fetchBusinessGoalBySlug] Error fetching business goal:', error);
    throw handleCMSError(error, 'fetch', 'BusinessGoal');
  }
};
