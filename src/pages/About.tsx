
import React from 'react';
import Layout from '@/components/layout/Layout';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import Image from '@/components/common/Image';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import useContentful from '@/hooks/useContentful';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ContentfulAsset, ContentfulResponse } from '@/types/contentful';
import { Document } from '@contentful/rich-text-types';

interface AboutPageFields {
  bodyContent: Document; 
}

const About = () => {
  const { data, isLoading, error, isContentReady } = useContentful<ContentfulResponse<AboutPageFields>>({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      
      // Get the entry with linked assets
      const response = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 2, // Include linked assets (like images)
      });
      
      console.log('Raw Contentful response:', JSON.stringify(response, null, 2));
      
      // Return the response with the correct type
      return response as unknown as ContentfulResponse<AboutPageFields>;
    }
  });

  React.useEffect(() => {
    if (data) {
      console.log('About page data structure:', JSON.stringify(data, null, 2));
      
      // Log the includes structure to help debug asset rendering
      if (data.includes?.Asset) {
        console.log('Found assets in includes:', data.includes.Asset.length);
        data.includes.Asset.forEach(asset => {
          console.log('Asset ID:', asset.sys.id, 'Title:', asset.fields.title);
        });
      } else {
        console.log('No assets found in includes');
      }
    }
  }, [data]);

  const richTextOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        try {
          // Get the asset ID from the node
          const assetId = node.data?.target?.sys?.id;
          console.log('Rendering embedded asset with ID:', assetId);
          
          if (!assetId) {
            console.error('Missing asset ID in embedded asset node');
            return null;
          }
          
          // Look for the asset in the includes.Asset array
          if (data?.includes?.Asset && Array.isArray(data.includes.Asset)) {
            console.log('Looking through assets array with length:', data.includes.Asset.length);
            const asset = data.includes.Asset.find(a => a.sys.id === assetId);
            
            if (asset) {
              console.log('Found asset:', asset.sys.id);
              return renderAsset(asset);
            } else {
              console.error('Asset not found in includes.Asset array');
            }
          } else {
            console.error('No includes.Asset array available');
          }
          
          console.error('Asset not found for ID:', assetId);
          console.log('Available asset IDs:', data?.includes?.Asset?.map(a => a.sys.id).join(', ') || 'none');
          return <div className="text-red-500">Image not found (ID: {assetId})</div>;
          
        } catch (error) {
          console.error('Error rendering embedded asset:', error);
          return <div className="text-red-500">Error rendering image</div>;
        }
      }
    }
  };
  
  // Helper function to render the asset once we've found it
  const renderAsset = (asset: ContentfulAsset) => {
    try {
      const { title, file } = asset.fields;
      const imageUrl = file.url;
      console.log('Rendering image with URL:', imageUrl);
      
      // Make sure URL starts with https:
      const fullUrl = imageUrl.startsWith('//') ? 
        `https:${imageUrl}` : 
        imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
      
      return (
        <div className="my-8">
          <AspectRatio ratio={16/9} className="overflow-hidden rounded-md border border-gray-200">
            <Image 
              src={fullUrl}
              alt={title || 'About image'}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      );
    } catch (err) {
      console.error('Error in renderAsset:', err);
      return <div className="text-red-500">Error rendering asset</div>;
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div className="text-red-500">
            Error loading content: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <ContentfulErrorBoundary contentType="About page">
            <div className="prose max-w-none">
              {isContentReady && data?.fields?.bodyContent && 
                documentToReactComponents(data.fields.bodyContent, richTextOptions)
              }
              {isContentReady && !data?.fields?.bodyContent && (
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p>The About page content was loaded, but no body content was found.</p>
                </div>
              )}
            </div>
          </ContentfulErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default About;
