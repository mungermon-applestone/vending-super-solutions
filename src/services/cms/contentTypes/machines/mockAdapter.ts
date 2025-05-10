
/**
 * This file provides mock implementations for machine operations 
 * that previously interacted with Supabase directly.
 * It's part of the deprecation strategy for direct database operations
 * as we transition to Contentful for content management.
 */

import { v4 as uuidv4 } from 'uuid';
import { MachineFormValues } from '@/utils/machineMigration/types';
import { CMSMachine } from '@/types/cms';

// In-memory storage for mocked operations
let mockMachines: CMSMachine[] = [];

/**
 * Mock implementation of machine create operation
 */
export async function mockCreateMachine(machineData: MachineFormValues): Promise<string> {
  console.warn('[mockCreateMachine] This is a mock implementation. Use Contentful for production data.');
  
  // Generate a new ID
  const id = uuidv4();
  
  // Create a new mock machine
  const newMachine: CMSMachine = {
    id,
    title: machineData.title,
    slug: machineData.slug,
    type: machineData.type,
    temperature: machineData.temperature,
    description: machineData.description || '',
    images: machineData.images || [],
    specs: machineData.specs || {},
    features: machineData.features || [],
    visible: true,
    created_at: new Date().toISOString(),
  };
  
  // Add to mock storage
  mockMachines.push(newMachine);
  
  console.log(`[mockCreateMachine] Created mock machine with ID: ${id}`);
  
  return id;
}

/**
 * Mock implementation of machine update operation
 */
export async function mockUpdateMachine(id: string, machineData: MachineFormValues): Promise<boolean> {
  console.warn('[mockUpdateMachine] This is a mock implementation. Use Contentful for production data.');
  
  // Find the machine to update
  const machineIndex = mockMachines.findIndex(m => m.id === id);
  
  if (machineIndex === -1) {
    console.log(`[mockUpdateMachine] Machine with ID ${id} not found`);
    return false;
  }
  
  // Update the machine
  mockMachines[machineIndex] = {
    ...mockMachines[machineIndex],
    title: machineData.title,
    slug: machineData.slug,
    type: machineData.type,
    temperature: machineData.temperature,
    description: machineData.description || '',
    images: machineData.images || [],
    specs: machineData.specs || {},
    features: machineData.features || [],
  };
  
  console.log(`[mockUpdateMachine] Updated mock machine with ID: ${id}`);
  
  return true;
}

/**
 * Mock implementation of machine delete operation
 */
export async function mockDeleteMachine(id: string): Promise<boolean> {
  console.warn('[mockDeleteMachine] This is a mock implementation. Use Contentful for production data.');
  
  // Filter out the machine to delete
  const initialLength = mockMachines.length;
  mockMachines = mockMachines.filter(m => m.id !== id);
  
  const wasDeleted = mockMachines.length < initialLength;
  console.log(`[mockDeleteMachine] ${wasDeleted ? 'Deleted' : 'Failed to delete'} mock machine with ID: ${id}`);
  
  return wasDeleted;
}

/**
 * Mock implementation of machine clone operation
 */
export async function mockCloneMachine(id: string): Promise<string | null> {
  console.warn('[mockCloneMachine] This is a mock implementation. Use Contentful for production data.');
  
  // Find the machine to clone
  const machineToCopy = mockMachines.find(m => m.id === id);
  
  if (!machineToCopy) {
    console.log(`[mockCloneMachine] Machine with ID ${id} not found`);
    return null;
  }
  
  // Generate a new ID and create a copy with modified title and slug
  const newId = uuidv4();
  const clonedMachine: CMSMachine = {
    ...machineToCopy,
    id: newId,
    title: `${machineToCopy.title} (Copy)`,
    slug: `${machineToCopy.slug}-copy-${newId.substring(0, 8)}`,
    created_at: new Date().toISOString(),
  };
  
  // Add to mock storage
  mockMachines.push(clonedMachine);
  
  console.log(`[mockCloneMachine] Cloned mock machine with ID: ${id}, new ID: ${newId}`);
  
  return newId;
}
