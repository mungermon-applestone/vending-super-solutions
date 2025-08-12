/**
 * Contentful Product Preview Adapter for draft content
 */

import { Entry } from 'contentful';
import { CMSProductType } from '@/types/cms';
import { ProductAdapter } from './types';
import { contentfulPreviewClient } from '@/services/cms/utils/contentfulPreviewClient';
import { getStringField, getAssetUrl, getArrayField } from '@/utils/contentful/dataExtractors';
import { handleCmsError } from '../baseCmsAdapter';

/**
 * Transform Contentful entry to CMSProduct for preview
 */
function transformPreviewEntry(entry: Entry<any>): CMSProductType {
  const fields = entry.fields;
  
  const imageUrl = getAssetUrl(fields.image);
  
  return {
    id: entry.sys.id,
    title: getStringField(entry, 'title'),
    slug: getStringField(entry, 'slug'),
    description: getStringField(entry, 'description'),
    image: imageUrl ? { 
      id: 'image-id',
      url: imageUrl,
      alt: getStringField(entry, 'imageAlt', 'Product image')
    } : undefined,
    benefits: getArrayField(entry, 'benefits', []),
    features: getArrayField(entry, 'features', []).map((feature: any) => ({
      id: feature.sys?.id || 'unknown',
      title: getStringField(feature, 'title'),
      description: getStringField(feature, 'description')
    })),
    recommendedMachines: getArrayField(entry, 'recommendedMachines', []).map((machine: any) => ({
      id: machine.sys?.id || 'unknown',
      slug: getStringField(machine, 'slug'),
      title: getStringField(machine, 'title') || getStringField(machine, 'name'),
      description: getStringField(machine, 'description')
    })),
    created_at: entry.sys.createdAt,
    updated_at: entry.sys.updatedAt
  };
}

/**
 * Preview adapter for Contentful products (draft content)
 */
export const contentfulProductPreviewAdapter: Omit<ProductAdapter, 'create' | 'update' | 'delete' | 'clone'> = {
  /**
   * Get all products including drafts
   */
  getAll: async (filters = {}) => {
    try {
      console.log('[Preview] Fetching all products including drafts with filters:', filters);
      
      const response = await contentfulPreviewClient.getEntries({
        content_type: 'product',
        include: 2,
        ...filters
      });

      const products = response.items.map(transformPreviewEntry);
      
      console.log(`[Preview] Found ${products.length} products (including drafts)`);
      return products;
    } catch (error) {
      console.error('[Preview] Error fetching products:', error);
      return handleCmsError(error, 'fetch');
    }
  },

  /**
   * Get product by slug including drafts
   */
  getBySlug: async (slug: string) => {
    try {
      console.log(`[Preview] Fetching product by slug: ${slug} (including drafts)`);
      
      const response = await contentfulPreviewClient.getEntries({
        content_type: 'product',
        'fields.slug': slug,
        include: 2,
        limit: 1
      });

      if (response.items.length === 0) {
        console.log(`[Preview] Product not found: ${slug}`);
        return null;
      }

      const product = transformPreviewEntry(response.items[0]);
      console.log(`[Preview] Found product: ${product.title}`);
      return product;
    } catch (error) {
      console.error(`[Preview] Error fetching product ${slug}:`, error);
      return handleCmsError(error, 'fetch');
    }
  },

  /**
   * Get product by ID including drafts
   */
  getById: async (id: string) => {
    try {
      console.log(`[Preview] Fetching product by ID: ${id} (including drafts)`);
      
      const entry = await contentfulPreviewClient.getEntry(id, { include: 2 });
      const product = transformPreviewEntry(entry);
      
      console.log(`[Preview] Found product: ${product.title}`);
      return product;
    } catch (error) {
      console.error(`[Preview] Error fetching product ${id}:`, error);
      return handleCmsError(error, 'fetch');
    }
  }
};