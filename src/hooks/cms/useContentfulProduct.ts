
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntryBySlug } from '@/services/cms/utils/contentfulClient';
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

// Define fallback product data for preview environment
const fallbackProductData: Record<string, CMSProductType> = {
  'cannabis-vending': {
    id: 'fallback-cannabis',
    title: 'Cannabis Vending',
    slug: 'cannabis-vending',
    description: 'Secure solutions for cannabis products with age verification and compliance features.',
    benefits: [
      'Age verification and compliance',
      'Secure product dispensing',
      'Inventory tracking',
      'Temperature control'
    ],
    image: {
      id: 'fallback-image',
      url: 'https://images.unsplash.com/photo-1560913210-91e811632701',
      alt: 'Cannabis Vending Machine',
    },
    features: [
      {
        id: 'feature-1',
        title: 'Age Verification',
        description: 'Built-in ID scanning and verification to ensure legal compliance',
        icon: 'shield'
      },
      {
        id: 'feature-2',
        title: 'Secure Storage',
        description: 'Tamper-proof design keeps products secure until authorized purchase',
        icon: 'lock'
      },
      {
        id: 'feature-3',
        title: 'Compliance Reporting',
        description: 'Automated reporting for regulatory compliance',
        icon: 'clipboard'
      }
    ]
  },
  'grocery-vending': {
    id: 'fallback-grocery',
    title: 'Grocery Vending',
    slug: 'grocery-vending',
    description: 'Temperature-controlled vending solutions for grocery items, snacks, and beverages.',
    benefits: [
      'Temperature control',
      'Fresh food dispensing',
      'Contactless shopping',
      'Inventory management'
    ],
    image: {
      id: 'fallback-image',
      url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a',
      alt: 'Grocery Vending Machine',
    },
    features: [
      {
        id: 'feature-1',
        title: 'Temperature Control',
        description: 'Maintain optimal temperature for different food products',
        icon: 'thermometer'
      },
      {
        id: 'feature-2',
        title: 'Freshness Monitoring',
        description: 'Track product expiration and ensure freshness',
        icon: 'calendar'
      },
      {
        id: 'feature-3',
        title: 'Contactless Purchasing',
        description: 'Touchless interface for hygienic shopping experience',
        icon: 'hand'
      }
    ]
  }
};

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      try {
        // First check if we have a direct match on the slug
        console.log(`[useContentfulProduct] Trying direct slug match for: "${slug}"`);
        
        // IMPORTANT: Use productType content type ID to match Contentful schema
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
        
        // If nothing found in Contentful, check fallback data
        console.warn(`[useContentfulProduct] No product found in Contentful for slug: ${slug}, checking fallbacks`);
        
        // Try direct match with fallback data first
        if (fallbackProductData[slug]) {
          console.log(`[useContentfulProduct] Using fallback data for: ${slug}`);
          return fallbackProductData[slug];
        }
        
        // Try with normalized slug for fallbacks
        const normalizedSlug = normalizeSlug(slug);
        if (fallbackProductData[normalizedSlug]) {
          console.log(`[useContentfulProduct] Using fallback data with normalized slug: ${normalizedSlug}`);
          return fallbackProductData[normalizedSlug];
        }
        
        // If no fallback found, return null
        console.log(`[useContentfulProduct] No product found for slug: ${slug}`);
        return null;
      } catch (error) {
        console.error(`[useContentfulProduct] Error fetching product:`, error);
        
        // Always check for fallback data if there's an error with Contentful
        if (fallbackProductData[slug]) {
          console.log(`[useContentfulProduct] Using fallback data after error for: ${slug}`);
          return fallbackProductData[slug];
        }
        
        // Also try normalized slug for fallbacks
        const normalizedSlug = normalizeSlug(slug);
        if (fallbackProductData[normalizedSlug]) {
          console.log(`[useContentfulProduct] Using fallback data with normalized slug after error: ${normalizedSlug}`);
          return fallbackProductData[normalizedSlug];
        }
        
        return null; // Return null instead of throwing to avoid breaking UI
      }
    },
    enabled: !!slug,
    meta: {
      onError: (error: Error) => {
        // Only show error toast for non-fallback errors
        if (!(error.message.includes("No product found") || error.message.includes("Missing Contentful configuration"))) {
          toast.error(`Error loading product: ${error.message}`);
        }
      }
    }
  });
}
