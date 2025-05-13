
import { CMSMachine } from '@/types/cms';

/**
 * Validates machine data to ensure it has all required fields with correct types
 * 
 * @param machine The machine data to validate
 * @returns A clean machine object with validated data
 * @throws Error if validation fails
 */
export function validateMachineData(machine: any): CMSMachine {
  // Check for required fields
  if (!machine.id) {
    throw new Error('Machine ID is required');
  }
  
  if (!machine.title) {
    throw new Error('Machine title is required');
  }
  
  // Default values for optional fields to prevent errors downstream
  const validatedMachine: CMSMachine = {
    id: String(machine.id),
    title: String(machine.title),
    slug: machine.slug ? String(machine.slug) : String(machine.title).toLowerCase().replace(/\s+/g, '-'),
    type: machine.type === 'locker' ? 'locker' : 'vending',
    description: machine.description ? String(machine.description) : '',
    features: Array.isArray(machine.features) ? machine.features.filter(Boolean).map(String) : [],
    temperature: machine.temperature ? String(machine.temperature) : 'ambient'
  };
  
  // Validate and clean images
  if (machine.images && Array.isArray(machine.images)) {
    validatedMachine.images = machine.images
      .filter(img => img && typeof img === 'object' && img.url)
      .map(img => ({
        id: img.id || '',
        url: String(img.url),
        alt: img.alt || validatedMachine.title
      }));
  }
  
  // Validate and clean thumbnail
  if (machine.thumbnail && typeof machine.thumbnail === 'object' && machine.thumbnail.url) {
    validatedMachine.thumbnail = {
      id: machine.thumbnail.id || '',
      url: String(machine.thumbnail.url),
      alt: machine.thumbnail.alt || validatedMachine.title
    };
  }
  
  // Validate and clean specs
  if (machine.specs && typeof machine.specs === 'object') {
    validatedMachine.specs = {
      dimensions: machine.specs.dimensions ? String(machine.specs.dimensions) : '',
      weight: machine.specs.weight ? String(machine.specs.weight) : '',
      capacity: machine.specs.capacity ? String(machine.specs.capacity) : '',
      powerRequirements: machine.specs.powerRequirements ? String(machine.specs.powerRequirements) : '',
      paymentOptions: machine.specs.paymentOptions ? String(machine.specs.paymentOptions) : '',
      connectivity: machine.specs.connectivity ? String(machine.specs.connectivity) : '',
      manufacturer: machine.specs.manufacturer ? String(machine.specs.manufacturer) : '',
      warranty: machine.specs.warranty ? String(machine.specs.warranty) : '',
      temperature: machine.specs.temperature ? String(machine.specs.temperature) : ''
    };
  }
  
  return validatedMachine;
}
