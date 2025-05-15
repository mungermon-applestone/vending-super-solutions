
import { supabase } from '@/integrations/supabase/client';

/**
 * Log a CMS operation for debugging and auditing purposes
 * @param operation The operation name
 * @param contentType The content type being operated on
 * @param message The log message
 */
function logCMSOperation(operation: string, contentType: string, message: string): void {
  console.log(`[CMS:${contentType}] ${operation}: ${message}`);
}

/**
 * Handle and log CMS errors
 * @param operation The operation name
 * @param contentType The content type being operated on
 * @param error The error object
 */
function handleCMSError(operation: string, contentType: string, error: any): void {
  console.error(`[CMS:${contentType}] Error in ${operation}:`, error);
  // Additional error handling logic can be added here
}

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

// Define specific table types to ensure type safety using string literal union
// Use a simpler approach to avoid excessive depth in type instantiation
type TableName = string;

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
      .from(table as any)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !originalItem) {
      handleCMSError('cloneContentItem', contentType, fetchError || new Error(`${contentType} not found`));
      return null;
    }

    // Create a copy of the original item
    // Fix: Create an explicit Record<string, any> and copy properties manually instead of using spread
    const cloneData: Record<string, any> = {};
    
    // Copy all properties from originalItem to cloneData
    for (const key in originalItem) {
      if (Object.prototype.hasOwnProperty.call(originalItem, key)) {
        cloneData[key] = originalItem[key];
      }
    }
    
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
      .from(table as any)
      .insert(cloneData)
      .select('*')
      .single();

    if (insertError) {
      handleCMSError('cloneContentItem', contentType, insertError);
      return null;
    }

    // Fix: Type safety for newItem.id - ensure newItem exists and has an id property
    if (newItem && 'id' in newItem) {
      logCMSOperation('cloneContentItem', contentType, `Successfully cloned ${contentType}, new ID: ${newItem.id}`);
    } else {
      logCMSOperation('cloneContentItem', contentType, `Successfully cloned ${contentType}, but couldn't retrieve new ID`);
    }
    
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

    // Create clones of each related item - fix the spread operator issue by ensuring items are treated as objects
    const clonedItems = relatedItems.map(item => {
      // Define clone as Record<string, any> to ensure TypeScript sees it as an object type
      const clone: Record<string, any> = {};
      
      // Manually copy properties instead of using spread
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          clone[key] = item[key];
        }
      }
      
      // Remove ID so a new one will be generated
      delete clone.id;
      
      // Set the foreign key to the new parent ID
      clone[foreignKeyField] = newId;
      
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
