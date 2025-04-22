/**
 * Simplified data synchronization utility
 * This replaces the previous Supabase-based sync implementation
 */

export interface SyncOptions {
  contentTypes: string[];
  direction: 'push' | 'pull';
  onProgress?: (contentType: string, progress: number, total: number) => void;
  onError?: (contentType: string, error: Error) => void;
  onComplete?: (summary: SyncSummary) => void;
}

export interface ContentTypeSummary {
  type: string;
  success: number;
  errors: number;
}

export interface SyncSummary {
  startTime: Date;
  endTime: Date;
  totalItems: number;
  successCount: number;
  errorCount: number;
  contentTypes?: ContentTypeSummary[];
}

export interface SyncStatus {
  inProgress: boolean;
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

export const syncableContentTypes = [
  { id: 'machines', label: 'Machines' },
  { id: 'business_goals', label: 'Business Goals' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'case_studies', label: 'Case Studies' }
];

export const useCMSSynchronization = () => {
  const synchronizeData = async (options: SyncOptions): Promise<SyncSummary> => {
    const startTime = new Date();
    
    // Simulating a sync process since we don't need this functionality anymore
    // but we're keeping the interface for components that might need it
    const contentTypeSummaries: ContentTypeSummary[] = [];
    
    // Simulate progress for each content type
    for (const contentType of options.contentTypes) {
      try {
        const total = 5; // Mock number of items
        
        // Simulate incremental progress
        for (let i = 1; i <= total; i++) {
          if (options.onProgress) {
            options.onProgress(contentType, i, total);
          }
          
          // Simulate some processing time
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        contentTypeSummaries.push({
          type: contentType,
          success: total,
          errors: 0
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        
        if (options.onError) {
          options.onError(contentType, err);
        }
        
        contentTypeSummaries.push({
          type: contentType,
          success: 0,
          errors: 1
        });
      }
    }
    
    const endTime = new Date();
    const successCount = contentTypeSummaries.reduce((sum, item) => sum + item.success, 0);
    const errorCount = contentTypeSummaries.reduce((sum, item) => sum + item.errors, 0);
    
    const summary = {
      startTime,
      endTime,
      totalItems: successCount + errorCount,
      successCount,
      errorCount,
      contentTypes: contentTypeSummaries
    };
    
    if (options.onComplete) {
      options.onComplete(summary);
    }
    
    return summary;
  };
  
  const canSynchronizeData = () => {
    // Since we're moving away from the dual-CMS setup, return false
    return false;
  };
  
  return {
    synchronizeData,
    canSynchronizeData
  };
};
