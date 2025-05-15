
// This file previously had Supabase references, but we'll remove those
// and implement a simpler fallback implementation for now

import { CMSBusinessGoal } from '@/types/cms';

// Fallback business goals data
const FALLBACK_BUSINESS_GOALS: CMSBusinessGoal[] = [
  {
    id: 'bg-1',
    title: 'Increase Revenue',
    slug: 'increase-revenue',
    description: 'Boost your business revenue with our smart vending solutions',
    visible: true,
    icon: 'trending-up',
    benefits: [
      { id: 'ben-1', text: 'Expand to new locations with minimal overhead' },
      { id: 'ben-2', text: 'Increase sales with 24/7 availability' },
      { id: 'ben-3', text: 'Optimize pricing dynamically' }
    ],
    features: [
      { id: 'feat-1', title: 'Smart Pricing', description: 'Automatically adjust prices based on demand' }
    ]
  },
  {
    id: 'bg-2',
    title: 'Reduce Operating Costs',
    slug: 'reduce-operating-costs',
    description: 'Lower your operational expenses with automated vending',
    visible: true,
    icon: 'trending-down',
    benefits: [
      { id: 'ben-4', text: 'Minimize staffing requirements' },
      { id: 'ben-5', text: 'Reduce overhead with smaller footprint' },
      { id: 'ben-6', text: 'Decrease inventory wastage' }
    ],
    features: [
      { id: 'feat-2', title: 'Inventory Management', description: 'Real-time tracking to prevent stockouts' }
    ]
  }
];

// Mock function to get all business goals
export async function getBusinessGoals(): Promise<CMSBusinessGoal[]> {
  console.log('[businessGoalHelpers] Getting business goals from fallback data');
  return FALLBACK_BUSINESS_GOALS;
}

// Mock function to get a single business goal by slug
export async function getBusinessGoalBySlug(slug: string): Promise<CMSBusinessGoal | null> {
  console.log(`[businessGoalHelpers] Getting business goal by slug: ${slug}`);
  return FALLBACK_BUSINESS_GOALS.find(goal => goal.slug === slug) || null;
}

// Mock function to get visible business goals
export async function getVisibleBusinessGoals(): Promise<CMSBusinessGoal[]> {
  console.log('[businessGoalHelpers] Getting visible business goals');
  return FALLBACK_BUSINESS_GOALS.filter(goal => goal.visible === true);
}

// Mock function to create a business goal
export async function createBusinessGoal(data: Partial<CMSBusinessGoal>): Promise<CMSBusinessGoal> {
  console.log('[businessGoalHelpers] Creating business goal (mock):', data);
  return {
    id: `new-${Date.now()}`,
    title: data.title || 'New Business Goal',
    slug: data.slug || `new-goal-${Date.now()}`,
    description: data.description || '',
    visible: data.visible !== undefined ? data.visible : true,
    benefits: data.benefits || [],
    features: data.features || [],
    icon: data.icon || 'default-icon'
  };
}
