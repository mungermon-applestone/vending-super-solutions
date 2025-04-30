
import { CMSMachine } from '@/types/cms';

/**
 * Validates machine data to ensure it meets minimum requirements
 * 
 * @param machine - The machine data to validate
 * @returns The validated machine data
 * @throws Error if validation fails
 */
export const validateMachineData = (machine: CMSMachine): CMSMachine => {
  // Ensure required fields are present
  if (!machine.id) {
    throw new Error('Machine must have an ID');
  }
  
  if (!machine.title) {
    throw new Error('Machine must have a title');
  }
  
  if (!machine.slug) {
    throw new Error('Machine must have a slug');
  }
  
  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(machine.slug)) {
    console.warn(`Machine slug "${machine.slug}" contains invalid characters, this may cause issues`);
  }
  
  // Validate type
  if (!['vending', 'locker'].includes(machine.type)) {
    console.warn(`Machine type "${machine.type}" is not recognized, defaulting to "vending"`);
    machine.type = 'vending';
  }
  
  // Ensure arrays are defined
  machine.features = machine.features || [];
  machine.images = machine.images || [];
  
  // Validate thumbnail if present
  if (machine.thumbnail) {
    if (!machine.thumbnail.url) {
      console.warn('Machine thumbnail missing URL, this may cause display issues');
    }
    if (!machine.thumbnail.alt) {
      console.warn('Machine thumbnail missing alt text, adding default alt text');
      machine.thumbnail.alt = `${machine.title} thumbnail`;
    }
  }
  
  // Return the validated machine
  return machine;
};
