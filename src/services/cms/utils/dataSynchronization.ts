import { getCMSProviderConfig, ContentProviderType, isUsingProvider } from '../providerConfig';
import { getTechnologyAdapter } from '../adapters/technologies/technologyAdapterFactory';

/**
 * Defines the content types that can be synchronized between CMS providers
 */
export const syncableContentTypes = [
  { id: 'technologies', label: 'Technologies' },
  { id: 'machines', label: 'Machines' },
  { id: 'product-types', label: 'Product Types' },
  { id: 'business-goals', label: 'Business Goals' },
  { id: 'testimonials', label: 'Testimonials' }
];

/**
 * Options for synchronization operations
 */
export interface SyncOptions {
  /** Content types to synchronize */
  contentTypes: string[];
  /** Direction of synchronization */
  direction: 'push' | 'pull';
  /** Progress callback */
  onProgress?: (contentType: string, current: number, total: number) => void;
  /** Error callback */
  onError?: (contentType: string, error: Error) => void;
}

/**
 * Represents the status of a synchronization operation
 */
export interface SyncStatus {
  /** Whether synchronization is in progress */
  inProgress: boolean;
  /** Current progress, if available */
  progress: { contentType: string; current: number; total: number } | null;
  /** Errors that occurred during synchronization */
  errors: Array<{ contentType: string; message: string }>;
  /** Summary of the synchronization operation */
  summary?: SyncSummary;
}

/**
 * Summary of a completed synchronization operation
 */
export interface SyncSummary {
  /** Number of items successfully synchronized */
  successCount: number;
  /** Number of items that failed to synchronize */
  errorCount: number;
  /** Time the synchronization operation started */
  startTime: Date;
  /** Time the synchronization operation ended */
  endTime: Date;
}

/**
 * Hooks and utilities for CMS data synchronization
 */
export const useCMSSynchronization = () => {
  /**
   * Synchronize data between two CMS providers
   * @param options Synchronization options
   * @returns Summary of the synchronization operation
   */
  const synchronizeData = async (options: SyncOptions): Promise<SyncSummary> => {
    // Start timing the operation
    const startTime = new Date();
    
    // Initialize counters
    let successCount = 0;
    let errorCount = 0;
    
    // Get the current provider config
    const config = getCMSProviderConfig();
    
    // Determine source and target based on direction
    const isStrapi = isUsingProvider(ContentProviderType.STRAPI);
    const targetCmsName = isStrapi ? 'Strapi' : 'Supabase';
    
    console.log(`[synchronizeData] Starting synchronization to ${targetCmsName}`);
    
    // Process each selected content type
    for (const contentType of options.contentTypes) {
      try {
        // For now, we only implement technology synchronization
        if (contentType === 'technologies') {
          const technologyAdapter = getTechnologyAdapter(config);
          
          // Get all technologies
          const technologies = await technologyAdapter.getAll();
          
          if (options.onProgress) {
            options.onProgress(contentType, 0, technologies.length);
          }
          
          // For demo purposes, we just log what would happen
          console.log(`[synchronizeData] Would synchronize ${technologies.length} technologies to ${targetCmsName}`);
          
          // Process each technology
          for (let i = 0; i < technologies.length; i++) {
            const technology = technologies[i];
            
            try {
              // Here we would perform the actual synchronization
              // This is a placeholder for the actual implementation
              console.log(`[synchronizeData] Processing technology: ${technology.title}`);
              
              // Update progress
              if (options.onProgress) {
                options.onProgress(contentType, i + 1, technologies.length);
              }
              
              // Simulate success
              successCount++;
            } catch (error) {
              console.error(`[synchronizeData] Error processing technology ${technology.id}:`, error);
              errorCount++;
              
              if (options.onError) {
                options.onError(contentType, error instanceof Error ? error : new Error(String(error)));
              }
            }
          }
        } else {
          // Other content types would be implemented here
          console.log(`[synchronizeData] Synchronization for ${contentType} not yet implemented`);
        }
      } catch (error) {
        console.error(`[synchronizeData] Error synchronizing ${contentType}:`, error);
        errorCount++;
        
        if (options.onError) {
          options.onError(contentType, error instanceof Error ? error : new Error(String(error)));
        }
      }
    }
    
    // Complete the operation
    const endTime = new Date();
    
    console.log(`[synchronizeData] Synchronization completed. Success: ${successCount}, Errors: ${errorCount}`);
    
    return {
      successCount,
      errorCount,
      startTime,
      endTime
    };
  };
  
  /**
   * Check if data synchronization is available
   * @returns True if synchronization can be performed
   */
  const canSynchronizeData = (): boolean => {
    // For now, we'll just check if we're using Strapi
    return isUsingProvider(ContentProviderType.STRAPI);
  };
  
  return {
    synchronizeData,
    canSynchronizeData
  };
};
