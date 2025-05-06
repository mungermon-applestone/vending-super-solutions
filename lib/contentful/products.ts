
import { getContentfulClient } from './client';
import { CMSProductType, CMSFeature, CMSImage } from '@/types/cms';

/**
 * Get all product types from Contentful
 */
export async function getProductTypes(): Promise<CMSProductType[]> {
  try {
    const client = getContentfulClient();
    
    const entries = await client.getEntries({
      content_type: 'productType',
      include: 2,
      limit: 100,
    });
    
    return entries.items.map(entry => {
      const fields = entry.fields;
      
      const product: CMSProductType = {
        id: entry.sys.id,
        title: fields.title as string,
        slug: fields.slug as string,
        description: fields.description as string,
        visible: fields.visible as boolean ?? true,
        benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
        
        // Process main image if available
        image: fields.image ? {
          id: (fields.image as any).sys.id,
          url: `https:${(fields.image as any).fields.file.url}`,
          alt: (fields.image as any).fields.title || fields.title,
        } : undefined,
        
        // Process thumbnail if available
        thumbnail: fields.thumbnail ? {
          id: (fields.thumbnail as any).sys.id,
          url: `https:${(fields.thumbnail as any).fields.file.url}`,
          alt: (fields.thumbnail as any).fields.title || fields.title,
        } : undefined,
        
        // Process features
        features: fields.features ? (fields.features as any[]).map(feature => ({
          id: feature.sys.id,
          title: feature.fields.title,
          description: feature.fields.description,
          icon: feature.fields.icon || undefined,
          screenshot: feature.fields.screenshot ? {
            id: feature.fields.screenshot.sys.id,
            url: `https:${feature.fields.screenshot.fields.file.url}`,
            alt: feature.fields.screenshot.fields.title || feature.fields.title
          } : undefined
        })) : []
      };
      
      return product;
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
}

/**
 * Get a product type by slug
 */
export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  if (!slug || slug.trim() === '') {
    return null;
  }
  
  try {
    const client = getContentfulClient();
    
    const entries = await client.getEntries({
      content_type: 'productType',
      'fields.slug': slug,
      include: 2,
      limit: 1,
    });
    
    if (!entries.items.length) {
      console.log(`No product found with slug: "${slug}"`);
      return null;
    }
    
    const entry = entries.items[0];
    const fields = entry.fields;
    
    const product: CMSProductType = {
      id: entry.sys.id,
      title: fields.title as string,
      slug: fields.slug as string,
      description: fields.description as string,
      visible: fields.visible as boolean ?? true,
      benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
      
      // Process main image if available
      image: fields.image ? {
        id: (fields.image as any).sys.id,
        url: `https:${(fields.image as any).fields.file.url}`,
        alt: (fields.image as any).fields.title || fields.title,
      } : undefined,
      
      // Process thumbnail if available
      thumbnail: fields.thumbnail ? {
        id: (fields.thumbnail as any).sys.id,
        url: `https:${(fields.thumbnail as any).fields.file.url}`,
        alt: (fields.thumbnail as any).fields.title || fields.title,
      } : undefined,
      
      // Process features
      features: fields.features ? (fields.features as any[]).map(feature => ({
        id: feature.sys.id,
        title: feature.fields.title,
        description: feature.fields.description,
        icon: feature.fields.icon || undefined,
        screenshot: feature.fields.screenshot ? {
          id: feature.fields.screenshot.sys.id,
          url: `https:${feature.fields.screenshot.fields.file.url}`,
          alt: feature.fields.screenshot.fields.title || feature.fields.title
        } : undefined
      })) : []
    };
    
    return product;
  } catch (error) {
    console.error(`Error fetching product type by slug "${slug}":`, error);
    return null;
  }
}
