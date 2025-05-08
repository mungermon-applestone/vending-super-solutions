
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
        
        const fields = entry.fields;
        
        // Log video-related fields for debugging
        console.log(`[useContentfulProductType] Video-related fields:`, {
          hasVideo: !!fields.video,
          hasYoutubeVideoId: !!fields.youtubeVideoId,
          hasVideoTitle: !!fields.videoTitle,
          hasVideoDescription: !!fields.videoDescription,
          videoTitle: fields.videoTitle,
          videoDescription: fields.videoDescription ? 'Present' : 'Missing',
          hasVideoPreviewImage: !!fields.videoPreviewImage,
          hasVideoOrientation: !!fields.videoOrientation,
          videoOrientation: fields.videoOrientation
        });

        if (fields.videoPreviewImage) {
          console.log('[useContentfulProductType] Video preview image details:', {
            id: fields.videoPreviewImage.sys?.id,
            url: fields.videoPreviewImage.fields?.file?.url,
            title: fields.videoPreviewImage.fields?.title
          });
        }
        
        // Extract text from rich text video description if available
        let plainVideoDescription = '';
        if (fields.videoDescription) {
          if (typeof fields.videoDescription === 'string') {
            plainVideoDescription = fields.videoDescription;
          } else if (fields.videoDescription.content && Array.isArray(fields.videoDescription.content)) {
            // Handle structured Rich Text format
            try {
              // Attempt to extract text from the first paragraph
              const firstParagraph = fields.videoDescription.content.find(item => 
                item.nodeType === 'paragraph' && item.content && Array.isArray(item.content)
              );
              
              if (firstParagraph) {
                plainVideoDescription = firstParagraph.content
                  .filter(node => node.nodeType === 'text')
                  .map(node => node.value)
                  .join('');
              }
              
              console.log('[useContentfulProductType] Extracted video description:', plainVideoDescription);
            } catch (e) {
              console.error('[useContentfulProductType] Error extracting rich text description:', e);
              plainVideoDescription = 'See our product in action';
            }
          }
        }
        
        // Extract and normalize video orientation from Contentful
        let videoOrientation;
        if (fields.videoOrientation) {
          // Handle if videoOrientation is a string
          if (typeof fields.videoOrientation === 'string') {
            // Normalize to lowercase for consistent comparison
            videoOrientation = fields.videoOrientation.toLowerCase();
            console.log(`[useContentfulProductType] Video orientation from string: ${videoOrientation}`);
          }
          // Log the extracted orientation
          console.log(`[useContentfulProductType] Using video orientation: ${videoOrientation}`);
        }
        
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
          // Enhanced video support with better handling
          video: (fields.video || fields.youtubeVideoId) ? {
            title: fields.videoTitle ? String(fields.videoTitle) : 'Product Demo',
            description: plainVideoDescription || 'See our solution in action',
            // Improved thumbnail handling
            thumbnailImage: fields.videoPreviewImage ? {
              id: fields.videoPreviewImage.sys?.id || 'thumbnail-id',
              url: fields.videoPreviewImage.fields?.file?.url ? `https:${fields.videoPreviewImage.fields.file.url}` : '',
              alt: fields.videoPreviewImage.fields?.title || 'Video thumbnail'
            } : fields.image ? {
              id: fields.image.sys?.id || 'image-as-thumbnail',
              url: fields.image.fields?.file?.url ? `https:${fields.image.fields.file.url}` : '',
              alt: fields.image.fields?.title || fields.title || 'Video thumbnail'
            } : null,
            url: fields.video?.fields?.file?.url ? `https:${fields.video.fields.file.url}` : undefined,
            youtubeId: fields.youtubeVideoId ? String(fields.youtubeVideoId) : undefined,
            orientation: videoOrientation // Use the extracted and normalized orientation without default
          } : null
        };
        
        // Log the processed video object
        if (productType.video) {
          console.log('[useContentfulProductType] Processed video object:', {
            title: productType.video.title,
            description: productType.video.description,
            hasThumbnail: !!productType.video.thumbnailImage,
            thumbnailUrl: productType.video.thumbnailImage?.url,
            orientation: productType.video.orientation
          });
        }
        
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
