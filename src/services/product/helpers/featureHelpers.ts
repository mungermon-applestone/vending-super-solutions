
import { CMSFeature } from '@/types/cms';

/**
 * Check if the feature icon is a string
 */
export const isFeatureIconString = (icon: any): icon is string => {
  return typeof icon === 'string';
};

/**
 * Parse feature data from any source and ensure it matches the CMSFeature interface
 * @param featureData Raw feature data
 * @returns Cleaned feature object conforming to CMSFeature interface
 */
export const parseFeatureData = (featureData: any): CMSFeature => {
  return {
    id: featureData.id || `feature-${Math.random().toString(36).substring(2, 9)}`,
    title: featureData.title || '',
    description: featureData.description || '',
    icon: featureData.icon || undefined,
    screenshot: featureData.screenshot ? {
      id: featureData.screenshot.id || 'screenshot',
      url: featureData.screenshot.url || '',
      alt: String(featureData.screenshot.alt || featureData.title || 'Feature image')
    } : undefined
  };
};
