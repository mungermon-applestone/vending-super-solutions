
import { CMSMachine } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock implementation of machine deletion
 * @deprecated This is a mock implementation and will be removed in future versions
 */
export async function mockDeleteMachine(id: string): Promise<boolean> {
  console.log(`[mockDeleteMachine] Would delete machine with ID: ${id} in a real implementation`);
  return true;
}

/**
 * Mock implementation of machine cloning
 * @deprecated This is a mock implementation and will be removed in future versions
 */
export async function mockCloneMachine(id: string): Promise<CMSMachine | null> {
  console.log(`[mockCloneMachine] Would clone machine with ID: ${id} in a real implementation`);
  
  // Return a simple mock machine as a clone
  return {
    id: `cloned-${uuidv4()}`,
    title: `Clone of machine ${id}`,
    slug: `clone-of-machine-${id}`,
    type: 'vending',
    description: 'This is a cloned machine',
    images: [
      {
        id: `img-${uuidv4()}`,
        url: 'https://example.com/machine-image.jpg',
        alt: 'Cloned machine image'
      }
    ],
    features: ['Feature 1', 'Feature 2'],
    specs: {
      dimensions: '72" x 39" x 35"',
      weight: '800 lbs'
    }
  };
}
