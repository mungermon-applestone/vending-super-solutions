
import { useState } from 'react';
import { getCMSProviderConfig, ContentProviderType } from '../providerConfig';
import { getTechnologyBySlug, getTechnologies, createTechnology, updateTechnology } from '../technologies';
import { getProductTypeBySlug, getProductTypes, createProductType, updateProductType } from '../productTypes';
import { getBusinessGoalBySlug, getBusinessGoals, createBusinessGoal, updateBusinessGoal } from '../businessGoals';

// Define content types that can be synchronized
export const syncableContentTypes = [
  { id: 'technologies', label: 'Technologies' },
  { id: 'productTypes', label: 'Product Types' },
  { id: 'businessGoals', label: 'Business Goals' },
  { id: 'machines', label: 'Machines' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'caseStudies', label: 'Case Studies' }
];

// Data synchronization options
export interface SyncOptions {
  contentTypes: string[];
  direction: 'push' | 'pull';
  onProgress?: (contentType: string, progress: number, total: number) => void;
  onError?: (contentType: string, error: Error) => void;
  onComplete?: (summary: SyncSummary) => void;
}

// Sync progress status
export interface SyncStatus {
  inProgress: boolean;
  progress: {
    contentType: string;
    current: number;
    total: number;
  } | null;
  errors: {
    contentType: string;
    message: string;
  }[];
  summary?: SyncSummary;
}

// Sync completion summary
export interface SyncSummary {
  successCount: number;
  errorCount: number;
  startTime: Date;
  endTime: Date;
  totalItems?: number;
  contentTypes?: string[];
}

/**
 * Custom hook to handle CMS data synchronization
 */
export function useCMSSynchronization() {
  const [status, setStatus] = useState<SyncStatus>({
    inProgress: false,
    progress: null,
    errors: []
  });

  // Check if data synchronization is available
  const canSynchronizeData = () => {
    // For now, we're just checking if the CMS provider is configured
    const config = getCMSProviderConfig();
    return !!config;
  };

  // Synchronize data between CMS providers
  const synchronizeData = async (options: SyncOptions): Promise<SyncSummary> => {
    const startTime = new Date();
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const contentType of options.contentTypes) {
        try {
          switch (contentType) {
            case 'technologies':
              const techResult = await synchronizeTechnologies(options);
              successCount += techResult.success;
              errorCount += techResult.error;
              break;
            case 'productTypes':
              const productResult = await synchronizeProductTypes(options);
              successCount += productResult.success;
              errorCount += productResult.error;
              break;
            case 'businessGoals':
              const goalResult = await synchronizeBusinessGoals(options);
              successCount += goalResult.success;
              errorCount += goalResult.error;
              break;
            // Add more content types as needed
            default:
              console.log(`[synchronizeData] Content type not implemented: ${contentType}`);
              break;
          }
        } catch (error) {
          errorCount++;
          if (options.onError) {
            options.onError(contentType, error instanceof Error ? error : new Error(String(error)));
          }
        }
      }

      const summary: SyncSummary = {
        successCount,
        errorCount,
        startTime,
        endTime: new Date(),
        totalItems: successCount + errorCount,
        contentTypes: options.contentTypes
      };

      if (options.onComplete) {
        options.onComplete(summary);
      }

      return summary;
    } catch (error) {
      console.error('[synchronizeData] Error during synchronization:', error);
      throw error;
    }
  };

  return {
    status,
    canSynchronizeData,
    synchronizeData
  };
}

// Synchronize technologies between CMS providers
async function synchronizeTechnologies(options: SyncOptions): Promise<{ success: number; error: number }> {
  let success = 0;
  let error = 0;
  
  try {
    const config = getCMSProviderConfig();
    const currentProvider = config.type;
    const targetProvider = currentProvider === ContentProviderType.STRAPI 
      ? ContentProviderType.SUPABASE 
      : ContentProviderType.STRAPI;
    
    // Fetch all technologies from current provider
    const technologies = await getTechnologies();
    
    if (options.onProgress) {
      options.onProgress('technologies', 0, technologies.length);
    }
    
    // Process each technology
    for (let i = 0; i < technologies.length; i++) {
      const tech = technologies[i];
      
      try {
        // Check if technology exists in target provider
        const targetTech = await getTechnologyBySlug(tech.slug);
        
        if (targetTech) {
          // Update existing technology
          await updateTechnology(targetTech.id, {
            title: tech.title,
            description: tech.description,
            visible: tech.visible
          });
        } else {
          // Create new technology
          await createTechnology({
            title: tech.title,
            slug: tech.slug,
            description: tech.description,
            visible: tech.visible
          });
        }
        
        success++;
      } catch (e) {
        error++;
        if (options.onError) {
          options.onError('technologies', e instanceof Error ? e : new Error(String(e)));
        }
      }
      
      if (options.onProgress) {
        options.onProgress('technologies', i + 1, technologies.length);
      }
    }
    
    return { success, error };
  } catch (e) {
    console.error('[synchronizeTechnologies] Error:', e);
    throw e;
  }
}

// Synchronize product types between CMS providers
async function synchronizeProductTypes(options: SyncOptions): Promise<{ success: number; error: number }> {
  let success = 0;
  let error = 0;
  
  try {
    // Similar implementation as synchronizeTechnologies
    const products = await getProductTypes();
    
    if (options.onProgress) {
      options.onProgress('productTypes', 0, products.length);
    }
    
    // Process each product type
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        const targetProduct = await getProductTypeBySlug(product.slug);
        
        if (targetProduct) {
          await updateProductType(targetProduct.id, {
            title: product.title,
            description: product.description,
            visible: product.visible !== false
          });
        } else {
          await createProductType({
            title: product.title,
            slug: product.slug,
            description: product.description,
            visible: product.visible !== false
          });
        }
        
        success++;
      } catch (e) {
        error++;
        if (options.onError) {
          options.onError('productTypes', e instanceof Error ? e : new Error(String(e)));
        }
      }
      
      if (options.onProgress) {
        options.onProgress('productTypes', i + 1, products.length);
      }
    }
    
    return { success, error };
  } catch (e) {
    console.error('[synchronizeProductTypes] Error:', e);
    throw e;
  }
}

// Synchronize business goals between CMS providers
async function synchronizeBusinessGoals(options: SyncOptions): Promise<{ success: number; error: number }> {
  let success = 0;
  let error = 0;
  
  try {
    const goals = await getBusinessGoals();
    
    if (options.onProgress) {
      options.onProgress('businessGoals', 0, goals.length);
    }
    
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      
      try {
        const targetGoal = await getBusinessGoalBySlug(goal.slug);
        
        if (targetGoal) {
          await updateBusinessGoal(targetGoal.id, {
            title: goal.title,
            description: goal.description,
            visible: goal.visible
          });
        } else {
          await createBusinessGoal({
            title: goal.title,
            slug: goal.slug,
            description: goal.description,
            visible: goal.visible
          });
        }
        
        success++;
      } catch (e) {
        error++;
        if (options.onError) {
          options.onError('businessGoals', e instanceof Error ? e : new Error(String(e)));
        }
      }
      
      if (options.onProgress) {
        options.onProgress('businessGoals', i + 1, goals.length);
      }
    }
    
    return { success, error };
  } catch (e) {
    console.error('[synchronizeBusinessGoals] Error:', e);
    throw e;
  }
}
