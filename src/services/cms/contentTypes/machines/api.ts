
import { CMSMachine } from '@/types/cms';
import { transformMachineData } from '../../utils/transformers';

// Mock machine data
const mockMachines: CMSMachine[] = [
  {
    id: 'machine-001',
    title: 'Vending Machine Pro',
    slug: 'vending-machine-pro',
    type: 'vending',
    temperature: 'ambient',
    description: 'Our flagship vending machine with advanced features',
    features: ['Touchscreen interface', 'Cashless payment', 'Remote monitoring'],
    images: [
      { id: 'img-001', url: 'https://example.com/machine1.jpg', alt: 'Vending Machine Pro front view' }
    ],
    specs: {
      dimensions: '72" x 39" x 35"',
      weight: '800 lbs',
      capacity: '500 items',
      powerRequirements: '110V'
    }
  },
  {
    id: 'machine-002',
    title: 'Smart Locker System',
    slug: 'smart-locker-system',
    type: 'locker',
    temperature: 'ambient',
    description: 'Secure locker system for package delivery and pickup',
    features: ['Barcode scanner', 'Notification system', 'Climate control'],
    images: [
      { id: 'img-002', url: 'https://example.com/locker1.jpg', alt: 'Smart Locker System' }
    ],
    specs: {
      dimensions: '80" x 72" x 20"',
      weight: '1200 lbs',
      capacity: '24 compartments',
      powerRequirements: '110V'
    }
  }
];

/**
 * Fetch machines from the CMS with sorting options
 */
export async function fetchMachines<T = any>(params: Record<string, any> = {}): Promise<T[]> {
  try {
    console.log('[fetchMachines] Starting fetch with params:', params);
    
    // Filter mock machines based on params
    let filteredMachines = [...mockMachines];
    
    if (params.type) {
      filteredMachines = filteredMachines.filter(m => m.type === params.type);
    }
    
    if (params.temperature) {
      filteredMachines = filteredMachines.filter(m => m.temperature === params.temperature);
    }
    
    if (params.slug) {
      filteredMachines = filteredMachines.filter(m => m.slug === params.slug);
    }
    
    if (params.id) {
      filteredMachines = filteredMachines.filter(m => m.id === params.id);
    }
    
    // Apply sorting if provided
    if (params.sort) {
      // For mock data, no sorting implementation needed
      console.log(`[fetchMachines] Would sort by ${params.sort} in a real implementation`);
    }
    
    console.log(`[fetchMachines] Returning ${filteredMachines.length} machines`);
    return filteredMachines as T[];
  } catch (error) {
    console.error('[fetchMachines] Error fetching machines:', error);
    throw error;
  }
}

/**
 * Fetch a single machine by its ID
 */
export async function fetchMachineById<T = any>(id: string): Promise<T | null> {
  try {
    console.log(`[fetchMachineById] Fetching machine with ID: ${id}`);
    
    const machine = mockMachines.find(m => m.id === id);
    
    if (!machine) {
      console.warn(`[fetchMachineById] No machine found with ID: ${id}`);
      return null;
    }
    
    return machine as T;
  } catch (error) {
    console.error(`[fetchMachineById] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
