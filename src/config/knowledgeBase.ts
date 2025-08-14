/**
 * Knowledge Base Configuration
 * Defines the order of sections and other knowledge base settings
 */

export const KNOWLEDGE_BASE_SECTION_ORDER = [
  'Overview',
  'Before You Start', 
  'Administrative Console',
  'Loader Application',
  'Reports',
  'Customizing the Kiosk',
  'Creating and Managing Promotions',
  'Troubleshooting',
  'FAQ'
] as const;

export type KnowledgeBaseSectionName = typeof KNOWLEDGE_BASE_SECTION_ORDER[number];