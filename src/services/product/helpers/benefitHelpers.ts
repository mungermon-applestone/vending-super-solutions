
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Process benefits to remove duplicates and empty entries
 * Returns a clean, deduplicated array of benefits
 */
export const processBenefits = (benefits: string[] | undefined): string[] => {
  console.log('[benefitHelpers] Processing benefits input:', benefits);
  
  // Guard against invalid input
  if (!Array.isArray(benefits)) {
    console.log('[benefitHelpers] Benefits is not an array, returning empty array');
    return [];
  }
  
  // First filter out empty strings and whitespace-only entries
  const nonEmptyBenefits = benefits.filter(benefit => 
    benefit && typeof benefit === 'string' && benefit.trim() !== ''
  );
  
  // Then remove duplicates using Set for efficiency
  const uniqueBenefits = [...new Set(nonEmptyBenefits.map(b => b.trim()))];
  
  console.log(`[benefitHelpers] Original benefits count: ${benefits.length}`);
  console.log(`[benefitHelpers] Non-empty benefits count: ${nonEmptyBenefits.length}`);
  console.log(`[benefitHelpers] Unique benefits count: ${uniqueBenefits.length}`);
  console.log('[benefitHelpers] Final processed benefits:', uniqueBenefits);
  
  return uniqueBenefits;
};

/**
 * Update a product's benefits by first completely removing existing ones
 * and then adding the new ones
 */
export const updateProductBenefits = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[benefitHelpers] Updating benefits for product ID:', productId);
  console.log('[benefitHelpers] Benefits data received:', data.benefits);
  
  try {
    // CRITICAL: First delete ALL existing benefits for this product
    // This ensures a clean slate and prevents duplicated benefits
    const { error: deleteError } = await supabase
      .from('product_type_benefits')
      .delete()
      .eq('product_type_id', productId);

    if (deleteError) {
      console.error('[benefitHelpers] Error deleting existing benefits:', deleteError);
      throw new Error(deleteError.message);
    }
    
    console.log('[benefitHelpers] Successfully deleted all existing benefits');
    
    // Clean benefits data again to ensure quality before insertion
    // This is redundant with the processing in updateProduct, but serves as a safety net
    const validBenefits = Array.isArray(data.benefits) 
      ? processBenefits(data.benefits)
      : [];
    
    console.log(`[benefitHelpers] Processing ${validBenefits.length} valid benefits for insertion`);
    
    // Skip the insertion step if there are no valid benefits to insert
    if (validBenefits.length === 0) {
      console.log('[benefitHelpers] No valid benefits to insert');
      return;
    }
    
    // Insert each benefit with a specific display_order
    const benefitsToInsert = validBenefits.map((benefit, index) => ({
      product_type_id: productId,
      benefit: benefit,
      display_order: index
    }));

    const { error: insertError } = await supabase
      .from('product_type_benefits')
      .insert(benefitsToInsert);

    if (insertError) {
      console.error('[benefitHelpers] Error inserting benefits:', insertError);
      throw new Error(insertError.message);
    }

    console.log(`[benefitHelpers] ${validBenefits.length} benefits inserted successfully`);
  } catch (error) {
    console.error('[benefitHelpers] Error in updateProductBenefits:', error);
    throw error;
  }
};

/**
 * Add product benefits (alias for updateProductBenefits for consistency)
 */
export const addProductBenefits = updateProductBenefits;
