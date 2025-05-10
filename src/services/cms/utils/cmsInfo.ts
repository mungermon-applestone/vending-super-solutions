
/**
 * Utility functions to provide information about the CMS configuration
 */

import { isContentfulConfigured } from '@/config/contentful';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID } from '@/config/contentful';

interface CMSInfo {
  provider: 'contentful';
  isConfigured: boolean;
  version: string;
  status: 'configured' | 'partial' | 'not-configured';
  spaceId?: string;
  environmentId?: string;
  deliveryTokenConfigured: boolean;
  managementTokenConfigured: boolean;
  adminUrl?: string;
}

/**
 * Get information about the current CMS configuration
 * @returns Object with CMS information
 */
export function getCMSInfo(): CMSInfo {
  const isFullyConfigured = isContentfulConfigured();
  const hasSpaceId = !!CONTENTFUL_SPACE_ID;
  const hasEnvironment = !!CONTENTFUL_ENVIRONMENT_ID;
  
  // Determine configuration status
  let status: 'configured' | 'partial' | 'not-configured' = 'not-configured';
  if (isFullyConfigured) {
    status = 'configured';
  } else if (hasSpaceId) {
    status = 'partial';
  }
  
  // Check for token configuration
  const hasDeliveryToken = typeof window !== 'undefined' && 
    ((window.env && window.env.VITE_CONTENTFUL_DELIVERY_TOKEN) || 
    !!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN);
  
  const hasManagementToken = typeof window !== 'undefined' && 
    ((window.env && window.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN) || 
    !!import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN);
  
  return {
    provider: 'contentful',
    isConfigured: isFullyConfigured,
    version: '1.0.0',
    status,
    spaceId: CONTENTFUL_SPACE_ID,
    environmentId: CONTENTFUL_ENVIRONMENT_ID || 'master',
    deliveryTokenConfigured: hasDeliveryToken,
    managementTokenConfigured: hasManagementToken,
    adminUrl: CONTENTFUL_SPACE_ID ? `https://app.contentful.com/spaces/${CONTENTFUL_SPACE_ID}` : undefined
  };
}

/**
 * Check if CMS is properly configured
 * @returns Boolean indicating if CMS is properly configured
 */
export function isCMSConfigured(): boolean {
  return isContentfulConfigured();
}
