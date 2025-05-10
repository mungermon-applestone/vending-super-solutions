
/**
 * This file provides mock implementations for business goals operations 
 * that previously interacted with external services or Supabase directly.
 * It's part of the deprecation strategy as we transition to Contentful for content management.
 */

import { v4 as uuidv4 } from 'uuid';
import { CMSBusinessGoal } from '@/types/cms';

// In-memory storage for mocked operations
let mockBusinessGoals: CMSBusinessGoal[] = [];

/**
 * Mock implementation of business goal create operation
 */
export async function mockCreateBusinessGoal(data: any): Promise<string> {
  console.warn('[mockCreateBusinessGoal] This is a mock implementation. Use Contentful for production data.');
  
  // Generate a new ID
  const id = uuidv4();
  
  // Create a new mock business goal
  const newGoal: CMSBusinessGoal = {
    id,
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    icon: data.icon || null,
    created_at: new Date().toISOString(),
  };
  
  // Add to mock storage
  mockBusinessGoals.push(newGoal);
  
  console.log(`[mockCreateBusinessGoal] Created mock business goal with ID: ${id}`);
  
  return id;
}

/**
 * Mock implementation of business goal update operation
 */
export async function mockUpdateBusinessGoal(id: string, data: any): Promise<boolean> {
  console.warn('[mockUpdateBusinessGoal] This is a mock implementation. Use Contentful for production data.');
  
  // Find the business goal to update by slug (since id parameter might be a slug)
  const goalIndex = mockBusinessGoals.findIndex(g => g.id === id || g.slug === id);
  
  if (goalIndex === -1) {
    console.log(`[mockUpdateBusinessGoal] Business goal with ID/slug ${id} not found`);
    return false;
  }
  
  // Update the business goal
  mockBusinessGoals[goalIndex] = {
    ...mockBusinessGoals[goalIndex],
    title: data.title,
    slug: data.slug,
    description: data.description || '',
    icon: data.icon || mockBusinessGoals[goalIndex].icon,
  };
  
  console.log(`[mockUpdateBusinessGoal] Updated mock business goal with ID: ${mockBusinessGoals[goalIndex].id}`);
  
  return true;
}

/**
 * Mock implementation of business goal delete operation
 */
export async function mockDeleteBusinessGoal(id: string): Promise<boolean> {
  console.warn('[mockDeleteBusinessGoal] This is a mock implementation. Use Contentful for production data.');
  
  // Find the business goal to delete (id might be a slug)
  const initialLength = mockBusinessGoals.length;
  mockBusinessGoals = mockBusinessGoals.filter(g => g.id !== id && g.slug !== id);
  
  const wasDeleted = mockBusinessGoals.length < initialLength;
  console.log(`[mockDeleteBusinessGoal] ${wasDeleted ? 'Deleted' : 'Failed to delete'} mock business goal with ID/slug: ${id}`);
  
  return wasDeleted;
}

/**
 * Mock implementation of business goal clone operation
 */
export async function mockCloneBusinessGoal(id: string): Promise<string | null> {
  console.warn('[mockCloneBusinessGoal] This is a mock implementation. Use Contentful for production data.');
  
  // Find the business goal to clone
  const goalToCopy = mockBusinessGoals.find(g => g.id === id);
  
  if (!goalToCopy) {
    console.log(`[mockCloneBusinessGoal] Business goal with ID ${id} not found`);
    return null;
  }
  
  // Generate a new ID and create a copy with modified title and slug
  const newId = uuidv4();
  const clonedGoal: CMSBusinessGoal = {
    ...goalToCopy,
    id: newId,
    title: `${goalToCopy.title} (Copy)`,
    slug: `${goalToCopy.slug}-copy-${newId.substring(0, 8)}`,
    created_at: new Date().toISOString(),
  };
  
  // Add to mock storage
  mockBusinessGoals.push(clonedGoal);
  
  console.log(`[mockCloneBusinessGoal] Cloned mock business goal with ID: ${id}, new ID: ${newId}`);
  
  return newId;
}
