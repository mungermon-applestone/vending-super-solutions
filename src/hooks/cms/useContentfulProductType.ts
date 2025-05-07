
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
      diagnosticInfo.endpoint = `spaces/${CONTENTFUL_CONFIG.SPACE_ID}/environments/${CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'}/entries`;

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
                title: item.fields?.title || 'No title',
                slug: item.fields?.slug || 'No slug'
              }))
            );
            
            diagnosticInfo.responseData = {
              ...diagnosticInfo.responseData,
              fallbackResults: fallbackQuery.items.map(item => ({
                id: item.sys.id,
                title: item.fields?.title || 'No title',
                slug: item.fields?.slug || 'No slug'
              }))
            };
            
            throw Object.assign(
              new Error(`Product type not found: ${slug}`),
              { diagnosticInfo }
            );
          }
        }

        const entry = entries.items[0];
        
        // Safety check for the entry
        if (!entry) {
          console.error(`[useContentfulProductType] Entry is undefined for slug: ${slug}`);
          throw Object.assign(
            new Error(`No product data available for: ${slug}`),
            { diagnosticInfo }
          );
        }
        
        // Safety check for entry.fields
        if (!entry.fields) {
          console.error(`[useContentfulProductType] Entry.fields is undefined for slug: ${slug}`);
          throw Object.assign(
            new Error(`Invalid product data for slug: ${slug} (missing fields)`),
            { diagnosticInfo }
          );
        }
        
        console.log(`[useContentfulProductType] Found product type:`, {
          id: entry.sys.id,
          title: entry.fields.title || 'No title',
          slug: entry.fields.slug || 'No slug',
          hasVideo: !!entry.fields.video || !!entry.fields.youtubeVideoId 
        });
        
        const fields = entry.fields;
        
        // Create a safe product object with all fields validated
        const productType = {
          id: entry.sys.id,
          title: String(fields.title || ''),
          slug: String(fields.slug || ''),
          description: fields.description ? String(fields.description) : '',
          benefits: Array.isArray(fields.benefits) ? fields.benefits.map(String) : [],
          image: fields.image ? {
            id: fields.image.sys?.id || 'unknown',
            url: fields.image.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
            alt: fields.image.fields?.title || fields.title || '',
          } : null,
          thumbnail: fields.thumbnail ? {
            id: fields.thumbnail.sys?.id || 'unknown',
            url: fields.thumbnail.fields?.file?.url ? `https:${fields.thumbnail.fields.file.url}` : '',
            alt: fields.thumbnail.fields?.title || fields.title || '',
          } : null,
          features: Array.isArray(fields.features) ? fields.features.map(feature => ({
            id: feature.sys?.id || `feature-${Math.random().toString(36).substring(2, 11)}`,
            title: feature.fields?.title || '',
            description: feature.fields?.description || '',
            icon: feature.fields?.icon || undefined
          })) : [],
          recommendedMachines: Array.isArray(fields.recommendedMachines) ? 
            fields.recommendedMachines.map(machine => ({
              id: machine.sys?.id || `machine-${Math.random().toString(36).substring(2, 11)}`,
              slug: machine.fields?.slug || '',
              title: machine.fields?.title || '',
              description: machine.fields?.description || '',
              image: machine.fields?.images && machine.fields.images[0] ? {
                url: `https:${machine.fields.images[0].fields?.file?.url || ''}`,
                alt: machine.fields.images[0].fields?.title || machine.fields?.title || ''
              } : undefined
            })).filter(machine => machine.slug && machine.title) : [],
          // Add video support
          video: (fields.video || fields.youtubeVideoId) ? {
            title: fields.videoTitle ? String(fields.videoTitle) : 'Product Demo',
            description: fields.videoDescription ? String(fields.videoDescription) : 'See our solution in action',
            thumbnailImage: fields.videoThumbnail ? {
              id: fields.videoThumbnail.sys?.id || 'thumbnail-id',
              url: fields.videoThumbnail.fields?.file?.url ? `https:${fields.videoThumbnail.fields.file.url}` : '',
              alt: fields.videoThumbnail.fields?.title || 'Video thumbnail'
            } : fields.image ? {
              id: fields.image.sys?.id || 'image-as-thumbnail',
              url: fields.image.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
              alt: fields.image.fields?.title || fields.title || 'Video thumbnail'
            } : {
              id: 'default-thumbnail',
              url: '/placeholder.svg',
              alt: 'Video thumbnail'
            },
            url: fields.video?.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
            youtubeId: fields.youtubeVideoId ? String(fields.youtubeVideoId) : undefined
          } : undefined
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
