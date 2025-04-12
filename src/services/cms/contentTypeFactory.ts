
import { ContentTypeOperations } from './contentTypes/types';
import { productTypeOperations } from './contentTypes/productTypes';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { technologyOperations } from './contentTypes/technologies';
import { caseStudyOperations } from './contentTypes/caseStudies/operations';
import { landingPageOperations } from './contentTypes/landingPages/operations';

/**
 * A factory for accessing different content type operations
 * This makes it easy to add new content types in the future
 */
export class CMSContentTypeFactory {
  private static contentTypes: Record<string, ContentTypeOperations<any>> = {
    'product-types': productTypeOperations,
    'business-goals': businessGoalOperations,
    'technologies': technologyOperations,
    'case-studies': caseStudyOperations,
    'landing-pages': landingPageOperations,
  };
  
  /**
   * Get operations for a specific content type
   * @param contentType The name of the content type
   * @returns ContentTypeOperations for the specified content type
   */
  public static getOperations<T>(contentType: string): ContentTypeOperations<T> {
    if (!this.contentTypes[contentType]) {
      throw new Error(`Content type "${contentType}" not supported.`);
    }
    
    return this.contentTypes[contentType] as ContentTypeOperations<T>;
  }
  
  /**
   * Register a new content type
   * @param name The name of the content type
   * @param operations The operations for the content type
   */
  public static registerContentType<T>(name: string, operations: ContentTypeOperations<T>): void {
    this.contentTypes[name] = operations;
  }
}

export default CMSContentTypeFactory;
