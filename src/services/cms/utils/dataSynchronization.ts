
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface for synchronization options
 */
export interface SyncOptions {
  contentTypes: string[];
  direction: 'push' | 'pull';
  onProgress?: (contentType: string, progress: number, total: number) => void;
  onError?: (contentType: string, error: Error) => void;
  onComplete?: (summary: SyncSummary) => void;
}

/**
 * Summary of synchronization results
 */
export interface SyncSummary {
  startTime: Date;
  endTime: Date;
  totalItems: number;
  successCount: number;
  errorCount: number;
  contentTypes: {
    type: string;
    success: number;
    errors: number;
    errorMessages: string[];
  }[];
}

/**
 * Status information for a sync operation
 */
export interface SyncStatus {
  inProgress: boolean;
  startTime?: Date;
  progress: {
    contentType: string;
    current: number;
    total: number;
  } | null;
  errors: Array<{
    contentType: string;
    message: string;
  }>;
  summary?: SyncSummary;
}

/**
 * Check if synchronization between CMS providers is possible
 */
export function canSynchronizeData(): boolean {
  // Check if both providers are configured
  const config = getCMSProviderConfig();
  
  // For now, we only support Strapi as a secondary provider
  // and only one-way sync from Supabase to Strapi
  return config.type === ContentProviderType.STRAPI && config.apiUrl !== undefined;
}

/**
 * Hook for CMS data synchronization
 */
export function useCMSSynchronization() {
  const { toast } = useToast();
  
  const synchronizeData = async (options: SyncOptions): Promise<SyncSummary> => {
    const startTime = new Date();
    const summary: SyncSummary = {
      startTime,
      endTime: new Date(),
      totalItems: 0,
      successCount: 0,
      errorCount: 0,
      contentTypes: []
    };
    
    try {
      if (!canSynchronizeData()) {
        throw new Error("CMS synchronization not available. Check that both primary and secondary providers are configured.");
      }
      
      const config = getCMSProviderConfig();
      console.log(`[useCMSSynchronization] Starting ${options.direction} sync to ${config.type} with options:`, options);
      
      // Process each content type sequentially
      for (const contentType of options.contentTypes) {
        const contentTypeSummary = {
          type: contentType,
          success: 0,
          errors: 0,
          errorMessages: []
        };
        
        try {
          console.log(`[useCMSSynchronization] Processing content type: ${contentType}`);
          
          // Get the appropriate content type adapter
          const adapter = await getContentTypeAdapter(contentType);
          if (!adapter) {
            throw new Error(`No adapter available for content type: ${contentType}`);
          }
          
          // Get all items from the source
          const items = await getSourceItems(contentType, options.direction);
          const totalItems = items.length;
          contentTypeSummary.type = contentType;
          
          console.log(`[useCMSSynchronization] Found ${totalItems} ${contentType} to ${options.direction === 'push' ? 'push' : 'pull'}`);
          
          // Process each item
          for (let i = 0; i < totalItems; i++) {
            const item = items[i];
            
            try {
              // Update progress
              if (options.onProgress) {
                options.onProgress(contentType, i, totalItems);
              }
              
              // Process item based on direction
              if (options.direction === 'push') {
                await pushItem(contentType, item);
              } else {
                await pullItem(contentType, item);
              }
              
              contentTypeSummary.success++;
              summary.successCount++;
              summary.totalItems++;
            } catch (itemError) {
              const errorMessage = itemError instanceof Error ? itemError.message : 'Unknown error';
              console.error(`[useCMSSynchronization] Error processing ${contentType} item:`, itemError);
              
              contentTypeSummary.errors++;
              contentTypeSummary.errorMessages.push(errorMessage);
              summary.errorCount++;
              summary.totalItems++;
              
              if (options.onError) {
                options.onError(contentType, itemError instanceof Error ? itemError : new Error(errorMessage));
              }
            }
          }
        } catch (contentTypeError) {
          const errorMessage = contentTypeError instanceof Error ? contentTypeError.message : 'Unknown error';
          console.error(`[useCMSSynchronization] Error processing content type ${contentType}:`, contentTypeError);
          
          contentTypeSummary.errors++;
          contentTypeSummary.errorMessages.push(errorMessage);
          summary.errorCount++;
          
          if (options.onError) {
            options.onError(contentType, contentTypeError instanceof Error ? contentTypeError : new Error(errorMessage));
          }
        }
        
        // Add the content type summary to the overall summary
        summary.contentTypes.push(contentTypeSummary);
      }
    } catch (error) {
      console.error("[useCMSSynchronization] Error:", error);
      toast({
        variant: "destructive",
        title: "Synchronization Error",
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
    
    // Update the end time
    summary.endTime = new Date();
    
    // Call onComplete callback if provided
    if (options.onComplete) {
      options.onComplete(summary);
    }
    
    // If no items were processed, show a toast
    if (summary.totalItems === 0) {
      toast({
        title: "No items to synchronize",
        description: "No content items were found to synchronize."
      });
    } else {
      // Show results toast
      toast({
        title: `Synchronization ${summary.errorCount > 0 ? 'partially ' : ''}completed`,
        description: `${summary.successCount} of ${summary.totalItems} items were successfully ${options.direction === 'push' ? 'pushed' : 'pulled'}.${summary.errorCount > 0 ? ` ${summary.errorCount} errors.` : ''}`
      });
    }
    
    return summary;
  };
  
  return { synchronizeData, canSynchronizeData };
}

/**
 * Get the appropriate content type adapter
 */
async function getContentTypeAdapter(contentType: string): Promise<any> {
  // This would be replaced with actual adapter code
  switch (contentType) {
    case 'business_goals':
      // Return business goals adapter
      return null;
    case 'product_types':
      // Return product types adapter
      return null;
    case 'technologies':
      const { getTechnologyAdapter } = await import('../adapters/technologies/technologyAdapterFactory');
      const { getCMSProviderConfig } = await import('../providerConfig');
      return getTechnologyAdapter(getCMSProviderConfig());
    case 'machines':
      // Return machines adapter
      return null;
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

/**
 * Get all items of a specific content type from the source system
 */
async function getSourceItems(contentType: string, direction: 'push' | 'pull'): Promise<any[]> {
  // This would be replaced with actual code to fetch items
  // If direction is 'push', we get from primary (Supabase)
  // If direction is 'pull', we get from secondary (Strapi)
  
  // This is just a stub for now
  console.log(`[getSourceItems] Getting items for ${contentType}`);
  
  return [];
}

/**
 * Push an item to the destination system
 */
async function pushItem(contentType: string, item: any): Promise<void> {
  // Stub for actually pushing an item
  console.log(`[pushItem] Pushing ${contentType} item:`, item);
}

/**
 * Pull an item from the secondary system
 */
async function pullItem(contentType: string, item: any): Promise<void> {
  // Stub for actually pulling an item
  console.log(`[pullItem] Pulling ${contentType} item:`, item);
}

/**
 * Content types that can be synchronized between CMS providers
 */
export const syncableContentTypes = [
  { id: 'business_goals', label: 'Business Goals' },
  { id: 'product_types', label: 'Product Types' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'machines', label: 'Machines' },
];
