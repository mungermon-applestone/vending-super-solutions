
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
import { Entry } from 'contentful';

// Define the asset structure we expect from Contentful
interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details?: {
        size?: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName?: string;
      contentType?: string;
    };
  };
}

// Define our entry structure with proper typing
interface AboutPageFields {
  bodyContent: any; // Rich text document
}

const About = () => {
  const { data, isLoading, error, isContentReady } = useContentful({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      return client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 2, // Include linked assets (like images)
      });
    }
  });

  // Debugging: Log complete response structure when data is available
  React.useEffect(() => {
    if (data) {
      console.log('About page data structure:', JSON.stringify(data, null, 2));
    }
  }, [data]);

  // Configure the rich text rendering options to handle embedded assets
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
          
          // Check for different ways assets might be included in the response
          // Method 1: Check in includes.Asset
          if (data?.includes?.Asset) {
            console.log('Found includes.Asset array with', data.includes.Asset.length, 'items');
            const asset = data.includes.Asset.find((a: any) => a.sys.id === assetId);
            
            if (asset) {
              console.log('Found asset using includes.Asset:', asset);
              return renderAsset(asset);
            }
          }
          
          // Method 2: Check in linked.assets.block
          if (data?.linked?.assets?.block) {
            console.log('Found linked.assets.block array with', data.linked.assets.block.length, 'items');
            const asset = data.linked.assets.block.find(
              (asset: ContentfulAsset) => asset.sys.id === assetId
            );
            
            if (asset) {
              console.log('Found asset using linked.assets.block:', asset);
              return renderAsset(asset);
            }
          }
          
          console.error('Asset not found in any expected location:', { assetId });
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
    const { title, description, file } = asset.fields;
    const imageUrl = file.url;
    console.log('Rendering image with URL:', imageUrl);
    
    return (
      <div className="my-8">
        <AspectRatio ratio={16/9} className="overflow-hidden rounded-md border border-gray-200">
          <Image 
            src={`https:${imageUrl}`}
            alt={description || title || 'About image'}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>
    );
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
