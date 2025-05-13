
import { CMSMachine } from '@/services/cms/adapters/machines/types';

/**
 * Validates a machine object for required fields
 * Throws an error if validation fails
 * 
 * @param machine - The machine object to validate
 * @returns boolean - True if validation passes
 */
export function validateMachineData(machine: CMSMachine): boolean {
  // Check for required fields
  if (!machine) {
    throw new Error('Machine data is null or undefined');
  }
  
  if (!machine.name) {
    throw new Error('Machine name is required');
  }
  
  if (!machine.slug) {
    throw new Error(`Machine slug is required for ${machine.name}`);
  }
  
  // Validate slug format (lowercase, no spaces, only hyphens)
  const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!validSlugPattern.test(machine.slug)) {
    console.warn(`Machine slug "${machine.slug}" may not be properly formatted`);
    // Don't throw an error as we want to be flexible with existing data
  }
  
  // Check that image properties exist if specified
  if (machine.mainImage && typeof machine.mainImage === 'object') {
    if (!machine.mainImage.url) {
      console.warn(`Machine ${machine.name} has a mainImage object but no URL`);
    }
  }
  
  // Validate that features have required properties if present
  if (machine.features && Array.isArray(machine.features)) {
    machine.features.forEach((feature, index) => {
      if (!feature.name) {
        console.warn(`Machine ${machine.name} has a feature at index ${index} with no name`);
      }
    });
  }
  
  // Validate specifications if present
  if (machine.specifications && Array.isArray(machine.specifications)) {
    machine.specifications.forEach((spec, index) => {
      if (!spec.name) {
        console.warn(`Machine ${machine.name} has a specification at index ${index} with no name`);
      }
      if (spec.value === undefined || spec.value === null) {
        console.warn(`Machine ${machine.name} has a specification "${spec.name}" with no value`);
      }
    });
  }
  
  return true;
}

/**
 * Validates an array of machines
 * Logs warnings for invalid machines but doesn't throw
 * 
 * @param machines - Array of machine objects to validate
 * @returns CMSMachine[] - Array of valid machines
 */
export function validateMachines(machines: CMSMachine[]): CMSMachine[] {
  if (!Array.isArray(machines)) {
    console.error('Invalid machines data: expected an array');
    return [];
  }
  
  const validMachines = machines.filter(machine => {
    try {
      validateMachineData(machine);
      return true;
    } catch (error) {
      console.error(`Validation failed for machine:`, error);
      return false;
    }
  });
  
  return validMachines;
}
