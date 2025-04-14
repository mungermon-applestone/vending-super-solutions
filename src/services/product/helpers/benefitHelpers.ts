
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Process benefits to remove duplicates and empty entries
 */
export const processBenefits = (benefits: string[]): string[] => {
  // Filter out empty benefits and remove duplicates
  const uniqueBenefits = new Set<string>();
  return benefits
    .filter(benefit => benefit.trim() !== '')
    .filter(benefit => {
      const normalized = benefit.trim().toLowerCase();
      if (uniqueBenefits.has(normalized)) {
        return false;
      }
      uniqueBenefits.add(normalized);
      return true;
    });
};

/**
 * Update a product's benefits
 */
export const updateProductBenefits = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[benefitHelpers] Updating benefits for product ID:', productId);
  console.log('[benefitHelpers] Benefits data received:', data.benefits);
  
  try {
    // IMPORTANT: First delete ALL existing benefits for this product
    // This ensures a clean slate and prevents orphaned or duplicate benefits
    console.log('[benefitHelpers] Deleting all existing benefits for product ID:', productId);
    const { error: deleteError, count } = await supabase
      .from('product_type_benefits')
      .delete({ count: 'exact' })
      .eq('product_type_id', productId);

    if (deleteError) {
      console.error('[benefitHelpers] Error deleting existing benefits:', deleteError);
      throw new Error(deleteError.message);
    }
    console.log(`[benefitHelpers] Deleted ${count} existing benefits`);
    
    // Clean benefits data to remove empties and duplicates
    const validBenefits = processBenefits(data.benefits);
    console.log(`[benefitHelpers] Processing ${validBenefits.length} valid benefits after filtering empty and duplicate ones`);
    console.log('[benefitHelpers] Valid benefits:', validBenefits);
    
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
