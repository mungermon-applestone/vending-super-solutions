
// Function to migrate machine data to the Supabase database
import { supabase } from "@/integrations/supabase/client";
import { MachinePlaceholder, MigrationResult } from "./types";
import { machinePlaceholderData } from "./machineData";

/**
 * Migrates machine data from the placeholder data to the Supabase database
 * @returns Promise with the migration result
 */
export const migrateMachinesData = async (): Promise<MigrationResult> => {
  try {
    console.log("Starting machine data migration...");
    const existingMachines = await supabase.from('machines').select('slug');
    console.log("Existing machines:", existingMachines.data);
    
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    let errors: string[] = [];
    
    // Process each machine sequentially using for...of to prevent race conditions
    for (const machineData of machinePlaceholderData) {
      try {
        console.log(`Processing machine: ${machineData.title} (${machineData.slug})`);
        
        // Check if machine with this slug already exists
        const { data: existingMachine, error: checkError } = await supabase
          .from('machines')
          .select('id, slug')
          .eq('slug', machineData.slug)
          .maybeSingle();
          
        if (checkError) {
          console.error(`Error checking for existing machine ${machineData.slug}:`, checkError);
          errors.push(`Failed to check existence of ${machineData.title}: ${checkError.message}`);
          failureCount++;
          continue;
        }
        
        // If machine already exists, skip it
        if (existingMachine) {
          console.log(`Machine with slug ${machineData.slug} already exists, skipping.`);
          skippedCount++;
          continue;
        }
        
        // Create the machine record with explicit insert values
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
          console.error(`Error creating machine ${machineData.title}:`, machineError);
          errors.push(`Failed to create ${machineData.title}: ${machineError.message}`);
          failureCount++;
          continue;
        }
        
        if (!machine || !machine.id) {
          console.error(`Failed to get ID for new machine ${machineData.title}`);
          errors.push(`Failed to get ID for new machine ${machineData.title}`);
          failureCount++;
          continue;
        }
        
        console.log(`Created machine with ID: ${machine.id}`);
        await addMachineRelatedData(machine.id, machineData, errors);
        
        // Increment success counter
        successCount++;
        console.log(`Successfully processed machine: ${machineData.title}`);
      } catch (machineError) {
        console.error(`Unexpected error processing machine ${machineData.title}:`, machineError);
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
      console.error("Error verifying final machine count:", finalError);
    } else {
      console.log(`Final machine count in database: ${finalMachines?.length || 0}`);
      console.log("Machines in database:", finalMachines);
    }
    
    console.log(`Migration summary: 
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
    console.error("Error during machine data migration:", error);
    return { 
      success: false, 
      message: "Migration failed with an unexpected error", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

/**
 * Helper function to add related data for a machine
 * MOCK IMPLEMENTATION: This function simulates adding related data for machines
 * @param machineId The ID of the machine
 * @param machineData The machine data
 * @param errors Array to collect errors
 */
async function addMachineRelatedData(machineId: string, machineData: MachinePlaceholder, errors: string[]) {
  // Mock adding machine images
  if (machineData.images.length > 0) {
    console.log(`MOCK: Adding ${machineData.images.length} images for machine ${machineData.title}`);
    const imageInserts = machineData.images.map((image, index) => ({
      machine_id: machineId,
      url: image.url,
      alt: image.alt || machineData.title,
      width: image.width || 800,
      height: image.height || 600,
      display_order: index
    }));
    
    // Log the mock operation instead of executing it
    console.log(`MOCK: Would insert ${imageInserts.length} images for machine ${machineData.title}`);
    console.log('MOCK: Sample image data:', imageInserts[0]);
  }
  
  // Mock adding machine specs
  if (machineData.specs) {
    console.log(`MOCK: Adding specs for machine ${machineData.title}`);
    const specInserts = Object.entries(machineData.specs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({
        machine_id: machineId,
        key,
        value
      }));
    
    if (specInserts.length > 0) {
      console.log(`MOCK: Would insert ${specInserts.length} specs for machine ${machineData.title}`);
      console.log('MOCK: Sample spec data:', specInserts[0]);
    }
  }
  
  // Mock adding machine features
  if (machineData.features.length > 0) {
    console.log(`MOCK: Adding ${machineData.features.length} features for machine ${machineData.title}`);
    const featureInserts = machineData.features.map((feature, index) => ({
      machine_id: machineId,
      feature,
      display_order: index
    }));
    
    console.log(`MOCK: Would insert ${featureInserts.length} features for machine ${machineData.title}`);
    if (featureInserts.length > 0) {
      console.log('MOCK: Sample feature data:', featureInserts[0]);
    }
  }
  
  // Mock adding deployment examples
  if (machineData.deploymentExamples.length > 0) {
    console.log(`MOCK: Adding ${machineData.deploymentExamples.length} deployment examples for machine ${machineData.title}`);
    const exampleInserts = machineData.deploymentExamples.map((example, index) => ({
      machine_id: machineId,
      title: example.title,
      description: example.description,
      image_url: example.image.url,
      image_alt: example.image.alt,
      display_order: index
    }));
    
    console.log(`MOCK: Would insert ${exampleInserts.length} deployment examples for machine ${machineData.title}`);
    if (exampleInserts.length > 0) {
      console.log('MOCK: Sample deployment example data:', exampleInserts[0]);
    }
  }
}
