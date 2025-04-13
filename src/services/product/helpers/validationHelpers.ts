
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a product slug already exists
 */
export const checkProductSlugExists = async (slug: string, excludeProductId?: string): Promise<boolean> => {
  console.log(`[validationHelpers] Checking if slug "${slug}" exists (excluding product ID: ${excludeProductId || 'none'})`);

  let query = supabase
    .from('product_types')
    .select('id')
    .eq('slug', slug);

  // If we're excluding a product ID (for updates), add that filter
  if (excludeProductId) {
    query = query.neq('id', excludeProductId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[validationHelpers] Error checking slug existence:', error);
    throw new Error(`Failed to check if slug exists: ${error.message}`);
  }

  const exists = data.length > 0;
  console.log(`[validationHelpers] Slug "${slug}" exists: ${exists}`);
  return exists;
};
