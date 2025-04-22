
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
import { Entry, Asset } from 'contentful';

// Define a custom interface that represents our expected Contentful response structure
interface ContentfulAboutEntry extends Entry<any> {
  fields: {
    bodyContent: any; // Rich text document
  };
  linked?: {
    assets?: {
      block?: ContentfulAsset[];
    };
  };
}

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

const About = () => {
  const { data, isLoading, error, isContentReady } = useContentful({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const response = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 2 // Include linked assets (like images)
      });
      return response as ContentfulAboutEntry;
    }
  });

  // Configure the rich text rendering options to handle embedded assets
  const richTextOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        try {
          const assetId = node.data?.target?.sys?.id;
          console.log('Rendering embedded asset with ID:', assetId);
          
          // Early return if no asset ID
          if (!assetId) {
            console.error('Missing asset ID');
            return null;
          }
          
          // Check if we have linked assets in the response
          if (!data?.linked?.assets?.block) {
            console.error('No linked assets found in the response');
            return null;
          }
          
          // Find the asset in the linked entries/assets
          const asset = data.linked.assets.block.find(
            (asset: ContentfulAsset) => asset.sys.id === assetId
          );
          
          if (asset && asset.fields) {
            const { title, description, file } = asset.fields;
            const imageUrl = file.url;
            console.log('Found image asset:', { title, url: imageUrl });
            
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
          } else {
            console.error('Asset found but missing required fields:', asset);
          }
        } catch (error) {
          console.error('Error rendering embedded asset:', error);
        }
        
        return null;
      }
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
                documentToReactComponents(data.fields.bodyContent as any, richTextOptions)
              }
            </div>
          </ContentfulErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default About;
