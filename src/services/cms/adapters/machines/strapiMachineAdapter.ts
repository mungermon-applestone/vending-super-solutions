
import { CMSMachine } from './types';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Strapi Machine Adapter - DEPRECATED
 * This adapter is maintained only for backward compatibility and as a fallback
 * All methods emit deprecation warnings and return empty results
 */
export const strapiMachineAdapter = {
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  getMachines: async (): Promise<CMSMachine[]> => {
    logDeprecation(
      'strapiMachineAdapter.getMachines',
      'Strapi integration is deprecated',
      'Use Contentful for machine data'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return [];
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  getMachineBySlug: async (slug: string): Promise<CMSMachine | null> => {
    logDeprecation(
      'strapiMachineAdapter.getMachineBySlug',
      `Strapi lookup for machine slug "${slug}" is deprecated`,
      'Use Contentful for machine data'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return null;
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  createMachine: async (machine: Partial<CMSMachine>): Promise<CMSMachine | null> => {
    logDeprecation(
      'strapiMachineAdapter.createMachine',
      'Strapi integration for machine creation is deprecated',
      'Use Contentful UI to manage machine content'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return null;
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  updateMachine: async (id: string, machine: Partial<CMSMachine>): Promise<CMSMachine | null> => {
    logDeprecation(
      'strapiMachineAdapter.updateMachine',
      'Strapi integration for machine updates is deprecated',
      'Use Contentful UI to manage machine content'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return null;
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  deleteMachine: async (id: string): Promise<boolean> => {
    logDeprecation(
      'strapiMachineAdapter.deleteMachine',
      'Strapi integration for machine deletion is deprecated',
      'Use Contentful UI to manage machine content'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return false;
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  getFeaturedMachines: async (limit: number = 4): Promise<CMSMachine[]> => {
    logDeprecation(
      'strapiMachineAdapter.getFeaturedMachines',
      'Strapi integration for featured machines is deprecated',
      'Use Contentful for machine data'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return [];
  },
  
  /**
   * @deprecated Use contentfulMachineAdapter instead
   */
  getMachinesByType: async (type: string): Promise<CMSMachine[]> => {
    logDeprecation(
      'strapiMachineAdapter.getMachinesByType',
      `Strapi lookup for machines of type "${type}" is deprecated`,
      'Use Contentful for machine data'
    );
    console.warn('[strapiMachineAdapter] This adapter is deprecated. Use contentfulMachineAdapter instead.');
    return [];
  }
};
