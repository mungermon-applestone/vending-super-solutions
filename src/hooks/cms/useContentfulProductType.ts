
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';
import { productFallbacks } from '@/data/productFallbacks';
import { Document } from '@contentful/rich-text-types';

export function useContentfulProductType(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'productType', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('[useContentfulProductType] No slug provided');
        throw new Error('Product slug is required');
      }
      
      console.log(`[useContentfulProductType] Fetching product with slug: "${slug}"`);
      
      let client;
      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulProductType] Failed to initialize Contentful client, trying refresh', clientError);
        // Try refreshing the client
        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulProductType] Failed to refresh Contentful client', refreshError);
          throw new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
        }
      }
      
      if (!client) {
        console.error('[useContentfulProductType] Failed to initialize Contentful client');
        throw new Error('Failed to initialize Contentful client');
      }
      
      // Try different slug variations if needed
      const slugVariations = [slug, `${slug}-vending`, slug.replace('-vending', '')];
      let entries;
      let currentSlug = slug;
      
      console.log(`[useContentfulProductType] Will try these slug variations:`, slugVariations);
      
      for (const slugVariation of slugVariations) {
        try {
          console.log(`[useContentfulProductType] Querying Contentful for product with slug: "${slugVariation}"`);
          entries = await client.getEntries({
            content_type: 'productType',
            'fields.slug': slugVariation,
            include: 2
          });
          
          if (entries.items.length > 0) {
            console.log(`[useContentfulProductType] Found product with slug: "${slugVariation}"`);
            currentSlug = slugVariation;
            break;
          }
        } catch (error) {
          console.error(`[useContentfulProductType] Error querying for slug "${slugVariation}":`, error);
        }
      }
      
      if (!entries || !entries.items.length) {
        console.error(`[useContentfulProductType] No product found with any slug variations: ${slugVariations.join(', ')}`);
        
        // Check if we have a fallback for this product
        if (productFallbacks[slug]) {
          console.warn(`[useContentfulProductType] Using fallback data for slug: ${slug}`);
          throw new Error(`Product not found in Contentful: ${slug}`);
        }
        
        throw new Error(`Product not found in Contentful: ${slug}`);
      }
      
      console.log(`[useContentfulProductType] Query returned ${entries.items.length} items for slug "${currentSlug}"`);
      
      const entry = entries.items[0];
      // Log the raw entry data to help with debugging
      console.log(`[useContentfulProductType] Raw entry for slug "${currentSlug}":`, {
        id: entry.sys.id,
        contentType: entry.sys.contentType?.sys?.id,
        fields: Object.keys(entry.fields),
        hasTitle: !!entry.fields.title,
        hasDescription: !!entry.fields.description,
        hasImage: !!entry.fields.image,
        hasVideo: !!entry.fields.video,
        hasVideoTitle: !!entry.fields.videoTitle,
        hasVideoDescription: !!entry.fields.videoDescription,
        hasVideoThumbnail: !!entry.fields.videoThumbnail
      });
      
      const fields = entry.fields;
      
      // Process video data
      let videoData = {
        url: undefined,
        youtubeId: undefined,
        title: undefined,
        description: undefined,
        thumbnailImage: undefined
      };
      
      // Extract video asset data if present
      if (fields.video) {
        const videoAsset = fields.video;
        console.log('[useContentfulProductType] Processing video asset:', videoAsset);
        
        // Get URL from video asset
        if (videoAsset.fields && videoAsset.fields.file && videoAsset.fields.file.url) {
          videoData.url = `https:${videoAsset.fields.file.url}`;
          
          // Check if it's a YouTube video by looking at the URL or file name
          const fileUrl = videoAsset.fields.file.url.toLowerCase();
          if (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be')) {
            // Extract YouTube ID from URL
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = fileUrl.match(youtubeRegex);
            if (match && match[1]) {
              videoData.youtubeId = match[1];
            }
          }
        }
      }
      
      // Get video title from dedicated field or fall back to asset title
      if (fields.videoTitle) {
        videoData.title = fields.videoTitle;
      } else if (fields.video && fields.video.fields && fields.video.fields.title) {
        videoData.title = fields.video.fields.title;
      }
      
      // Get video description from dedicated field or fall back to asset description
      if (fields.videoDescription) {
        videoData.description = fields.videoDescription;
      } else if (fields.video && fields.video.fields && fields.video.fields.description) {
        videoData.description = fields.video.fields.description;
      }
      
      // Get video thumbnail from dedicated field or fall back to video asset thumbnail
      if (fields.videoThumbnail) {
        videoData.thumbnailImage = {
          id: fields.videoThumbnail.sys.id,
          url: `https:${fields.videoThumbnail.fields.file.url}`,
          alt: fields.videoThumbnail.fields.title || 'Video thumbnail',
        };
      } else if (fields.video && fields.video.fields && fields.video.fields.file && fields.video.fields.file.details && fields.video.fields.file.details.image) {
        // Some video assets have a poster frame we can use
        videoData.thumbnailImage = {
          id: fields.video.sys.id,
          url: `https:${fields.video.fields.file.url}`,
          alt: fields.video.fields.title || 'Video preview',
        };
      }
      
      // Check if recommended machines exist and log for debugging
      if (fields.recommendedMachines) {
        console.log('[useContentfulProductType] Found recommended machines:', 
          fields.recommendedMachines.map((m: any) => ({
            title: m.fields?.title,
            hasImage: !!m.fields?.image,
            hasThumbnail: !!m.fields?.thumbnail
          }))
        );
      }

      // Transform the Contentful data into our app's format
      const product: CMSProductType = {
        id: entry.sys.id,
        title: fields.title as string,
        slug: fields.slug as string,
        description: fields.description as string,
        benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
        image: fields.image ? {
          id: fields.image.sys.id,
          url: `https:${fields.image.fields.file.url}`,
          alt: fields.image.fields.title || fields.title,
        } : undefined,
        features: fields.features ? (fields.features as any[]).map(feature => ({
          id: feature.sys.id,
          title: feature.fields.title,
          description: feature.fields.description,
          icon: feature.fields.icon || undefined
        })) : [],
        // Add the video data
        video: videoData.url || videoData.youtubeId ? {
          title: videoData.title,
          description: videoData.description,
          thumbnailImage: videoData.thumbnailImage,
          url: videoData.url,
          youtubeId: videoData.youtubeId
        } : undefined,
        // Also include the new dedicated fields
        videoTitle: fields.videoTitle as string,
        videoDescription: fields.videoDescription as Document,
        videoThumbnail: fields.videoThumbnail ? {
          id: fields.videoThumbnail.sys.id,
          url: `https:${fields.videoThumbnail.fields.file.url}`,
          alt: fields.videoThumbnail.fields.title || 'Video thumbnail'
        } : undefined,
        visible: !!fields.visible,
        recommendedMachines: fields.recommendedMachines ? 
          (fields.recommendedMachines as any[]).map(machine => {
            // Log each machine's structure for debugging
            console.log(`[useContentfulProductType] Processing recommended machine: ${machine.fields?.title}`, {
              hasImage: !!machine.fields?.image,
              hasThumbnail: !!machine.fields?.thumbnail,
              thumbnailDetails: machine.fields?.thumbnail ? {
                hasFields: !!machine.fields.thumbnail.fields,
                hasFile: !!machine.fields.thumbnail.fields?.file,
                hasUrl: !!machine.fields.thumbnail.fields?.file?.url
              } : 'No thumbnail'
            });
            
            return {
              id: machine.sys.id,
              slug: machine.fields.slug,
              title: machine.fields.title,
              description: machine.fields.description,
              image: machine.fields.image ? {
                url: `https:${machine.fields.image.fields.file.url}`,
                alt: machine.fields.image.fields.title || machine.fields.title
              } : undefined,
              thumbnail: machine.fields.thumbnail ? {
                url: `https:${machine.fields.thumbnail.fields.file.url}`,
                alt: machine.fields.thumbnail.fields.title || machine.fields.title
              } : undefined
            };
          }) : []
      };
      
      console.log(`[useContentfulProductType] Successfully processed product:`, {
        title: product.title,
        slug: product.slug,
        hasVideo: !!product.video,
        videoTitle: product.videoTitle,
        hasVideoDescription: !!product.videoDescription,
        hasVideoThumbnail: !!product.videoThumbnail,
        recommendedMachinesCount: product.recommendedMachines?.length || 0,
        machinesWithThumbnails: product.recommendedMachines?.filter(m => m.thumbnail).length || 0
      });
      
      return product;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading product from Contentful: ${error.message}`);
        console.error('[useContentfulProductType] Error:', error);
      }
    }
  });
}
