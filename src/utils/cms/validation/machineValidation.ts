
import { CMSMachine } from '@/types/cms';

/**
 * Validates machine data to ensure it conforms to the CMSMachine interface
 * 
 * @param machine - The machine data to validate
 * @returns The validated machine data with proper typing
 * @throws Error if validation fails
 */
export const validateMachineData = (machine: any): CMSMachine => {
  console.log('Validating machine data:', machine);
  
  // Check required fields
  if (!machine.id) {
    throw new Error('Machine missing required field: id');
  }
  
  if (!machine.title) {
    throw new Error('Machine missing required field: title');
  }
  
  if (!machine.slug) {
    throw new Error('Machine missing required field: slug');
  }
  
  // Ensure type is strictly "vending" or "locker"
  const validType = machine.type === 'locker' ? 'locker' : 'vending';
  
  // Validate images array
  const validatedImages = Array.isArray(machine.images) 
    ? machine.images.map(img => ({
        id: img.id || `img-${Math.random().toString(36).substring(2, 10)}`,
        url: img.url || '',
        alt: img.alt || machine.title || 'Machine image'
      }))
    : [];
  
  // Validate and sanitize specs
  const validatedSpecs = machine.specs || {};
  
  // Return validated machine
  const validatedMachine: CMSMachine = {
    id: machine.id,
    title: machine.title,
    slug: machine.slug,
    type: validType as 'vending' | 'locker',
    description: machine.description || '',
    temperature: machine.temperature || 'ambient',
    features: Array.isArray(machine.features) ? machine.features : [],
    images: validatedImages,
    specs: validatedSpecs
  };
  
  console.log('Validation successful:', validatedMachine);
  return validatedMachine;
};

