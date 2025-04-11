
import { supabase } from '@/integrations/supabase/client';
import { logCMSOperation, handleCMSError } from '../contentTypes/types';

/**
 * Generate a random alphanumeric suffix of the specified length
 * @param length Length of the suffix to generate
 * @returns Random alphanumeric string
 */
export function generateSuffix(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Define specific table types to ensure type safety using literal string union
type TableName = string & (
  | 'product_types'
  | 'product_type_benefits'
  | 'product_type_features'
  | 'product_type_images'
  | 'product_type_feature_images'
  | 'business_goals'
  | 'business_goal_benefits'
  | 'business_goal_features'
  | 'business_goal_feature_images'
  | 'technologies'
  | 'technology_sections'
  | 'technology_features'
  | 'technology_feature_items'
  | 'technology_images'
  | 'machines'
  | 'machine_features'
  | 'machine_images'
  | 'machine_specs'
  | 'deployment_examples'
);

/**
 * Generic function to clone a content item from any content type
 * @param table Database table name
 * @param id ID of the item to clone
 * @param contentType Human-readable content type name for logging
 * @param additionalFields Additional fields to override in the cloned item
 * @returns The cloned item or null if failed
 */
export async function cloneContentItem<T>(
  table: TableName,
  id: string,
  contentType: string,
  additionalFields: Record<string, any> = {}
): Promise<T | null> {
  try {
    logCMSOperation('cloneContentItem', contentType, `Cloning ${contentType} with ID: ${id}`);

    // First, fetch the original item
    const { data: originalItem, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !originalItem) {
      handleCMSError('cloneContentItem', contentType, fetchError || new Error(`${contentType} not found`));
      return null;
    }

    // Create a copy of the original item
    const cloneData = { ...originalItem };
    
    // Remove the id so a new one will be generated
    delete cloneData.id;
    
    // Update the title and slug to indicate it's a copy, if those properties exist
    if ('title' in cloneData) {
      cloneData.title = `${cloneData.title} (copy)`;
    }
    
    if ('slug' in cloneData) {
      // Generate a new slug based on the original one
      cloneData.slug = `${cloneData.slug}-copy-${generateSuffix(3)}`;
    }
    
    // Apply any additional field overrides
    Object.assign(cloneData, additionalFields);

    // Insert the cloned item
    const { data: newItem, error: insertError } = await supabase
      .from(table)
      .insert(cloneData)
      .select('*')
      .single();

    if (insertError) {
      handleCMSError('cloneContentItem', contentType, insertError);
      return null;
    }

    logCMSOperation('cloneContentItem', contentType, `Successfully cloned ${contentType}, new ID: ${newItem.id}`);
    return newItem as T;
  } catch (error) {
    handleCMSError('cloneContentItem', contentType, error);
    return null;
  }
}

/**
 * Clone related items that have a foreign key relationship to the main content
 * @param table Related table name
 * @param foreignKeyField Name of the foreign key field that references the parent
 * @param originalId Original parent ID
 * @param newId New parent ID to associate with the cloned items
 */
export async function cloneRelatedItems(
  table: TableName,
  foreignKeyField: string,
  originalId: string,
  newId: string
): Promise<void> {
  try {
    // Fetch all related items for the original content
    const { data: relatedItems, error: fetchError } = await supabase
      .from(table as any)
      .select('*')
      .eq(foreignKeyField, originalId);

    if (fetchError) {
      console.error(`Error fetching related items from ${table}:`, fetchError);
      return;
    }

    if (!relatedItems || relatedItems.length === 0) {
      console.log(`No related items found in ${table} for ${foreignKeyField}=${originalId}`);
      return;
    }

    // Create clones of each related item
    const clonedItems = relatedItems.map(item => {
      const clone = { ...item };
      delete clone.id; // Remove ID so a new one will be generated
      clone[foreignKeyField] = newId; // Set the foreign key to the new parent ID
      return clone;
    });

    // Insert all cloned related items
    const { error: insertError } = await supabase
      .from(table as any)
      .insert(clonedItems);

    if (insertError) {
      console.error(`Error inserting cloned items into ${table}:`, insertError);
    } else {
      console.log(`Successfully cloned ${clonedItems.length} related items in ${table}`);
    }
  } catch (error) {
    console.error(`Error cloning related items in ${table}:`, error);
  }
}
