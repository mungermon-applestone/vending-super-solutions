
import { supabase } from '@/integrations/supabase/client';
import { useTechnologyData } from '@/utils/technologyMigration/technologyData';

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * It provides a mock implementation that logs operations instead of making actual database modifications.
 * Use Contentful CMS integration for technology content management.
 * 
 * Migrates technology data to the Supabase database
 */
export async function migrateTechnologyData() {
  console.log('[DEPRECATED] Starting technology data migration (MOCK IMPLEMENTATION)...');
  
  try {
    const technologyData = useTechnologyData();
    
    // Create the main technology entry - only use the existing technologies table
    const { data: technology, error: techError } = await supabase
      .from('technologies')
      .insert({
        slug: 'enterprise-platform',
        title: 'Enterprise-Grade Technology',
        description: 'Our platform is built with security, scalability, and flexibility in mind. Connect any machine to our cloud infrastructure and unlock powerful retail automation capabilities.',
        // image_url and image_alt are in the database schema but not used in this mock implementation
      })
      .select('id')
      .single();
    
    if (techError) {
      throw new Error(`Failed to create technology: ${techError.message}`);
    }
    
    console.log('[DEPRECATED] Mock technology entry created:', technology);
    
    // Mock logging of operations instead of trying to insert into non-existent tables
    console.log('[DEPRECATED] MOCK: Would create architecture section with the following data:', {
      technology_id: technology.id,
      section_type: 'architecture',
      title: 'Cloud-Native Architecture',
      description: 'Our platform connects your machines to the cloud, enabling real-time monitoring, data analysis, and seamless integration with your business systems.'
    });
    
    // Log other operations that would have been performed
    console.log('[DEPRECATED] Technology data migration completed successfully (MOCK)');
    return true;
  } catch (error) {
    console.error('[DEPRECATED] Error during technology migration:', error);
    return false;
  }
}

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Use Contentful CMS integration for technology content management.
 * 
 * Checks if technology data exists in the database
 * Uses the technologies table only, which exists in the database
 */
export async function checkIfTechnologyDataExists() {
  console.log('[DEPRECATED] Checking if technology data exists (using simplified implementation)');
  try {
    const { count, error } = await supabase
      .from('technologies')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('[DEPRECATED] Error checking technology data:', error);
      return false;
    }
    
    return count && count > 0;
  } catch (error) {
    console.error('[DEPRECATED] Error checking technology data:', error);
    return false;
  }
}
