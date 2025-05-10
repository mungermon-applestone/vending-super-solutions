
import { CMSBusinessGoal } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';
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
const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
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
const fetchBusinessGoalBySlug = async (slug: string): Promise<CMSBusinessGoal | null> => {
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

/**
 * Clone a business goal - mock implementation
 */
const cloneBusinessGoal = async (id: string): Promise<CMSBusinessGoal | null> => {
  try {
    console.log('[cloneBusinessGoal] Mock cloning business goal with ID:', id);
    
    // Get the original goal by ID
    const originalGoal = await fetchBusinessGoalBySlug(id);
    
    if (!originalGoal) {
      console.error('[cloneBusinessGoal] Business goal not found');
      return null;
    }
    
    // Create a mock cloned goal
    const clonedGoal: CMSBusinessGoal = {
      id: uuidv4(),
      title: `${originalGoal.title} (Clone)`,
      slug: `${originalGoal.slug}-clone-${Date.now()}`,
      description: originalGoal.description,
      icon: originalGoal.icon,
      features: originalGoal.features ? originalGoal.features.map(feature => ({
        id: uuidv4(),
        title: feature.title,
        description: feature.description || ''
      })) : [],
      benefits: originalGoal.benefits ? originalGoal.benefits.map(benefit => ({
        id: uuidv4(),
        title: benefit.title,
        description: benefit.description || ''
      })) : []
    };
    
    console.log('[cloneBusinessGoal] Created cloned business goal:', clonedGoal);
    return clonedGoal;
  } catch (error) {
    console.error('[cloneBusinessGoal] Error cloning business goal:', error);
    throw handleCMSError(error, 'clone', 'BusinessGoal');
  }
};

// Mock create function
const createBusinessGoal = async (data: Partial<CMSBusinessGoal>): Promise<CMSBusinessGoal> => {
  console.log('[createBusinessGoal] Creating new business goal:', data);
  return {
    id: `mock-${Date.now()}`,
    title: data.title || 'New Business Goal',
    slug: data.slug || 'new-business-goal',
    description: data.description || '',
    icon: data.icon || 'activity',
    features: data.features || [],
    benefits: data.benefits || []
  };
};

// Mock update function
const updateBusinessGoal = async (id: string, data: Partial<CMSBusinessGoal>): Promise<CMSBusinessGoal> => {
  console.log('[updateBusinessGoal] Updating business goal:', id, data);
  return {
    id: id,
    title: data.title || 'Updated Business Goal',
    slug: data.slug || 'updated-business-goal',
    description: data.description || '',
    icon: data.icon || 'activity',
    features: data.features || [],
    benefits: data.benefits || []
  };
};

// Mock delete function
const deleteBusinessGoal = async (id: string): Promise<boolean> => {
  console.log('[deleteBusinessGoal] Deleting business goal:', id);
  return true;
};

// Mock fetchById function
const fetchBusinessGoalById = async (id: string): Promise<CMSBusinessGoal | null> => {
  return fetchBusinessGoalBySlug(id);
};

// Export all business goal operations
export const businessGoalOperations = {
  fetchAll: fetchBusinessGoals,
  fetchBySlug: fetchBusinessGoalBySlug,
  fetchById: fetchBusinessGoalById,
  create: createBusinessGoal,
  update: updateBusinessGoal,
  delete: deleteBusinessGoal,
  clone: cloneBusinessGoal
};

// Re-export individual functions for backwards compatibility
export {
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  fetchBusinessGoalById,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal,
  cloneBusinessGoal
};
