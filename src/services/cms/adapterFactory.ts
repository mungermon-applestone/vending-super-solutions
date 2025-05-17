
/**
 * CMS Adapter Factory
 * 
 * This module provides a centralized way to get adapters for different content types.
 * Only Contentful adapters are supported.
 */

// Import Contentful adapters
import { contentfulProductAdapter } from './adapters/products/contentfulProductAdapter';
import { contentfulTechnologyAdapter } from './adapters/technologies/contentfulTechnologyAdapter';
import { contentfulBusinessGoalAdapter } from './adapters/businessGoals/contentfulBusinessGoalAdapter';
import { contentfulMachineAdapter } from './adapters/machines/contentfulMachineAdapter';
import { contentfulCaseStudyAdapter } from './adapters/caseStudies/contentfulCaseStudyAdapter';

/**
 * Get the product adapter
 * @returns The Contentful product adapter
 */
export function getProductAdapter() {
  return contentfulProductAdapter;
}

/**
 * Get the technology adapter
 * @returns The Contentful technology adapter
 */
export function getTechnologyAdapter() {
  return contentfulTechnologyAdapter;
}

/**
 * Get the business goal adapter
 * @returns The Contentful business goal adapter
 */
export function getBusinessGoalAdapter() {
  return contentfulBusinessGoalAdapter;
}

/**
 * Get the machine adapter
 * @returns The Contentful machine adapter
 */
export function getMachineAdapter() {
  return contentfulMachineAdapter;
}

/**
 * Get the case study adapter
 * @returns The Contentful case study adapter
 */
export function getCaseStudyAdapter() {
  return contentfulCaseStudyAdapter;
}

/**
 * Helper to create a generic adapter factory for any content type
 */
export function createAdapterFactory<T>(
  contentfulAdapter: T,
) {
  return () => contentfulAdapter;
}
