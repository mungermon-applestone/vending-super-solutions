
import { CMSMachine } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';
import { supabase } from '@/integrations/supabase/client';

/**
 * Clone a machine
 * @param id ID of the machine to clone
 * @returns The cloned machine or null if failed
 */
export async function cloneMachine(id: string): Promise<CMSMachine | null> {
  try {
    logCMSOperation('cloneMachine', 'Machine', `Starting clone operation for machine with ID: ${id}`);
    
    // Clone the main machine
    const newMachine = await cloneContentItem<CMSMachine>(
      'machines',
      id,
      'Machine'
    );
    
    if (!newMachine) {
      throw new Error('Failed to clone machine');
    }
    
    // Clone related items
    await Promise.all([
      // Clone images
      cloneRelatedItems('machine_images', 'machine_id', id, newMachine.id),
      
      // Clone features
      cloneRelatedItems('machine_features', 'machine_id', id, newMachine.id),
      
      // Clone specifications
      cloneRelatedItems('machine_specs', 'machine_id', id, newMachine.id),
      
      // Clone deployment examples
      cloneRelatedItems('deployment_examples', 'machine_id', id, newMachine.id)
    ]);
    
    return newMachine;
  } catch (error) {
    handleCMSError('cloneMachine', 'Machine', error);
    return null;
  }
}
