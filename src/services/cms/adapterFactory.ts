
/**
 * CMS Adapter Factory
 * 
 * This module provides a centralized way to get adapters for different content types.
 * It handles the transition from legacy adapters to Contentful adapters.
 */

import { logDeprecationWarning } from './utils/deprecation';

// Import Contentful adapters (these should always be used for new development)
import { contentfulProductAdapter } from './adapters/products/contentfulProductAdapter';
import { contentfulTechnologyAdapter } from './adapters/technologies/contentfulTechnologyAdapter';
import { contentfulBusinessGoalAdapter } from './adapters/businessGoals/contentfulBusinessGoalAdapter';
import { contentfulMachineAdapter } from './adapters/machines/contentfulMachineAdapter';
import { contentfulCaseStudyAdapter } from './adapters/caseStudies/contentfulCaseStudyAdapter';

/**
 * Get the product adapter to use
 * Always returns the Contentful adapter but logs deprecation if legacy name is requested
 */
export function getProductAdapter(type: string = 'contentful') {
  if (type !== 'contentful') {
    logDeprecationWarning(
      `getProductAdapter(${type})`,
      `Legacy adapter type "${type}" is deprecated.`,
      "Use contentful adapter directly."
    );
  }
  
  return contentfulProductAdapter;
}

/**
 * Get the technology adapter to use
 * Always returns the Contentful adapter but logs deprecation if legacy name is requested
 */
export function getTechnologyAdapter(type: string = 'contentful') {
  if (type !== 'contentful') {
    logDeprecationWarning(
      `getTechnologyAdapter(${type})`,
      `Legacy adapter type "${type}" is deprecated.`,
      "Use contentful adapter directly."
    );
  }
  
  return contentfulTechnologyAdapter;
}

/**
 * Get the business goal adapter to use
 * Always returns the Contentful adapter but logs deprecation if legacy name is requested
 */
export function getBusinessGoalAdapter(type: string = 'contentful') {
  if (type !== 'contentful') {
    logDeprecationWarning(
      `getBusinessGoalAdapter(${type})`,
      `Legacy adapter type "${type}" is deprecated.`,
      "Use contentful adapter directly."
    );
  }
  
  return contentfulBusinessGoalAdapter;
}

/**
 * Get the machine adapter to use
 * Always returns the Contentful adapter but logs deprecation if legacy name is requested
 */
export function getMachineAdapter(type: string = 'contentful') {
  if (type !== 'contentful') {
    logDeprecationWarning(
      `getMachineAdapter(${type})`,
      `Legacy adapter type "${type}" is deprecated.`,
      "Use contentful adapter directly."
    );
  }
  
  return contentfulMachineAdapter;
}

/**
 * Get the case study adapter to use
 * Always returns the Contentful adapter but logs deprecation if legacy name is requested
 */
export function getCaseStudyAdapter(type: string = 'contentful') {
  if (type !== 'contentful') {
    logDeprecationWarning(
      `getCaseStudyAdapter(${type})`,
      `Legacy adapter type "${type}" is deprecated.`,
      "Use contentful adapter directly."
    );
  }
  
  return contentfulCaseStudyAdapter;
}

/**
 * Helper to create a generic adapter factory for any content type
 */
export function createAdapterFactory<T>(
  contentfulAdapter: T,
  contentTypeName: string
): (type?: string) => T {
  return (type: string = 'contentful') => {
    if (type !== 'contentful') {
      logDeprecationWarning(
        `get${contentTypeName}Adapter(${type})`,
        `Legacy adapter type "${type}" is deprecated.`,
        "Use contentful adapter directly."
      );
    }
    
    return contentfulAdapter;
  };
}
