import { supabase } from '@/integrations/supabase/client';

/**
 * Process benefits array to ensure it's clean
 * - Removes empty benefits
 * - Removes duplicate benefits
 */
export const processBenefits = (benefits: string[] | undefined): string[] => {
  if (!benefits || !Array.isArray(benefits)) {
    console.log('[productHelpers] processBenefits: No benefits array provided');
    return [];
  }
  
  // Filter out empty benefits
  const nonEmptyBenefits = benefits.filter(benefit => {
    const isValidBenefit = benefit && typeof benefit === 'string' && benefit.trim() !== '';
    if (!isValidBenefit) {
      console.log('[productHelpers] processBenefits: Filtering out empty benefit');
    }
    return isValidBenefit;
  });
  
  // Remove duplicates by converting to Set and back to array
  const uniqueBenefits = [...new Set(nonEmptyBenefits)];
  
  console.log(`[productHelpers] processBenefits: Processed ${benefits.length} benefits into ${uniqueBenefits.length} unique benefits`);
  
  return uniqueBenefits;
};

/**
 * Check if a product with the given slug exists
 */
export const checkProductSlugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
  console.log(`[productHelpers] Checking if slug "${slug}" exists`);
  
  try {
    let query = supabase
      .from('product_types')
      .select('id, slug')
      .eq('slug', slug);
    
    // If excludeId is provided, exclude that product from the check
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[productHelpers] Error checking slug existence:', error);
      throw new Error(`Failed to check slug existence: ${error.message}`);
    }
    
    const exists = Array.isArray(data) && data.length > 0;
    console.log(`[productHelpers] Slug "${slug}" exists: ${exists}`);
    
    return exists;
  } catch (error) {
    console.error('[productHelpers] Error in checkProductSlugExists:', error);
    throw error;
  }
};
