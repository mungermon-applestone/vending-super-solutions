
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { forceContentfulProvider } from '@/services/cms/cmsInit';

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
  fetchedOn?: string;
}

export function useContentfulProductType(slug: string) {
  forceContentfulProvider();
  
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
        fetchedOn: new Date().toISOString()
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
          
          // Try alternative formatting of the slug (often helps with URL vs DB format differences)
          const alternativeSlug = slug.replace(/-/g, '_');
          let entriesAlt;
          
          // Try a second query with the alternative slug format
          if (alternativeSlug !== slug) {
            try {
              console.log(`[useContentfulProductType] Trying alternative slug format: ${alternativeSlug}`);
              entriesAlt = await client.getEntries({
                content_type: 'productType',
                'fields.slug': alternativeSlug,
                include: 2
              });
              
              if (entriesAlt.items.length > 0) {
                console.log(`[useContentfulProductType] Found product with alternative slug: ${alternativeSlug}`);
                entries.items = entriesAlt.items;
              }
            } catch (e) {
              console.error(`[useContentfulProductType] Error trying alternative slug: ${e}`);
            }
          }
          
          // If still not found, try a fallback query with a broader search
          if (!entries.items.length) {
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
        }

        const entry = entries.items[0];
        
        if (!entry || !entry.fields) {
          console.error(`[useContentfulProductType] Entry or entry.fields is undefined for slug: ${slug}`);
          throw Object.assign(
            new Error(`Invalid product data for slug: ${slug}`),
            { diagnosticInfo }
          );
        }
        
        console.log(`[useContentfulProductType] Found product type:`, {
          id: entry.sys.id,
          title: entry.fields.title,
          slug: entry.fields.slug
        });
        
        const fields = entry.fields;
        
        // Validate that we have the minimum required fields
        if (!fields.title || !fields.slug) {
          console.error(`[useContentfulProductType] Missing required fields for product type: ${slug}`);
          throw Object.assign(
            new Error(`Product data is incomplete: missing required fields`),
            { diagnosticInfo }
          );
        }
        
        const productType = {
          id: entry.sys.id,
          title: fields.title as string,
          slug: fields.slug as string,
          description: fields.description as string,
          benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
          image: fields.image ? {
            id: (fields.image as any).sys.id,
            url: `https:${(fields.image as any).fields.file.url}`,
            alt: (fields.image as any).fields.title || fields.title,
          } : undefined,
          features: fields.features ? (fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon || undefined
          })) : [],
          recommendedMachines: fields.recommendedMachines ? 
            (fields.recommendedMachines as any[]).map(machine => ({
              id: machine.sys.id,
              slug: machine.fields.slug,
              title: machine.fields.title,
              description: machine.fields.description,
              image: machine.fields.images?.[0] ? {
                url: `https:${machine.fields.images[0].fields.file.url}`,
                alt: machine.fields.images[0].fields.title || machine.fields.title
              } : undefined
            })) : []
        };
        
        return {
          ...productType,
          diagnosticInfo
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
    enabled: !!slug
  });
}
