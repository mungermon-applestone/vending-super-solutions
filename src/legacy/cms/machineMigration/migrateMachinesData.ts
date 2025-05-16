
/**
 * @deprecated This module is deprecated and will be removed in future versions.
 * Use Contentful CMS integration for machine content management.
 */

import { supabase } from "@/integrations/supabase/client";
import { MachinePlaceholder, MigrationResult } from "./types";
import { machinePlaceholderData } from "@/utils/machineMigration/machineData";

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Migrates machine data from the placeholder data to the Supabase database
 * @returns Promise with the migration result
 */
export const migrateMachinesData = async (): Promise<MigrationResult> => {
  try {
    console.log("[DEPRECATED] Starting machine data migration...");
    const existingMachines = await supabase.from('machines').select('slug');
    console.log("[DEPRECATED] Existing machines:", existingMachines.data);
    
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    let errors: string[] = [];
    
    // Process each machine sequentially using for...of to prevent race conditions
    for (const machineData of machinePlaceholderData) {
      try {
        console.log(`[DEPRECATED] Processing machine: ${machineData.title} (${machineData.slug})`);
        
        // Check if machine with this slug already exists
        const { data: existingMachine, error: checkError } = await supabase
          .from('machines')
          .select('id, slug')
          .eq('slug', machineData.slug)
          .maybeSingle();
          
        if (checkError) {
          console.error(`[DEPRECATED] Error checking for existing machine ${machineData.slug}:`, checkError);
          errors.push(`Failed to check existence of ${machineData.title}: ${checkError.message}`);
          failureCount++;
          continue;
        }
        
        // If machine already exists, skip it
        if (existingMachine) {
          console.log(`[DEPRECATED] Machine with slug ${machineData.slug} already exists, skipping.`);
          skippedCount++;
          continue;
        }
        
        // Create the machine record with explicit insert values
        const { data: machine, error: machineError } = await supabase
          .from('machines')
          .insert({
            title: machineData.title,
            slug: machineData.slug,
            // Only using fields that exist in the current schema
          })
          .select('id')
          .single();
        
        if (machineError) {
          console.error(`[DEPRECATED] Error creating machine ${machineData.title}:`, machineError);
          errors.push(`Failed to create ${machineData.title}: ${machineError.message}`);
          failureCount++;
          continue;
        }
        
        if (!machine || !machine.id) {
          console.error(`[DEPRECATED] Failed to get ID for new machine ${machineData.title}`);
          errors.push(`Failed to get ID for new machine ${machineData.title}`);
          failureCount++;
          continue;
        }
        
        console.log(`[DEPRECATED] Created machine with ID: ${machine.id}`);
        await mockAddMachineRelatedData(machine.id, machineData, errors);
        
        // Increment success counter
        successCount++;
        console.log(`[DEPRECATED] Successfully processed machine: ${machineData.title}`);
      } catch (machineError) {
        console.error(`[DEPRECATED] Unexpected error processing machine ${machineData.title}:`, machineError);
        errors.push(`Unexpected error with ${machineData.title}: ${machineError instanceof Error ? machineError.message : 'Unknown error'}`);
        failureCount++;
        // Continue with next machine despite error
      }
    }
    
    // Fetch the current machine count from the database to verify
    const { data: finalMachines, error: finalError } = await supabase
      .from('machines')
      .select('id, title, slug')
      .order('title');
      
    if (finalError) {
      console.error("[DEPRECATED] Error verifying final machine count:", finalError);
    } else {
      console.log(`[DEPRECATED] Final machine count in database: ${finalMachines?.length || 0}`);
      console.log("[DEPRECATED] Machines in database:", finalMachines);
    }
    
    console.log(`[DEPRECATED] Migration summary: 
      - Total machines in placeholder data: ${machinePlaceholderData.length}
      - Successfully imported: ${successCount}
      - Failed: ${failureCount}
      - Skipped (already exist): ${skippedCount}
      - Final count in database: ${finalMachines?.length || 'Unknown'}`);
    
    return { 
      success: successCount > 0, 
      message: `Migration completed. ${successCount} machines were imported successfully, ${failureCount} failed, ${skippedCount} skipped.`,
      count: successCount,
      errors: errors.length > 0 ? errors : undefined,
      machinesInDb: finalMachines || []
    };
  } catch (error) {
    console.error("[DEPRECATED] Error during machine data migration:", error);
    return { 
      success: false, 
      message: "Migration failed with an unexpected error", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

/**
 * Helper function to mock adding related data for a machine
 * MOCK IMPLEMENTATION: This function simulates adding related data for machines
 * @param machineId The ID of the machine
 * @param machineData The machine data
 * @param errors Array to collect errors
 */
async function mockAddMachineRelatedData(machineId: string, machineData: MachinePlaceholder, errors: string[]) {
  // Mock adding machine images
  if (machineData.images.length > 0) {
    console.log(`[DEPRECATED] MOCK: Adding ${machineData.images.length} images for machine ${machineData.title}`);
    const imageInserts = machineData.images.map((image, index) => ({
      machine_id: machineId,
      url: image.url,
      alt: image.alt || machineData.title,
      width: image.width || 800,
      height: image.height || 600,
      display_order: index
    }));
    
    // Log the mock operation instead of executing it
    console.log(`[DEPRECATED] MOCK: Would insert ${imageInserts.length} images for machine ${machineData.title}`);
    console.log('[DEPRECATED] MOCK: Sample image data:', imageInserts[0]);
  }
  
  // Mock other related data operations
  console.log(`[DEPRECATED] MOCK: All related data for machine ${machineData.title} processed`);
}
