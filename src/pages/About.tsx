
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import Image from '@/components/common/Image';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';

interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      fileName?: string;
      contentType?: string;
    };
  };
}

interface ContentfulEntry {
  sys: {
    id: string;
  };
  fields: {
    bodyContent: Document;
  };
  includes?: {
    Asset?: ContentfulAsset[];
  };
}

const About = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      // Get the entry with its linked assets
      const response = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 2 // Include linked assets (like images)
      });
      
      console.log('Contentful response:', JSON.stringify(response, null, 2));
      return response;
    }
  });

  // Configure the rich text rendering options to handle embedded assets
  const richTextOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        try {
          // Get the asset reference from the node
          const assetId = node.data?.target?.sys?.id;
          console.log('Rendering embedded asset with ID:', assetId);
          
          if (!assetId || !data?.includes?.Asset) {
            console.error('Missing asset ID or includes data');
            return null;
          }
          
          // Find the asset in the linked entries/assets
          const asset = data.includes.Asset.find(
            asset => asset.sys.id === assetId
          );
          
          if (asset && asset.fields && asset.fields.file) {
            const { title, description, file } = asset.fields;
            const imageUrl = file.url;
            console.log('Found image asset:', { title, url: imageUrl });
            
            return (
              <div className="my-8">
                <Image 
                  src={`https:${imageUrl}`}
                  alt={description || title || 'About image'}
                  className="w-full h-auto rounded-md"
                />
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
              {data?.fields?.bodyContent && documentToReactComponents(data.fields.bodyContent, richTextOptions)}
            </div>
          </ContentfulErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default About;
