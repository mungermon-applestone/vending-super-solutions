
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { CONTENTFUL_CONFIG } from '@/config/cms';

interface DiagnosticInfo {
  contentfulConfig?: {
    spaceId?: string;
    environment?: string;
    hasToken: boolean;
  };
  contentType?: string;
  endpoint?: string;
  query?: any;
  errorDetails?: string;
  responseData?: any;
  slugVariations?: string[];
}

export function useContentfulProductType(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'productType', slug],
    queryFn: async () => {
      let diagnosticInfo: DiagnosticInfo = {
        contentfulConfig: {
          spaceId: CONTENTFUL_CONFIG.SPACE_ID,
          environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
          hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
        },
        contentType: 'productType',
      };

      if (!slug) {
        console.error('[useContentfulProductType] No slug provided');
        const error = new Error('Product type slug is required');
        throw Object.assign(error, { diagnosticInfo });
      }
      
      console.log(`[useContentfulProductType] Fetching product type with slug: "${slug}"`);
      
      let client;
      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulProductType] Failed to initialize Contentful client, trying refresh', clientError);
        diagnosticInfo.errorDetails = clientError instanceof Error 
          ? clientError.stack || clientError.message
          : JSON.stringify(clientError);

        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulProductType] Failed to refresh Contentful client', refreshError);
          diagnosticInfo.errorDetails = refreshError instanceof Error 
            ? refreshError.stack || refreshError.message
            : JSON.stringify(refreshError);
          throw Object.assign(
            new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`),
            { diagnosticInfo }
          );
        }
      }

      // Prepare query for logging
      const queryParams = {
        content_type: 'productType',
        'fields.slug': slug,
        include: 2
      };
      
      diagnosticInfo.query = queryParams;
      diagnosticInfo.endpoint = `spaces/${CONTENTFUL_CONFIG.SPACE_ID}/environments/${CONTENTFUL_CONFIG.ENVIRONMENT_ID}/entries`;

      try {
        console.log(`[useContentfulProductType] Executing query with params:`, queryParams);
        
        const entries = await client.getEntries(queryParams);
        
        console.log(`[useContentfulProductType] Query response:`, {
          total: entries.total,
          limit: entries.limit,
          skip: entries.skip,
          itemCount: entries.items.length
        });
        
        diagnosticInfo.responseData = {
          total: entries.total,
          limit: entries.limit,
          skip: entries.skip,
          itemCount: entries.items.length
        };

        if (!entries.items.length) {
          console.error(`[useContentfulProductType] No product type found with slug: ${slug}`);
          
          // Let's try a fallback query with a broader search to see what's available
          const fallbackQuery = await client.getEntries({
            content_type: 'productType',
            limit: 5
          });
          
          console.log(`[useContentfulProductType] Fallback found ${fallbackQuery.total} productTypes:`, 
            fallbackQuery.items.map(item => ({
              id: item.sys.id,
              title: item.fields.title,
              slug: item.fields.slug
            }))
          );
          
          diagnosticInfo.responseData = {
            ...diagnosticInfo.responseData,
            fallbackResults: fallbackQuery.items.map(item => ({
              id: item.sys.id,
              title: item.fields.title,
              slug: item.fields.slug
            }))
          };
          
          throw Object.assign(
            new Error(`Product type not found: ${slug}`),
            { diagnosticInfo }
          );
        }

        const entry = entries.items[0];
        
        console.log(`[useContentfulProductType] Found product type:`, {
          id: entry.sys.id,
          title: entry.fields.title,
          slug: entry.fields.slug
        });
        
        return {
          id: entry.sys.id,
          title: entry.fields.title as string,
          slug: entry.fields.slug as string,
          description: entry.fields.description as string,
          benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
          image: entry.fields.image ? {
            id: (entry.fields.image as any).sys.id,
            url: `https:${(entry.fields.image as any).fields.file.url}`,
            alt: (entry.fields.image as any).fields.title || entry.fields.title,
          } : undefined,
          features: entry.fields.features ? (entry.fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon || undefined
          })) : []
        };
      } catch (error) {
        console.error('[useContentfulProductType] Error:', error);
        
        // Enhance the error with diagnostic information
        diagnosticInfo.errorDetails = error instanceof Error 
          ? error.stack || error.message
          : JSON.stringify(error);
          
        throw Object.assign(
          new Error(`Error loading product type: ${error instanceof Error ? error.message : 'Unknown error'}`),
          { diagnosticInfo }
        );
      }
    },
    retry: 1,
    meta: {
      onError: (error: Error & { diagnosticInfo?: DiagnosticInfo }) => {
        toast.error(`Error loading product type: ${error.message}`);
        console.error('[useContentfulProductType] Error:', error);
        
        if (error.diagnosticInfo) {
          console.error('[useContentfulProductType] Diagnostic info:', error.diagnosticInfo);
        }
      }
    },
    select: (data) => {
      // Return both the data and diagnostic info
      return {
        ...data,
        diagnosticInfo: {
          contentfulConfig: {
            spaceId: CONTENTFUL_CONFIG.SPACE_ID,
            environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
            hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
          },
          contentType: 'productType',
          fetchedOn: new Date().toISOString()
        }
      };
    }
  });
}
