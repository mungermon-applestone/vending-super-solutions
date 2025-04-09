
import { supabase } from '@/integrations/supabase/client';
import { MachineFormValues } from '@/utils/machineMigration/types';
import { addMachineImages, addMachineSpecs, addMachineFeatures } from './helpers';

/**
 * Create a new machine in the CMS
 */
export async function createMachine(machineData: MachineFormValues): Promise<string> {
  try {
    console.log('[createMachine] Creating new machine with data:', machineData);
    
    // First, create the machine record
    const { data: machine, error: machineError } = await supabase
      .from('machines')
      .insert({
        title: machineData.title,
        slug: machineData.slug,
        type: machineData.type,
        temperature: machineData.temperature,
        description: machineData.description,
        visible: true
      })
      .select('id')
      .single();
    
    if (machineError) {
      console.error('[createMachine] Error creating machine:', machineError);
      throw machineError;
    }
    
    console.log(`[createMachine] Created machine with ID: ${machine.id}`);
    
    // Add machine images if provided
    await addMachineImages(machine.id, machineData);
    
    // Add machine specs if provided
    await addMachineSpecs(machine.id, machineData);
    
    // Add machine features if provided
    await addMachineFeatures(machine.id, machineData);
    
    return machine.id;
  } catch (error) {
    console.error('[createMachine] Error:', error);
    throw error;
  }
}
