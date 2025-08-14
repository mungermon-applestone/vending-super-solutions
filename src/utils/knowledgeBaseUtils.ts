/**
 * Knowledge Base Utilities
 * Functions for sorting sections and articles according to business rules
 */

import { KNOWLEDGE_BASE_SECTION_ORDER } from '@/config/knowledgeBase';
import { ContentfulHelpDeskArticle } from '@/services/cms/adapters/helpDeskArticles/contentfulHelpDeskArticleAdapter';

/**
 * Sorts section categories according to predefined order
 * Unknown sections appear at the end, sorted alphabetically
 */
export function sortSectionsByOrder(sections: string[]): string[] {
  return sections.sort((a, b) => {
    const indexA = KNOWLEDGE_BASE_SECTION_ORDER.indexOf(a as any);
    const indexB = KNOWLEDGE_BASE_SECTION_ORDER.indexOf(b as any);
    
    // If both sections are in the predefined order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only A is in the predefined order, it comes first
    if (indexA !== -1 && indexB === -1) {
      return -1;
    }
    
    // If only B is in the predefined order, it comes first
    if (indexA === -1 && indexB !== -1) {
      return 1;
    }
    
    // If neither is in the predefined order, sort alphabetically
    return a.localeCompare(b);
  });
}

/**
 * Sorts articles within a section according to business rules:
 * 1. Primary sort: orderWithinSection (ascending, null/undefined last)
 * 2. Secondary sort: alphabetical by articleTitle
 */
export function sortArticlesWithinSection(articles: ContentfulHelpDeskArticle[]): ContentfulHelpDeskArticle[] {
  return articles.sort((a, b) => {
    const orderA = a.fields.orderWithinSection;
    const orderB = b.fields.orderWithinSection;
    
    // If both have order values, sort by order
    if (orderA != null && orderB != null) {
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // If same order value, fall back to alphabetical
      return a.fields.articleTitle.localeCompare(b.fields.articleTitle);
    }
    
    // If only A has an order value, it comes first
    if (orderA != null && orderB == null) {
      return -1;
    }
    
    // If only B has an order value, it comes first
    if (orderA == null && orderB != null) {
      return 1;
    }
    
    // If neither has an order value, sort alphabetically
    return a.fields.articleTitle.localeCompare(b.fields.articleTitle);
  });
}

/**
 * Sorts and processes articles grouped by category
 * Returns categories in predefined order with articles sorted within each category
 */
export function sortArticlesByCategory(
  groupedArticles: Record<string, ContentfulHelpDeskArticle[]>
): [string, ContentfulHelpDeskArticle[]][] {
  const sortedCategories = sortSectionsByOrder(Object.keys(groupedArticles));
  
  return sortedCategories.map(category => [
    category,
    sortArticlesWithinSection(groupedArticles[category])
  ]);
}