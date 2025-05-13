
import { CMSMachine, CMSImage } from '@/types/cms';

/**
 * Normalizes fallback machine data to ensure it conforms to the CMSMachine type
 * Adds missing 'id' property to images and handles other type mismatches
 */
export function normalizeMachineData(machine: any): CMSMachine {
  // Create a copy to avoid mutating the original
  const normalizedMachine = { ...machine };
  
  // Normalize images to ensure they have an 'id' property
  if (normalizedMachine.images && Array.isArray(normalizedMachine.images)) {
    normalizedMachine.images = normalizedMachine.images.map((image, index) => ({
      id: image.id || `${normalizedMachine.id || 'fallback'}-image-${index}`,
      url: image.url,
      alt: image.alt || image.title || `${normalizedMachine.title} image ${index + 1}`
    }));
  }
  
  // Normalize thumbnail if it exists
  if (normalizedMachine.thumbnail && !normalizedMachine.thumbnail.id) {
    normalizedMachine.thumbnail = {
      id: `${normalizedMachine.id || 'fallback'}-thumbnail`,
      url: normalizedMachine.thumbnail.url,
      alt: normalizedMachine.thumbnail.alt || `${normalizedMachine.title} thumbnail`
    };
  }
  
  // Normalize deployment examples if they exist
  if (normalizedMachine.deploymentExamples && Array.isArray(normalizedMachine.deploymentExamples)) {
    normalizedMachine.deploymentExamples = normalizedMachine.deploymentExamples.map((example, index) => {
      // If the example image lacks an id, add one
      if (example.image && !example.image.id) {
        example.image = {
          id: `${normalizedMachine.id || 'fallback'}-deployment-${index}`,
          url: example.image.url,
          alt: example.image.alt || `${example.title} deployment`
        };
      }
      return example;
    });
  }
  
  return normalizedMachine as CMSMachine;
}
