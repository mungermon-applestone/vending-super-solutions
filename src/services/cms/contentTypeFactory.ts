
import { ContentTypeOperations } from './contentTypes/types';

/**
 * Factory class for getting operations for different content types
 */
export class CMSContentTypeFactory {
  private static operationsMap: Record<string, ContentTypeOperations<any>> = {};
  
  /**
   * Register operations for a content type
   * @param contentType Content type identifier
   * @param operations Operations implementation
   */
  static registerOperations<T>(contentType: string, operations: ContentTypeOperations<T>): void {
    CMSContentTypeFactory.operationsMap[contentType] = operations;
  }
  
  /**
   * Get operations for a content type
   * @param contentType Content type identifier
   * @returns Operations for the content type
   */
  static getOperations<T>(contentType: string): ContentTypeOperations<T> {
    const operations = CMSContentTypeFactory.operationsMap[contentType];
    if (!operations) {
      throw new Error(`No operations registered for content type: ${contentType}`);
    }
    return operations as ContentTypeOperations<T>;
  }
  
  /**
   * Check if operations are registered for a content type
   * @param contentType Content type identifier
   * @returns True if operations are registered
   */
  static hasOperations(contentType: string): boolean {
    return !!CMSContentTypeFactory.operationsMap[contentType];
  }
}

// Register operations for all content types
import { productTypeOperations } from './contentTypes/productTypes';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { technologyOperations } from './contentTypes/technologies';
import { caseStudyOperations } from './contentTypes/caseStudies/operations';
import { landingPageOperations } from './contentTypes/landingPages/operations';

// Initialize by registering known content types
CMSContentTypeFactory.registerOperations('product-types', productTypeOperations);
// For businessGoalOperations, we ensure it's compatible with ContentTypeOperations
CMSContentTypeFactory.registerOperations('business-goals', businessGoalOperations);
CMSContentTypeFactory.registerOperations('technologies', technologyOperations);
CMSContentTypeFactory.registerOperations('case-studies', caseStudyOperations);
CMSContentTypeFactory.registerOperations('landing-pages', landingPageOperations);
