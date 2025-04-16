
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulAsset } from '@/types/contentful';
import { CMSProductType } from '@/types/cms';
import { normalizeSlug, getSlugVariations } from '@/services/cms/utils/slugMatching';
import { toast } from 'sonner';

// Define the structure of a product in Contentful
interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    image?: ContentfulAsset;
    benefits?: string[];
    features?: Array<{
      sys: { id: string };
      fields: {
        title: string;
        description: string;
        icon?: string;
      }
    }>;
    visible?: boolean;
  };
}

// Transform Contentful product to our internal format
const transformProduct = (entry: ContentfulProduct): CMSProductType => {
  return {
    id: entry.sys.id,
    title: entry.fields.title,
    slug: entry.fields.slug,
    description: entry.fields.description,
    benefits: entry.fields.benefits || [],
    image: entry.fields.image ? {
      id: entry.fields.image.sys.id,
      url: `https:${entry.fields.image.fields.file.url}`,
      alt: entry.fields.image.fields.title || entry.fields.title,
    } : undefined,
    features: entry.fields.features ? entry.fields.features.map(feature => ({
      id: feature.sys.id,
      title: feature.fields.title,
      description: feature.fields.description,
      icon: feature.fields.icon || 'check'
    })) : [],
    visible: entry.fields.visible !== false
  };
};

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      
      if (!slug) {
        throw new Error('No slug provided');
      }
      
      try {
        // First check if we have a direct match on the slug
        console.log(`[useContentfulProduct] Trying direct slug match for: "${slug}"`);
        
        // IMPORTANT: Using productType content type ID to match Contentful schema
        const entries = await fetchContentfulEntries<ContentfulProduct>('productType', {
          'fields.slug': slug,
          limit: 1
        });
        
        console.log(`[useContentfulProduct] Found ${entries.length} entries for slug ${slug}`);
        
        if (entries.length > 0) {
          const transformedProduct = transformProduct(entries[0]);
          console.log('[useContentfulProduct] Successfully fetched Contentful product:', transformedProduct);
          return transformedProduct;
        }
        
        // If no direct match, try with alternate slug variations
        console.log(`[useContentfulProduct] No direct match, trying alternate variations`);
        const slugVariations = getSlugVariations(slug);
        
        for (const variation of slugVariations) {
          if (variation === slug) continue; // Skip the one we already tried
          
          console.log(`[useContentfulProduct] Trying variation: "${variation}"`);
          const variationEntries = await fetchContentfulEntries<ContentfulProduct>('productType', {
            'fields.slug': variation,
            limit: 1
          });
          
          if (variationEntries.length > 0) {
            const transformedProduct = transformProduct(variationEntries[0]);
            console.log(`[useContentfulProduct] Found product with variation "${variation}":`, transformedProduct);
            return transformedProduct;
          }
        }
        
        console.log(`[useContentfulProduct] No product found for slug: ${slug}`);
        throw new Error(`No product found with slug "${slug}"`);
      } catch (error) {
        console.error(`[useContentfulProduct] Error fetching product:`, error);
        throw error;
      }
    },
    enabled: !!slug,
    meta: {
      onError: (error: Error) => {
        if (!error.message.includes("No product found")) {
          toast.error(`Error loading product: ${error.message}`);
        }
      }
    }
  });
}
