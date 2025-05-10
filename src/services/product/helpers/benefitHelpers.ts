
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
 * and then adding the new ones - MOCK IMPLEMENTATION
 */
export const updateProductBenefits = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[benefitHelpers] MOCK: Updating benefits for product ID:', productId);
  console.log('[benefitHelpers] MOCK: Benefits data received:', data.benefits);
  
  try {
    // Mock implementation - no actual database queries here
    console.log('[benefitHelpers] MOCK: Successfully deleted all existing benefits');
    
    // Clean benefits data
    const validBenefits = Array.isArray(data.benefits) 
      ? processBenefits(data.benefits)
      : [];
    
    console.log(`[benefitHelpers] MOCK: Processing ${validBenefits.length} valid benefits`);
    
    // Skip the insertion step if there are no valid benefits to insert
    if (validBenefits.length === 0) {
      console.log('[benefitHelpers] MOCK: No valid benefits to insert');
      return;
    }
    
    // Mock the benefits as they would be inserted in a DB
    const benefitsToInsert = validBenefits.map((benefit, index) => ({
      product_type_id: productId,
      benefit: benefit,
      display_order: index
    }));

    console.log(`[benefitHelpers] MOCK: ${validBenefits.length} benefits would be inserted`);
    console.log('[benefitHelpers] MOCK: Benefits sample:', benefitsToInsert[0]);

    console.log(`[benefitHelpers] MOCK: ${validBenefits.length} benefits inserted successfully`);
  } catch (error) {
    console.error('[benefitHelpers] Error in updateProductBenefits:', error);
    throw error;
  }
};

/**
 * Add product benefits (alias for updateProductBenefits for consistency)
 */
export const addProductBenefits = updateProductBenefits;
